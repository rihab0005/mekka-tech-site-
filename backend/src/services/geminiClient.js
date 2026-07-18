// ============================================================
// MEKKA TECH CHATBOT — Client Gemini (Google AI)
//
// Isolé volontairement : c'est le SEUL fichier du projet qui connaît
// l'URL et le format de l'API Gemini. Si on change encore de
// fournisseur IA un jour, seul ce fichier est à réécrire.
// ============================================================

const env = require('../config/env');
const fs = require('fs');
const path = require('path');

const systemPrompt = fs.readFileSync(path.join(__dirname, '../knowledge/system-prompt.md'), 'utf-8');
const knowledge = JSON.parse(fs.readFileSync(path.join(__dirname, '../knowledge/knowledge.json'), 'utf-8'));

function buildSystemInstruction() {
  return `${systemPrompt}\n\n## knowledge.json (données factuelles actuelles)\n\`\`\`json\n${JSON.stringify(knowledge, null, 2)}\n\`\`\``;
}

/**
 * Gemini utilise le rôle "model" là où d'autres API utilisent "assistant".
 */
function toGeminiRole(role) {
  return role === 'assistant' ? 'model' : 'user';
}

/**
 * @param {string} message - message actuel de l'utilisateur (déjà nettoyé)
 * @param {Array<{role:string, content:string}>} historique - échanges précédents (déjà nettoyés/tronqués)
 * @param {string} langue - fr / ar / en (indicatif, le system prompt gère déjà la consigne de langue)
 */
async function askGemini(message, historique = [], langue = 'fr') {
  const contents = [
    ...historique.map((m) => ({ role: toGeminiRole(m.role), parts: [{ text: m.content }] })),
    { role: 'user', parts: [{ text: message }] }
  ];

  const url = `${env.geminiApiBaseUrl}/${env.geminiModel}:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-goog-api-key': env.geminiApiKey(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: buildSystemInstruction() }] },
      contents,
      generationConfig: {
        temperature: 0.3,   // peu de créativité : on veut de la précision, pas de l'invention
        maxOutputTokens: 400
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    const error = new Error(`Gemini API error ${response.status}: ${errText}`);
    error.statusCode = response.status;
    throw error;
  }

  const json = await response.json();
  const reply = json.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    throw new Error('Réponse Gemini vide ou invalide');
  }

  return reply.trim();
}

module.exports = { askGemini };
