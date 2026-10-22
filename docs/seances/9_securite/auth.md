# Authentification et autorisation {#auth}


L'authentification et l'autorisation constituent les piliers fondamentaux de la sécurité des applications web. Ces mécanismes déterminent qui peut accéder à votre application et quelles actions ils sont autorisés à effectuer. Une implémentation défaillante de ces systèmes peut compromettre entièrement la sécurité de votre application.

## Comprendre la différence entre authentification et autorisation

Il est crucial de bien distinguer ces deux concepts souvent confondus :

**L'authentification** (AuthN) est le processus de vérification de l'identité d'un utilisateur. Elle répond à la question "Qui prétendez-vous être ?". C'est comme présenter votre carte d'identité à l'entrée d'un bâtiment.

**L'autorisation** (AuthZ) est le processus de détermination des permissions accordées à un utilisateur authentifié. Elle répond à la question "Que pouvez-vous faire ?". C'est comme vérifier si votre badge d'accès vous permet d'entrer dans certaines zones du bâtiment.

## Les mécanismes d'authentification modernes

### Authentification par mots de passe : Les fondamentaux sécurisés

L'authentification par mot de passe reste la méthode la plus répandue, mais elle doit être implémentée avec le plus grand soin. Le stockage en clair des mots de passe est une faute professionnelle grave qui expose tous vos utilisateurs en cas de compromission.

```javascript
import bcrypt from 'bcrypt';

// Hachage sécurisé du mot de passe lors de l'inscription
const hashPassword = async (password) => {
    // Le nombre de rounds détermine la complexité du hachage
    // 12 rounds offrent un bon équilibre entre sécurité et performance
    const saltRounds = 12;
    
    // bcrypt génère automatiquement un salt unique pour chaque mot de passe
    return await bcrypt.hash(password, saltRounds);
};

// Vérification du mot de passe lors de la connexion
const verifyPassword = async (password, hash) => {
    // bcrypt compare automatiquement avec le salt intégré dans le hash
    return await bcrypt.compare(password, hash);
};

// Exemple d'implémentation complète
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation de la force du mot de passe
        if (!isPasswordStrong(password)) {
            return res.status(400).json({
                error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole'
            });
        }
        
        // Hachage sécurisé
        const hashedPassword = await hashPassword(password);
        
        // Sauvegarde en base
        const user = await createUser(email, hashedPassword);
        
        res.status(201).json({ message: 'Utilisateur créé avec succès', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
});

function isPasswordStrong(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
}
```

### JSON Web Tokens (JWT) : Authentification stateless {#jwt}

Les JWT offrent une alternative moderne aux sessions traditionnelles, particulièrement adaptée aux architectures distribuées et aux API RESTful. Un JWT est un token **auto-porté** (*self-contained*) : il transporte des claims d’identité que le serveur peut vérifier **sans** consulter une session stockée.

::: tip Lien avec le chapitre APIs RESTful
Le [chapitre APIs RESTful](../6_api_rest.md) montre l’usage minimal (`jwt.sign` / `jwt.verify`) dans une API. Ici on détaille le **mécanisme technique** (encodage, signature, JWS/JWE), puis la configuration stricte, les refresh tokens et la révocation.
:::

#### Anatomie technique d’un JWT {#jwt-internals}

Un JWT compact se présente comme **trois segments** séparés par des points :

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0In0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
└──────────────── header ──────────┘ └──── payload ────┘ └─────────────────── signature ────────────┘
```

Chacun des deux premiers segments est du **JSON encodé en Base64URL** (variante URL-safe du Base64 : pas de `+`, `/`, ni `=` de padding). Le troisième est la **signature cryptographique**, aussi en Base64URL.

**1. Header (en-tête)**

```json
{ "alg": "HS256", "typ": "JWT" }
```

- `alg` : algorithme de signature (ex. `HS256` = HMAC-SHA256 avec secret partagé ; `RS256` = RSA + SHA-256 avec clé privée/publique)
- `typ` : type du token (`JWT`)

**2. Payload (charges / claims)**

```json
{
  "sub": "1234",
  "email": "alice@example.com",
  "role": "user",
  "iat": 1710000000,
  "exp": 1710003600
}
```

Claims courants : `sub` (sujet), `iat` (émis à), `exp` (expiration), `iss`, `aud`, `jti` (voir plus bas).

**3. Signature**

Pour un JWT signé en HS256, le principe est :

```
signature = HMAC-SHA256(
  base64url(header) + "." + base64url(payload),
  secret
)
```

Le serveur qui possède le secret peut **recalculer** la signature et la comparer. Si le payload a été modifié (ex. `role: "admin"`), la signature ne correspond plus → token rejeté.

```javascript
import crypto from 'crypto';

