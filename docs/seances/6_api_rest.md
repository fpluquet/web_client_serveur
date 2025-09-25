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
- **HATEOAS** (Hypermedia as the Engine of Application State) : Les réponses incluent des liens vers d'autres ressources liées.

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

#### Configuration de base de l'application

**package.json**
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

**Configuration principale (src/app.js)**
```javascript
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

// Import des routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

// Import des middlewares
import errorHandler from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par windowMs
});
app.use('/api', limiter);

// Parsing des requêtes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connexion à MongoDB réussie');
}).catch((error) => {
  console.error('❌ Erreur de connexion à MongoDB:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Middleware pour les routes non trouvées
app.use(notFoundHandler);

// Middleware de gestion d'erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
```

#### Modèle utilisateur avec Mongoose

**src/models/User.js**
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // N'inclut pas le mot de passe par défaut dans les requêtes
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  passwordChangedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Index pour améliorer les performances de recherche
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });

// Middleware pre-save pour hasher le mot de passe
userSchema.pre('save', async function(next) {
  // Ne hasher que si le mot de passe a été modifié
  if (!this.isModified('password')) return next();
  
  try {
    // Hasher le mot de passe avec un coût de 12
    this.password = await bcrypt.hash(this.password, 12);
    
    // Mettre à jour passwordChangedAt si ce n'est pas un nouvel utilisateur
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // -1s pour éviter les problèmes de timing
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour vérifier si le mot de passe a été changé après l'émission du JWT
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Méthode statique pour trouver un utilisateur actif par email
userSchema.statics.findActiveByEmail = function(email) {
  return this.findOne({ email, isActive: true });
};

module.exports = mongoose.model('User', userSchema);
```

#### Contrôleurs et logique métier

**src/controllers/authController.js**
```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError, AuthenticationError } from '../middleware/errorHandler.js';

// Fonction utilitaire pour générer un JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// Fonction utilitaire pour envoyer le token
const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 24) * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt', token, cookieOptions);

  // Mettre à jour la dernière connexion
  user.lastLogin = new Date();
  user.save({ validateBeforeSave: false });

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user
    }
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Un utilisateur avec cet email existe déjà', 409));
    }

    // Créer le nouvel utilisateur
    const newUser = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    createSendToken(newUser, 201, res, 'Utilisateur créé avec succès');
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Vérifier que l'email et le mot de passe sont fournis
    if (!email || !password) {
      return next(new AppError('Email et mot de passe requis', 400));
    }

    // Trouver l'utilisateur et inclure le mot de passe
    const user = await User.findActiveByEmail(email).select('+password');

    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (!user || !(await user.comparePassword(password))) {
      return next(new AuthenticationError('Email ou mot de passe incorrect'));
    }

    createSendToken(user, 200, res, 'Connexion réussie');
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    status: 'success',
    message: 'Déconnexion réussie'
  });
};

exports.refreshToken = async (req, res, next) => {
  try {
    const user = req.user; // Fourni par le middleware d'authentification
    createSendToken(user, 200, res, 'Token rafraîchi');
  } catch (error) {
    next(error);
  }
};
```

**src/controllers/userController.js**
```javascript
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

exports.getAllUsers = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtres
    const filter = { isActive: true };
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Tri
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Tri par défaut
    }

    const users = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: users.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        users
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.isActive) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { password, ...updateData } = req.body;

    // Empêcher la mise à jour du mot de passe via cette route
    if (password) {
      return next(new AppError('Cette route ne permet pas la mise à jour du mot de passe', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = async (req, res, next) => {
  try {
    // Filtrer les champs non autorisés
    const allowedFields = ['name', 'email'];
    const filteredBody = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredBody[key] = req.body[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
```

### 2.2 Middlewares de sécurité et validation

**src/middleware/auth.js**
```javascript
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';
import { AppError, AuthenticationError, AuthorizationError } from './errorHandler.js';

exports.protect = async (req, res, next) => {
  try {
    // 1) Récupérer le token
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AuthenticationError('Vous n\'êtes pas connecté'));
    }

    // 2) Vérifier le token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.id);
    if (!currentUser || !currentUser.isActive) {
      return next(new AuthenticationError('L\'utilisateur associé à ce token n\'existe plus'));
    }

    // 4) Vérifier si l'utilisateur a changé son mot de passe après l'émission du token
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AuthenticationError('Mot de passe récemment modifié. Veuillez vous reconnecter'));
    }

    // Donner accès à la route protégée
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AuthenticationError('Token invalide'));
    } else if (error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Token expiré'));
    }
    next(error);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AuthorizationError('Vous n\'avez pas la permission d\'effectuer cette action'));
    }
    next();
  };
};

exports.isOwnerOrAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.id === req.params.id) {
    return next();
  }
  return next(new AuthorizationError('Vous pouvez seulement accéder à vos propres ressources'));
};
```

### 2.3 Routes et structure de l'API

**src/routes/auth.js**
```javascript
import express from 'express';
import authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', protect, authController.refreshToken);

module.exports = router;
```

**src/routes/users.js**
```javascript
import express from 'express';
import userController from '../controllers/userController.js';
import { protect, restrictTo, isOwnerOrAdmin } from '../middleware/auth.js';
import { validateUserUpdate } from '../middleware/validation.js';

const router = express.Router();

// Toutes les routes suivantes nécessitent une authentification
router.use(protect);

// Routes pour l'utilisateur connecté
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', validateUserUpdate, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// Routes administrateur
router.use(restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(validateUserUpdate, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
```

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












