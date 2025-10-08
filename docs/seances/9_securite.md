# Sécurité des Applications Web


## 1. Introduction à la sécurité web {#introduction}

La sécurité des applications web est devenue l'un des enjeux les plus critiques du développement moderne. Dans un monde où les cyberattaques se multiplient et se sophistiquent, comprendre et implémenter des mesures de sécurité robustes n'est plus une option, mais une nécessité absolue pour tout développeur web.

### Pourquoi la sécurité web est-elle cruciale ?

Les applications web modernes gèrent des quantités massives de données sensibles : informations personnelles des utilisateurs, données financières, secrets commerciaux, et bien plus encore. Une seule faille de sécurité peut avoir des conséquences désastreuses :

- **Impact financier** : Les violations de données coûtent en moyenne 4,45 millions de dollars selon IBM Security
- **Réputation** : La confiance des utilisateurs, une fois perdue, est extrêmement difficile à reconquérir
- **Conformité légale** : Le RGPD et d'autres réglementations imposent des sanctions sévères en cas de négligence
- **Continuité des activités** : Une attaque réussie peut paralyser complètement une organisation

### L'évolution du paysage des menaces

Le paysage des cybermenaces évolue constamment. Les attaquants utilisent désormais l'intelligence artificielle, automatisent leurs attaques, et exploitent la complexité croissante des architectures web modernes. Les applications web d'aujourd'hui intègrent de multiples services tiers, utilisent des frameworks JavaScript complexes, et déploient dans des environnements cloud distribués, créant ainsi de nouvelles surfaces d'attaque.

### Objectifs d'apprentissage

À l'issue de ce chapitre, vous serez capables de :

1. **Identifier** les principales vulnérabilités affectant les applications web modernes
2. **Comprendre** les mécanismes d'attaque et leurs impacts potentiels
3. **Implémenter** des mesures de protection efficaces dans vos développements
4. **Adopter** une approche proactive de la sécurité dès la phase de conception
5. **Utiliser** les outils et techniques d'audit de sécurité appropriés

### Concepts fondamentaux de la sécurité informatique

La sécurité informatique repose sur plusieurs piliers fondamentaux, souvent résumés par l'acronyme CIA (Confidentiality, Integrity, Availability) :

#### Confidentialité
La confidentialité garantit que les informations sensibles ne sont accessibles qu'aux personnes autorisées. Dans le contexte web, cela implique :
- Le chiffrement des données en transit et au repos
- L'implémentation de mécanismes d'authentification robustes
- La gestion appropriée des permissions d'accès
- La protection contre l'exposition accidentelle d'informations

#### Intégrité
L'intégrité assure que les données n'ont pas été altérées de manière non autorisée. Cela comprend :
- La vérification de l'authenticité des données reçues
- La détection des modifications non autorisées
- L'implémentation de mécanismes de validation des données
- La protection contre les attaques de manipulation de données

#### Disponibilité
La disponibilité garantit que les services et les données restent accessibles aux utilisateurs légitimes quand ils en ont besoin. Cela nécessite :
- La protection contre les attaques par déni de service (DDoS)
- L'implémentation de mécanismes de redondance
- La planification de la continuité des activités
- La surveillance proactive des performances et de la santé du système

#### Authentification et Autorisation

Ces deux concepts, souvent confondus, sont distincts mais complémentaires :

**L'authentification** répond à la question "Qui êtes-vous ?" Elle consiste à vérifier l'identité d'un utilisateur ou d'un système. Les méthodes d'authentification incluent :
- Quelque chose que vous savez (mot de passe, PIN)
- Quelque chose que vous avez (token, carte à puce)
- Quelque chose que vous êtes (biom��trie)
- Quelque part où vous êtes (géolocalisation)

**L'autorisation** répond à la question "Que pouvez-vous faire ?" Elle détermine les actions qu'un utilisateur authentifié est autorisé à effectuer. Elle comprend :
- La définition de rôles et de permissions
- L'implémentation de contrôles d'accès granulaires
- La gestion des privilèges selon le principe du moindre privilège

### La sécurité par conception (Security by Design)

La sécurité par conception est une approche proactive qui intègre les considérations de sécurité dès les premières phases du développement, plutôt que de les ajouter après coup. Cette philosophie repose sur plusieurs principes fondamentaux :

1. **Sécurité proactive plutôt que réactive** : Anticiper les menaces plutôt que de réagir aux incidents
2. **Sécurité par défaut** : Les configurations par défaut doivent être les plus sécurisées possible
3. **Défense en profondeur** : Implémenter plusieurs couches de sécurité redondantes
4. **Principe du moindre privilège** : Accorder uniquement les permissions minimales nécessaires
5. **Validation complète** : Vérifier et valider toutes les entrées utilisateur

## 2. Les principales vulnérabilités {#vulnerabilites}

### L'OWASP et son importance dans la sécurité web

L'Open Web Application Security Project (OWASP) est une fondation à but non lucratif qui travaille à améliorer la sécurité des logiciels. Depuis 2003, l'OWASP publie régulièrement son "Top 10" des vulnérabilités les plus critiques affectant les applications web. Cette liste, mise à jour tous les 3-4 ans, est devenue la référence mondiale pour les professionnels de la sécurité.

La dernière version (2021) reflète l'évolution du paysage des menaces et l'émergence de nouvelles vulnérabilités liées aux architectures modernes. Comprendre ces vulnérabilités est essentiel pour tout développeur web souhaitant créer des applications sécurisées.

### OWASP Top 10 (2021) - Analyse détaillée

#### 1. Broken Access Control (Contrôle d'accès défaillant)

Le contrôle d'accès défaillant représente la vulnérabilité la plus critique selon l'OWASP 2021. Cette catégorie englobe tous les défauts permettant aux utilisateurs d'agir en dehors de leurs permissions prévues.

**Manifestations courantes :**
- Élévation de privilèges : Un utilisateur normal accède aux fonctions administrateur
- Accès horizontal : Un utilisateur accède aux données d'un autre utilisateur du même niveau
- Contournement des contrôles côté client
- Manipulation d'URL pour accéder à des pages non autorisées
- Exposition d'identifiants internes dans les URL

**Exemple concret :**
```javascript
// ❌ Vulnérable : URL manipulation
app.get('/user/:id/profile', (req, res) => {
    const userId = req.params.id;
    // Aucune vérification que l'utilisateur connecté peut accéder à ce profil
    const profile = getUserProfile(userId);
    res.json(profile);
});

// ✅ Sécurisé : Vérification des autorisations
app.get('/user/:id/profile', authenticateUser, (req, res) => {
    const requestedUserId = req.params.id;
    const currentUserId = req.user.id;
    
    // Vérifier que l'utilisateur peut accéder à ce profil
    if (requestedUserId !== currentUserId && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Accès refusé' });
    }
    
    const profile = getUserProfile(requestedUserId);
    res.json(profile);
});
```

#### 2. Cryptographic Failures (Échecs cryptographiques)

Cette catégorie couvre tous les échecs liés à la cryptographie, incluant l'absence de chiffrement, l'utilisation d'algorithmes faibles, ou la mauvaise gestion des clés cryptographiques.

**Problèmes fréquents :**
- Transmission de données sensibles en clair
- Utilisation d'algorithmes de hachage obsolètes (MD5, SHA1)
- Stockage de mots de passe en clair ou faiblement hachés
- Clés cryptographiques codées en dur dans le code source
- Certificats SSL/TLS mal configurés

**Exemple de protection :**
```javascript
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// ❌ Hachage faible
const weakHash = crypto.createHash('md5').update(password).digest('hex');

// ✅ Hachage fort avec bcrypt
const strongHash = await bcrypt.hash(password, 12);

// ✅ Chiffrement AES pour données sensibles
const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32); // Clé générée aléatoirement, stockée de manière sécurisée
const iv = crypto.randomBytes(16);

function encrypt(text) {
    const cipher = crypto.createCipher(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return { encrypted, authTag: authTag.toString('hex'), iv: iv.toString('hex') };
}
```

