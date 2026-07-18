// ============================================================
// MEKKA TECH CHATBOT — Rate limiting
//
// Limite en mémoire, par instance de fonction serverless : c'est du
// "best-effort", pas une garantie absolue (une fonction serverless peut
// redémarrer sur un nouveau conteneur et perdre ce compteur). Sans base
// de données (choix assumé pour rester simple), c'est la meilleure
// protection disponible côté code.
//
// La vraie garantie contre une facture qui explose reste de surveiller
// votre usage dans Google AI Studio (ai.google.dev). Gemini a un palier
// gratuit permanent (pas de crédits qui expirent), donc le risque
// financier est déjà beaucoup plus faible qu'avec un fournisseur payant.
// ============================================================

const env = require('../config/env');

const hits = new Map(); // clé = identifiant visiteur, valeur = [timestamps]

function isRateLimited(identifier) {
  const now = Date.now();
  const windowStart = now - env.rateLimit.windowMs;

  const timestamps = (hits.get(identifier) || []).filter((t) => t > windowStart);

  if (timestamps.length >= env.rateLimit.maxRequests) {
    hits.set(identifier, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(identifier, timestamps);
  return false;
}

module.exports = { isRateLimited };
