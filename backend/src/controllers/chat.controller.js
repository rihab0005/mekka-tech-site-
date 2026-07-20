// ============================================================
// MEKKA TECH CHATBOT — Contrôleur de conversation
// ============================================================

const { validateChatRequest } = require('../middleware/sanitizeInput');
const { isRateLimited } = require('../middleware/rateLimiter');
const { askGroq } = require('../services/groqClient');

const MESSAGES_ERREUR = {
  fr: {
    rate_limited: 'Vous avez envoyé beaucoup de messages d\'un coup. Merci de patienter quelques minutes avant de réessayer.',
    invalid: 'Message vide ou invalide.',
    server: 'Une erreur est survenue. Vous pouvez nous contacter directement au +212 6 67 74 71 80.'
  },
  ar: {
    rate_limited: 'لقد أرسلتم عدة رسائل بسرعة. يرجى الانتظار بضع دقائق قبل المحاولة مرة أخرى.',
    invalid: 'رسالة فارغة أو غير صالحة.',
    server: 'حدث خطأ ما. يمكنكم الاتصال بنا مباشرة على +212 6 67 74 71 80.'
  },
  en: {
    rate_limited: 'You\'ve sent several messages quickly. Please wait a few minutes before trying again.',
    invalid: 'Empty or invalid message.',
    server: 'Something went wrong. You can reach us directly at +212 6 67 74 71 80.'
  }
};

/**
 * @param {object} body - { message, historique, langue }
 * @param {string} visitorId - identifiant anonyme du visiteur (IP ou autre, fourni par la fonction serverless)
 */
async function handleChat(body, visitorId) {
  const { valid, data } = validateChatRequest(body);
  const langue = data.langue;
  const errMsgs = MESSAGES_ERREUR[langue] || MESSAGES_ERREUR.fr;

  if (!valid) {
    return { statusCode: 422, body: { error: 'invalid_message', message: errMsgs.invalid } };
  }

  if (isRateLimited(visitorId)) {
    return { statusCode: 429, body: { error: 'rate_limited', message: errMsgs.rate_limited } };
  }

  try {
    const reply = await askGroq(data.message, data.historique, langue);
    return { statusCode: 200, body: { success: true, reply } };
  } catch (err) {
    console.error('[chat.controller] Erreur Gemini :', err.message);
    return { statusCode: 502, body: { error: 'upstream_error', message: errMsgs.server } };
  }
}

module.exports = { handleChat };
