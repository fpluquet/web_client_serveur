# API Simple - Express.js

Cette API simple démontre les opérations CRUD de base avec Express.js.

## Installation et démarrage

```bash
npm install
npm run dev
```

## Test de l'API

### Récupérer tous les utilisateurs
```bash
curl http://localhost:3000/api/users
```

### Récupérer un utilisateur spécifique
```bash
curl http://localhost:3000/api/users/1
```

### Créer un nouvel utilisateur
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie", "email": "charlie@example.com"}'
```

### Modifier un utilisateur
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Dupont", "email": "alice.dupont@example.com"}'
```

### Supprimer un utilisateur
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## Structure des données

Les utilisateurs ont la structure suivante :
```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com"
}
```

## Points d'apprentissage

- Routes HTTP (GET, POST, PUT, DELETE)
- Paramètres d'URL (`:id`)
- Middleware JSON
- Validation de base
- Gestion d'erreurs
- Codes de statut HTTP