# Gestion des données et interaction avec la base de données

## 1. Théorie

### 1.1 Gestion des requêtes HTTP

#### Méthodes HTTP et leur usage

- **GET** : Récupération de données
- **POST** : Création de données
- **PUT/PATCH** : Mise à jour de données
- **DELETE** : Suppression de données

#### Paramètres de requête et corps de requête

- **Paramètres d'URL** : `?param1=value1&param2=value2`
- **Corps de requête** : Données formatées (JSON, form-data, etc.)
- **En-têtes HTTP** : Métadonnées de la requête/réponse

### 1.2 Bases de données et ORM

#### Types de bases de données
- **Relationnelles** : MySQL, PostgreSQL
- **NoSQL** : MongoDB, Redis

#### ORM (Object-Relational Mapping)
- Conversion entre objets en mémoire et tables en base de données
- Node.js : Sequelize, TypeORM, Prisma
- PHP : Doctrine, Eloquent

### 1.3 Modèle MVC (Modèle-Vue-Contrôleur)

- **Modèle** : Logique métier et accès aux données
- **Vue** : Présentation des données
- **Contrôleur** : Coordination entre modèle et vue

## 2. Application

### 2.1 Gestion des données en Node.js/Express

::: details Code illustré
```javascript
// Middleware pour parser le JSON
app.use(express.json());

// Stockage temporaire des utilisateurs (à remplacer par une BD)
let users = [];

// Route pour créer un utilisateur (POST)
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  
  res.status(201).json(newUser);
});

// Route pour obtenir tous les utilisateurs (GET)
app.get('/users', (req, res) => {
  res.json(users);
});
```

> Le code complet se trouve dans `/code/seance2/nodejs/`
:::

#### Points clés :
- Express offre des middlewares pour parser les corps de requête
- Les statuts HTTP permettent de communiquer le résultat de l'opération
- Les routes peuvent être organisées par ressource (/users)

### 2.2 Gestion des données en PHP

::: details Code illustré
```php
<?php
// Simuler une "base de données" avec un tableau
$users = [];

// Déterminer l'action en fonction de la méthode HTTP
$method = $_SERVER['REQUEST_METHOD'];
$route = $_GET['route'] ?? 'home';

// Gérer les requêtes pour la ressource "users"
if ($route === 'users') {
    switch ($method) {
        case 'GET':
            // Retourner tous les utilisateurs
            header('Content-Type: application/json');
            echo json_encode($users);
            break;
            
        case 'POST':
            // Créer un nouvel utilisateur
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['name']) || !isset($data['email'])) {
                header('HTTP/1.1 400 Bad Request');
                echo json_encode(['error' => 'Name and email are required']);
                break;
            }
            
            $newUser = [
                'id' => count($users) + 1,
                'name' => $data['name'],
                'email' => $data['email']
            ];
            
            $users[] = $newUser;
            
            header('HTTP/1.1 201 Created');
            header('Content-Type: application/json');
            echo json_encode($newUser);
            break;
    }
}
```

> Le code complet se trouve dans `/code/seance2/php/`
:::

#### Points clés :
- PHP peut accéder au corps de la requête via `php://input`
- `json_encode` et `json_decode` permettent de travailler avec le format JSON
- `$_SERVER['REQUEST_METHOD']` donne accès à la méthode HTTP

## 3. Exercices

### Exercice 2.1 : API CRUD pour une liste de tâches

**Objectif** : Créer une API RESTful pour gérer une liste de tâches (todo list).

**Consignes** :
1. Implémentez les routes suivantes :
   - `GET /tasks` : Liste toutes les tâches
   - `GET /tasks/:id` : Récupère une tâche spécifique
   - `POST /tasks` : Crée une nouvelle tâche
   - `PUT /tasks/:id` : Met à jour une tâche
   - `DELETE /tasks/:id` : Supprime une tâche

2. Chaque tâche doit avoir :
   - Un identifiant unique
   - Un titre
   - Une description
   - Un statut (à faire, en cours, terminée)

3. Implémentez cette API en Node.js/Express et en PHP

> Les solutions complètes sont disponibles dans `/solutions/seance2/nodejs/` et `/solutions/seance2/php/`

### Exercice 2.2 : Connexion à une base de données

**Objectif** : Modifier l'API de tâches pour utiliser une base de données.

**Consignes** :
1. En Node.js/Express :
   - Installez et configurez Sequelize avec une base SQLite
   - Créez un modèle pour les tâches
   - Modifiez les routes pour utiliser les méthodes de Sequelize

2. En PHP :
   - Utilisez PDO pour vous connecter à une base SQLite
   - Créez les requêtes SQL pour CRUD
   - Modifiez les routes pour utiliser PDO

> Les solutions complètes sont disponibles dans `/solutions/seance2/nodejs/` et `/solutions/seance2/php/`
