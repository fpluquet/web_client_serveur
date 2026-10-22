# 📋 Guide de préparation - Examen Web Client-Serveur (UE2108)

### ℹ️ À propos de ce questionnaire

Ce document contient des **questions de préparation pour l'examen de Web 2** (Web Client-Serveur). Il couvre la matière essentielle du cours, mais **les questions de l'examen réel ne seront pas nécessairement identiques** à celles-ci. Les questions peuvent être tournées différemment, combinées, ou porter sur des aspects spécifiques. Il peut y avoir moins d'indices ou de contexte que dans ce questionnaire.

Cependant, **tous les sujets abordés dans ce questionnaire seront évalués** à l'examen. Vous devez donc être capable de :

1. **Répondre à des questions théoriques** : Expliquer les concepts, les différences, les avantages/inconvénients, etc.
2. **Comprendre un code existant** : Analyser du code fourni, identifier les problèmes, expliquer ce qui se passe, etc.
3. **Produire du code** : Écrire du code fonctionnel pour résoudre un problème donné (middlewares, validations, authentification, etc.)

### 📚 Conseils pour étudier

- Travaillez sur chaque question attentivement
- Consultez les ressources du cours (syllabus, exemples de code)
- Pour les questions de code : testez le code dans votre environnement
- Pour les questions théoriques : comprenez le **pourquoi**, pas juste le **quoi**
- Entraînez-vous à **écrire du code** sans regarder des exemples


---

## 1. Architecture Client-Serveur, URL et HTTP

### Question 1
Dans une URL comme `https://api.monsite.com:8080/users/123?sort=name&limit=10#details`, identifiez et décrivez le rôle de chaque composant (schéma, host, port, chemin, paramètres de requête, fragment).

---

### Question 2
Analysez l'URL suivante et répondez aux questions :
```
https://shop.example.com:443/api/v2/products/books?author=Tolkien&year=1954&format=hardcover#reviews
```
a) Quel est le port utilisé ? Est-il obligatoire dans cette URL ?
b) Quelle serait la valeur de `req.params` et `req.query` si cette route est définie comme `/api/v2/products/:category` ?
c) Le fragment `#reviews` est-il envoyé au serveur ?

---

### Question 3
Quelle est la différence entre les paramètres de route (`:id`) et les query parameters (`?param=value`) dans une URL ? Donnez un exemple d'utilisation appropriée pour chacun.

---

### Question 4
Pour chacune des URL suivantes, indiquez quelle route Express correspondrait et quelles seraient les valeurs des paramètres :

a) `GET /users/42/posts/15/comments`
b) `GET /search?q=javascript&page=3&limit=20`
c) `GET /products/electronics/laptops`

---

### Question 5
Expliquez la différence entre les codes de statut HTTP 4XX (400, 401, ...) et 5XX (500, 501, ...). Dans quel contexte utiliseriez-vous chacun d'eux ?

---

### Question 6
Quelle méthode HTTP devriez-vous utiliser pour chacune de ces opérations dans une API REST ?
- Récupérer la liste de tous les produits
- Créer un nouvel utilisateur
- Mettre à jour partiellement les informations d'un article
- Supprimer un commentaire

---

### Question 7
Analysez la requête HTTP suivante et identifiez chaque composant (méthode, ...) :
```
POST /api/users HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json

{"name": "Alice", "email": "alice@exemple.com"}
```

---

### Question 8
Analysez cette réponse HTTP et répondez aux questions :
```
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/156
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
Cache-Control: no-store

{"id": 156, "name": "Bob", "email": "bob@exemple.com"}
```
a) Que signifie le code de statut 201 ?
b) À quoi sert l'en-tête `Location` ?
c) Expliquez chaque attribut du cookie (`HttpOnly`, `Secure`, `SameSite=Strict`).

---

## 2. Client Léger vs Client Lourd (SPA)

### Question 9
Quelles sont les trois caractéristiques principales qui différencient une architecture client léger d'une architecture client lourd ?

