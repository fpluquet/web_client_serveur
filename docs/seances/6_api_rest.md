# APIs RESTful et sécurité web

## 1. Théorie

### 1.1 Principes des API RESTful

REST (Representational State Transfer) est un style d'architecture pour la conception d'APIs web qui a été introduit par Roy Fielding en 2000. Ce paradigme est devenu le standard de facto pour la création d'APIs web modernes en raison de sa simplicité, de sa scalabilité et de sa compatibilité avec le web.

#### Architecture REST : les fondements

Le style architectural REST repose sur six contraintes fondamentales qui définissent la manière dont les applications web doivent être conçues pour être véritablement RESTful :

**1. Interface uniforme (Uniform Interface)**
L'interface uniforme est le principe central de REST. Elle stipule que toutes les ressources doivent être accessibles via une interface standardisée. Cette contrainte se subdivise en quatre sous-contraintes :

- **Identification des ressources** : Chaque ressource doit être uniquement identifiable par une URI (Uniform Resource Identifier). Par exemple, `/api/users/123` identifie l'utilisateur avec l'ID 123.
- **Manipulation des ressources par représentations** : Les clients interagissent avec les ressources via leurs représentations (JSON, XML, HTML).
- **Messages auto-descriptifs** : Chaque message doit contenir suffisamment d'informations pour être traité (headers HTTP, codes de statut).
- **HATEOAS** (Hypermedia as the Engine of Application State) : Les réponses incluent des liens vers d'autres ressources liées, permettant la découverte dynamique des actions possibles.

**2. Sans état (Stateless)**
Chaque requête du client vers le serveur doit contenir toutes les informations nécessaires pour traiter la requête. Le serveur ne doit stocker aucun contexte client entre les requêtes. Cela signifie que :
- Aucune session n'est maintenue côté serveur
- Chaque requête est indépendante
- L'authentification doit être fournie à chaque requête
- Cela améliore la scalabilité et la fiabilité

**3. Cacheable**
Les réponses doivent être explicitement marquées comme cachables ou non-cachables. Le cache améliore les performances en évitant des requêtes répétitives au serveur. Les headers HTTP comme `Cache-Control`, `ETag`, et `Last-Modified` permettent de contrôler le comportement du cache.

**4. Architecture client-serveur**
Cette contrainte impose une séparation claire entre le client et le serveur. Le client gère l'interface utilisateur et l'expérience utilisateur, tandis que le serveur gère le stockage des données et la logique métier. Cette séparation permet :
- Une évolution indépendante des deux composants
- Une meilleure portabilité
- Une réutilisation des composants

**5. Système en couches (Layered System)**
L'architecture peut être composée de couches hiérarchiques où chaque composant ne peut voir que la couche immédiatement adjacente. Cela permet d'ajouter des éléments intermédiaires comme des proxies, des gateways, ou des caches sans affecter la communication client-serveur.

**6. Code à la demande (Code on Demand) - Optionnel**
Cette contrainte optionnelle permet au serveur d'étendre temporairement les fonctionnalités du client en transmettant du code exécutable (JavaScript, par exemple).

#### Focus sur HATEOAS : découverte dynamique des actions

HATEOAS (Hypermedia as the Engine of Application State) est souvent la contrainte REST la moins comprise et la moins implémentée. Elle mérite une explication détaillée.

**Le principe :** Un client interagit avec une API REST **uniquement via les liens hypermedia fournis dynamiquement par le serveur** dans les réponses. Le client n'a pas besoin de connaître à l'avance la structure complète de l'API — il découvre les actions possibles à travers les liens contenus dans les réponses du serveur.

**Sans HATEOAS :**
Le client sait qu'il doit faire :
```
GET /users/1
GET /users/1/orders
```
Ces URL sont codées en dur dans le client → **fort couplage**.

**Avec HATEOAS :**
Réponse du serveur à `GET /users/1` :
```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "_links": {
    "self": { "href": "/users/1" },
    "orders": { "href": "/users/1/orders" },
    "update": { "href": "/users/1", "method": "PUT" }
  }
}
```