// Illustration pédagogique (en prod, utiliser jsonwebtoken)
const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
const payload = Buffer.from(JSON.stringify({ sub: '1234', role: 'user' })).toString('base64url');
const data = `${header}.${payload}`;
const signature = crypto
  .createHmac('sha256', process.env.JWT_SECRET)
  .update(data)
  .digest('base64url');

const token = `${data}.${signature}`;
```

#### Encodage ≠ chiffrement {#jwt-encoding}

C’est le point le plus mal compris — et le plus important pour la sécurité :

| | Encodage (Base64URL) | Signature (JWS) | Chiffrement (JWE) |
|--|----------------------|-----------------|-------------------|
| **But** | Rendre le JSON transportable dans une URL / un header | Prouver que le contenu n’a **pas été altéré** et vient d’une partie de confiance | Rendre le contenu **illisible** sans clé |
| **Le contenu est-il secret ?** | Non — n’importe qui peut décoder | Non — le payload reste lisible | Oui |
| **Dans un JWT « classique »** | Oui (header + payload) | Oui | **Non** (sauf si on utilise JWE) |

Conséquences pratiques :

1. **Ne jamais** mettre de mot de passe, numéro de carte, secret API, données médicales, etc. dans le payload d’un JWT signé classique.
2. On peut inspecter n’importe quel JWT sur [jwt.io](https://jwt.io) : le payload s’affiche en clair après décodage Base64URL.
3. La signature garantit l’**intégrité** et l’**authenticité**, pas la **confidentialité**.

```javascript
// Décoder le payload SANS vérifier la signature (démo uniquement !)
const [, payloadB64] = token.split('.');
const claims = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
console.log(claims); // lisible par tout le monde
```

Toujours utiliser `jwt.verify(...)` côté serveur (vérifie signature + `exp`, etc.). Un simple `jwt.decode(...)` **ne sécurise rien**.

#### Famille JOSE : JWT, JWS, JWE {#jose}

« JWT » est souvent utilisé comme raccourci, mais la norme repose sur la famille **JOSE** (*JavaScript Object Signing and Encryption*) :

```mermaid
flowchart TB
  JWT["JWT - contenu logique claims"]
  JWS["JWS - JWT signé compact header.payload.signature"]
  JWE["JWE - JWT chiffré compact 5 segments"]
  JWT -->|le plus courant pour les API| JWS
  JWT -->|confidentialité requise| JWE
