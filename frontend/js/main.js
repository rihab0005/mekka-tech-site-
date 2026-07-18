// ============================================================
// MEKKA TECH — main.js
// i18n (FR/AR/EN), navigation mobile, révélation au scroll,
// bouton WhatsApp flottant. Chargé sur toutes les pages publiques.
// ============================================================

(function () {
  'use strict';

  const STORAGE_KEY = 'mekka_lang';
  const DEFAULT_LANG = 'fr';

  // ---------- i18n ----------

  function getTranslation(lang, path) {
    return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : null), window.MEKKA_I18N[lang]);
  }

  function applyTranslations(lang) {
    const dict = window.MEKKA_I18N[lang];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = getTranslation(lang, el.getAttribute('data-i18n'));
      if (value !== null) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const value = getTranslation(lang, el.getAttribute('data-i18n-html'));
      if (value !== null) el.innerHTML = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const value = getTranslation(lang, el.getAttribute('data-i18n-placeholder'));
      if (value !== null) el.setAttribute('placeholder', value);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const value = getTranslation(lang, el.getAttribute('data-i18n-aria'));
      if (value !== null) el.setAttribute('aria-label', value);
    });

    document.dispatchEvent(new CustomEvent('mekka:lang-changed', { detail: { lang } }));
  }

  function setLanguage(lang) {
    if (!window.MEKKA_I18N[lang]) lang = DEFAULT_LANG;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem(STORAGE_KEY, lang);

    document.querySelectorAll('.lang-switch button').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    applyTranslations(lang);
  }

  function initLangSwitcher() {
    const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    setLanguage(saved);

    document.querySelectorAll('.lang-switch button').forEach((btn) => {
      btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
    });
  }

  // ---------- Navigation mobile ----------

  function initMobileNav() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    if (!header || !toggle) return;

    toggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.main-nav a').forEach((link) => {
      link.addEventListener('click', () => header.classList.remove('open'));
    });
  }

  // ---------- Lien actif dans le menu ----------

  function markActiveNavLink() {
    const current = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
    document.querySelectorAll('.main-nav a[data-page]').forEach((link) => {
      if (link.getAttribute('data-page') === current) link.classList.add('active');
    });
  }

  // ---------- Révélation au scroll ----------

  function initScrollReveal() {
    const targets = document.querySelectorAll('[data-reveal]:not(.is-visible)');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLangSwitcher();
    initMobileNav();
    markActiveNavLink();
    initScrollReveal();
  });

  window.MEKKA = window.MEKKA || {};
  window.MEKKA.getTranslation = getTranslation;
  window.MEKKA.getCurrentLang = () => document.documentElement.lang || DEFAULT_LANG;
  window.MEKKA.reobserveReveal = initScrollReveal;
})();