Le client lit les liens disponibles (`_links`) et sait quelles actions sont possibles :
* consulter les commandes,
* mettre à jour le profil, etc.
→ **Il n'a pas besoin de connaître les routes à l'avance.**

**En pratique :**
* HATEOAS rend les **API plus évolutives** et **moins dépendantes du client**.
* Mais il est **rarement implémenté complètement** dans les API REST modernes (souvent jugé trop verbeux ou inutile si la documentation est claire).

#### Bonnes pratiques pour les APIs RESTful

**Conception des URLs orientées ressources :**

Les URLs doivent représenter des ressources (noms) et non des actions (verbes). Les actions sont exprimées par les méthodes HTTP :

```
✅ Bon :
GET /api/users          # Récupérer tous les utilisateurs
GET /api/users/123      # Récupérer l'utilisateur 123
POST /api/users         # Créer un nouvel utilisateur
PUT /api/users/123      # Mettre à jour l'utilisateur 123
DELETE /api/users/123   # Supprimer l'utilisateur 123

❌ Mauvais :
GET /api/getUsers
POST /api/createUser
POST /api/deleteUser/123
```

**Utilisation appropriée des codes de statut HTTP :**

Les codes de statut HTTP communiquent le résultat de la requête :

- **2xx Succès** : `200 OK`, `201 Created`, `204 No Content`
- **3xx Redirection** : `301 Moved Permanently`, `304 Not Modified`
- **4xx Erreur client** : `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `422 Unprocessable Entity`
- **5xx Erreur serveur** : `500 Internal Server Error`, `503 Service Unavailable`

**Versionnement des APIs :**

Le versionnement est crucial pour maintenir la compatibilité :

```javascript
// Dans l'URL
/api/v1/users
/api/v2/users

// Dans les headers
Accept: application/vnd.api+json;version=1
API-Version: 1.0
```

**Pagination pour les collections :**

Pour les collections importantes, la pagination est essentielle :

```javascript
// Requête
GET /api/users?page=2&limit=20

// Réponse
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8
  },
  "links": {
    "first": "/api/users?page=1&limit=20",
    "prev": "/api/users?page=1&limit=20",
    "next": "/api/users?page=3&limit=20",
    "last": "/api/users?page=8&limit=20"
  }
}
```

### 1.2 Authentification et autorisation dans le contexte Node.js

L'authentification et l'autorisation sont des aspects cruciaux de la sécurité des APIs. Dans l'écosystème Node.js, plusieurs stratégies peuvent être mises en œuvre.

#### Comprendre la différence entre authentification et autorisation

- **Authentification** : "Qui êtes-vous ?" - Processus de vérification de l'identité d'un utilisateur.
- **Autorisation** : "Que pouvez-vous faire ?" - Processus de détermination des permissions d'un utilisateur authentifié.

#### Méthodes d'authentification pour Node.js/Express

**1. Authentification par session et cookies :**

Approche traditionnelle où l'état de session est maintenu côté serveur :

```javascript
import session from 'express-session';
import MongoStore from 'connect-mongo';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only en production
    httpOnly: true, // Protection contre XSS
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));
```

- **Avantages** : Familier, révocation facile des sessions
- **Inconvénients** : Moins scalable, état côté serveur, problèmes avec les applications distribuées

**2. JSON Web Tokens (JWT)**
Tokens autoportés contenant des informations d'authentification :

```javascript
import jwt from 'jsonwebtoken';

// Génération du token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '24h',
      issuer: 'your-app-name',
      audience: 'your-app-users'
    }
  );
};

