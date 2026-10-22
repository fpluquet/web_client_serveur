# Sécurisation des communications {#communications}


::: tip Complément au chapitre APIs RESTful
Cette section couvre **HTTPS**, **Helmet** (headers / CSP) et **CORS granulaire** — le complément sécurité transport / navigateur après l’API JWT de base.
:::

La sécurisation des communications constitue un aspect fondamental de la sécurité web moderne. Dans un monde où les données transitent constamment sur des réseaux potentiellement compromis, protéger l'intégrité et la confidentialité des échanges entre clients et serveurs est crucial. Cette section explore les techniques et protocoles essentiels pour sécuriser efficacement les communications web.

## L'importance du chiffrement en transit

Les données qui transitent sur Internet passent par de nombreux intermédiaires : routeurs, proxies, fournisseurs d'accès, points d'accès WiFi publics, etc. Chacun de ces points représente une opportunité potentielle pour un attaquant d'intercepter, modifier ou analyser le trafic. Sans protection appropriée, des informations sensibles comme les mots de passe, données personnelles, ou informations financières peuvent être compromises.

Le chiffrement en transit garantit que même si un attaquant intercepte les communications, il ne pourra pas comprendre leur contenu sans posséder les clés de déchiffrement appropriées.

## HTTPS et TLS : Les fondamentaux sécurisés {#https}

### Comprendre TLS/SSL

Transport Layer Security (TLS), successeur de Secure Sockets Layer (SSL), est le protocole standard pour sécuriser les communications web. TLS fournit trois garanties essentielles :

1. **Confidentialité** : Les données sont chiffrées pour empêcher l'écoute
2. **Intégrité** : Protection contre la modification des données en transit
3. **Authentification** : Vérification de l'identité du serveur (et optionnellement du client)

### Configuration HTTPS robuste

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

### Génération et gestion des certificats

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

## Headers de sécurité : Renforcer la protection

Les headers de sécurité HTTP fournissent des instructions aux navigateurs sur la façon de traiter le contenu de votre site de manière sécurisée. Ils constituent une couche de défense supplémentaire contre diverses attaques.

### Configuration complète avec Helmet {#helmet}

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

### Analyse détaillée des headers critiques

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

## CORS : Contrôle d'accès cross-origin sécurisé {#cors}

Cross-Origin Resource Sharing (CORS) est un mécanisme qui permet à des ressources web d'être demandées depuis un autre domaine que celui qui sert la ressource. Une configuration CORS inappropriée peut exposer votre API à des attaques.

### Configuration CORS granulaire

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

### Préflight et requêtes complexes

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

## Surveillance et monitoring des communications

### Détection d'anomalies de trafic

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

### Logging et alertes de sécurité

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

---

← [Authentification](./auth) · [Validation →](./validation)
