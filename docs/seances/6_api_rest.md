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
import FileStore from 'session-file-store';

const FileStoreSession = FileStore(session);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new FileStoreSession({
    path: './sessions',
    encrypt: true
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

Les **JSON Web Tokens (JWT)** sont devenus le standard de facto pour l'authentification stateless dans les applications web modernes. Un JWT est un token sécurisé et autoporté qui permet de transmettre des informations d'identité entre parties de manière compacte et vérifiable.

#### Structure complète d'un JWT

Un JWT est composé de **trois parties** séparées par des points (`.`) :

```
header.payload.signature
```

**Exemple de JWT complet :**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```


##### 1. Header (En-tête)
Contient les métadonnées sur le token :

```json
{
  "alg": "HS256",    // Algorithme de signature (HMAC SHA256)
  "typ": "JWT"       // Type de token
}
```

**Algorithmes de signature supportés :**
- **HS256** (HMAC SHA256) : Signature symétrique avec clé secrète partagée
- **RS256** (RSA SHA256) : Signature asymétrique avec clé privée/publique
- **ES256** (ECDSA SHA256) : Signature avec courbes elliptiques

##### 2. Payload (Charge utile)
Contient les **claims** (revendications) - les données sur l'utilisateur et le token :

```json
{
  "sub": "1234567890",           // Subject - identifiant unique
  "name": "John Doe",            // Claim personnalisé
  "email": "john@example.com",   // Claim personnalisé
  "role": "admin",               // Claim personnalisé
  "iat": 1516239022,             // Issued At - moment de création
  "exp": 1516325422,             // Expiration - moment d'expiration
  "iss": "my-app",               // Issuer - qui a émis le token
  "aud": "my-app-users"          // Audience - à qui est destiné le token
}
```

**Types de claims :**

- **Claims standards (RFC 7519) :**
  - `iss` (issuer) : Émetteur du token
  - `sub` (subject) : Sujet (généralement l'ID utilisateur)
  - `aud` (audience) : Destinataire prévu
  - `exp` (expiration) : Date d'expiration (timestamp UNIX)
  - `iat` (issued at) : Date de création
  - `nbf` (not before) : Date avant laquelle le token n'est pas valide
  - `jti` (JWT ID) : Identifiant unique du token

- **Claims personnalisés :**
  - `role`, `permissions`, `email`, `username`, etc.
  - ⚠️ **Attention** : Ne jamais inclure de données sensibles (mots de passe, numéros de carte de crédit)

##### 3. Signature
**Garantit l'intégrité et l'authenticité du token** - C'est LE mécanisme de sécurité des JWT :

```javascript
// Pour HS256 (HMAC SHA256)
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

**Comment la sécurité est assurée :**

1. **Processus de création de la signature :**
   ```javascript
   // 1. Concaténation des parties encodées
   const message = base64UrlEncode(header) + "." + base64UrlEncode(payload);
   
   // 2. Calcul du hash cryptographique avec la clé secrète
   const signature = crypto
     .createHmac('sha256', SECRET_KEY)  // Clé secrète connue SEULEMENT du serveur
     .update(message)                   // Message à signer
     .digest('base64url');              // Résultat en base64url
   ```

2. **Processus de vérification :**
   ```javascript
   // Côté serveur, lors de la réception d'un token
   const [receivedHeader, receivedPayload, receivedSignature] = token.split('.');
   
   // Recalcul de la signature attendue
   const expectedSignature = crypto
     .createHmac('sha256', SECRET_KEY)
     .update(`${receivedHeader}.${receivedPayload}`)
     .digest('base64url');
   
   // Comparaison sécurisée
   if (crypto.timingSafeEqual(
     Buffer.from(expectedSignature), 
     Buffer.from(receivedSignature)
   )) {
     console.log('✅ Token authentique et non modifié');
   } else {
     console.log('❌ Token invalide ou modifié');
   }
   ```

**Types d'algorithmes de signature et leur sécurité :**

- **HS256** (HMAC SHA256) : 
  - 🔑 **Clé symétrique** : Même clé pour signer et vérifier
  - ✅ **Avantages** : Rapide, simple à implémenter
  - ⚠️ **Inconvénients** : Tous les services doivent partager la même clé secrète
  - 🔐 **Sécurité** : Repose sur le secret de la clé partagée

- **RS256** (RSA SHA256) :
  - 🔑 **Clé asymétrique** : Clé privée pour signer, clé publique pour vérifier
  - ✅ **Avantages** : Permet la distribution de la vérification sans partager la clé de signature
  - ⚠️ **Inconvénients** : Plus lent, plus complexe
  - 🔐 **Sécurité** : Repose sur la cryptographie à clé publique

- **ES256** (ECDSA SHA256) :
  - 🔑 **Courbes elliptiques** : Plus efficace que RSA pour la même sécurité
  - ✅ **Avantages** : Signatures plus courtes, meilleure performance
  - ⚠️ **Inconvénients** : Support moins universel
  - 🔐 **Sécurité** : Repose sur le problème du logarithme discret sur courbes elliptiques

**Exemple pratique de tentative d'attaque :**

```javascript
// ❌ Tentative de modification malveillante d'un token
const originalToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoidXNlciJ9.signature";

// Un attaquant essaie de modifier le payload pour devenir admin
const maliciousPayload = {
  userId: "123",
  role: "admin"  // ❌ Modification malveillante
};

const encodedMaliciousPayload = Buffer.from(JSON.stringify(maliciousPayload)).toString('base64url');
const [header, , originalSignature] = originalToken.split('.');

// Token modifié avec l'ancienne signature
const tamperedToken = `${header}.${encodedMaliciousPayload}.${originalSignature}`;

// ✅ Le serveur détecte la modification lors de la vérification
const verifyTamperedToken = (token, secret) => {
  const [h, p, s] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
  
  if (expectedSig !== s) {
    throw new Error('🚨 ATTAQUE DÉTECTÉE : Token modifié !');
  }
};
```

**Pourquoi la signature est inviolable :**
- Sans la clé secrète, impossible de générer une signature valide
- Toute modification du header ou payload invalide la signature
- Les algorithmes cryptographiques utilisés sont computationnellement sûrs
- La vérification détecte immédiatement toute tentative de falsification


#### ⚠️ **IMPORTANT : Encodage vs Chiffrement dans les JWT**

**Les JWT ne sont PAS chiffrés !** Il s'agit d'une confusion courante mais critique pour la sécurité :

**Ce qui est ENCODÉ (Base64URL) :**
- ✅ **Header** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` → `{"alg":"HS256","typ":"JWT"}`
- ✅ **Payload** : `eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ` → `{"userId":"1234567890","name":"John Doe","iat":1516239022}`

**Ce qui est CRYPTOGRAPHIQUEMENT SÉCURISÉ :**
- 🔐 **Signature** : `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c` → Hash cryptographique HMAC-SHA256

**Démonstration pratique :**

```javascript
// N'importe qui peut décoder le contenu d'un JWT
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const [header, payload, signature] = token.split('.');

// Décodage du header (sans clé secrète !)
const decodedHeader = JSON.parse(Buffer.from(header, 'base64url').toString());
console.log(decodedHeader); // {"alg":"HS256","typ":"JWT"}

// Décodage du payload (sans clé secrète !)
const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
console.log(decodedPayload); // {"userId":"1234567890","name":"John Doe","iat":1516239022}

// ⚠️ La signature ne peut être vérifiée QUE avec la clé secrète
```

**Implications de sécurité critiques :**

1. **❌ JAMAIS de données sensibles dans le payload** :
   ```javascript
   // ❌ DANGEREUX - Visible par tous !
   const badPayload = {
     userId: "123",
     password: "secret123",        // ❌ Lisible par tous !
     creditCard: "1234-5678-9012", // ❌ Lisible par tous !
     apiKey: "sk_live_abc123"      // ❌ Lisible par tous !
   };
   
   // ✅ CORRECT - Données non sensibles uniquement
   const goodPayload = {
     userId: "123",
     email: "user@example.com",    // ✅ Information publique
     role: "user",                 // ✅ Information de contexte
     permissions: ["read"]         // ✅ Information de contexte
   };
   ```

2. **🔐 La sécurité repose uniquement sur la signature** :
   - La signature garantit que le token n'a pas été modifié
   - Elle confirme que le token provient d'une source de confiance (qui possède la clé secrète)
   - Elle ne cache PAS le contenu du payload

3. **🔍 Vérification de l'intégrité** :
   ```javascript
   // Processus de vérification d'un JWT
   const verifyJWT = (token, secret) => {
     const [header, payload, signature] = token.split('.');
     
     // 1. Recalculer la signature avec la clé secrète
     const expectedSignature = crypto
       .createHmac('sha256', secret)
       .update(`${header}.${payload}`)
       .digest('base64url');
     
     // 2. Comparer avec la signature fournie
     if (expectedSignature !== signature) {
       throw new Error('Token modifié ou invalide !');
     }
     
     // 3. Si les signatures correspondent → token authentique
     return JSON.parse(Buffer.from(payload, 'base64url').toString());
   };
   ```

**En résumé :**
- 📖 **Encodage Base64URL** : Permet la transmission et le stockage facile (lisible par tous)
- 🔐 **Signature cryptographique** : Garantit l'authenticité et l'intégrité (vérifiable seulement avec la clé secrète)
- ⚠️ **Pas de chiffrement** : Le contenu est visible, ne jamais y mettre de données sensibles !

#### Implémentation pratique avec Node.js

**Génération complète d'un JWT :**

```javascript
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  // Payload avec claims standards et personnalisés
  const payload = {
    // Claims standards
    sub: user._id,                    // Subject (ID utilisateur)
    iat: Math.floor(Date.now() / 1000), // Issued at
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Expire dans 24h
    iss: 'my-app',                    // Issuer
    aud: 'my-app-users',              // Audience
    
    // Claims personnalisés
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    username: user.username
  };

  // Options supplémentaires
  const options = {
    algorithm: 'HS256',               // Algorithme de signature
    expiresIn: '24h',                 // Alternative à exp dans payload
    issuer: 'my-app',                 // Alternative à iss dans payload
    audience: 'my-app-users',         // Alternative à aud dans payload
    subject: user._id.toString(),     // Alternative à sub dans payload
    jwtid: generateUniqueId()         // ID unique pour le token
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// Fonction helper pour générer un ID unique
const generateUniqueId = () => {
  return require('crypto').randomBytes(16).toString('hex');
};
```

**Vérification et décodage :**

```javascript
const verifyToken = (token) => {
  try {
    // Options de vérification
    const options = {
      algorithms: ['HS256'],           // Algorithmes acceptés
      issuer: 'my-app',               // Vérifier l'émetteur
      audience: 'my-app-users',       // Vérifier l'audience
      clockTolerance: 30,             // Tolérance de 30 secondes pour l'horloge
      maxAge: '24h'                   // Age maximum du token
    };

    const decoded = jwt.verify(token, process.env.JWT_SECRET, options);
    
    // Vérifications supplémentaires
    if (!decoded.sub || !decoded.email) {
      throw new Error('Token invalide : claims manquants');
    }

    return {
      valid: true,
      payload: decoded,
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role
    };

  } catch (error) {
    return {
      valid: false,
      error: error.message,
      expired: error.name === 'TokenExpiredError',
      invalid: error.name === 'JsonWebTokenError'
    };
  }
};
```

**Middleware d'authentification complet :**

```javascript
const jwtMiddleware = async (req, res, next) => {
  try {
    // 1. Extraction du token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token manquant',
        message: 'Format attendu: Authorization: Bearer <token>'
      });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // 2. Vérification du token
    const verification = verifyToken(token);
    if (!verification.valid) {
      const statusCode = verification.expired ? 401 : 403;
      return res.status(statusCode).json({
        error: verification.expired ? 'Token expiré' : 'Token invalide',
        details: verification.error
      });
    }

    // 3. Enrichissement de la requête
    req.user = verification.payload;
    req.userId = verification.userId;
    req.userRole = verification.role;

    // 4. Vérifications métier supplémentaires (optionnel)
    const user = await User.findById(verification.userId);
    if (!user || !user.active) {
      return res.status(401).json({
        error: 'Utilisateur inactif ou supprimé'
      });
    }

    next();

  } catch (error) {
    console.error('Erreur middleware JWT:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
```

#### Gestion du cycle de vie des tokens

**Refresh Tokens pour la sécurité renforcée :**

```javascript
class TokenService {
  // Génération de paire access/refresh tokens
  static generateTokenPair(user) {
    // Access token courte durée (15 minutes)
    const accessToken = jwt.sign(
      { 
        sub: user._id, 
        email: user.email, 
        role: user.role,
        type: 'access'
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Refresh token longue durée (7 jours)
    const refreshToken = jwt.sign(
      {
        sub: user._id,
        type: 'refresh',
        jti: crypto.randomBytes(16).toString('hex') // ID unique
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  } 

  // Renouvellement des tokens
  static async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      if (decoded.type !== 'refresh') {
        throw new Error('Type de token invalide');
      }

      // Vérifier que le refresh token existe en base (pour révocation)
      const tokenRecord = await RefreshToken.findOne({ 
        userId: decoded.sub, 
        tokenId: decoded.jti 
      });

      if (!tokenRecord || tokenRecord.revoked) {
        throw new Error('Refresh token révoqué');
      }

      // Récupérer l'utilisateur
      const user = await User.findById(decoded.sub);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Générer nouveau access token
      const newAccessToken = jwt.sign(
        { 
          sub: user._id, 
          email: user.email, 
          role: user.role,
          type: 'access'
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      return { accessToken: newAccessToken };

    } catch (error) {
      throw new Error('Refresh token invalide');
    }
  }

  // Révocation des tokens (logout)
  static async revokeTokens(userId, tokenId = null) {
    if (tokenId) {
      // Révoquer un token spécifique
      await RefreshToken.updateOne(
        { userId, tokenId },
        { revoked: true, revokedAt: new Date() }
      );
    } else {
      // Révoquer tous les tokens de l'utilisateur
      await RefreshToken.updateMany(
        { userId },
        { revoked: true, revokedAt: new Date() }
      );
    }
  }
}
```

#### Sécurisation avancée des JWT

**1. Configuration sécurisée :**

```javascript
// Générateur de secret fort
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Variables d'environnement recommandées
const jwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET,     // 64+ caractères aléatoires
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,   // Différent de l'access secret
  accessTokenExpiry: '15m',                             // Courte durée
  refreshTokenExpiry: '7d',                             // Durée raisonnable
  algorithm: 'HS256',                                   // Ou RS256 pour plus de sécurité
  issuer: process.env.APP_NAME,
  audience: `${process.env.APP_NAME}-users`
};
```

**2. Protection contre les attaques :**

```javascript
// Protection contre les attaques par timing
const safeCompare = (a, b) => {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

// Validation stricte des claims
const validateClaims = (payload) => {
  const requiredClaims = ['sub', 'iat', 'exp'];
  const missingClaims = requiredClaims.filter(claim => !payload[claim]);
  
  if (missingClaims.length > 0) {
    throw new Error(`Claims manquants: ${missingClaims.join(', ')}`);
  }

  // Vérification de la date d'expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) {
    throw new Error('Token expiré');
  }

  // Vérification de la date de début de validité
  if (payload.nbf && payload.nbf > now) {
    throw new Error('Token pas encore valide');
  }

  return true;
};
```

#### Comparaison JWT vs Sessions

| Aspect | JWT | Sessions |
|--------|-----|----------|
| **Stockage serveur** | ❌ Aucun | ✅ État stocké |
| **Scalabilité** | ✅ Excellent | ❌ Limité |
| **Révocation** | ❌ Complexe | ✅ Immédiate |
| **Taille des données** | ❌ Limite (8KB) | ✅ Illimitée |
| **Sécurité XSS** | ⚠️ Stockage client | ✅ HttpOnly cookies |
| **Performance** | ✅ Pas de DB lookup | ❌ Lookup à chaque requête |
| **Applications distribuées** | ✅ Parfait | ❌ Session sharing complexe |

#### Bonnes pratiques JWT

**✅ À faire :**
- Utiliser HTTPS obligatoirement
- Stocker les tokens dans httpOnly cookies (côté web) ou stockage sécurisé (mobile)
- Implémenter des refresh tokens
- Utiliser des durées courtes pour les access tokens (15-30 minutes)
- Valider tous les claims
- Implémenter une blacklist pour la révocation critique
- Logger les tentatives d'utilisation de tokens invalides

**❌ À éviter :**
- Stocker des données sensibles dans le payload
- Utiliser des secrets faibles ou réutilisés
- Négliger la validation des claims
- Oublier la gestion de l'expiration
- Stocker les tokens dans localStorage (web) - vulnérable aux XSS

```javascript
// Exemple de bonnes pratiques pour le stockage côté client
// ✅ Cookies sécurisés (recommandé pour web)
res.cookie('accessToken', token, {
  httpOnly: true,      // Pas accessible via JavaScript
  secure: true,        // HTTPS uniquement
  sameSite: 'strict',  // Protection CSRF
  maxAge: 15 * 60 * 1000  // 15 minutes
});

// ❌ localStorage (vulnérable aux XSS)
// localStorage.setItem('token', token); // À éviter !
```

Cette approche complète des JWT permet aux étudiants de comprendre non seulement le fonctionnement technique, mais aussi les implications de sécurité et les meilleures pratiques pour une implémentation robuste en production.

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
  
  // Erreurs de validation personnalisées
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.message
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

// Rate limiting global (stockage en mémoire)
const globalLimiter = rateLimit({
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
### 2.1 Création d'une API RESTful simple

Avant de plonger dans l'implémentation complète, voici un exemple simple d'API RESTful basique pour comprendre les concepts fondamentaux ([📁 Voir sur GitHub](https://github.com/fpluquet/web_client_serveur/tree/main/code/seance6/api-simple)) :

::: details api-simple/server.js
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
:::

::: details api-simple/package.json
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
:::

### 2.2 Création d'une API RESTful complète

Dans cette section, nous allons construire une API RESTful complète pour la gestion d'utilisateurs en utilisant Node.js et Express. Cette application démontrera tous les concepts théoriques abordés précédemment ([📁 Voir sur GitHub](https://github.com/fpluquet/web_client_serveur/tree/main/code/seance6/api-project)).

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

#### Architecture en couches : Comprendre le rôle de chaque composant

Cette application RESTful suit une **architecture en couches** (layered architecture) qui sépare les responsabilités pour améliorer la maintenabilité, la testabilité et la scalabilité du code. Voici le rôle de chaque couche :

##### 1. **Couche d'entrée - Point d'entrée de l'application (`app.js`)**

```javascript
// Configuration centralisée des middlewares, routes et serveur
app.use(helmet());           // Sécurité HTTP
app.use('/api/auth', authRoutes);  // Routage
app.use(errorHandler);       // Gestion d'erreurs
```

**Responsabilités :**
- Configuration globale de l'application Express
- Initialisation des middlewares de sécurité
- Enregistrement des routes principales
- Démarrage du serveur HTTP
- Gestion des erreurs au niveau application

##### 2. **Couche de routage (`routes/`)**

```javascript
// userRoutes.js - Définition des endpoints et de leurs middlewares
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, updateProfileValidation, userController.updateProfile);
```

**Responsabilités :**
- Définition des endpoints RESTful (`GET /api/users/profile`)
- Association des URL aux contrôleurs appropriés
- Orchestration des middlewares par route (authentification, validation)
- Respect des conventions REST (méthodes HTTP, nommage des ressources)

##### 3. **Couche middleware (`middleware/`)**

Les middlewares sont des **fonctions interceptrices** qui s'exécutent avant les contrôleurs :

**`auth.js` - Authentification :**
```javascript
// Vérifie le token JWT et enrichit req.user
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  const decoded = jwt.verify(token, secret);
  req.user = decoded;  // Enrichit la requête
  next();              // Passe au middleware suivant
}
```

**`validation.js` - Validation des données :**
```javascript
// Valide les données d'entrée avec express-validator
const updateProfileValidation = [
  body('email').isEmail(),
  body('username').isLength({ min: 3 })
];
```

**Responsabilités :**
- **Authentification** : Vérification des tokens JWT
- **Autorisation** : Contrôle des permissions (admin, user)
- **Validation** : Vérification de la conformité des données d'entrée
- **Gestion d'erreurs** : Interception et formatage des erreurs
- **Sécurité** : Rate limiting, CORS, headers sécurisés

##### 4. **Couche contrôleurs (`controllers/`)**

```javascript
// authController.js - Logique métier des endpoints
exports.register = async (req, res) => {
  const errors = validationResult(req);  // Récupère les erreurs de validation
  const user = new User(req.body);       // Utilise le modèle
  await user.save();                     // Persiste les données
  res.json({ user, token });             // Formate la réponse
};
```

**Responsabilités :**
- **Logique métier** : Traitement des requêtes HTTP
- **Orchestration** : Coordination entre modèles et services
- **Formatage des réponses** : Structure des réponses JSON
- **Gestion des erreurs** : Capture et transmission des erreurs métier
- **Codes de statut HTTP** : Choix approprié des codes de retour

##### 5. **Couche modèles (`models/`)**

```javascript
// User.js - Représentation et persistance des données
class User {
  constructor(userData) {
    this.id = userData.id || Date.now().toString();
    this.username = userData.username;
    // ...
  }
  
  async save() {
    // Logique de persistance (ici en fichier JSON)
  }
  
  static async findById(id) {
    // Logique de recherche
  }
}
```

**Responsabilités :**
- **Représentation des données** : Structure des entités métier
- **Persistance** : Interface avec le système de stockage (JSON, base de données)
- **Validation des données** : Règles de validation au niveau modèle
- **Transformation** : Hashage des mots de passe, formatage des dates
- **Requêtes** : Méthodes pour CRUD (Create, Read, Update, Delete)

##### 6. **Couche services (`services/`) - Optionnelle**

```javascript
// authService.js - Logique métier complexe réutilisable
class AuthService {
  static generateToken(user) {
    return jwt.sign({ userId: user.id }, secret);
  }
  
  static async validateCredentials(email, password) {
    // Logique de validation complexe
  }
}
```

**Responsabilités :**
- **Logique métier réutilisable** : Fonctions utilisées par plusieurs contrôleurs
- **Opérations complexes** : Algorithmes métier, calculs
- **Intégrations externes** : APIs tierces, services de mailing
- **Abstraction** : Encapsulation de la complexité

##### 7. **Couche utilitaires (`utils/`)**

```javascript
// logger.js - Fonctions d'aide transversales
const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message) => console.error(`[ERROR] ${message}`)
};
```

**Responsabilités :**
- **Fonctions utilitaires** : Helpers réutilisables dans toute l'application
- **Configuration** : Paramètres globaux, constantes
- **Formatage** : Fonctions de transformation des données
- **Logging** : Système de journalisation

#### Flux de données dans l'architecture

```
1. Requête HTTP → app.js (middlewares globaux)
2. Routage → routes/ (middlewares spécifiques)
3. Middleware → middleware/ (auth, validation)
4. Contrôleur → controllers/ (logique métier)
5. Modèle → models/ (persistance)
6. Service → services/ (logique complexe)
7. Réponse ← formatée par le contrôleur
```

**Exemple concret : `PUT /api/users/profile`**

1. **app.js** : Applique les middlewares globaux (helmet, cors)
2. **userRoutes.js** : Route vers `authMiddleware` → `updateProfileValidation` → `userController.updateProfile`
3. **auth.js** : Vérifie le token JWT, enrichit `req.user`
4. **validation.js** : Valide les données du body
5. **userController.js** : Traite la logique métier
6. **User.js** : Modifie et sauvegarde les données
7. **Réponse** : Retourne le profil mis à jour

Cette architecture garantit :
- **Séparation des responsabilités** : Chaque couche a un rôle précis
- **Maintenabilité** : Modifications localisées dans la couche appropriée
- **Testabilité** : Chaque couche peut être testée indépendamment
- **Réutilisabilité** : Middlewares et services réutilisables
- **Scalabilité** : Ajout facile de nouvelles fonctionnalités

### 2.2 Implémentation complète avec sécurité et bonnes pratiques

#### Configuration de base de l'application

::: details api-project/package.json
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
:::
<!-- @include:end api-project/package.json -->

::: details Configuration principale (src/app.js)
<!-- @include:start api-project/src/app.js -->
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

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
:::

#### Modèle utilisateur avec stockage en fichiers JSON

Dans cette section, nous utilisons un système de stockage basé sur des fichiers JSON. Cette approche est idéale pour :
- **Apprentissage** : Se concentrer sur les concepts REST sans la complexité d'une base de données
- **Prototypage rapide** : Démarrer rapidement sans configuration de base de données
- **Environnements simples** : Applications légères ou environnements de développement

Le modèle `User` implémente une interface simple et efficace pour la gestion des données utilisateurs. Il faudra adapter cette approche pour une base de données réelle (MongoDB, PostgreSQL, etc.) dans une application de production (voir chapitre suivant).

::: details src/models/User.js
<!-- @include:start api-project/src/models/User.js -->
```javascript
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

class FileDataStore {
  constructor(filename) {
    this.filename = filename;
    this.dataDir = path.join(__dirname, '..', 'data');
    this.filePath = path.join(this.dataDir, `${filename}.json`);
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeData(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }
}

class User {
  constructor(userData) {
    this.id = userData.id || Date.now().toString();
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role || 'user';
    this.createdAt = userData.createdAt || new Date().toISOString();
  }

  static dataStore = new FileDataStore('users');

  // Méthode pour hasher le mot de passe
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2a$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Méthode pour vérifier le mot de passe
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Méthode pour exclure le mot de passe lors de la sérialisation
  toJSON() {
    const userObject = { ...this };
    delete userObject.password;
    return userObject;
  }

  // Sauvegarder un utilisateur
  async save() {
    await this.hashPassword();
    const users = await User.dataStore.readData();
    
    // Vérifier si l'utilisateur existe déjà
    const existingIndex = users.findIndex(u => u.id === this.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = this;
    } else {
      users.push(this);
    }
    
    await User.dataStore.writeData(users);
    return this;
  }

  // Trouver un utilisateur par critères
  static async findOne(criteria) {
    const users = await User.dataStore.readData();
    
    return users.find(user => {
      if (criteria.$or) {
        return criteria.$or.some(condition => {
          return Object.keys(condition).every(key => 
            user[key] === condition[key]
          );
        });
      }
      
      if (criteria._id && criteria._id.$ne) {
        return Object.keys(criteria).every(key => {
          if (key === '_id') return user.id !== criteria._id.$ne;
          return user[key] === criteria[key];
        });
      }
      
      return Object.keys(criteria).every(key => 
        user[key] === criteria[key]
      );
    });
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    const users = await User.dataStore.readData();
    return users.find(user => user.id === id);
  }

  // Trouver et mettre à jour un utilisateur
  static async findByIdAndUpdate(id, updates, options = {}) {
    const users = await User.dataStore.readData();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }
    
    users[userIndex] = { ...users[userIndex], ...updates };
    
    if (options.new) {
      await User.dataStore.writeData(users);
      return users[userIndex];
    }
    
    const oldUser = { ...users[userIndex] };
    await User.dataStore.writeData(users);
    return oldUser;
  }

  // Trouver tous les utilisateurs avec pagination
  static async find(options = {}) {
    const users = await User.dataStore.readData();
    return users;
  }

  // Compter les documents
  static async countDocuments() {
    const users = await User.dataStore.readData();
    return users.length;
  }
}

module.exports = User;
```
<!-- @include:end api-project/src/models/User.js -->
:::


#### Contrôleurs et logique métier

::: details src/controllers/authController.js
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
    const token = generateToken(user.id);

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
    const token = generateToken(user.id);

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
:::

::: details src/controllers/userController.js
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

    const allUsers = await User.find();
    const users = allUsers
      .map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      })
      .slice(skip, skip + limit)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
:::

### 2.2 Middlewares de sécurité et validation

::: details src/middleware/auth.js
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


::: details src/middleware/validation.js
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
:::

::: details src/middleware/errorHandler.js
<!-- @include:start api-project/src/middleware/errorHandler.js -->
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Erreur capturée par le middleware:', err);

  // Erreur de validation personnalisée
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      details: err.message
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
:::

::: details src/middleware/admin.js
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
:::

### 2.3 Routes et structure de l'API

::: details src/routes/authRoutes.js
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
:::

::: details src/routes/userRoutes.js
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
:::

### 2.4 Tests automatisés

::: details tests/api.test.js
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
:::

Cette implémentation complète démontre tous les concepts RESTful et de sécurité abordés dans la partie théorique, avec une architecture moderne et scalable utilisant Node.js et Express.


## 3. Exercices pratiques

### Exercice 1 : Extension de l'API
Étendez l'API de gestion d'utilisateurs en ajoutant un système de changement de mot de passe.


### Exercice 2 : Tests automatisés
Testez toutes les routes de l'API en utilisant Jest et Supertest pour assurer la robustesse et la fiabilité de l'application (seules 2 sont testées pour le moment).

### Exercice 3 : Documentation API
Créez une documentation complète de votre API en utilisant Swagger/OpenAPI.










