# Mekka Tech — Site vitrine

Site vitrine multilingue (Français / Arabe / Anglais) pour Mekka Tech, entreprise marocaine spécialisée en informatique, domotique, vidéosurveillance, détection incendie, anti-intrusion, automatisme, téléphonie, télédistribution, électricité et câblage.

100% statique : aucun serveur ni base de données. Le formulaire de contact ouvre WhatsApp avec un message pré-rempli.

## Structure

```
mekka-tech/
├── frontend/
│   ├── public/          → les 4 pages du site
│   │   ├── index.html      (accueil)
│   │   ├── services.html   (les 10 services)
│   │   ├── apropos.html    (à propos)
│   │   └── contact.html    (formulaire → WhatsApp)
│   ├── css/style.css    → tout le design
│   ├── js/
│   │   ├── i18n.js         (traductions FR/AR/EN)
│   │   ├── main.js         (langues, menu, animations)
│   │   └── contact-form.js (envoi vers WhatsApp)
│   └── assets/logo/     → le logo
├── docs/DEPLOYMENT.md   → comment mettre en ligne
└── README.md
```

## Voir le site

Ouvrez `frontend/public/index.html` dans un navigateur (ou "Live Server" dans VS Code).

## Mettre en ligne

Voir `docs/DEPLOYMENT.md` — le plus simple : glisser-déposer `frontend/public` sur https://app.netlify.com/drop

## Contact entreprise

- Téléphone / WhatsApp : 06 67 74 71 80
- Email : mekka.technologie@gmail.com
- Zone : tout le Maroc · Lun–Sam, 9h–19h