#### 3. Injection

Les attaques par injection se produisent quand des données non fiables sont envoyées à un interpréteur dans le cadre d'une commande ou d'une requête. Les données hostiles peuvent amener l'interpréteur à exécuter des commandes non prévues ou à accéder à des données sans autorisation appropriée.

**Types d'injection courants :**

##### Injection SQL
L'injection SQL reste l'une des vulnérabilités les plus dangereuses et les plus répandues :

```javascript
// ❌ Vulnérable à l'injection SQL
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    // Un attaquant peut injecter : admin' OR '1'='1' --
    // Résultat : SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = ''
    db.query(query, (err, results) => {
        if (results.length > 0) {
            res.json({ success: true });
        }
    });
});

// ✅ Protection avec requêtes préparées
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    
    db.execute(query, [username, password], (err, results) => {
        if (results.length > 0) {
            res.json({ success: true });
        }
    });
});
```

##### Injection NoSQL
Même les bases de données NoSQL ne sont pas à l'abri :

```javascript
// ❌ Vulnérable à l'injection NoSQL
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Un attaquant peut envoyer : { "username": {"$ne": null}, "password": {"$ne": null} }
    db.collection('users').findOne({ username, password }, (err, user) => {
        if (user) {
            res.json({ success: true });
        }
    });
});

// ✅ Protection avec validation stricte
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Validation que les paramètres sont des chaînes
    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Paramètres invalides' });
    }
    
    db.collection('users').findOne({ 
        username: username,
        password: hashPassword(password)
    }, (err, user) => {
        if (user) {
            res.json({ success: true });
        }
    });
});
```

##### Injection de commandes système
```javascript
// ❌ Vulnérable à l'injection de commandes
app.post('/convert', (req, res) => {
    const { filename } = req.body;
    const command = `convert ${filename} output.jpg`;
    
    // Un attaquant peut injecter : image.png; rm -rf /
    exec(command, (error, stdout, stderr) => {
        res.json({ result: stdout });
    });
});

// ✅ Protection avec validation et échappement
app.post('/convert', (req, res) => {
    const { filename } = req.body;
    
    // Validation du nom de fichier
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
        return res.status(400).json({ error: 'Nom de fichier invalide' });
    }
    
    // Utilisation de execFile avec tableau d'arguments
    execFile('convert', [filename, 'output.jpg'], (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: 'Erreur de conversion' });
        }
        res.json({ result: stdout });
    });
});
```

#### 4. Cross-Site Scripting (XSS)

Le Cross-Site Scripting permet à un attaquant d'injecter du code JavaScript malveillant dans des pages web vues par d'autres utilisateurs. Il existe trois types principaux de XSS :

##### XSS Réfléchi (Reflected XSS)
Le code malveillant est inclus dans la requête et renvoyé immédiatement dans la réponse :

```javascript
// ❌ Vulnérable au XSS réfléchi
app.get('/search', (req, res) => {
    const query = req.query.q;
    const html = `<h1>Résultats pour : ${query}</h1>`;
    // Si query = <script>alert('XSS')</script>, le script s'exécutera
    res.send(html);
});

// ✅ Protection par échappement HTML
import escapeHtml from 'escape-html';

app.get('/search', (req, res) => {
    const query = req.query.q;
    const safeQuery = escapeHtml(query);
    const html = `<h1>Résultats pour : ${safeQuery}</h1>`;
    res.send(html);
});
```

##### XSS Stocké (Stored XSS)
Le code malveillant est stocké côté serveur et exécuté chaque fois que la page est chargée :

```javascript
// ❌ Vulnérable au XSS stocké
app.post('/comment', (req, res) => {
    const { comment } = req.body;
    
    // Stockage direct sans sanitisation
    saveComment(comment);
    res.redirect('/comments');
});

app.get('/comments', (req, res) => {
    const comments = getComments();
    let html = '<div>';
    
    comments.forEach(comment => {
        html += `<p>${comment.text}</p>`;
    });
    
    html += '</div>';
    res.send(html);
});

// ✅ Protection avec sanitisation
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

app.post('/comment', (req, res) => {
    const { comment } = req.body;
    
    // Sanitisation du contenu HTML
    const cleanComment = purify.sanitize(comment, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
        ALLOWED_ATTR: []
    });
    
    saveComment(cleanComment);
    res.redirect('/comments');
});
```

##### XSS basé sur le DOM
Le code malveillant modifie le DOM côté client :

```javascript
// ❌ Code côté client vulnérable
function displayUserName() {
    const userName = new URLSearchParams(window.location.search).get('name');
    document.getElementById('welcome').innerHTML = `Bienvenue ${userName}`;
    // URL: index.html?name=<img src=x onerror=alert('XSS')>
}

// ✅ Protection côté client
function displayUserName() {
    const userName = new URLSearchParams(window.location.search).get('name');
    
    if (userName) {
        // Utilisation de textContent au lieu d'innerHTML
        document.getElementById('welcome').textContent = `Bienvenue ${userName}`;
        
        // Ou validation stricte
        if (/^[a-zA-Z\s]+$/.test(userName)) {
            document.getElementById('welcome').textContent = `Bienvenue ${userName}`;
        } else {
            document.getElementById('welcome').textContent = 'Bienvenue utilisateur';
        }
    }
}
```

#### 5. Cross-Site Request Forgery (CSRF)

Le CSRF force un utilisateur authentifié à exécuter des actions non désirées sur une application web dans laquelle il est actuellement authentifié :

```javascript
// ❌ Endpoint vulnérable au CSRF
app.post('/transfer', authenticateUser, (req, res) => {
    const { to, amount } = req.body;
    
    // Aucune protection CSRF
    transferMoney(req.user.id, to, amount);
    res.json({ success: true });
});

// ✅ Protection CSRF avec token
import csrf from 'csurf';
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

app.get('/transfer-form', (req, res) => {
    res.render('transfer', { csrfToken: req.csrfToken() });
});

app.post('/transfer', authenticateUser, (req, res) => {
    const { to, amount } = req.body;
    
    // Le middleware CSRF vérifie automatiquement le token
    transferMoney(req.user.id, to, amount);
    res.json({ success: true });
});

// Template HTML avec token CSRF
// <form method="POST" action="/transfer">
//   <input type="hidden" name="_csrf" value="{{ csrfToken }}">
//   <input type="text" name="to" placeholder="Destinataire">
//   <input type="number" name="amount" placeholder="Montant">
//   <button type="submit">Transférer</button>
// </form>
```

### Impact et conséquences des vulnérabilités

Chaque vulnérabilité peut avoir des conséquences dramatiques :

- **Vol de données** : Exposition d'informations personnelles, financières ou commerciales sensibles
- **Usurpation d'identité** : Prise de contrôle de comptes utilisateur
- **Défiguration de sites** : Modification du contenu visible par les visiteurs
- **Ransomware** : Chiffrement des données avec demande de rançon
- **Botnet** : Utilisation des serveurs compromis pour d'autres attaques
- **Réputation** : Perte de confiance des clients et partenaires
- **Légal** : Sanctions réglementaires et poursuites judiciaires

La compréhension approfondie de ces vulnérabilités est la première étape vers le développement d'applications web sécurisées. Dans les sections suivantes, nous explorerons les techniques et les outils pour se protéger efficacement contre ces menaces.

## 3. Authentication et autorisation {#auth}

L'authentification et l'autorisation constituent les piliers fondamentaux de la sécurité des applications web. Ces mécanismes déterminent qui peut accéder à votre application et quelles actions ils sont autorisés à effectuer. Une implémentation défaillante de ces systèmes peut compromettre entièrement la sécurité de votre application.

### Comprendre la différence entre authentification et autorisation

Il est crucial de bien distinguer ces deux concepts souvent confondus :

