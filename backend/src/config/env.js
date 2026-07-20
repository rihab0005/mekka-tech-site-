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
  groqApiKey: () => required('GROQ_API_KEY'),
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  groqApiUrl: 'https://api.groq.com/openai/v1/chat/completions',

  allowedOrigin: process.env.ALLOWED_ORIGIN || 'https://mekkatech.ma',

  rateLimit: {
    windowMs: 10 * 60 * 1000,
    maxRequests: 15
  },

  maxMessageLength: 800,
  maxHistoryMessages: 8
};
