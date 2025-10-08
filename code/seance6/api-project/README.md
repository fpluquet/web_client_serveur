# API RESTful avec Node.js et Express

Cette application est un exemple complet d'API RESTful construite avec Node.js, Express et fichiers JSON.

## Fonctionnalités

- **Authentification JWT** : Inscription et connexion sécurisées
- **Gestion des utilisateurs** : Profils utilisateurs avec rôles
- **Validation des données** : Validation côté serveur avec express-validator
- **Sécurité** : Helmet, CORS, limitation du taux de requêtes
- **Tests** : Tests unitaires avec Jest et Supertest
- **Structure modulaire** : Architecture MVC claire

## Installation

1. Cloner le projet
2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` basé sur `.env.example`
4. Lancer l'application :

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur (authentifié)
- `PUT /api/users/profile` - Modifier le profil (authentifié)
- `GET /api/users` - Liste des utilisateurs (admin)

## Tests

```bash
npm test
```

## Structure du projet

```
src/
├── controllers/     # Logique métier
├── middleware/      # Middlewares personnalisés
├── models/          # Modèles de données
├── routes/          # Définition des routes
└── app.js          # Point d'entrée

tests/              # Tests unitaires
```