**L'authentification** (AuthN) est le processus de vérification de l'identité d'un utilisateur. Elle répond à la question "Qui prétendez-vous être ?". C'est comme présenter votre carte d'identité à l'entrée d'un bâtiment.

**L'autorisation** (AuthZ) est le processus de détermination des permissions accordées à un utilisateur authentifié. Elle répond à la question "Que pouvez-vous faire ?". C'est comme vérifier si votre badge d'accès vous permet d'entrer dans certaines zones du bâtiment.

### Les mécanismes d'authentification modernes

#### Authentification par mots de passe : Les fondamentaux sécurisés

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

#### JSON Web Tokens (JWT) : Authentification stateless

Les JWT offrent une alternative moderne aux sessions traditionnelles, particulièrement adaptée aux architectures distribuées et aux API RESTful. Un JWT est un token auto-contenu qui encode les informations d'authentification de manière sécurisée.

```javascript
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Configuration sécurisée pour JWT
const JWT_CONFIG = {
    secret: process.env.JWT_SECRET, // Doit être une chaîne longue et aléatoire
    algorithm: 'HS256',
    expiresIn: '1h',
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
        jti: crypto.randomUUID() // JWT ID unique pour éviter la réutilisation
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

#### Authentification multi-facteurs (2FA) : Renforcer la sécurité

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

### Systèmes d'autorisation avancés

#### Contrôle d'accès basé sur les rôles (RBAC)

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

#### Contrôle d'accès basé sur les attributs (ABAC)

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

### Gestion avancée des sessions et tokens

#### Révocation de tokens et blacklist

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

## 4. Sécurisation des communications {#communications}

La sécurisation des communications constitue un aspect fondamental de la sécurité web moderne. Dans un monde où les données transitent constamment sur des réseaux potentiellement compromis, protéger l'intégrité et la confidentialité des échanges entre clients et serveurs est crucial. Cette section explore les techniques et protocoles essentiels pour sécuriser efficacement les communications web.

### L'importance du chiffrement en transit

Les données qui transitent sur Internet passent par de nombreux intermédiaires : routeurs, proxies, fournisseurs d'accès, points d'accès WiFi publics, etc. Chacun de ces points représente une opportunité potentielle pour un attaquant d'intercepter, modifier ou analyser le trafic. Sans protection appropriée, des informations sensibles comme les mots de passe, données personnelles, ou informations financières peuvent être compromises.

Le chiffrement en transit garantit que même si un attaquant intercepte les communications, il ne pourra pas comprendre leur contenu sans posséder les clés de déchiffrement appropriées.

### HTTPS et TLS : Les fondamentaux sécurisés

#### Comprendre TLS/SSL

Transport Layer Security (TLS), successeur de Secure Sockets Layer (SSL), est le protocole standard pour sécuriser les communications web. TLS fournit trois garanties essentielles :

1. **Confidentialité** : Les données sont chiffrées pour empêcher l'écoute
2. **Intégrité** : Protection contre la modification des données en transit
3. **Authentification** : Vérification de l'identité du serveur (et optionnellement du client)

#### Configuration HTTPS robuste

```javascript
import https from 'https';
import fs from 'fs';
import express from 'express';

const app = express();

// Configuration TLS sécurisée
const tlsOptions = {
    // Certificat et clé privée
    key: fs.readFileSync('path/to/private-key.pem'),
    cert: fs.readFileSync('path/to/certificate.pem'),
    
    // Chaîne de certificats (si nécessaire)
    ca: fs.readFileSync('path/to/ca-certificate.pem'),
    
    // Configuration de sécurité renforcée
    secureProtocol: 'TLSv1_2_method', // Force TLS 1.2+
    ciphers: [
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES128-SHA256',
        'ECDHE-RSA-AES256-SHA384'
    ].join(':'),
    
    // Préférer les suites de chiffrement du serveur
    honorCipherOrder: true,
    
    // Désactiver la compression pour éviter CRIME/BREACH
    secureOptions: import('constants').then(constants => constants.SSL_OP_NO_COMPRESSION)
};

// Création du serveur HTTPS
const httpsServer = https.createServer(tlsOptions, app);

httpsServer.listen(443, () => {
    console.log('Serveur HTTPS sécurisé démarré sur le port 443');
});

// Redirection automatique HTTP vers HTTPS
const httpApp = express();
httpApp.use((req, res) => {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
});

httpApp.listen(80, () => {
    console.log('Serveur de redirection HTTP démarré sur le port 80');
});
```

#### Génération et gestion des certificats

Pour un environnement de développement, vous pouvez générer des certificats auto-signés :

```bash
# Génération d'une clé privée
openssl genrsa -out private-key.pem 2048

# Génération d'un certificat auto-signé
openssl req -new -x509 -key private-key.pem -out certificate.pem -days 365
```

Pour la production, utilisez des certificats émis par une autorité de certification reconnue comme Let's Encrypt :

```bash
# Installation de Certbot
sudo apt-get install certbot

# Obtention d'un certificat Let's Encrypt
sudo certbot certonly --standalone -d votre-domaine.com
```

### Headers de sécurité : Renforcer la protection

Les headers de sécurité HTTP fournissent des instructions aux navigateurs sur la façon de traiter le contenu de votre site de manière sécurisée. Ils constituent une couche de défense supplémentaire contre diverses attaques.

#### Configuration complète avec Helmet

```javascript
import helmet from 'helmet';

// Configuration exhaustive des headers de sécurité
app.use(helmet({
    // Content Security Policy - Protection contre XSS
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
                "'self'",
                "'unsafe-inline'", // Uniquement si nécessaire
                "https://fonts.googleapis.com"
            ],
            scriptSrc: [
                "'self'",
                "https://cdnjs.cloudflare.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https:"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com"
            ],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            workerSrc: ["'self'"],
            childSrc: ["'self'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            upgradeInsecureRequests: []
        },
        reportOnly: false, // Passer à true pour le mode test
        reportUri: '/csp-report' // Endpoint pour recevoir les rapports CSP
    },
    
    // HTTP Strict Transport Security
    hsts: {
        maxAge: 31536000, // 1 an
        includeSubDomains: true,
        preload: true
    },
    
    // Protection contre le clickjacking
    frameguard: {
        action: 'deny'
    },
    
    // Empêche le MIME type sniffing
    noSniff: true,
    
    // Désactive la mise en cache DNS prefetching
    dnsPrefetchControl: {
        allow: false
    },
    
    // Empêche l'ouverture dans IE
    ieNoOpen: true,
    
    // Configuration des permissions
    permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: ["'self'"],
        notifications: ["'self'"]
    }
}));

// Headers personnalisés supplémentaires
app.use((req, res, next) => {
    // Contrôle des informations envoyées dans le header Referer
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Empêche l'inclusion dans des frames (redondant avec frameguard mais explicite)
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Protection contre le MIME type confusion
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Désactive la détection automatique du type de contenu
    res.setHeader('X-Download-Options', 'noopen');
    
    // Contrôle des fonctionnalités du navigateur
    res.setHeader('Feature-Policy', 
        "camera 'none'; microphone 'none'; geolocation 'self'; notifications 'self'"
    );
    
    next();
});

