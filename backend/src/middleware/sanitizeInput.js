// ============================================================
// MEKKA TECH CHATBOT — Validation et nettoyage des entrées
// ============================================================

const env = require('../config/env');

const ALLOWED_LANGS = ['fr', 'ar', 'en'];

function sanitizeText(str) {
  return String(str || '')
    .replace(/<[^>]*>/g, '')      // retire toute balise HTML
    .replace(/javascript:/gi, '') // retire les tentatives de protocole JS
    .trim();
}

/**
 * @param {object} body - JSON reçu du frontend
 * @returns {{ valid: boolean, errors: string[], data: object }}
 */
function validateChatRequest(body) {
  const errors = [];

  const message = sanitizeText(body.message).slice(0, env.maxMessageLength);
  if (!message) errors.push('message requis');

  const langue = ALLOWED_LANGS.includes(body.langue) ? body.langue : 'fr';

  // Historique : on ne garde que les derniers échanges, on nettoie chaque message,
  // et on rejette tout rôle qui ne serait ni "user" ni "assistant"
  const historiqueBrut = Array.isArray(body.historique) ? body.historique : [];
  const historique = historiqueBrut
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-env.maxHistoryMessages)
    .map((m) => ({ role: m.role, content: sanitizeText(m.content).slice(0, env.maxMessageLength) }));

  return {
    valid: errors.length === 0,
    errors,
    data: { message, langue, historique }
  };
}

module.exports = { validateChatRequest, sanitizeText };
