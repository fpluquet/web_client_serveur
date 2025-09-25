# Séance 5 - Architecture Client Lourd

Ce dossier contient les exemples de code pour la séance 5 sur l'architecture client lourd.

## Structure

```
seance5/
├── package.json                    # Scripts pour démarrer les exemples
├── spa-basique/                    # Exemple 1: SPA basique
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
└── todolist-client-lourd/         # Exemple 2: TodoList avec API REST
    ├── README.md
    ├── server/                     # API REST Express
    │   ├── package.json
    │   └── server.js
    └── client/                     # Client lourd JavaScript
        ├── index.html
        ├── css/style.css
        └── js/app.js
```

## Comment utiliser ces exemples

### 1. SPA Basique

Pour tester l'exemple de SPA basique :

```bash
cd spa-basique

# Option 1: Avec Python (si installé)
python -m http.server 8000

# Option 2: Avec Node.js
npx serve .

# Option 3: Utilisez l'extension Live Server de VS Code
```

Puis ouvrez http://localhost:8000 dans votre navigateur.

### 2. TodoList Client Lourd

Pour l'exemple de TodoList avec API REST :

```bash
# 1. Aller dans le dossier server
cd todolist-client-lourd/server

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur
npm start
# ou pour le développement avec auto-reload :
npm run dev
```

Puis ouvrez http://localhost:3000 dans votre navigateur.

## Scripts raccourcis

Depuis ce dossier (seance5), vous pouvez utiliser ces raccourcis :

```bash
# Démarrer le serveur SPA simple
npm run spa

# Installer les dépendances pour TodoList
npm run todolist:install

# Démarrer TodoList
npm run todolist:start

# Démarrer TodoList en mode développement
npm run todolist:dev
```

## Synchronisation automatique

Ce code est automatiquement synchronisé avec le fichier markdown `docs/seances/5_client_lourd.md` via le script `sync-code.js` du projet principal.

Pour mettre à jour le markdown après modification du code :

```bash
# Depuis la racine du projet
npm run sync-code
```

## Architecture

### SPA Basique
- **Principe** : Application à page unique sans framework
- **Navigation** : Gérée par JavaScript avec `window.history.pushState()`
- **Contenu** : Injecté dynamiquement dans un conteneur principal
- **API** : Simulation d'appels asynchrones

### TodoList Client Lourd
- **Serveur** : API REST avec Express.js
- **Client** : Application JavaScript vanilla qui consomme l'API
- **Communication** : Appels AJAX avec `fetch()`
- **État** : Géré côté client avec synchronisation serveur

## Exercices proposés

### SPA Basique
1. Ajouter une page "Produits" avec des données simulées
2. Implémenter une fonction de recherche
3. Ajouter des transitions CSS entre les pages

### TodoList
1. Édition en ligne des todos
2. Filtrage (toutes/complétées/en cours)
3. Sauvegarde locale avec localStorage
4. Système de catégories
5. Mode hors ligne avec synchronisation