// Endpoint pour recevoir les rapports CSP
app.post('/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
    console.log('Violation CSP détectée:', req.body);
    
    // Analyser et traiter la violation
    if (req.body['csp-report']) {
        const report = req.body['csp-report'];
        
        // Log structuré de la violation
        console.log({
            timestamp: new Date().toISOString(),
            violatedDirective: report['violated-directive'],
            blockedUri: report['blocked-uri'],
            documentUri: report['document-uri'],
            originalPolicy: report['original-policy'],
            userAgent: req.headers['user-agent'],
            ip: req.ip
        });
        
        // Optionnel : alerter l'équipe de sécurité
        if (report['blocked-uri'] && !report['blocked-uri'].startsWith('data:')) {
            alertSecurityTeam('CSP_VIOLATION', report);
        }
    }
    
    res.status(204).end();
});
```

#### Analyse détaillée des headers critiques

**Content Security Policy (CSP)** est l'un des headers les plus puissants pour prévenir les attaques XSS. Il définit une liste blanche des sources autorisées pour différents types de ressources :

```javascript
// CSP progressif - commencer strict puis assouplir si nécessaire
const cspPolicies = {
    // Politique stricte pour les nouvelles applications
    strict: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'none'"],
        childSrc: ["'none'"],
        workerSrc: ["'self'"],
        manifestSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: []
    },
    
    // Politique pour applications avec du contenu tiers
    moderate: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://code.jquery.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://api.monservice.com"],
        frameSrc: ["https://www.youtube.com", "https://player.vimeo.com"],
        upgradeInsecureRequests: []
    }
};

// Sélection dynamique de la politique CSP
const getCurrentCSPPolicy = (req) => {
    // Logique pour déterminer quelle politique appliquer
    const isInternalUser = req.headers['x-internal-user'] === 'true';
    return isInternalUser ? cspPolicies.moderate : cspPolicies.strict;
};
```

**HTTP Strict Transport Security (HSTS)** force les navigateurs à utiliser HTTPS pour tous les futurs accès au domaine :

```javascript
// Configuration HSTS avancée
app.use((req, res, next) => {
    // HSTS uniquement sur HTTPS
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        res.setHeader('Strict-Transport-Security', 
            'max-age=31536000; includeSubDomains; preload'
        );
    }
    next();
});

// Fonction pour soumettre le domaine à la liste de préchargement HSTS
const submitHSTSPreload = async (domain) => {
    console.log(`Pour soumettre ${domain} à la liste HSTS preload:`);
    console.log('1. Visitez https://hstspreload.org/');
    console.log('2. Entrez votre domaine');
    console.log('3. Vérifiez que tous les prérequis sont respectés');
    console.log('4. Soumettez votre domaine');
};
```

### CORS : Contrôle d'accès cross-origin sécurisé

Cross-Origin Resource Sharing (CORS) est un mécanisme qui permet à des ressources web d'être demandées depuis un autre domaine que celui qui sert la ressource. Une configuration CORS inappropriée peut exposer votre API à des attaques.

#### Configuration CORS granulaire

```javascript
import cors from 'cors';

// Configuration CORS dynamique et sécurisée
const corsOptions = {
    origin: (origin, callback) => {
        // Liste des domaines autorisés
        const allowedOrigins = [
            'https://monapp.com',
            'https://www.monapp.com',
            'https://admin.monapp.com',
            'https://api.monapp.com'
        ];
        
        // Autoriser les requêtes sans origin (applications mobiles, Postman, etc.)
        if (!origin) {
            return callback(null, true);
        }
        
        // Vérifier si l'origin est autorisé
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Log des tentatives d'accès non autorisées
            console.log(`Tentative d'accès CORS refusée depuis: ${origin}`);
            callback(new Error('Accès CORS non autorisé'));
        }
    },
    
    // Headers autorisés dans les requêtes
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-API-Key'
    ],
    
    // Méthodes HTTP autorisées
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    
    // Autoriser l'envoi de cookies et credentials
    credentials: true,
    
    // Durée de mise en cache des informations de préflight
    maxAge: 86400, // 24 heures
    
    // Headers exposés au client
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    
    // Réponse réussie pour les requêtes OPTIONS (préflight)
    optionsSuccessStatus: 200
};

// Application de CORS avec gestion d'erreur
app.use(cors(corsOptions));

// Gestion spécifique des erreurs CORS
app.use((error, req, res, next) => {
    if (error.message === 'Accès CORS non autorisé') {
        logSecurityEvent('CORS_VIOLATION', {
            origin: req.headers.origin,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            method: req.method,
            url: req.url
        });
        
        return res.status(403).json({
            error: 'Accès non autorisé',
            code: 'CORS_DENIED'
        });
    }
    next(error);
});

// Configuration CORS différenciée par environnement
const getCorsConfig = () => {
    if (process.env.NODE_ENV === 'development') {
        return {
            origin: true, // Autorise tous les origins en développement
            credentials: true
        };
    } else if (process.env.NODE_ENV === 'staging') {
        return {
            origin: /\.staging\.monapp\.com$/,
            credentials: true
        };
    } else {
        return corsOptions; // Configuration stricte en production
    }
};

app.use(cors(getCorsConfig()));
```

#### Préflight et requêtes complexes

Les navigateurs effectuent des requêtes préflight (OPTIONS) avant certaines requêtes CORS. Il est important de les gérer correctement :

```javascript
// Gestion explicite des requêtes préflight
app.options('*', (req, res) => {
    const origin = req.headers.origin;
    const method = req.headers['access-control-request-method'];
    const headers = req.headers['access-control-request-headers'];
    
    // Log des requêtes préflight
    console.log(`Requête préflight depuis ${origin} pour ${method}`);
    
    // Validation de la requête préflight
    if (validatePreflightRequest(origin, method, headers)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', method);
        res.setHeader('Access-Control-Allow-Headers', headers);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '86400');
        res.status(200).end();
    } else {
        res.status(403).json({ error: 'Requête préflight non autorisée' });
    }
});

function validatePreflightRequest(origin, method, headers) {
    const allowedOrigins = ['https://monapp.com', 'https://www.monapp.com'];
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    const allowedHeaders = ['content-type', 'authorization', 'x-api-key'];
    
    return allowedOrigins.includes(origin) &&
           allowedMethods.includes(method) &&
           (!headers || headers.split(',').every(h => 
               allowedHeaders.includes(h.trim().toLowerCase())
           ));
}
```

### Surveillance et monitoring des communications

#### Détection d'anomalies de trafic

```javascript
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// Limitation adaptative du taux de requêtes
const createAdaptiveRateLimit = (windowMs, maxRequests) => {
    return rateLimit({
        windowMs: windowMs,
        max: (req) => {
            // Plus de requêtes autorisées pour les utilisateurs authentifiés
            if (req.user && req.user.role === 'premium') {
                return maxRequests * 2;
            } else if (req.user) {
                return Math.floor(maxRequests * 1.5);
            }
            return maxRequests;
        },
        
        // Message d'erreur informatif
        message: {
            error: 'Limite de requêtes dépassée',
            retryAfter: Math.ceil(windowMs / 1000),
            maxRequests: maxRequests
        },
        
        // Headers informatifs
        standardHeaders: true,
        legacyHeaders: false,
        
        // Fonction de clé personnalisée
        keyGenerator: (req) => {
            // Utiliser l'ID utilisateur si authentifié, sinon l'IP
            return req.user ? `user:${req.user.id}` : `ip:${req.ip}`;
        },
        
        // Callback en cas de limite dépassée
        onLimitReached: (req, res, options) => {
            logSecurityEvent('RATE_LIMIT_EXCEEDED', {
                ip: req.ip,
                userId: req.user?.id,
                endpoint: req.path,
                method: req.method,
                userAgent: req.headers['user-agent']
            });
        }
    });
};

// Ralentissement progressif
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // Ralentir après 50 requêtes
    delayMs: 500, // Délai de 500ms par requête supplémentaire
    maxDelayMs: 20000, // Délai maximum de 20 secondes
    
    keyGenerator: (req) => {
        return req.user ? `user:${req.user.id}` : `ip:${req.ip}`;
    },
    
    onLimitReached: (req, res, options) => {
        console.log(`Ralentissement appliqué pour ${req.ip}`);
    }
});

// Application des limiteurs
app.use('/api/', speedLimiter);
app.use('/api/', createAdaptiveRateLimit(15 * 60 * 1000, 100));
```

#### Logging et alertes de sécurité

```javascript
import winston from 'winston';

