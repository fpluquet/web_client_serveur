# Pratiques et outils

## 6. Gestion sécurisée des sessions {#sessions}

Les **sessions serveur + cookies** restent une alternative (ou un complément) aux JWT purs, surtout pour les apps web classiques (SSR, formulaires). Contrairement au JWT access token, l’état vit côté serveur : la révocation est simple (`destroy`).

### Configuration des sessions

Points critiques du cookie de session :

| Option | Valeur recommandée | Effet |
|--------|-------------------|--------|
| `httpOnly` | `true` | Inaccessible depuis JavaScript → mitige le vol via XSS |
| `secure` | `true` en production | Cookie envoyé uniquement en HTTPS |
| `sameSite` | `'strict'` ou `'lax'` | Réduit le risque CSRF |
| `store` | Redis / Mongo / DB | Pas de MemoryStore en multi-instances / prod |
| `secret` | Variable d’environnement forte | Signature du cookie de session |

```javascript
import session from 'express-session';
import MongoStore from 'connect-mongo';

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sid', // évite le nom par défaut trop prévisible connect.sid
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 60 * 60 * 24 // aligné sur maxAge
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

Toujours détruire la session **et** effacer le cookie côté client :

```javascript
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur de déconnexion' });
        }
        res.clearCookie('sid');
        res.json({ message: 'Déconnecté avec succès' });
    });
});
```

::: tip JWT vs session
- **API mobile / SPA multi-services** → souvent JWT (+ refresh tokens, § ci-dessus)
- **Site web monolithique / cookie first-party** → souvent session serveur
Les deux exigent HTTPS en production et une gestion soignée de la déconnexion / révocation.
:::

## 7. Sécurisation côté serveur {#serveur}

### Variables d'environnement
```javascript
// .env (ne jamais commiter ce fichier)
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
DB_PASSWORD=your-database-password
API_KEY=your-api-key

// Chargement sécurisé
import 'dotenv/config';

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

---

← [Validation](./validation) · [Exercices →](./exercices)
