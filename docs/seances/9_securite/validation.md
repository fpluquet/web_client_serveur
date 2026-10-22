# Validation et sanitisation des données {#validation}


La validation et la sanitisation des données constituent la première ligne de défense contre la plupart des attaques web. Dans un environnement où les utilisateurs peuvent soumettre des données arbitraires, il est essentiel de vérifier, nettoyer et sécuriser toutes les entrées avant de les traiter. Cette section explore les techniques avancées pour implémenter une validation robuste et une sanitisation efficace.

## Comprendre la différence entre validation et sanitisation

**La validation** consiste à vérifier que les données respectent les critères attendus (format, type, longueur, etc.). Si les données ne sont pas valides, elles sont rejetées.

**La sanitisation** consiste à nettoyer les données en supprimant ou en échappant les caractères potentiellement dangereux, tout en conservant les données dans un format utilisable.

Ces deux processus sont complémentaires et doivent être appliqués systématiquement sur toutes les entrées utilisateur.

## Principes fondamentaux de la validation

### Validation côté serveur : Impératif de sécurité

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

### Validation des fichiers uploadés

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

## Sanitisation avancée des données

### Sanitisation HTML et protection XSS

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

## Protection contre les attaques par déni de service

### Limitation adaptative du taux de requêtes

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

## Validation métier et logique applicative

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

---

← [Communications](./communications) · [Pratiques →](./pratiques)