---

### Question 10
Dans une application client lourd (SPA), pourquoi est-il problématique pour le SEO (référencement) par défaut ? Quelle technique peut être utilisée pour résoudre ce problème ?

---

### Question 11
Expliquez pourquoi une application client lourd a généralement une charge serveur moins élevée qu'une application client léger après le chargement initial.

---

### Question 12
Dans une SPA, expliquez pourquoi on utilise `window.history.pushState()` au lieu de simplement changer `window.location.href` :

```javascript
link.addEventListener('click', (e) => {
  e.preventDefault();
  const route = e.target.getAttribute('data-route');
  navigateTo(route);
  window.history.pushState(null, '', `#${route}`);
});
```

---

### Question 13
Quelle est la différence entre `textContent` et `innerHTML` ? Pourquoi `textContent` est-il préférable pour afficher des données utilisateur du point de vue de la sécurité ?

---

### Question 14
Dans ce code côté client, expliquez le rôle de `async/await` et de `try/catch` :

```javascript
async function fetchUsers() {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();
    displayUsers(users);
  } catch (error) {
    showError('Impossible de charger les utilisateurs');
  }
}
```

---

## 3. Node.js

### Question 15
Expliquez la différence entre la syntaxe CommonJS (`require`/`module.exports`) et la syntaxe ES Modules (`import`/`export`). Comment active-t-on les ES Modules dans un projet Node.js ?

---

### Question 16
Quelle est la différence entre `fs.readFileSync()` et `fs.readFile()` ? Pourquoi devrait-on généralement préférer la version asynchrone dans un serveur web ?

---

### Question 17
Dans le fichier `package.json` ci-dessous, expliquez la différence entre `dependencies` et `devDependencies`. Quelle commande installe uniquement les `dependencies` ?

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mariadb": "^3.2.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0"
  }
}
```

---

## 4. Express.js et Middlewares

### Question 18
Qu'est-ce qu'un middleware dans Express.js ? Décrivez les trois paramètres qu'il reçoit et expliquez l'importance de la fonction `next()`.

---

### Question 19
Dans le code Express suivant, expliquez pourquoi l'ordre des middlewares est important :
```javascript
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.get('/users', (req, res) => { /* ... */ });
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});
```

---

### Question 20
Quelle est la différence entre `app.use()` et `app.get()` dans Express.js ?

---

### Question 21
À quoi servent les routers Express (`express.Router()`) ? Quel problème résolvent-ils dans une application de grande taille ?

---

### Question 22
Expliquez ce que fait le middleware `express.static('public')` et dans quel contexte l'utilise-t-on.

---

### Question 23
Analysez le code suivant et indiquez ce qui sera affiché dans la console et envoyé au client pour une requête `GET /test` :

```javascript
app.use((req, res, next) => {
  console.log('Middleware 1');
  next();
});

app.get('/test', (req, res, next) => {
  console.log('Route handler');
  res.locals.message = 'Hello';
  next();
});

app.use((req, res, next) => {
  console.log('Middleware 2');
  res.send(res.locals.message + ' World');
});
```

---

### Question 24
Identifiez le(s) problème(s) dans ce code et proposez une correction :

```javascript
app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
  console.log('Utilisateur envoyé');
  res.status(200).send('OK');
});
```

---

### Question 25
Expliquez la différence de comportement entre ces deux middlewares de gestion d'erreur :

```javascript
// Middleware A
app.use((req, res, next) => {
  res.status(404).send('Erreur');
});

// Middleware B
app.use((err, req, res, next) => {
  res.status(500).send('Erreur');
});
```

---