```

| Acronyme | Nom | Rôle |
|----------|-----|------|
| **JWT** | JSON Web Token | Format de claims (le « message ») |
| **JWS** | JSON Web Signature | Message **signé** (intégrité + authenticité) — c’est le JWT à 3 parties que vous utilisez avec `jsonwebtoken` |
| **JWE** | JSON Web Encryption | Message **chiffré** (confidentialité) — 5 segments séparés par des points |
| **JWK** | JSON Web Key | Représentation JSON d’une clé crypto |
| **JWA** | JSON Web Algorithms | Catalogue d’algorithmes (`HS256`, `RS256`, `A256GCM`…) |

**JWS (ce que font 99 % des APIs REST du cours)**  

`header.payload.signature` — payload lisible, signature vérifiable. Algorithmes typiques :

- **HS256** : secret partagé (simple, idéal pour une seule API qui signe et vérifie)
- **RS256 / ES256** : clé privée pour signer, clé publique pour vérifier (plusieurs services peuvent vérifier sans connaître la clé privée)

**JWE (quand le payload doit rester secret)**  

Format compact à **cinq** parties :  
`protectedHeader.encryptedKey.iv.ciphertext.tag`

Le contenu n’est lisible qu’avec la clé de déchiffrement. Cas d’usage : tokens qui transportent des données sensibles *et* traversent des intermédiaires non fiables. Plus complexe (gestion des clés, librairies dédiées type `jose`) ; on ne l’utilise pas dans le projet du chapitre APIs RESTful.

**En résumé pour ce cours :**

- « JWT » en pratique = presque toujours un **JWS**
- Signature = **confiance dans l’émetteur** + **intégrité**
- Pas de confidentialité sans **JWE** (ou sans chiffrer autrement les données sensibles)
- En production API : JWS court + HTTPS (le canal chiffre le transport) + claims stricts (§ suivant)

#### Configuration JWT stricte : `issuer`, `audience`, `jti` {#jwt-strict}

Au-delà de `jwt.sign({ userId }, secret)`, une API de production **contraint** qui a émis le token, pour qui, et avec quel identifiant unique :

| Claim / option | Rôle | Pourquoi c’est important |
|----------------|------|---------------------------|
| **`issuer` (`iss`)** | Qui a émis le token (votre API) | Refuse un JWT signé pour une autre appli avec la même clé volée ailleurs |
| **`audience` (`aud`)** | Destinataire prévu (vos clients) | Empêche de réutiliser un token prévu pour un autre service |
| **`jti`** | ID unique du token | Permet la **révocation** (blacklist) et détecte la réutilisation |
| **`algorithms`** à la vérif. | Liste blanche (ex. `['HS256']`) | Évite les attaques « algorithm none » / confusion RSA↔HMAC |
| **`expiresIn` / `exp`** | Durée de vie courte (access token) | Limite la fenêtre d’abus si le token fuit |

```javascript
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Configuration sécurisée pour JWT
const JWT_CONFIG = {
    secret: process.env.JWT_SECRET, // Chaîne longue et aléatoire (jamais en dur dans le code)
    algorithm: 'HS256',
    expiresIn: '15m', // Access token court ; le refresh token dure plus longtemps
    issuer: 'monapp.com',
    audience: 'monapp-users'
};

// Génération d'un token JWT sécurisé
const generateToken = (user) => {
    const payload = {
        sub: user.id, // Subject (identifiant de l'utilisateur)
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000), // Issued at
        jti: crypto.randomUUID() // JWT ID unique pour révocation / anti-rejeu
    };
    
    return jwt.sign(payload, JWT_CONFIG.secret, {
        algorithm: JWT_CONFIG.algorithm,
        expiresIn: JWT_CONFIG.expiresIn,
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience
    });
};