// Configuration du logger de sécurité
const securityLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'security' },
    transports: [
        new winston.transports.File({ 
            filename: 'logs/security-error.log', 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: 'logs/security-combined.log' 
        }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Middleware de logging des requêtes suspectes
app.use((req, res, next) => {
    const suspiciousPatterns = [
        /\.\./,  // Path traversal
        /<script/i,  // XSS attempts
        /union.*select/i,  // SQL injection
        /exec\(/i,  // Command injection
        /eval\(/i   // Code injection
    ];
    
    const requestData = JSON.stringify({
        url: req.url,
        body: req.body,
        query: req.query,
        headers: req.headers
    });
    
    // Vérifier les patterns suspects
    const isSuspicious = suspiciousPatterns.some(pattern => 
        pattern.test(requestData)
    );
    
    if (isSuspicious) {
        securityLogger.warn('Requête suspecte détectée', {
            ip: req.ip,
            method: req.method,
            url: req.url,
            userAgent: req.headers['user-agent'],
            body: req.body,
            query: req.query,
            timestamp: new Date().toISOString()
        });
        
        // Optionnel : bloquer immédiatement
        // return res.status(403).json({ error: 'Requête suspecte bloquée' });
    }
    
    next();
});

// Fonction globale de logging des événements de sécurité
const logSecurityEvent = (eventType, details) => {
    securityLogger.warn(`Événement de sécurité: ${eventType}`, {
        eventType,
        details,
        timestamp: new Date().toISOString()
    });
    
    // Alertes en temps réel pour les événements critiques
    const criticalEvents = ['BRUTE_FORCE_ATTACK', 'SQL_INJECTION_ATTEMPT', 'XSS_ATTEMPT'];
    if (criticalEvents.includes(eventType)) {
        alertSecurityTeam(eventType, details);
    }
};

// Système d'alertes (exemple avec email)
const alertSecurityTeam = async (eventType, details) => {
    import nodemailer from 'nodemailer';
    
    const transporter = nodemailer.createTransporter({
        // Configuration SMTP
    });
    
    const mailOptions = {
        from: 'security@monapp.com',
        to: 'security-team@monapp.com',
        subject: `ALERTE SÉCURITÉ: ${eventType}`,
        html: `
            <h2>Alerte de Sécurité</h2>
            <p><strong>Type d'événement:</strong> ${eventType}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>Détails:</strong></p>
            <pre>${JSON.stringify(details, null, 2)}</pre>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Alerte envoyée pour l'événement: ${eventType}`);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'alerte:', error);
    }
};
```

La sécurisation des communications est un processus continu qui nécessite une surveillance constante et des mises à jour régulières. Les techniques présentées dans cette section fournissent une base solide, mais elles doivent être adaptées aux spécificités de chaque application et maintenues à jour face aux nouvelles menaces.

## 5. Validation et sanitisation des données {#validation}

La validation et la sanitisation des données constituent la première ligne de défense contre la plupart des attaques web. Dans un environnement où les utilisateurs peuvent soumettre des données arbitraires, il est essentiel de vérifier, nettoyer et sécuriser toutes les entrées avant de les traiter. Cette section explore les techniques avancées pour implémenter une validation robuste et une sanitisation efficace.

### Comprendre la différence entre validation et sanitisation

**La validation** consiste à vérifier que les données respectent les critères attendus (format, type, longueur, etc.). Si les données ne sont pas valides, elles sont rejetées.

**La sanitisation** consiste à nettoyer les données en supprimant ou en échappant les caractères potentiellement dangereux, tout en conservant les données dans un format utilisable.

Ces deux processus sont complémentaires et doivent être appliqués systématiquement sur toutes les entrées utilisateur.

### Principes fondamentaux de la validation

#### Validation côté serveur : Impératif de sécurité

La validation côté serveur est absolument critique car elle ne peut pas être contournée par un attaquant. Contrairement à la validation côté client, qui peut être désactivée ou modifiée, la validation serveur constitue votre dernier rempart contre les données malveillantes.

```javascript
import Joi from 'joi';
import validator from 'validator';

// Schémas de validation complets avec Joi
const userRegistrationSchema = Joi.object({
    // Email avec validation avancée
    email: Joi.string()
        .email({ 
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net', 'org', 'edu', 'gov'] }
        })
        .required()
        .max(254) // RFC 5321 limit
        .lowercase()
        .trim(),
    
    // Mot de passe avec critères de sécurité stricts
    password: Joi.string()
        .min(12) // Minimum 12 caractères
        .max(128) // Maximum raisonnable
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
            'string.pattern.base': 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'
        }),
    
    // Nom avec validation des caractères
    firstName: Joi.string()
        .min(1)
        .max(50)
        .pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .required()
        .trim(),
    
    lastName: Joi.string()
        .min(1)
        .max(50)
        .pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .required()
        .trim(),
    
    // Âge avec limites raisonnables
    age: Joi.number()
        .integer()
        .min(13)
        .max(120)
        .optional(),
    
    // Numéro de téléphone avec validation internationale
    phoneNumber: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Format de numéro de téléphone invalide'
        }),
    
    // URL avec validation stricte
    website: Joi.string()
        .uri({
            scheme: ['http', 'https']
        })
        .optional()
});

// Schéma pour la mise à jour de profil
const userUpdateSchema = Joi.object({
    email: Joi.string()
        .email()
        .max(254)
        .lowercase()
        .trim()
        .optional(),
    
    firstName: Joi.string()
        .min(1)
        .max(50)
        .pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .trim()
        .optional(),
    
    lastName: Joi.string()
        .min(1)
        .max(50)
        .pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .trim()
        .optional(),
    
    bio: Joi.string()
        .max(500)
        .trim()
        .optional()
        .allow(''),
    
    // Validation de fichier uploadé
    avatar: Joi.object({
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/webp').required(),
        size: Joi.number().max(5 * 1024 * 1024).required(), // 5MB max
        originalname: Joi.string().pattern(/\.(jpg|jpeg|png|webp)$/i).required()
    }).optional()
});

// Middleware de validation flexible
const createValidationMiddleware = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false, // Collecter toutes les erreurs
            stripUnknown: true, // Supprimer les champs non définis dans le schéma
            convert: true // Convertir les types automatiquement
        });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }));
            
            // Log des tentatives de validation échouées
            console.warn('Échec de validation:', {
                endpoint: req.path,
                errors: errors,
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
            
            return res.status(400).json({
                error: 'Données invalides',
                details: errors
            });
        }
        
        // Remplacer les données originales par les données validées
        req[property] = value;
        next();
    };
};

