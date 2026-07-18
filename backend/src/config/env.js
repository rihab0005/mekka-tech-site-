// ============================================================
// MEKKA TECH CHATBOT — Configuration environnement
// ============================================================

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[env] Variable d'environnement manquante : ${name}`);
  }
  return value;
}

module.exports = {
  // Clé secrète Gemini (Google AI Studio) — jamais exposée au frontend
  geminiApiKey: () => required('GEMINI_API_KEY'),
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  geminiApiBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',

  allowedOrigin: process.env.ALLOWED_ORIGIN || 'https://mekkatech.ma',

  rateLimit: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 15           // 15 messages / 10 min / visiteur (reste large sous le quota gratuit Gemini)
  },

  maxMessageLength: 800,
  maxHistoryMessages: 8 // on ne renvoie que les derniers échanges (pertinence + rapidité)
};
