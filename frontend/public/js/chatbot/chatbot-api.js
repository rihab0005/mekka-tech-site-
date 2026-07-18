// ============================================================
// MEKKA TECH — chatbot-api.js
// Seul fichier qui parle au backend. Le frontend n'a et n'aura
// jamais la clé Grok : elle vit exclusivement dans la fonction
// serverless (backend/functions/chat.js).
// ============================================================

window.MEKKA_CHATBOT_API = (function () {
  'use strict';

  const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8888/api'
    : '/api';

  /**
   * @param {string} message
   * @param {Array<{role:string, content:string}>} historique
   * @param {string} langue
   */
  async function sendMessage(message, historique, langue) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, historique, langue })
    });

    let payload = null;
    try { payload = await response.json(); } catch { /* réponse vide */ }

    if (!response.ok) {
      throw payload || { error: 'unknown_error', message: 'Une erreur est survenue.' };
    }
    return payload;
  }

  return { sendMessage };
})();