// Utilisation des middlewares de validation
app.post('/register', 
    createValidationMiddleware(userRegistrationSchema),
    async (req, res) => {
        try {
            const { email, password, firstName, lastName, age, phoneNumber, website } = req.body;
            
            // Vérifications métier supplémentaires
            const existingUser = await findUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({ error: 'Cet email est déjà utilisé' });
            }
            
            // Validation de la force du mot de passe avec des critères avancés
            const passwordStrength = assessPasswordStrength(password);
            if (passwordStrength.score < 3) {
                return res.status(400).json({
                    error: 'Mot de passe trop faible',
                    suggestions: passwordStrength.feedback
                });
            }
            
            // Création de l'utilisateur
            const hashedPassword = await hashPassword(password);
            const user = await createUser({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                age,
                phoneNumber,
                website
            });
            
            res.status(201).json({
                message: 'Compte créé avec succès',
                userId: user.id
            });
        } catch (error) {
            console.error('Erreur lors de la création du compte:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }
);

// Fonction d'évaluation de la force du mot de passe
function assessPasswordStrength(password) {
    const checks = {
        length: password.length >= 12,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        symbols: /[@$!%*?&]/.test(password),
        noCommon: !isCommonPassword(password),
        noPersonal: !containsPersonalInfo(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    const feedback = [];
    
    if (!checks.length) feedback.push('Utilisez au moins 12 caractères');
    if (!checks.lowercase) feedback.push('Ajoutez des lettres minuscules');
    if (!checks.uppercase) feedback.push('Ajoutez des lettres majuscules');
    if (!checks.numbers) feedback.push('Ajoutez des chiffres');
    if (!checks.symbols) feedback.push('Ajoutez des caractères spéciaux');
    if (!checks.noCommon) feedback.push('Évitez les mots de passe courants');
    if (!checks.noPersonal) feedback.push('Évitez les informations personnelles');
    
    return { score, feedback };
}

function isCommonPassword(password) {
    const commonPasswords = [
        'password', '123456', 'password123', 'admin', 'qwerty',
        'letmein', 'welcome', 'monkey', '1234567890'
    ];
    return commonPasswords.includes(password.toLowerCase());
}

function containsPersonalInfo(password) {
    // Cette fonction devrait être étendue pour vérifier contre
    // les informations personnelles connues de l'utilisateur
    const personalTerms = ['birthday', 'name', 'email'];
    return personalTerms.some(term => 
        password.toLowerCase().includes(term)
    );
}
```

#### Validation des fichiers uploadés

Les uploads de fichiers représentent un vecteur d'attaque majeur. Une validation rigoureuse est essentielle :

```javascript
import multer from 'multer';
import fileType from 'file-type';
import path from 'path';
import crypto from 'crypto';

// Configuration sécurisée de multer
const createSecureUpload = (allowedTypes, maxSize = 5 * 1024 * 1024) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // Répertoire d'upload sécurisé en dehors du web root
            const uploadDir = path.join(__dirname, '../uploads');
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            // Nom de fichier sécurisé et unique
            const uniqueSuffix = crypto.randomUUID();
            const extension = path.extname(file.originalname).toLowerCase();
            const safeName = `${uniqueSuffix}${extension}`;
            cb(null, safeName);
        }
    });
    
    const fileFilter = (req, file, cb) => {
        // Validation du type MIME
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error(`Type de fichier non autorisé: ${file.mimetype}`));
        }
        
        // Validation de l'extension
        const extension = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt']
        };
        
        const validExtensions = allowedExtensions[file.mimetype] || [];
        if (!validExtensions.includes(extension)) {
            return cb(new Error(`Extension non autorisée: ${extension}`));
        }
        
        cb(null, true);
    };
    
    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSize,
            files: 1 // Un seul fichier à la fois
        }
    });
};

// Middleware de validation post-upload
const validateUploadedFile = async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    
    try {
        const filePath = req.file.path;
        
        // Vérification du contenu réel du fichier
        const fileBuffer = fs.readFileSync(filePath);
        const actualMimeType = fileType.fromBuffer(fileBuffer);
        
        if (!actualMimeType || actualMimeType.mime !== req.file.mimetype) {
            // Supprimer le fichier suspect
            fs.unlinkSync(filePath);
            return res.status(400).json({
                error: 'Le contenu du fichier ne correspond pas à son type déclaré'
            });
        }
        
        // Scan antivirus (exemple avec ClamAV)
        const isClean = await scanFileForVirus(filePath);
        if (!isClean) {
            fs.unlinkSync(filePath);
            return res.status(400).json({
                error: 'Fichier potentiellement dangereux détecté'
            });
        }
        
        next();
    } catch (error) {
        console.error('Erreur lors de la validation du fichier:', error);
        // Supprimer le fichier en cas d'erreur
        if (req.file?.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Erreur lors de la validation du fichier' });
    }
};

// Utilisation pour l'upload d'avatar
const avatarUpload = createSecureUpload(['image/jpeg', 'image/png', 'image/webp']);

app.post('/upload-avatar',
    verifyToken,
    avatarUpload.single('avatar'),
    validateUploadedFile,
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Aucun fichier fourni' });
            }
            
            // Traitement de l'image (redimensionnement, optimisation)
            const processedImagePath = await processAvatar(req.file.path);
            
            // Mise à jour de l'utilisateur
            await updateUserAvatar(req.user.sub, processedImagePath);
            
            res.json({
                message: 'Avatar mis à jour avec succès',
                avatarUrl: `/avatars/${path.basename(processedImagePath)}`
            });
        } catch (error) {
            console.error('Erreur lors de l\'upload d\'avatar:', error);
            res.status(500).json({ error: 'Erreur lors de l\'upload' });
        }
    }
);

async function scanFileForVirus(filePath) {
    // Implémentation d'un scan antivirus
    // Exemple avec ClamAV via node-clam
    try {
        import clam from 'clamscan';
        const clamscan = await new clam().init();
        const scanResult = await clamscan.isInfected(filePath);
        return !scanResult;
    } catch (error) {
        console.error('Erreur lors du scan antivirus:', error);
        return false; // En cas d'erreur, considérer comme suspect
    }
}
```

### Sanitisation avancée des données

#### Sanitisation HTML et protection XSS

```javascript
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import validator from 'validator';

// Configuration DOMPurify pour différents contextes
const createDOMPurifier = (strictness = 'moderate') => {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    
    const configs = {
        strict: {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
            ALLOWED_ATTR: [],
            KEEP_CONTENT: false,
            RETURN_DOM: false,
            RETURN_DOM_FRAGMENT: false,
            SANITIZE_DOM: true
        },
        moderate: {
            ALLOWED_TAGS: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'p', 'br', 'div', 'span',
                'b', 'i', 'em', 'strong', 'u',
                'ul', 'ol', 'li',
                'a', 'img',
                'blockquote', 'code', 'pre'
            ],
            ALLOWED_ATTR: [
                'href', 'title', 'alt', 'src', 'width', 'height',
                'class', 'id'
            ],
            ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
            KEEP_CONTENT: true
        },
        permissive: {
            ALLOWED_TAGS: [
                // Tags de structure
                'html', 'head', 'body', 'div', 'span', 'section', 'article',
                'header', 'footer', 'nav', 'main', 'aside',
                // Tags de contenu
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'p', 'br', 'hr',
                // Tags de formatage
                'b', 'i', 'em', 'strong', 'u', 's', 'small', 'sub', 'sup',
                // Listes
                'ul', 'ol', 'li', 'dl', 'dt', 'dd',
                // Liens et médias
                'a', 'img', 'figure', 'figcaption',
                // Tableaux
                'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
                // Citation et code
                'blockquote', 'cite', 'q', 'code', 'pre', 'kbd', 'samp', 'var'
            ],
            ALLOWED_ATTR: [
                'href', 'title', 'alt', 'src', 'width', 'height',
                'class', 'id', 'style', 'target', 'rel',
                'colspan', 'rowspan', 'scope',
                'datetime', 'cite'
            ],
            KEEP_CONTENT: true
        }
    };
    
    const config = configs[strictness] || configs.moderate;
    
    return {
        sanitize: (dirty) => {
            return purify.sanitize(dirty, config);
        },
        isValid: (html) => {
            const sanitized = purify.sanitize(html, config);
            return sanitized === html;
        }
    };
};

// Middleware de sanitisation automatique
const createSanitizationMiddleware = (fields, strictness = 'moderate') => {
    const purifier = createDOMPurifier(strictness);
    
    return (req, res, next) => {
        for (const field of fields) {
            if (req.body[field]) {
                // Sanitisation HTML
                req.body[field] = purifier.sanitize(req.body[field]);
                
                // Trim des espaces
                req.body[field] = req.body[field].trim();
                
                // Normalisation des espaces multiples
                req.body[field] = req.body[field].replace(/\s+/g, ' ');
            }
        }
        next();
    };
};

