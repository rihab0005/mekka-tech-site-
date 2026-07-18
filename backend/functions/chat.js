// ============================================================
// MEKKA TECH CHATBOT — Fonction serverless (Netlify Functions)
//
// Route exposée au frontend : POST /api/chat
// C'est la SEULE porte d'entrée. Le frontend n'a jamais la clé Gemini ;
// cette fonction la lit depuis les variables d'environnement Netlify
// (Site settings → Environment variables → GEMINI_API_KEY), invisibles
// dans le code livré au navigateur.
// ============================================================

const { handleChat } = require('../src/controllers/chat.controller');
const env = require('../src/config/env');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': env.allowedOrigin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'method_not_allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return respond(400, { error: 'invalid_json' });
  }

  // Identifiant anonyme du visiteur pour le rate-limiting (jamais stocké,
  // utilisé uniquement en mémoire le temps du comptage des requêtes)
  const visitorId = event.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';

  const result = await handleChat(body, visitorId);
  return respond(result.statusCode, result.body);
};

function respond(statusCode, payload) {
  return {
    statusCode,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };
}
