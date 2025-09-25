# TodoList Client Lourd

Exemple d'application client lourd avec API REST.

## Installation

### Serveur
```bash
cd server
npm install
npm start
```

### Client
Le client est servi automatiquement par le serveur sur http://localhost:3000

## Architecture

- **Serveur** : API REST avec Express.js
- **Client** : Application JavaScript vanilla qui communique avec l'API
- **Données** : Stockées en mémoire côté serveur (remplacer par une base de données en production)