// Sanitisation pour différents types de contenu
const sanitizers = {
    // Sanitisation pour commentaires d'utilisateurs
    userComment: (content) => {
        const purifier = createDOMPurifier('strict');
        return purifier.sanitize(content);
    },
    
    // Sanitisation pour articles de blog
    blogContent: (content) => {
        const purifier = createDOMPurifier('moderate');
        return purifier.sanitize(content);
    },
    
    // Sanitisation pour contenu administrateur
    adminContent: (content) => {
        const purifier = createDOMPurifier('permissive');
        return purifier.sanitize(content);
    },
    
    // Sanitisation pour URLs
    url: (url) => {
        if (!validator.isURL(url, {
            protocols: ['http', 'https'],
            require_protocol: true
        })) {
            throw new Error('URL invalide');
        }
        return validator.normalizeEmail(url);
    },
    
    // Sanitisation pour emails
    email: (email) => {
        const normalizedEmail = validator.normalizeEmail(email, {
            gmail_lowercase: true,
            gmail_remove_dots: false,
            gmail_remove_subaddress: false,
            gmail_convert_googlemaildotcom: true,
            outlookdotcom_lowercase: true,
            outlookdotcom_remove_subaddress: false,
            yahoo_lowercase: true,
            yahoo_remove_subaddress: false,
            icloud_lowercase: true,
            icloud_remove_subaddress: false
        });
        
        if (!normalizedEmail) {
            throw new Error('Format d\'email invalide');
        }
        
        return normalizedEmail;
    },
    
    // Sanitisation pour numéros de téléphone
    phoneNumber: (phone) => {
        // Supprimer tous les caractères non numériques sauf le +
        const cleaned = phone.replace(/[^\d+]/g, '');
        
        // Validation du format international
        if (!validator.isMobilePhone(cleaned, 'any', { strictMode: false })) {
            throw new Error('Numéro de téléphone invalide');
        }
        
        return cleaned;
    }
};

// Exemple d'utilisation dans un endpoint de blog
app.post('/blog/posts',
    verifyToken,
    authorize([PERMISSIONS.WRITE_POSTS]),
    createValidationMiddleware(blogPostSchema),
    createSanitizationMiddleware(['title', 'excerpt'], 'strict'),
    createSanitizationMiddleware(['content'], 'moderate'),
    async (req, res) => {
        try {
            const { title, excerpt, content, tags } = req.body;
            
            // Sanitisation supplémentaire pour les tags
            const sanitizedTags = tags.map(tag => 
                validator.escape(tag.trim().toLowerCase())
            );
            
            const post = await createBlogPost({
                title,
                excerpt,
                content,
                tags: sanitizedTags,
                authorId: req.user.sub
            });
            
            res.status(201).json({
                message: 'Article créé avec succès',
                postId: post.id
            });
        } catch (error) {
            console.error('Erreur lors de la création de l\'article:', error);
            res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
        }
    }
);
```

### Protection contre les attaques par déni de service

#### Limitation adaptative du taux de requêtes

```javascript
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import MongoStore from 'rate-limit-mongo';

// Stockage distribué pour les limiteurs de taux
const createDistributedRateLimit = (windowMs, maxRequests, options = {}) => {
    return rateLimit({
        windowMs,
        max: maxRequests,
        
        // Stockage MongoDB pour les clusters
        store: new MongoStore({
            uri: process.env.MONGODB_URI,
            collectionName: 'rate_limits',
            expireTimeMs: windowMs
        }),
        
        // Génération de clé personnalisée
        keyGenerator: (req) => {
            // Utiliser l'ID utilisateur si authentifié
            if (req.user) {
                return `user:${req.user.sub}`;
            }
            
            // Utiliser l'IP et l'User-Agent pour les utilisateurs non authentifiés
            const ip = req.ip || req.connection.remoteAddress;
            const userAgent = req.headers['user-agent'] || 'unknown';
            return `ip:${ip}:${Buffer.from(userAgent).toString('base64').slice(0, 20)}`;
        },
        
        // Limitation dynamique basée sur l'utilisateur
        max: (req) => {
            if (req.user) {
                switch (req.user.role) {
                    case 'premium': return maxRequests * 3;
                    case 'verified': return maxRequests * 2;
                    default: return Math.floor(maxRequests * 1.5);
                }
            }
            return maxRequests;
        },
        
        // Messages d'erreur informatifs
        message: (req) => ({
            error: 'Limite de requêtes dépassée',
            limit: maxRequests,
            windowMs,
            retryAfter: Math.ceil(windowMs / 1000),
            type: req.user ? 'authenticated' : 'anonymous'
        }),
        
        // Headers standards
        standardHeaders: true,
        legacyHeaders: false,
        
        // Callback en cas de limite dépassée
        onLimitReached: (req, res, options) => {
            logSecurityEvent('RATE_LIMIT_EXCEEDED', {
                ip: req.ip,
                userId: req.user?.id,
                endpoint: req.path,
                method: req.method,
                userAgent: req.headers['user-agent'],
                limit: options.max,
                window: options.windowMs
            });
            
            // Alerter en cas d'abus répétés
            checkForAbuse(req);
        },
        
        ...options
    });
};

// Détection d'abus et blocage temporaire
const abuseTracker = new Map();

async function checkForAbuse(req) {
    const key = req.ip;
    const now = Date.now();
    
    if (!abuseTracker.has(key)) {
        abuseTracker.set(key, { count: 1, firstSeen: now });
        return;
    }
    
    const abuse = abuseTracker.get(key);
    abuse.count++;
    
    // Si plus de 10 violations en 1 heure
    if (abuse.count > 10 && (now - abuse.firstSeen) < 60 * 60 * 1000) {
        // Bloquer temporairement l'IP
        await blockIPTemporarily(key, 24 * 60 * 60 * 1000); // 24 heures
        
        logSecurityEvent('IP_BLOCKED_FOR_ABUSE', {
            ip: key,
            violationCount: abuse.count,
            timeSpan: now - abuse.firstSeen
        });
        
        // Nettoyer l'entrée
        abuseTracker.delete(key);
    }
}

// Limitation spécialisée pour différents endpoints
const limiters = {
    // Limitation globale
    global: createDistributedRateLimit(15 * 60 * 1000, 1000), // 1000 req/15min
    
    // Limitation pour l'authentification
    auth: createDistributedRateLimit(15 * 60 * 1000, 5, {
        skipSuccessfulRequests: true,
        message: {
            error: 'Trop de tentatives de connexion',
            retryAfter: 900 // 15 minutes
        }
    }),
    
    // Limitation pour la réinitialisation de mot de passe
    passwordReset: createDistributedRateLimit(60 * 60 * 1000, 3, {
        message: {
            error: 'Trop de demandes de réinitialisation',
            retryAfter: 3600 // 1 heure
        }
    }),
    
    // Limitation pour les uploads
    upload: createDistributedRateLimit(60 * 60 * 1000, 10),
    
    // Limitation pour la recherche
    search: createDistributedRateLimit(60 * 1000, 30),
    
    // Limitation pour les API externes
    external: createDistributedRateLimit(60 * 1000, 100)
};

// Ralentissement progressif pour éviter les pics
const progressiveSlowDown = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 100, // Commencer à ralentir après 100 requêtes
    delayMs: 100, // Ajouter 100ms de délai par requête supplémentaire
    maxDelayMs: 10000, // Délai maximum de 10 secondes
    
    keyGenerator: (req) => {
        return req.user ? `user:${req.user.id}` : `ip:${req.ip}`;
    },
    
    onLimitReached: (req, res, options) => {
        console.log(`Ralentissement appliqué pour ${req.ip}: ${options.delay}ms`);
    }
});

// Application des limiteurs
app.use(progressiveSlowDown);
app.use(limiters.global);

