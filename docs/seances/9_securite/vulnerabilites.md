# Vulnérabilités web (OWASP) {#vulnerabilites}


## L'OWASP et son importance dans la sécurité web

L'Open Web Application Security Project (OWASP) est une fondation à but non lucratif qui travaille à améliorer la sécurité des logiciels. Depuis 2003, l'OWASP publie régulièrement son "Top 10" des vulnérabilités les plus critiques affectant les applications web. Cette liste, mise à jour tous les 3-4 ans, est devenue la référence mondiale pour les professionnels de la sécurité.

La version courante est le **[OWASP Top 10:2025](https://owasp.org/Top10/2025/)**. Par rapport à 2021 : *Security Misconfiguration* et la *supply chain* montent fortement ; le **SSRF** est rattaché à A01 ; une nouvelle catégorie **A10 Mishandling of Exceptional Conditions** apparaît (gestion d’erreurs / conditions exceptionnelles).

### Le Top 10 complet (2025)

| # | Catégorie | En bref | Dans ce cours |
|---|-----------|---------|----------------|
| A01 | Broken Access Control | Permissions mal appliquées (élévation, IDOR…) ; **SSRF inclus** depuis 2025 | [ci-dessous](#a01) · [Auth / RBAC](./auth) |
| A02 | Security Misconfiguration | Defaults dangereux, headers absents, services exposés | [Helmet / headers](./communications#helmet) · [CORS](./communications#cors) · [Sessions](./pratiques#sessions) |
| A03 | Software Supply Chain Failures | Dépendances, build, distribution (élargit l’ancien « Vulnerable Components ») | [Audit npm](./pratiques#serveur) |
| A04 | Cryptographic Failures | Pas de chiffrement, algos faibles, clés mal gérées | [ci-dessous](#a04) · [HTTPS](./communications#https) |
| A05 | Injection | SQL, NoSQL, OS, LDAP… (+ **XSS** toujours dans cette catégorie) | [Injection](#a05) · [XSS](#xss) · [Validation](./validation) |
| A06 | Insecure Design | Conception sans contrôles de sécu (threat modeling absent) | [Security by Design](./#introduction) · [Bonnes pratiques](./pratiques#bonnes-pratiques) |
| A07 | Authentication Failures | Mots de passe faibles, sessions, MFA absente | [Authentification](./auth#auth) |
| A08 | Software or Data Integrity Failures | CI/CD, désérialisation, mises à jour non vérifiées | Notions en [bonnes pratiques](./pratiques#bonnes-pratiques) |
| A09 | Security Logging and Alerting Failures | Pas de logs / alertes → attaques invisibles | [Monitoring](./communications) · [Outils](./pratiques#outils) |
| A10 | Mishandling of Exceptional Conditions | Erreurs / exceptions mal gérées (fuite d’infos, états incohérents…) | [Gestion des erreurs](./pratiques#serveur) |

::: tip Focus de cette page
Nous **développons** ici les failles les plus concrètes pour un projet Node/Express BA2 (**A01**, **A04**, **A05**, XSS, CSRF). Le tableau ci-dessus situe le reste du Top 10 et renvoie vers les autres parties du chapitre Sécurité.
:::

## Vulnérabilités prioritaires (approfondissement)

### Broken Access Control — A01 {#a01}

Le contrôle d'accès défaillant reste la vulnérabilité la plus critique selon l'OWASP **2025**. Cette catégorie englobe tous les défauts permettant aux utilisateurs d'agir en dehors de leurs permissions prévues. Depuis 2025, le **SSRF** (Server-Side Request Forgery) y est également rattaché.

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

### Cryptographic Failures — A04 {#a04}

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

### Injection — A05 {#a05}

Les attaques par injection se produisent quand des données non fiables sont envoyées à un interpréteur dans le cadre d'une commande ou d'une requête. Les données hostiles peuvent amener l'interpréteur à exécuter des commandes non prévues ou à accéder à des données sans autorisation appropriée.

**Types d'injection courants :**

#### Injection SQL
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

#### Injection NoSQL
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

#### Injection de commandes système
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

### Cross-Site Scripting (XSS) {#xss}

::: info Place dans le Top 10 2025
Le XSS n’est **pas une entrée séparée** : il reste rattaché à **A05 Injection** (comme en 2021 sous A03). On le détaille quand même ici, car c’est l’une des failles les plus fréquentes côté web applicatif.
:::

Le Cross-Site Scripting permet à un attaquant d'injecter du code JavaScript malveillant dans des pages web vues par d'autres utilisateurs. Il existe trois types principaux de XSS :

#### XSS Réfléchi (Reflected XSS)
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

#### XSS Stocké (Stored XSS)
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

#### XSS basé sur le DOM
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

### Cross-Site Request Forgery (CSRF) {#csrf}

::: info Place dans le Top 10 2025
Le CSRF **ne figure pas** dans le Top 10 2025 (absent depuis 2017). Il reste toutefois un risque classique dès qu’on s’appuie sur des **cookies de session** — d’où cet approfondissement, en lien avec [SameSite / sessions](./pratiques#sessions) et le [stockage JWT](./auth#jwt-storage).
:::

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

## Impact et conséquences des vulnérabilités

Chaque vulnérabilité peut avoir des conséquences dramatiques :

- **Vol de données** : Exposition d'informations personnelles, financières ou commerciales sensibles
- **Usurpation d'identité** : Prise de contrôle de comptes utilisateur
- **Défiguration de sites** : Modification du contenu visible par les visiteurs
- **Ransomware** : Chiffrement des données avec demande de rançon
- **Botnet** : Utilisation des serveurs compromis pour d'autres attaques
- **Réputation** : Perte de confiance des clients et partenaires
- **Légal** : Sanctions réglementaires et poursuites judiciaires

La compréhension approfondie de ces vulnérabilités est la première étape vers le développement d'applications web sécurisées. Dans les sections suivantes, nous explorerons les techniques et les outils pour se protéger efficacement contre ces menaces.

---

← [Vue d'ensemble](./) · [Authentification →](./auth)
