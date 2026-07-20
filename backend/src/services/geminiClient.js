// ============================================================
// MEKKA TECH CHATBOT — Client Gemini (Google AI)
//
// Isolé volontairement : c'est le SEUL fichier du projet qui connaît
// l'URL et le format de l'API Gemini. Si on change encore de
// fournisseur IA un jour, seul ce fichier est à réécrire.
// ============================================================

const env = require('../config/env');
const systemPrompt = require('../knowledge/system-prompt');
const knowledge = require('../knowledge/knowledge.json');

function buildSystemInstruction() {
  return `${systemPrompt}\n\n## knowledge.json (données factuelles actuelles)\n\`\`\`json\n${JSON.stringify(knowledge, null, 2)}\n\`\`\``;
}

function toGeminiRole(role) {
  return role === 'assistant' ? 'model' : 'user';
}

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
        temperature: 0.3,
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