### Question 26
Dans le code suivant, quelle sera la réponse pour `GET /api/users/abc` (où `abc` n'est pas un nombre valide) ?

```javascript
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'ID invalide' });
  }
  
  if (userId <= 0) {
    return res.status(400).json({ error: 'ID doit être positif' });
  }
  
  res.json({ userId: userId });
});
```

---

### Question 27
Expliquez ce que fait ce code et pourquoi `parseInt(req.query.page) || 1` est utilisé :

```javascript
app.get('/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  // ... récupération des produits avec limit et offset
});
```

---

### Question 28
Dans ce code de router, quelle URL complète déclencherait la route qui affiche "Commentaire trouvé" ?

```javascript
// fichier: routes/posts.js
const router = express.Router();

router.get('/:postId/comments/:commentId', (req, res) => {
  res.send('Commentaire trouvé');
});

export default router;

// fichier: app.js
import postRoutes from './routes/posts.js';
app.use('/api/posts', postRoutes);
```

---

### Question 29
Analysez le code Express suivant et expliquez ce qui se passe lors d'une requête `GET /api/products/electronics?page=2` :

```javascript
const productsRouter = express.Router();

productsRouter.use((req, res, next) => {
  console.log('Middleware produits exécuté');
  req.timestamp = Date.now();
  next();
});

productsRouter.get('/:category', async (req, res) => {
  const category = req.params.category;
  const page = parseInt(req.query.page) || 1;
  
  try {
    const products = await Product.findByCategory(category, page);
    res.json({
      data: products,
      meta: { category, page, requestedAt: req.timestamp }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.use('/api/products', productsRouter);
```

---

## 5. API REST

### Question 30
Qu'est-ce que le principe "stateless" (sans état) dans une architecture REST ? Pourquoi est-ce important pour la scalabilité ?

---

### Question 31
Dans le code suivant, expliquez comment récupérer l'ID de l'utilisateur et les paramètres de tri :
```javascript
// URL: /api/users/42?sort=name&order=desc
app.get('/api/users/:id', (req, res) => {
  // Comment accéder à l'ID et aux paramètres de tri ?
});
```

---

### Question 32
Qu'est-ce que HATEOAS et quel avantage apporte-t-il à une API REST ? Donnez un exemple concret de réponse contenant des liens HATEOAS.

---

### Question 33
Dans une API REST, quelle est la différence entre les méthodes PUT et PATCH pour mettre à jour une ressource ?

---

### Question 34
Expliquez ce que fait la pagination dans cette réponse API et à quoi servent les liens `_links` :

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8
  },
  "_links": {
    "first": "/api/users?page=1&limit=20",
    "prev": "/api/users?page=1&limit=20",
    "next": "/api/users?page=3&limit=20",
    "last": "/api/users?page=8&limit=20"
  }
}
```

---

## 6. Validation, Fichiers et Configuration

### Question 35
Expliquez pourquoi il est important de valider les données côté serveur même si une validation existe côté client. Donnez un exemple de code utilisant `express-validator` pour valider un formulaire d'inscription (email valide, mot de passe d'au moins 8 caractères).

---

### Question 36
Analysez ce code de validation et expliquez ce que fait chaque validateur :

```javascript
import { body, validationResult } from 'express-validator';

app.post('/users',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/\d/),
  body('age').optional().isInt({ min: 18, max: 120 }),
  body('username').trim().escape().notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Créer l'utilisateur...
  }
);
```

---

### Question 37
Qu'est-ce qu'un fichier `.env` et pourquoi est-il utilisé dans les applications Node.js ? Expliquez pourquoi ce fichier ne doit jamais être commité dans un dépôt Git et quelle alternative utilise-t-on pour documenter les variables nécessaires.

---

### Question 38
Analysez ce code et expliquez comment les variables d'environnement sont utilisées :

```javascript
import 'dotenv/config';