// Vérification du token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
```

**Structure d'un JWT** :
- **Header** : Type de token et algorithme de signature
- **Payload** : Données (claims)
- **Signature** : Vérification de l'intégrité

**Avantages & Inconvénients** :
- **Avantages** : Sans état, scalable, décentralisé
- **Inconvénients** : Révocation complexe, taille des tokens, sécurité du secret

**3. OAuth 2.0 avec Node.js**
Délégation d'accès via des providers externes (Google, GitHub, Facebook) :

```javascript
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Trouver ou créer l'utilisateur
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));
```

**4. API Keys**
Clés d'identification simples pour les APIs :

```javascript
const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  try {
    const client = await ApiKey.findOne({ key: apiKey, active: true });
    if (!client) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    req.client = client;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};
```

#### Sécurisation des applications Node.js/Express

**HTTPS : Communication chiffrée :**

En production, HTTPS est obligatoire. Avec Express :

```javascript
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS server running on port 443');
});

// Redirection HTTP vers HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

**CORS (Cross-Origin Resource Sharing) :**

Configuration précise des accès cross-origin :

```javascript
import cors from 'cors';

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://yourdomain.com',
      'https://app.yourdomain.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Autorise les cookies
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

**Content Security Policy (CSP) :**
Protection contre les attaques XSS :

```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));
```

### 1.3 Validation et gestion d'erreurs avec Express

#### Validation des entrées avec Joi et express-validator

**Avec Joi :**

```javascript
import Joi from 'joi';

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
  name: Joi.string().min(2).max(50).required(),
  age: Joi.number().integer().min(18).max(120)
});

const validateUser = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.validatedData = value;
  next();
};
```

**Avec express-validator :**
```javascript
import { body, validationResult } from 'express-validator';

const validateUserRules = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email valide requis'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),
  
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .escape() // Protection contre XSS
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};
```

#### Gestion d'erreurs structurée

**Middleware de gestion d'erreurs global :**
```javascript
// Classes d'erreurs personnalisées
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

// Middleware de gestion d'erreurs
const errorHandler = (err, req, res, next) => {
  // Log de l'erreur
  console.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // Erreurs opérationnelles prévues
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      timestamp: err.timestamp,
      path: req.path
    });
  }
  
  // Erreurs de validation Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  // Erreurs de duplication MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: `${field} already exists`
    });
  }
  
  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }
  
  // Erreurs non prévues
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};

// Gestionnaire pour les routes non trouvées
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

app.use(notFoundHandler);
app.use(errorHandler);
```

#### Rate Limiting avec Express

Protection contre les attaques par déni de service et les abus :

```javascript
import rateLimit from 'express-rate-limit';
import MongoStore from 'rate-limit-mongo';

// Rate limiting global
const globalLimiter = rateLimit({
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: 'rate-limits',
    expireTimeMs: 15 * 60 * 1000 // 15 minutes
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requêtes par fenêtre
  message: {
    error: 'Too many requests',
    retryAfter: Math.round(15 * 60) // en secondes
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting spécifique pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 tentatives de connexion
  skipSuccessfulRequests: true, // Ne pas compter les connexions réussies
  message: {
    error: 'Too many authentication attempts, please try again later'
  }
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);
```

## 2. Application pratique avec Node.js et Express

### 2.1 Création d'une API RESTful complète

Dans cette section, nous allons construire une API RESTful complète pour la gestion d'utilisateurs en utilisant Node.js et Express. Cette application démontrera tous les concepts théoriques abordés précédemment.

#### Structure du projet

```
api-project/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── users.js
│   ├── services/
│   │   ├── authService.js
│   │   └── userService.js
│   ├── utils/
│   │   ├── database.js
│   │   └── logger.js
│   └── app.js
├── tests/
├── package.json
└── .env
```

#### Exemple simple d'API RESTful

Avant de plonger dans l'implémentation complète, voici un exemple simple d'API RESTful basique pour comprendre les concepts fondamentaux :

**api-simple/server.js**
<!-- @include:start api-simple/server.js -->
```javascript
const express = require('express');
const app = express();

// Middleware pour parser JSON
app.use(express.json());

// Données en mémoire (en réalité, on utiliserait une base de données)
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

let nextId = 3;

// Route GET - Récupérer tous les utilisateurs
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: users
  });
});