// Limitations spécifiques
app.use('/api/auth/', limiters.auth);
app.use('/api/password-reset', limiters.passwordReset);
app.use('/api/upload', limiters.upload);
app.use('/api/search', limiters.search);
app.use('/api/external', limiters.external);
```

### Validation métier et logique applicative

```javascript
// Validateurs métier personnalisés
const businessValidators = {
    // Validation d'âge pour différents services
    validateAgeRequirement: (age, serviceType) => {
        const requirements = {
            'alcohol': 18,
            'driving': 16,
            'voting': 18,
            'gambling': 21,
            'adult_content': 18
        };
        
        const minAge = requirements[serviceType];
        if (!minAge) {
            throw new Error(`Type de service inconnu: ${serviceType}`);
        }
        
        if (age < minAge) {
            throw new Error(`Âge minimum requis: ${minAge} ans`);
        }
        
        return true;
    },
    
    // Validation de crédit/limite
    validateCreditLimit: async (userId, requestedAmount) => {
        const user = await findUserById(userId);
        const currentDebt = await getCurrentDebt(userId);
        
        if (currentDebt + requestedAmount > user.creditLimit) {
            throw new Error('Limite de crédit dépassée');
        }
        
        return true;
    },
    
    // Validation de disponibilité
    validateAvailability: async (resourceId, startDate, endDate) => {
        const conflicts = await findConflictingBookings(resourceId, startDate, endDate);
        
        if (conflicts.length > 0) {
            throw new Error('Ressource non disponible pour cette période');
        }
        
        return true;
    },
    
    // Validation géographique
    validateGeoRestriction: (userLocation, serviceLocation, maxDistance = 50) => {
        const distance = calculateDistance(userLocation, serviceLocation);
        
        if (distance > maxDistance) {
            throw new Error(`Service non disponible (distance: ${distance}km)`);
        }
        
        return true;
    }
};

// Middleware de validation métier
const businessValidationMiddleware = (validators) => {
    return async (req, res, next) => {
        try {
            for (const validator of validators) {
                await validator(req);
            }
            next();
        } catch (error) {
            res.status(400).json({
                error: 'Validation métier échouée',
                message: error.message
            });
        }
    };
};

// Exemple d'utilisation pour une réservation
app.post('/bookings',
    verifyToken,
    createValidationMiddleware(bookingSchema),
    businessValidationMiddleware([
        async (req) => {
            await businessValidators.validateAvailability(
                req.body.resourceId,
                new Date(req.body.startDate),
                new Date(req.body.endDate)
            );
        },
        async (req) => {
            const user = await findUserById(req.user.sub);
            businessValidators.validateGeoRestriction(
                user.location,
                req.body.location,
                100 // 100km max
            );
        }
    ]),
    async (req, res) => {
        // Logique de création de réservation
        res.json({ message: 'Réservation créée avec succès' });
    }
);
```

La validation et la sanitisation des données ne sont pas des processus statiques. Ils doivent évoluer avec votre application et s'adapter aux nouvelles menaces. Il est crucial de maintenir un équilibre entre sécurité et utilisabilité, en implémentant des validations strictes sans nuire à l'expérience utilisateur.

## 6. Gestion sécurisée des sessions {#sessions}

### Configuration des sessions
```javascript
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS uniquement
        httpOnly: true, // Pas d'accès via JavaScript
        maxAge: 1000 * 60 * 60 * 24, // 24 heures
        sameSite: 'strict' // Protection CSRF
    }
}));
```

### Gestion de la déconnexion
```javascript
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur de déconnexion' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Déconnecté avec succès' });
    });
});
```

## 7. Sécurisation côté serveur {#serveur}

### Variables d'environnement
```javascript
// .env (ne jamais commiter ce fichier)
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
DB_PASSWORD=your-database-password
API_KEY=your-api-key

// Chargement sécurisé
require('dotenv').config();

// Validation des variables requises
const requiredEnvVars = ['JWT_SECRET', 'DB_PASSWORD'];
requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        console.error(`Variable d'environnement manquante: ${envVar}`);
        process.exit(1);
    }
});
```

### Gestion des erreurs sécurisée
```javascript
// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Ne pas exposer les détails en production
    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ error: 'Erreur interne du serveur' });
    } else {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});
```

### Audit de sécurité
```bash
# Audit des dépendances
npm audit

# Correction automatique
npm audit fix

# Mise à jour des dépendances
npm update
```

## 8. Sécurisation côté client {#client}

### Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
```

### Protection contre le clickjacking
```css
/* Empêcher l'inclusion dans des iframes */
html {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
```

### Validation côté client (complément)
```javascript
// Validation côté client (ne remplace pas la validation serveur)
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // Au moins 8 caractères, une majuscule, une minuscule, un chiffre, un caractère spécial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}
```

## 9. Bonnes pratiques de développement {#bonnes-pratiques}

### Principe du moindre privilège
- Accordez uniquement les permissions minimales nécessaires
- Utilisez des comptes de service dédiés
- Implémentez une séparation claire des responsabilités

### Défense en profondeur
- Implémentez plusieurs couches de sécurité
- Validez les données à chaque niveau
- Surveillez et journalisez les activités

### Sécurité par conception
- Intégrez la sécurité dès la conception
- Effectuez des revues de code axées sur la sécurité
- Utilisez des outils d'analyse statique

### Gestion des mots de passe
```javascript
// Politique de mots de passe robuste
const passwordPolicy = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    preventReuse: 5, // Empêcher la réutilisation des 5 derniers mots de passe
    maxAge: 90 * 24 * 60 * 60 * 1000 // Expiration après 90 jours
};
```

## 10. Outils et tests de sécurité {#outils}

### Outils d'analyse de code
- **ESLint Security Plugin** : Détection des vulnérabilités JavaScript
- **SonarQube** : Analyse de qualité et sécurité du code
- **Snyk** : Scan des vulnérabilités dans les dépendances

### Tests de pénétration
```javascript
// Exemple de test automatisé avec Jest
describe('Tests de sécurité', () => {
    test('Devrait rejeter les requêtes sans token', async () => {
        const response = await request(app)
            .get('/api/protected')
            .expect(401);
    });
    
    test('Devrait empêcher l\'injection SQL', async () => {
        const maliciousInput = "1'; DROP TABLE users; --";
        const response = await request(app)
            .post('/api/search')
            .send({ query: maliciousInput })
            .expect(400);
    });
});
```

### Monitoring et alertes
```javascript
import winston from 'winston';

// Configuration du logging sécurisé
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Middleware de logging des erreurs
app.use((err, req, res, next) => {
    logger.error('Erreur détectée', {
        message: err.message,
        stack: err.stack,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        url: req.originalUrl,
        method: req.method
    });
    
    next(err);
});
```

## 11. Exercices pratiques {#exercices}

### Exercice 1 : Sécurisation d'une API de connexion
**Objectif** : Implémenter une authentification sécurisée

**Tâches** :
1. Créer un endpoint de connexion avec validation
2. Implémenter le hachage des mots de passe
3. Générer et valider des JWT
4. Ajouter une limitation du taux de requêtes

### Exercice 2 : Protection contre XSS
**Objectif** : Sécuriser une application contre les attaques XSS

**Tâches** :
1. Identifier les vulnérabilités XSS dans le code fourni
2. Implémenter la sanitisation des données
3. Configurer CSP
4. Tester les protections

### Exercice 3 : Audit de sécurité
**Objectif** : Effectuer un audit complet d'une application

**Tâches** :
1. Scanner les vulnérabilités avec npm audit
2. Analyser les headers de sécurité
3. Tester les mécanismes d'authentification
4. Proposer des améliorations

### Exercice 4 : Implémentation HTTPS
**Objectif** : Configurer HTTPS et les headers de sécurité

**Tâches** :
1. Générer des certificats SSL
2. Configurer le serveur HTTPS
3. Implémenter HSTS
4. Rediriger HTTP vers HTTPS

## Conclusion

La sécurité des applications web est un domaine en constante évolution qui nécessite une vigilance permanente. Les concepts abordés dans ce chapitre constituent les fondements essentiels pour développer des applications web sécurisées.

### Points clés à retenir :
- La sécurité doit être intégrée dès la conception
- Toujours valider et sanitiser les données d'entrée
- Utiliser HTTPS et des headers de sécurité appropriés
- Implémenter une authentification et autorisation robustes
- Maintenir les dépendances à jour
- Effectuer des tests de sécurité réguliers

### Ressources supplémentaires :
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)