const config = {
  port: process.env.PORT || 3000,
  dbHost: process.env.DB_HOST,
  dbPassword: process.env.DB_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development'
};

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET is required');
}
```

a) Que fait `|| 3000` dans la ligne du port ?
b) Pourquoi vérifie-t-on si `jwtSecret` existe ?
c) Quel fichier contiendrait les vraies valeurs de ces variables ?

---

### Question 39
Expliquez ce que fait le middleware `multer` dans ce code et à quoi servent les différentes options de configuration :

```javascript
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.post('/profile/avatar', upload.single('avatar'), (req, res) => {
  res.json({ filename: req.file.filename });
});
```

---

### Question 40
Qu'est-ce que Swagger (OpenAPI) ? Quels sont les avantages de documenter une API avec Swagger et comment les développeurs frontend peuvent-ils l'utiliser ?

---

## 7. Sécurité Web

### Question 41
Expliquez ce qu'est une attaque XSS (Cross-Site Scripting). Donnez un exemple de code vulnérable et expliquez comment le corriger.

---

### Question 42
Expliquez pourquoi ce code est vulnérable au XSS stocké et proposez une correction :

```javascript
app.post('/comments', (req, res) => {
  const comment = req.body.comment;
  comments.push(comment);
  res.redirect('/comments');
});

app.get('/comments', (req, res) => {
  let html = '<ul>';
  comments.forEach(c => {
    html += `<li>${c}</li>`;
  });
  html += '</ul>';
  res.send(html);
});
```

---

### Question 43
Qu'est-ce qu'une attaque CSRF (Cross-Site Request Forgery) ? Comment un token CSRF protège-t-il contre cette attaque ?

---

### Question 44
Dans le code suivant, identifiez la vulnérabilité d'injection SQL et proposez une correction :
```javascript
app.get('/users', (req, res) => {
  const username = req.query.username;
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  db.query(query);
});
```

---

### Question 45
Quelle est la différence entre l'authentification (AuthN) et l'autorisation (AuthZ) ? Donnez un exemple concret pour illustrer chaque concept.

---

### Question 46
Un JWT (JSON Web Token) est composé de trois parties. Nommez ces trois parties et expliquez brièvement le rôle de chacune.

---

### Question 47
Dans un JWT, pourquoi est-il dangereux de stocker des informations sensibles dans le payload ? Donnez un exemple d'information qu'on ne devrait jamais y mettre.

---

### Question 48
Analysez ce middleware d'authentification et expliquez dans quels cas il renvoie une erreur 401 vs 403 :

```javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    return res.status(403).json({ error: 'Token invalide' });
  }
}
```

---

### Question 49
Pourquoi ne faut-il jamais stocker les mots de passe en clair dans une base de données ? Quelle technique utilise-t-on à la place et comment fonctionne-t-elle (expliquez le concept de "salt" et de "hachage") ?

---

### Question 50
Quelle est la différence entre le hachage avec `bcrypt` et le chiffrement avec `AES-256` ? Lequel utilise-t-on pour les mots de passe et pourquoi ?

---

### Question 51
Expliquez ce qu'est CORS (Cross-Origin Resource Sharing) et pourquoi il est nécessaire dans le contexte d'une API REST consommée par une application frontend sur un domaine différent.

---

### Question 52
Dans le contexte de la sécurité des cookies, expliquez la différence entre les attributs `HttpOnly` et `Secure`. Pourquoi sont-ils importants ?

---

## 8. Architecture et bonnes pratiques

### Question 53
Dans une bonne architecture pour une API Express, quelles sont les responsabilités respectives du **Controller**, du **Service**, du **Model** et du **Repository** ? Qui orchestre le Model et le Repository ? Pourquoi le Model doit-il rester indépendant ?

---

### Question 54
Dans une bonne architecture pour une API Express, quelles sont les différentes couches par lesquelles une requête passe ? Décrivez brièvement le rôle de chaque couche et les dépendances (Router → Middleware → Controller → Service → Repository/Model).
---

### Question 55
Analysez cette structure de projet et identifiez à quoi sert chaque dossier. Précisez qui appelle qui (`controllers/` → `services/` → …) :

```
src/
├── controllers/
├── middleware/
├── models/
├── repositories/
├── routes/
├── services/
└── utils/
```

---

## 9. Sécurité avancée

### Question 56
Qu'est-ce que le rate limiting et pourquoi est-il important pour la sécurité d'une API ? Analysez ce code et expliquez ce qu'il fait :

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes, réessayez plus tard' },
  standardHeaders: true,
  legacyHeaders: false
});

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives de connexion' }
});

app.use('/api/', limiter);
app.use('/api/auth/login', loginLimiter);
```