// Middleware de vérification JWT robuste
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: 'Token d\'authentification requis',
            code: 'MISSING_TOKEN' 
        });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, JWT_CONFIG.secret, {
            algorithms: [JWT_CONFIG.algorithm],
            issuer: JWT_CONFIG.issuer,
            audience: JWT_CONFIG.audience
        });
        
        // Vérification de la validité temporelle
        if (decoded.exp < Math.floor(Date.now() / 1000)) {
            return res.status(401).json({
                error: 'Token expiré',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        let errorMessage = 'Token invalide';
        let errorCode = 'INVALID_TOKEN';
        
        if (error.name === 'TokenExpiredError') {
            errorMessage = 'Token expiré';
            errorCode = 'TOKEN_EXPIRED';
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = 'Format de token invalide';
            errorCode = 'MALFORMED_TOKEN';
        }
        
        return res.status(401).json({ error: errorMessage, code: errorCode });
    }
};

// Endpoint de connexion avec génération de JWT
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Recherche de l'utilisateur
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        
        // Vérification du mot de passe
        const isValidPassword = await verifyPassword(password, user.hashedPassword);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        
        // Génération du token
        const token = generateToken(user);
        
        // Journalisation de la connexion réussie
        logSecurityEvent('LOGIN_SUCCESS', {
            userId: user.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        
        res.json({
            message: 'Connexion réussie',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});
```

### Authentification multi-facteurs (2FA) : Renforcer la sécurité

L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire en demandant quelque chose que l'utilisateur possède (son téléphone) en plus de quelque chose qu'il connaît (son mot de passe).

```javascript
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// Configuration et génération du secret 2FA pour un utilisateur
const setup2FA = async (userId, userEmail) => {
    // Génération d'un secret unique pour l'utilisateur
    const secret = speakeasy.generateSecret({
        name: `MonApp (${userEmail})`,
        issuer: 'MonApplication',
        length: 32
    });
    
    // Sauvegarde du secret en base (chiffré)
    await saveUser2FASecret(userId, secret.base32);
    
    // Génération du QR Code pour l'application mobile
    const qrCodeUrl = speakeasy.otpauthURL({
        secret: secret.ascii,
        label: userEmail,
        issuer: 'MonApplication',
        algorithm: 'sha1',
        digits: 6,
        period: 30
    });
    
    const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);
    
    return {
        secret: secret.base32,
        qrCode: qrCodeImage,
        manualEntryKey: secret.base32
    };
};

// Vérification du code TOTP
const verifyTOTP = async (userId, token) => {
    const userSecret = await getUser2FASecret(userId);
    
    if (!userSecret) {
        throw new Error('2FA non configuré pour cet utilisateur');
    }
    
    const verified = speakeasy.totp.verify({
        secret: userSecret,
        encoding: 'base32',
        token: token,
        window: 2, // Accepte les codes dans une fenêtre de ±60 secondes
        step: 30 // Renouvellement toutes les 30 secondes
    });
    
    return verified;
};

// Endpoint d'activation de la 2FA
app.post('/enable-2fa', verifyToken, async (req, res) => {
    try {
        const userId = req.user.sub;
        const userEmail = req.user.email;
        
        const setup = await setup2FA(userId, userEmail);
        
        res.json({
            message: 'Configuration 2FA générée',
            qrCode: setup.qrCode,
            manualEntryKey: setup.manualEntryKey,
            instructions: 'Scannez le QR code avec votre application d\'authentification (Google Authenticator, Authy, etc.)'
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la configuration 2FA' });
    }
});

// Endpoint de vérification 2FA lors de la connexion
app.post('/verify-2fa', async (req, res) => {
    try {
        const { userId, totpCode } = req.body;
        
        const isValid = await verifyTOTP(userId, totpCode);
        
        if (isValid) {
            // Générer le token JWT avec marqueur 2FA validé
            const user = await findUserById(userId);
            const token = generateToken({ ...user, twoFactorVerified: true });
            
            res.json({
                message: '2FA vérifiée avec succès',
                token: token
            });
        } else {
            res.status(401).json({ error: 'Code 2FA invalide' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la vérification 2FA' });
    }
});
```

## Systèmes d'autorisation avancés

### Contrôle d'accès basé sur les rôles (RBAC)

Le RBAC est un modèle de sécurité qui attribue des permissions aux utilisateurs en fonction de leurs rôles au sein de l'organisation. C'est une approche scalable qui simplifie la gestion des permissions.

```javascript
// Définition des rôles et permissions
const PERMISSIONS = {
    // Permissions de lecture
    READ_USERS: 'read:users',
    READ_REPORTS: 'read:reports',
    READ_SYSTEM_LOGS: 'read:system_logs',
    
    // Permissions d'écriture
    WRITE_USERS: 'write:users',
    WRITE_REPORTS: 'write:reports',
    
    // Permissions d'administration
    ADMIN_USERS: 'admin:users',
    ADMIN_SYSTEM: 'admin:system'
};

const ROLES = {
    USER: {
        name: 'user',
        permissions: [PERMISSIONS.READ_REPORTS]
    },
    MODERATOR: {
        name: 'moderator',
        permissions: [
            PERMISSIONS.READ_USERS,
            PERMISSIONS.READ_REPORTS,
            PERMISSIONS.WRITE_REPORTS
        ]
    },
    ADMIN: {
        name: 'admin',
        permissions: [
            PERMISSIONS.READ_USERS,
            PERMISSIONS.READ_REPORTS,
            PERMISSIONS.READ_SYSTEM_LOGS,
            PERMISSIONS.WRITE_USERS,
            PERMISSIONS.WRITE_REPORTS,
            PERMISSIONS.ADMIN_USERS
        ]
    },
    SUPER_ADMIN: {
        name: 'super_admin',
        permissions: Object.values(PERMISSIONS) // Toutes les permissions
    }
};

// Middleware d'autorisation flexible
const authorize = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentification requise' });
            }
            
            // Récupération des permissions de l'utilisateur
            const user = await findUserById(req.user.sub);
            const userRole = ROLES[user.role.toUpperCase()];
            
            if (!userRole) {
                return res.status(403).json({ error: 'Rôle utilisateur invalide' });
            }
            
            // Vérification des permissions requises
            const userPermissions = userRole.permissions;
            const hasAllPermissions = requiredPermissions.every(permission => 
                userPermissions.includes(permission)
            );
            
            if (!hasAllPermissions) {
                logSecurityEvent('ACCESS_DENIED', {
                    userId: req.user.sub,
                    requiredPermissions,
                    userPermissions,
                    endpoint: req.path,
                    method: req.method,
                    ip: req.ip
                });
                
                return res.status(403).json({ 
                    error: 'Permissions insuffisantes',
                    required: requiredPermissions
                });
            }
            
            // Ajout des permissions au contexte de la requête
            req.userPermissions = userPermissions;
            next();
        } catch (error) {
            console.error('Erreur lors de la vérification des autorisations:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    };
};

// Utilisation du middleware d'autorisation
app.get('/users', verifyToken, authorize([PERMISSIONS.READ_USERS]), async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
});

app.post('/users', verifyToken, authorize([PERMISSIONS.WRITE_USERS]), async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
});

app.delete('/users/:id', verifyToken, authorize([PERMISSIONS.ADMIN_USERS]), async (req, res) => {
    try {
        await deleteUser(req.params.id);
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
});
```

### Contrôle d'accès basé sur les attributs (ABAC)

L'ABAC est un modèle plus flexible que le RBAC, qui prend en compte non seulement les rôles, mais aussi les attributs de l'utilisateur, de la ressource, et du contexte d'accès.

```javascript
// Moteur de règles ABAC
class ABACEngine {
    constructor() {
        this.rules = [];
    }
    
    addRule(rule) {
        this.rules.push(rule);
    }
    
    async evaluateAccess(subject, resource, action, context) {
        for (const rule of this.rules) {
            if (await rule.evaluate(subject, resource, action, context)) {
                return { granted: true, rule: rule.name };
            }
        }
        return { granted: false, reason: 'Aucune règle ne permet cet accès' };
    }
}

// Exemple de règles ABAC
class OwnershipRule {
    constructor() {
        this.name = 'ownership';
    }
    
    async evaluate(subject, resource, action, context) {
        // L'utilisateur peut accéder à ses propres ressources
        return resource.ownerId === subject.id;
    }
}

class DepartmentRule {
    constructor() {
        this.name = 'department';
    }
    
    async evaluate(subject, resource, action, context) {
        // Les managers peuvent accéder aux ressources de leur département
        return subject.role === 'manager' && 
               resource.department === subject.department;
    }
}

class TimeBasedRule {
    constructor() {
        this.name = 'time_based';
    }
    
    async evaluate(subject, resource, action, context) {
        // Certaines actions ne sont autorisées qu'en heures ouvrables
        const now = new Date();
        const hour = now.getHours();
        const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
        
        if (action === 'delete' && resource.type === 'critical') {
            return isWeekday && hour >= 9 && hour <= 17;
        }
        
        return true; // Pas de restriction temporelle pour les autres actions
    }
}

// Configuration du moteur ABAC
const abacEngine = new ABACEngine();
abacEngine.addRule(new OwnershipRule());
abacEngine.addRule(new DepartmentRule());
abacEngine.addRule(new TimeBasedRule());

// Middleware ABAC
const authorizeABAC = (resourceType, action) => {
    return async (req, res, next) => {
        try {
            const subject = req.user;
            const resourceId = req.params.id;
            const resource = await getResource(resourceType, resourceId);
            
            const context = {
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                time: new Date(),
                method: req.method,
                path: req.path
            };
            
            const decision = await abacEngine.evaluateAccess(subject, resource, action, context);
            
            if (decision.granted) {
                req.resource = resource;
                next();
            } else {
                logSecurityEvent('ABAC_ACCESS_DENIED', {
                    userId: subject.id,
                    resourceType,
                    resourceId,
                    action,
                    reason: decision.reason,
                    context
                });
                
                res.status(403).json({ 
                    error: 'Accès refusé',
                    reason: decision.reason
                });
            }
        } catch (error) {
            console.error('Erreur lors de l\'évaluation ABAC:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    };
};

// Utilisation de l'autorisation ABAC
app.get('/documents/:id', verifyToken, authorizeABAC('document', 'read'), (req, res) => {
    res.json(req.resource);
});

app.delete('/documents/:id', verifyToken, authorizeABAC('document', 'delete'), (req, res) => {
    // Logique de suppression
    res.json({ message: 'Document supprimé avec succès' });
});
```

## Gestion avancée des sessions et tokens

### Refresh tokens : access token court + renouvellement {#refresh-tokens}

Un **access token** JWT à longue durée de vie est dangereux : s’il fuit, l’attaquant reste authentifié longtemps, et on ne peut pas facilement l’invalider (token auto-porté).

La stratégie classique :

1. **Access token** : JWT court (ex. 5–15 min) — envoyé à chaque requête API (`Authorization: Bearer …`)
2. **Refresh token** : opaque ou JWT longue durée (ex. 7–30 jours), stocké de façon plus stricte, utilisé **uniquement** pour obtenir un nouvel access token
3. Quand l’access expire, le client appelle `POST /auth/refresh` avec le refresh token
4. En cas de déconnexion / suspicion de vol : on **révoque** le refresh token (et éventuellement l’access via `jti` + blacklist)

```javascript
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET; // secret différent !

// En mémoire pour l’exemple ; en prod : Redis / table DB
const refreshTokenStore = new Map(); // refreshToken -> { userId, expiresAt }

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            role: user.role,
            jti: crypto.randomUUID()
        },
        ACCESS_SECRET,
        {
            expiresIn: '15m',
            issuer: 'monapp.com',
            audience: 'monapp-api',
            algorithm: 'HS256'
        }
    );
};

const generateRefreshToken = (user) => {
    const token = jwt.sign(
        { userId: user.id, type: 'refresh', jti: crypto.randomUUID() },
        REFRESH_SECRET,
        {
            expiresIn: '7d',
            issuer: 'monapp.com',
            audience: 'monapp-refresh',
            algorithm: 'HS256'
        }
    );
    const decoded = jwt.decode(token);
    refreshTokenStore.set(token, {
        userId: user.id,
        expiresAt: decoded.exp * 1000
    });
    return token;
};

// Login : renvoie la paire de tokens
app.post('/auth/login', async (req, res) => {
    const user = await authenticateUser(req.body); // vérif email/password
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
        accessToken,
        refreshToken,
        expiresIn: 900 // secondes (15 min)
    });
});

// Renouvellement de l’access token
app.post('/auth/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token manquant' });
    }

    const stored = refreshTokenStore.get(refreshToken);
    if (!stored || stored.expiresAt < Date.now()) {
        refreshTokenStore.delete(refreshToken);
        return res.status(403).json({ error: 'Refresh token invalide ou expiré' });
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET, {
            algorithms: ['HS256'],
            issuer: 'monapp.com',
            audience: 'monapp-refresh'
        });

        // Rotation : invalider l’ancien refresh, en émettre un nouveau (option recommandée)
        refreshTokenStore.delete(refreshToken);
        const user = { id: decoded.userId, role: decoded.role /* charger depuis DB */ };
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: 900
        });
    } catch {
        return res.status(403).json({ error: 'Refresh token invalide' });
    }
});

