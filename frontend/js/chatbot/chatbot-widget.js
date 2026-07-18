// ============================================================
// MEKKA TECH — chatbot-widget.js
// Injecte le widget de chat dans toutes les pages qui incluent ce
// script. S'appuie sur main.js (i18n) et chatbot-api.js (réseau).
// ============================================================

(function () {
  'use strict';

  let history = []; // { role: 'user'|'assistant', content: string }
  let sending = false;

  function t(key) {
    const lang = window.MEKKA.getCurrentLang();
    return window.MEKKA.getTranslation(lang, `chatbot.${key}`) || '';
  }

  function buildWidget() {
    const bubble = document.createElement('button');
    bubble.className = 'mk-chat-bubble';
    bubble.setAttribute('aria-label', 'Chat');
    bubble.innerHTML = `
      <span class="mk-chat-badge"></span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>`;

    const win = document.createElement('div');
    win.className = 'mk-chat-window';
    win.innerHTML = `
      <div class="mk-chat-header">
        <div class="mk-avatar">MT</div>
        <div>
          <div class="mk-title" data-i18n="chatbot.title">Mekka-Tech Assistant</div>
          <div class="mk-status" data-i18n="chatbot.status">En ligne</div>
        </div>
        <button class="mk-chat-close" aria-label="Fermer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="mk-chat-messages" id="mk-chat-messages"></div>
      <p class="mk-chat-error" id="mk-chat-error"></p>
      <form class="mk-chat-form" id="mk-chat-form">
        <input type="text" id="mk-chat-input" maxlength="800" autocomplete="off"
               data-i18n-placeholder="chatbot.placeholder" placeholder="Écrivez votre message...">
        <button type="submit" aria-label="Envoyer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 20 18-8L3 4v6l12 2-12 2v6z"/></svg>
        </button>
      </form>`;

    document.body.appendChild(bubble);
    document.body.appendChild(win);

    return { bubble, win };
  }

  function addMessage(container, role, text) {
    const div = document.createElement('div');
    div.className = `mk-msg mk-msg-${role === 'user' ? 'user' : 'bot'}`;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
  }

  function showTyping(container) {
    const div = document.createElement('div');
    div.className = 'mk-msg mk-msg-bot mk-msg-typing';
    div.id = 'mk-typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('mk-typing-indicator');
    if (el) el.remove();
  }

  function init() {
    const { bubble, win } = buildWidget();
    const messagesEl = win.querySelector('#mk-chat-messages');
    const errorEl = win.querySelector('#mk-chat-error');
    const form = win.querySelector('#mk-chat-form');
    const input = win.querySelector('#mk-chat-input');
    const closeBtn = win.querySelector('.mk-chat-close');

    let greeted = false;

    function openWindow() {
      win.classList.add('open');
      if (!greeted) {
        addMessage(messagesEl, 'assistant', t('greeting'));
        greeted = true;
      }
      input.focus();
    }
    function closeWindow() { win.classList.remove('open'); }

    bubble.addEventListener('click', () => {
      win.classList.contains('open') ? closeWindow() : openWindow();
    });
    closeBtn.addEventListener('click', closeWindow);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message || sending) return;

      errorEl.classList.remove('show');
      addMessage(messagesEl, 'user', message);
      history.push({ role: 'user', content: message });
      input.value = '';
      sending = true;
      form.querySelector('button').disabled = true;
      showTyping(messagesEl);

      try {
        const lang = window.MEKKA.getCurrentLang();
        const res = await window.MEKKA_CHATBOT_API.sendMessage(message, history, lang);
        removeTyping();
        addMessage(messagesEl, 'assistant', res.reply);
        history.push({ role: 'assistant', content: res.reply });
      } catch (err) {
        removeTyping();
        errorEl.textContent = (err && err.message) || t('genericError');
        errorEl.classList.add('show');
      } finally {
        sending = false;
        form.querySelector('button').disabled = false;
      }
    });

    // Re-traduit les textes statiques du widget quand la langue change
    document.addEventListener('mekka:lang-changed', () => {
      const lang = window.MEKKA.getCurrentLang();
      win.querySelectorAll('[data-i18n]').forEach((el) => {
        const val = window.MEKKA.getTranslation(lang, el.getAttribute('data-i18n'));
        if (val) el.textContent = val;
      });
      const ph = win.querySelector('[data-i18n-placeholder]');
      if (ph) ph.setAttribute('placeholder', t('placeholder'));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
