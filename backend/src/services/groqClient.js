// ============================================================
// MEKKA TECH CHATBOT — Client Groq
// ============================================================

const env = require('../config/env');
const systemPrompt = require('../knowledge/system-prompt');
const knowledge = require('../knowledge/knowledge.json');

function buildSystemMessage() {
  return `${systemPrompt}\n\n## knowledge.json (données factuelles actuelles)\n\`\`\`json\n${JSON.stringify(knowledge, null, 2)}\n\`\`\``;
}

async function askGroq(message, historique = [], langue = 'fr') {
  const messages = [
    { role: 'system', content: buildSystemMessage() },
    ...historique,
    { role: 'user', content: message }
  ];

  const response = await fetch(env.groqApiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.groqApiKey()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: env.groqModel,
      messages,
      temperature: 0.3,
      max_tokens: 400
    })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    const error = new Error(`Groq API error ${response.status}: ${errText}`);
    error.statusCode = response.status;
    throw error;
  }

  const json = await response.json();
  const reply = json.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error('Réponse Groq vide ou invalide');
  }

  return reply.trim();
}

module.exports = { askGroq };