// Route GET - Récupérer un utilisateur par ID
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// Route POST - Créer un nouvel utilisateur
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validation simple
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Le nom et l\'email sont requis'
    });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser
  });
});

// Route PUT - Modifier un utilisateur
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }
  
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Le nom et l\'email sont requis'
    });
  }
  
  users[userIndex] = { id, name, email };
  
  res.json({
    success: true,
    data: users[userIndex]
  });
});

// Route DELETE - Supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Utilisateur supprimé',
    data: deletedUser
  });
});

// Route par défaut
app.get('/', (req, res) => {
  res.json({
    message: 'API Simple - Gestion d\'utilisateurs',
    endpoints: {
      'GET /api/users': 'Récupérer tous les utilisateurs',
      'GET /api/users/:id': 'Récupérer un utilisateur',
      'POST /api/users': 'Créer un utilisateur',
      'PUT /api/users/:id': 'Modifier un utilisateur',
      'DELETE /api/users/:id': 'Supprimer un utilisateur'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}`);
});
```
<!-- @include:end api-simple/server.js -->

**api-simple/package.json**
<!-- @include:start api-simple/package.json -->
```json
{
  "name": "api-simple",
  "version": "1.0.0",
  "description": "API simple pour débuter avec Express",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```
<!-- @include:end api-simple/package.json -->

#### Configuration de base de l'application

**package.json**
<!-- @include:start api-project/package.json -->
```json
{
  "name": "api-restful-nodejs",
  "version": "1.0.0",
  "description": "API RESTful complète avec Node.js et Express",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^6.10.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.4",
    "supertest": "^6.3.3"
  }
}
```
<!-- @include:end api-project/package.json -->

**Configuration principale (src/app.js)**
<!-- @include:start api-project/src/app.js -->
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Configuration de la base de données
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/api-restful', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware de sécurité
app.use(helmet());
app.use(cors());

// Limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par windowMs
});
app.use(limiter);

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'API RESTful avec Node.js et Express' });
});

// Middleware de gestion d'erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
```
<!-- @include:end api-project/src/app.js -->

#### Modèle utilisateur avec Mongoose

**src/models/User.js**
<!-- @include:start api-project/src/models/User.js -->
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour hasher le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour exclure le mot de passe lors de la sérialisation
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
```
<!-- @include:end api-project/src/models/User.js -->

#### Contrôleurs et logique métier

**src/controllers/authController.js**
<!-- @include:start api-project/src/controllers/authController.js -->
```javascript
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Génération du JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret_key', {
    expiresIn: '24h'
  });
};

// Inscription
exports.register = async (req, res) => {
  try {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà'
      });
    }

    // Créer le nouvel utilisateur
    const user = new User({ username, email, password });
    await user.save();

    // Générer le token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Générer le token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};
```
<!-- @include:end api-project/src/controllers/authController.js -->

**src/controllers/userController.js**
<!-- @include:start api-project/src/controllers/userController.js -->
```javascript
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Obtenir le profil utilisateur
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Mettre à jour le profil utilisateur
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, email } = req.body;
    const userId = req.user.userId;

    // Vérifier si le nouvel email ou username existe déjà
    if (email || username) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        $or: [
          email && { email },
          username && { username }
        ].filter(Boolean)
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà'
        });
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: updatedUser.toJSON()
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Obtenir la liste des utilisateurs (admin seulement)
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};
```
<!-- @include:end api-project/src/controllers/userController.js -->

### 2.2 Middlewares de sécurité et validation

**src/middleware/auth.js**
<!-- @include:start api-project/src/middleware/auth.js -->
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant ou invalide'
      });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    
    // Vérifier que l'utilisateur existe encore
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Ajouter les informations utilisateur à la requête
    req.user = decoded;
    next();

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

