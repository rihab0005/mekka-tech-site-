# Guide de déploiement — Mekka Tech (site vitrine)

Le site est 100% statique (HTML/CSS/JS). Aucun serveur, aucune base de données. Le formulaire de contact ouvre WhatsApp avec un message pré-rempli — les demandes arrivent directement sur le téléphone de l'entreprise.

## Option 1 — Netlify (recommandé, gratuit)

1. Créer un compte sur https://netlify.com
2. Méthode la plus simple : **glisser-déposer**. Ouvrez https://app.netlify.com/drop et déposez le dossier `frontend/public` directement dans la page. Le site est en ligne en quelques secondes.
3. (Optionnel) Pour des mises à jour automatiques : connecter un dépôt GitHub. Dans les réglages de build, mettre **Publish directory** = `frontend/public` (pas de build command nécessaire).

## Option 2 — GitHub Pages (gratuit)

1. Créer un dépôt GitHub et y pousser le projet
2. Réglages → Pages → Source = branche `main`, dossier `/frontend/public` (ou déplacer le contenu de `frontend/public` à la racine)
3. Le site est publié sur `https://<votre-compte>.github.io/<nom-du-repo>`

## Option 3 — N'importe quel hébergement web

Uploadez simplement le contenu de `frontend/public/` (les 4 pages HTML) ainsi que les dossiers `frontend/css`, `frontend/js` et `frontend/assets` en respectant la structure des chemins relatifs. Un simple hébergement mutualisé suffit.

## Brancher le domaine mekkatech.ma

1. Acheter le domaine `mekkatech.ma` (registre.ma, ou Namecheap/OVH)
2. Sur Netlify : **Domain settings → Add a domain** → suivre les instructions DNS
3. HTTPS gratuit activé automatiquement

## Tester en local

Ouvrez `frontend/public/index.html` dans un navigateur, ou dans VS Code : clic droit sur `index.html` → "Open with Live Server".

## Coûts

| Poste | Coût |
|---|---|
| Hébergement (Netlify / GitHub Pages) | Gratuit |
| Domaine mekkatech.ma | ~150–250 MAD/an (optionnel) |

Aucun autre coût : pas de serveur, pas de base de données.