---

### Question 57
Qu'est-ce que la sanitization des données et pourquoi est-elle complémentaire à la validation ? Donnez des exemples de données qui pourraient nécessiter une sanitization avant d'être stockées ou affichées.

---

### Question 58
Analysez ce code de sanitization et expliquez ce que fait chaque ligne :

```javascript
import sanitizeHtml from 'sanitize-html';

app.post('/comments', (req, res) => {
  let comment = req.body.comment;
  
  // Sanitization
  comment = comment.trim();
  comment = sanitizeHtml(comment, {
    allowedTags: ['b', 'i', 'em', 'strong'],
    allowedAttributes: {}
  });
  
  // Stockage du commentaire sanitizé
  comments.push({ text: comment, date: new Date() });
  res.status(201).json({ message: 'Commentaire ajouté' });
});
```

---

### Question 59
Expliquez la stratégie de refresh token *(approfondissement : chapitre Sécurité)*. Pourquoi utilise-t-on deux tokens (access token et refresh token) au lieu d'un seul JWT à longue durée de vie ? Décrivez le flux complet lorsqu'un access token expire.

---

### Question 60
Analysez ce système d'authentification avec refresh token et expliquez le rôle de chaque route :

```javascript
app.post('/auth/login', async (req, res) => {
  const user = await authenticateUser(req.body);
  
  const accessToken = jwt.sign(
    { userId: user.id }, 
    process.env.ACCESS_SECRET, 
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id }, 
    process.env.REFRESH_SECRET, 
    { expiresIn: '7d' }
  );
  
  await saveRefreshToken(user.id, refreshToken);
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  
  res.json({ accessToken });
});

app.post('/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token manquant' });
  }
  
  const storedToken = await findRefreshToken(refreshToken);
  if (!storedToken) {
    return res.status(403).json({ error: 'Refresh token invalide' });
  }
  
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  const newAccessToken = jwt.sign(
    { userId: decoded.userId },
    process.env.ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  
  res.json({ accessToken: newAccessToken });
});
```

---

### Question 61
Quels sont les différents endroits où un token JWT peut être stocké côté client ? Comparez les avantages et inconvénients de chaque approche en termes de sécurité *(voir chapitre Sécurité — [stockage JWT](./9_securite/auth#jwt-storage))* :

| Stockage | Vulnérable au XSS ? | Vulnérable au CSRF ? |
|----------|---------------------|----------------------|
| localStorage | ? | ? |
| sessionStorage | ? | ? |
| Cookie HttpOnly | ? | ? |

Précisez aussi : en cas de XSS, un cookie `HttpOnly` empêche-t-il *toute* utilisation abusive de la session ? Pourquoi ?

---

### Question 62
Écrivez un middleware Express qui vérifie si l'utilisateur connecté a le rôle "admin" avant d'accéder à une route protégée. Le middleware doit :
- Vérifier que `req.user` existe (utilisateur authentifié)
- Vérifier que l'utilisateur a le rôle "admin"
- Renvoyer une erreur 401 si non authentifié, 403 si non autorisé

---

### Question 63
Analysez ce système de middlewares d'authentification et d'autorisation, puis expliquez comment ils fonctionnent ensemble :

```javascript
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    
    next();
  };
};

// Utilisation
app.get('/api/users', authenticate, authorize('admin', 'manager'), getUsers);
app.delete('/api/users/:id', authenticate, authorize('admin'), deleteUser);
```

a) Que fait la syntaxe `...roles` ?
b) Pourquoi `authorize` retourne-t-il une fonction ?
c) Qui peut accéder à `GET /api/users` ? Et à `DELETE /api/users/:id` ?