module.exports = authMiddleware;
```
<!-- @include:end api-project/src/middleware/auth.js -->

**src/middleware/validation.js**
<!-- @include:start api-project/src/middleware/validation.js -->
```javascript
const { body } = require('express-validator');

// Validation pour l'inscription
exports.registerValidation = [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),

  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre')
];

// Validation pour la connexion
exports.loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis')
];

// Validation pour la mise à jour du profil
exports.updateProfileValidation = [
  body('username')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
];
```
<!-- @include:end api-project/src/middleware/validation.js -->

**src/middleware/errorHandler.js**
<!-- @include:start api-project/src/middleware/errorHandler.js -->
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Erreur capturée par le middleware:', err);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors
    });
  }

  // Erreur de duplication MongoDB (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} existe déjà`
    });
  }

  // Erreur CastError (ID MongoDB invalide)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID invalide'
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne'
  });
};

module.exports = errorHandler;
```
<!-- @include:end api-project/src/middleware/errorHandler.js -->

**src/middleware/admin.js**
<!-- @include:start api-project/src/middleware/admin.js -->
```javascript
const User = require('../models/User');

// Middleware pour vérifier les rôles d'administrateur
const adminMiddleware = async (req, res, next) => {
  try {
    // Récupérer l'utilisateur complet depuis la base de données
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier que l'utilisateur a le rôle admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Droits administrateur requis.'
      });
    }

    // Ajouter les informations utilisateur complètes à la requête
    req.userFull = user;
    next();

  } catch (error) {
    console.error('Erreur dans le middleware admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

module.exports = adminMiddleware;
```
<!-- @include:end api-project/src/middleware/admin.js -->

### 2.3 Routes et structure de l'API

**src/routes/authRoutes.js**
<!-- @include:start api-project/src/routes/authRoutes.js -->
```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');

// POST /api/auth/register - Inscription
router.post('/register', registerValidation, authController.register);

// POST /api/auth/login - Connexion
router.post('/login', loginValidation, authController.login);

module.exports = router;
```
<!-- @include:end api-project/src/routes/authRoutes.js -->

**src/routes/userRoutes.js**
<!-- @include:start api-project/src/routes/userRoutes.js -->
```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { updateProfileValidation } = require('../middleware/validation');

// GET /api/users/profile - Obtenir son profil (utilisateur connecté)
router.get('/profile', authMiddleware, userController.getProfile);

// PUT /api/users/profile - Mettre à jour son profil (utilisateur connecté)
router.put('/profile', authMiddleware, updateProfileValidation, userController.updateProfile);

// GET /api/users - Obtenir la liste des utilisateurs (admin seulement)
router.get('/', authMiddleware, adminMiddleware, userController.getUsers);

module.exports = router;
```
<!-- @include:end api-project/src/routes/userRoutes.js -->

### 2.4 Tests automatisés

**tests/api.test.js**
<!-- @include:start api-project/tests/api.test.js -->
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('API Tests', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('API RESTful avec Node.js et Express');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(userData.email);
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'Password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('errors');
    });
  });
});
```
<!-- @include:end api-project/tests/api.test.js -->

Cette implémentation complète démontre tous les concepts RESTful et de sécurité abordés dans la partie théorique, avec une architecture moderne et scalable utilisant Node.js et Express.

## 3. Exercices pratiques

### Exercice 1 : Extension de l'API
Étendez l'API de gestion d'utilisateurs en ajoutant :
1. Un système de changement de mot de passe
2. Une fonctionnalité de récupération de mot de passe par email
3. Un système de rôles plus granulaire avec permissions spécifiques

### Exercice 2 : Tests automatisés
Implémentez des tests unitaires et d'intégration pour l'API en utilisant Jest et Supertest.

### Exercice 3 : Documentation API
Créez une documentation complète de votre API en utilisant Swagger/OpenAPI.

Ces exercices permettront de consolider les connaissances acquises et d'approfondir la maîtrise des APIs RESTful avec Node.js et Express.












