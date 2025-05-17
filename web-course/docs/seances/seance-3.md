# Séance 3 : APIs RESTful et sécurité web

## 1. Théorie

### 1.1 Principes des API RESTful

REST (Representational State Transfer) est un style d'architecture pour la conception d'APIs web.

#### Principes fondamentaux

- **Interface uniforme** : Ressources identifiées par URLs, actions par méthodes HTTP
- **Sans état** : Chaque requête contient toutes les informations nécessaires
- **Cacheable** : Réponses peuvent être marquées cachables ou non
- **Architecture client-serveur** : Séparation des préoccupations
- **Système en couches** : Les composants intermédiaires sont invisibles pour le client

#### Bonnes pratiques

- URLs basées sur les ressources (noms, pas verbes)
- Utiliser les bons codes de statut HTTP
- Versionnement des APIs
- Pagination pour les collections importantes

### 1.2 Authentification et autorisation

#### Méthodes d'authentification

- **Session/Cookie** : Traditionnelle, état stocké côté serveur
- **JWT** (JSON Web Tokens) : Sans état, information autoportée
- **OAuth 2.0** : Délégation d'accès
- **API Keys** : Clés d'identification simples

#### Sécurisation des applications

- **HTTPS** : Communication chiffrée
- **CORS** (Cross-Origin Resource Sharing) : Contrôle des accès cross-origin
- **CSP** (Content Security Policy) : Protection contre les attaques XSS

### 1.3 Validation et gestion d'erreurs

- **Validation des entrées** : Prévention des injections et attaques
- **Gestion d'erreurs structurée** : Messages appropriés, logs pertinents
- **Rate limiting** : Protection contre les abus

## 2. Application

### 2.1 API RESTful en Node.js/Express

::: details Code illustré
```javascript
// Structure de l'API dans des routes séparées
const express = require('express');
const router = express.Router();

// Middleware d'authentification
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    // Vérifier le token (simplifié pour l'exemple)
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes protégées par authentification
router.get('/protected-resource', authenticate, (req, res) => {
  res.json({ 
    message: 'Access granted', 
    user: req.user
  });
});

// Gestion d'erreurs centralisée
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

module.exports = router;
```

> Le code complet se trouve dans `/code/seance3/nodejs/`
:::

#### Points clés :
- Express permet de créer des middlewares d'authentification réutilisables
- La gestion d'erreurs centralisée simplifie le traitement des exceptions
- Les routes peuvent être organisées de manière modulaire

### 2.2 API RESTful en PHP

::: details Code illustré
```php
<?php
// Middleware d'authentification
function authenticate() {
    // Récupérer l'en-tête Authorization
    $headers = getallheaders();
    $auth = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    // Vérifier le format Bearer token
    if (preg_match('/Bearer\s(\S+)/', $auth, $matches)) {
        $token = $matches[1];
        
        // Vérifier le token (simplifié pour l'exemple)
        try {
            $decoded = verifyToken($token);
            return $decoded;
        } catch (Exception $e) {
            header('HTTP/1.1 401 Unauthorized');
            echo json_encode(['error' => 'Invalid token']);
            exit;
        }
    }
    
    // Aucun token valide
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['error' => 'Authentication required']);
    exit;
}

// Route protégée
if ($route === 'protected-resource') {
    // Authentifier l'utilisateur avant de continuer
    $user = authenticate();
    
    header('Content-Type: application/json');
    echo json_encode([
        'message' => 'Access granted',
        'user' => $user
    ]);
}

// Gestion globale des erreurs
function handleErrors($errno, $errstr, $errfile, $errline) {
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json');
    
    $isProduction = getenv('ENVIRONMENT') === 'production';
    echo json_encode([
        'error' => 'Server error',
        'message' => $isProduction ? 'Something went wrong' : $errstr
    ]);
    
    // Terminer le script
    exit;
}

// Enregistrer le gestionnaire d'erreur
set_error_handler('handleErrors');
```

> Le code complet se trouve dans `/code/seance3/php/`
:::

#### Points clés :
- Les fonctions permettent de créer des middlewares réutilisables
- `set_error_handler` centralise la gestion des erreurs
- La segmentation des fonctionnalités améliore la maintenabilité

## 3. Exercices

### Exercice 3.1 : API sécurisée avec JWT

**Objectif** : Implémenter un système d'authentification JWT pour sécuriser une API.

**Consignes** :
1. Créez les routes d'authentification suivantes :
   - `POST /auth/register` : Inscription d'un utilisateur
   - `POST /auth/login` : Connexion et génération de token JWT
   - `GET /auth/me` : Récupération des infos utilisateur (route protégée)

2. Implémentez la validation des données entrantes

3. Sécurisez toutes les routes de l'API de tâches (exercice précédent) avec JWT

4. Implémentez cette API en Node.js/Express et en PHP

> Les solutions complètes sont disponibles dans `/solutions/seance3/nodejs/` et `/solutions/seance3/php/`

### Exercice 3.2 : Documentation d'API avec Swagger/OpenAPI

**Objectif** : Documenter l'API de tâches avec Swagger/OpenAPI.

**Consignes** :
1. En Node.js/Express :
   - Installez et configurez swagger-ui-express
   - Documentez toutes les routes de l'API tâches
   - Incluez des exemples de requêtes et réponses

2. En PHP :
   - Créez un fichier de spécification OpenAPI (YAML ou JSON)
   - Configurez Swagger UI pour afficher la documentation
   - Documentez toutes les routes de l'API tâches

> Les solutions complètes sont disponibles dans `/solutions/seance3/nodejs/` et `/solutions/seance3/php/`