// ============================================================
// MEKKA TECH — contact-form.js
// Le formulaire ne dépend d'aucun serveur : il compose un message
// pré-rempli et ouvre WhatsApp vers le numéro de l'entreprise.
// La demande arrive directement sur le téléphone de Mekka Tech.
// ============================================================

(function () {
  'use strict';

  // Numéro WhatsApp de l'entreprise (format international, sans + ni espaces)
  const WHATSAPP_NUMBER = '212667747180';

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quote-form');
    if (!form) return;

    const statusEl = document.getElementById('form-status');

    // Préremplit le service si on arrive depuis un lien "?service=..."
    const params = new URLSearchParams(window.location.search);
    const preselect = params.get('service');
    if (preselect) {
      const select = form.querySelector('#service');
      if (select) select.value = preselect;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      hideStatus();

      const nom = form.nom_complet.value.trim();
      const tel = form.telephone.value.trim();
      const email = form.email.value.trim();
      const serviceSelect = form.service;
      const serviceLabel = serviceSelect.options[serviceSelect.selectedIndex]?.text || '';
      const serviceValue = serviceSelect.value;
      const message = form.message.value.trim();

      // Honeypot anti-bot : si rempli, on ignore silencieusement
      if (form.website && form.website.value) return;

      if (!nom || !tel || !serviceValue) {
        showStatus('err', getText('errorMsg'));
        return;
      }

      const lang = window.MEKKA.getCurrentLang();
      const lines = buildMessage(lang, { nom, tel, email, serviceLabel, message });
      const waMessage = encodeURIComponent(lines.join('\n'));
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

      // Ouvre WhatsApp (nouvel onglet / application)
      window.open(waUrl, '_blank');

      showStatus('ok', getText('waRedirect'));
      form.reset();
    });

    function buildMessage(lang, d) {
      const labels = {
        fr: { title: 'Nouvelle demande de devis', name: 'Nom', phone: 'Téléphone', email: 'Email', service: 'Service', msg: 'Message' },
        ar: { title: 'طلب عرض ثمن جديد', name: 'الاسم', phone: 'الهاتف', email: 'البريد', service: 'الخدمة', msg: 'الرسالة' },
        en: { title: 'New quote request', name: 'Name', phone: 'Phone', email: 'Email', service: 'Service', msg: 'Message' }
      };
      const t = labels[lang] || labels.fr;
      const out = [`*${t.title}*`, `${t.name}: ${d.nom}`, `${t.phone}: ${d.tel}`];
      if (d.email) out.push(`${t.email}: ${d.email}`);
      out.push(`${t.service}: ${d.serviceLabel}`);
      if (d.message) out.push(`${t.msg}: ${d.message}`);
      return out;
    }

    function getText(key) {
      const lang = window.MEKKA.getCurrentLang();
      return window.MEKKA.getTranslation(lang, `contact.${key}`) || '';
    }

    function showStatus(type, message) {
      statusEl.textContent = message;
      statusEl.className = `form-status show ${type}`;
    }

    function hideStatus() {
      statusEl.className = 'form-status';
    }
  });
})();