// Logout : révoquer le refresh token
app.post('/auth/logout', (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) refreshTokenStore.delete(refreshToken);
    res.json({ message: 'Déconnexion réussie' });
});
```

**Bonnes pratiques :**

- Secrets **différents** pour access et refresh (`JWT_SECRET` ≠ `REFRESH_SECRET`)
- Access token **court** ; refresh token stocké côté client avec prudence (souvent httpOnly cookie sur le domaine d’auth, pas dans `localStorage` si possible)
- **Rotation** du refresh token à chaque renouvellement (un token réutilisé = signal de vol)
- Persister les refresh tokens côté serveur (DB/Redis) pour pouvoir les révoquer

### Où stocker le JWT côté client ? Cookie vs `localStorage` {#jwt-storage}

Une fois le token émis, le client doit le **conserver** pour les prochaines requêtes. Deux approches dominent — et une idée reçue fréquente mérite d’être corrigée.

#### `localStorage` / `sessionStorage`

```javascript
localStorage.setItem('accessToken', token);
// plus tard :
fetch('/api/profile', {
  headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
});
```

- **Avantage** : simple pour une SPA ; pas envoyé automatiquement → peu exposé au CSRF classique.
- **Inconvénient majeur** : tout script de la page peut lire le token. En cas de **XSS**, l’attaquant fait `localStorage.getItem('accessToken')` et **exfiltre** le JWT vers son serveur. Il pourra ensuite l’utiliser depuis n’importe où jusqu’à expiration.

#### Cookie `HttpOnly` + `Secure` + `SameSite`

```javascript
res.cookie('accessToken', token, {
  httpOnly: true,   // inaccessible via document.cookie / JS
  secure: true,     // HTTPS uniquement
  sameSite: 'strict', // mitige le CSRF cross-site
  maxAge: 15 * 60 * 1000
});
```

Le navigateur **attache** le cookie aux requêtes vers votre origine. Le JS de la page **ne peut pas lire** la valeur.

- **Avantage** : un XSS ne peut en général **pas voler** le secret pour le rejouer hors du navigateur de la victime.
- **Contrepartie** : il faut gérer le CSRF (`SameSite`, éventuellement token CSRF) car le cookie part tout seul.

#### Le piège : « cookie HttpOnly = immunité XSS » — faux

Même avec un cookie `HttpOnly`, si un attaquant injecte du JS **sur votre origine**, il peut quand même **agir au nom de la victime** :

```javascript
// Code malveillant injecté via XSS sur VOTRE site
fetch('/api/transfer', {
  method: 'POST',
  credentials: 'include', // le navigateur envoie le cookie HttpOnly
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: 'attaquant', amount: 1000 })
});
```

| | `localStorage` | Cookie `HttpOnly` |
|--|----------------|-------------------|
| XSS peut **lire** le token | Oui → exfiltration | Non |
| XSS peut **utiliser** la session (fetch same-origin) | Oui (`Authorization: Bearer …`) | Oui (cookie envoyé auto) |
| Réutilisation hors navigateur victime | Facile si volé | Difficile |
| Risque CSRF | Faible (header manuel) | À mitiger (`SameSite`, etc.) |

**En résumé :**

1. Cookie `HttpOnly` = **mieux contre le vol du token**, pas contre l’**abus de session via XSS**.
2. XSS reste critique dans les deux cas → priorité absolue : **empêcher le XSS** (CSP, sanitization, pas d’HTML non fiable…).
3. Compromis fréquent en production : **access token court** (parfois seulement en mémoire JS) + **refresh token** en cookie `HttpOnly` / `Secure` / `SameSite`, avec rotation.

`SameSite` protège surtout contre le CSRF **depuis un autre site** ; il ne bloque pas un `fetch` lancé par un XSS **sur votre propre domaine**.

### Révocation de tokens et blacklist {#jwt-blacklist}

```javascript
import redis from 'redis';
const client = redis.createClient();

// Blacklist des tokens révoqués
class TokenBlacklist {
    static async addToken(jti, exp) {
        const ttl = exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
            await client.setex(`blacklist:${jti}`, ttl, 'revoked');
        }
    }
    
    static async isTokenBlacklisted(jti) {
        const result = await client.get(`blacklist:${jti}`);
        return result === 'revoked';
    }
}

// Middleware de vérification de blacklist
const checkTokenBlacklist = async (req, res, next) => {
    try {
        if (req.user && req.user.jti) {
            const isBlacklisted = await TokenBlacklist.isTokenBlacklisted(req.user.jti);
            if (isBlacklisted) {
                return res.status(401).json({ error: 'Token révoqué' });
            }
        }
        next();
    } catch (error) {
        console.error('Erreur lors de la vérification de la blacklist:', error);
        next();
    }
};

// Endpoint de déconnexion avec révocation
app.post('/logout', verifyToken, checkTokenBlacklist, async (req, res) => {
    try {
        // Ajouter le token à la blacklist
        await TokenBlacklist.addToken(req.user.jti, req.user.exp);
        
        logSecurityEvent('LOGOUT', {
            userId: req.user.sub,
            tokenId: req.user.jti,
            ip: req.ip
        });
        
        res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        res.status(500).json({ error: 'Erreur lors de la déconnexion' });
    }
});
```

---

← [Vulnérabilités](./vulnerabilites) · [Communications →](./communications)
