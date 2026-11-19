# Checklist des concepts — UE2108 Web Client & Serveur

> `[X]` = à connaître et comprendre pour l'examen · `[ ]` = hors matière `[~]` = savoir ce que cela fait sans connaître tous les détails 

---

## 1. Architecture client-serveur et HTTP

### Architecture
- [X] Rôles du client et du serveur
- [X] Diagramme de séquence d'une interaction requête/réponse

### URL
- [X] Schéma / protocole (`http`, `https`)
- [X] Host : nom de domaine, sous-domaines, adresse IP
- [X] Port
- [X] Chemin (path) et structure hiérarchique
- [X] Query string (`?`, `=`, `&`)
- [X] Fragment (ancre)
- [X] Encodage des URLs (percent-encoding)

### Protocole HTTP
- [X] Structure d'une requête : ligne de requête (méthode, chemin, version), en-têtes, corps
- [X] Méthodes HTTP : GET, POST, PUT, PATCH, DELETE
- [X] Structure d'une réponse : ligne de statut (version, code, message), en-têtes, corps
- [X] Codes de statut : 200, 201, 301, 302, 400, 401, 403, 404, 500
- [X] Cycle de vie d'une communication HTTP
- [X] En-têtes de requête : `Host`, `User-Agent`, `Accept`, `Accept-Language`, `Authorization`, `Cookie`, `Content-Type`, `Content-Length`
- [X] En-têtes de réponse : `Content-Type`, `Content-Length`, `Set-Cookie`, `Cache-Control`, `Location`
- [X] Conception d'une première API REST (CRUD sur `/books`)

---

## 2. Client léger vs client lourd

- [X] Client léger : rendu serveur, cycle de vie d'une requête (rechargement complet)
- [X] Avantages et inconvénients du client léger
- [X] Client lourd (SPA) : cycle de vie d'une requête (appel API + rendu client)
- [X] Architecture d'un client lourd : UI, actions/événements, router, services, state management
- [X] Comparaison client léger / client lourd
- [X] Critères de choix d'un client lourd (interactivité, état, applications métier, UX)

---

## 3. Node.js et npm

### Node.js
- [X] Définition : JavaScript côté serveur
- [X] Single-threaded, asynchrone et événementiel
- [X] Caractéristiques : performances, écosystème, WebSockets, microservices, TypeScript
- [~] Installation (Windows, macOS, Linux)

### npm et projet
- [X] Rôles de npm : gestionnaire de dépendances, registre, exécuteur de scripts, initialisation de projet
- [X] `npm init` et `package.json`
- [X] Installation de packages externes, `node_modules`
- [X] `dependencies` vs `devDependencies`
- [X] Scripts npm
- [X] `nodemon`

### Modules
- [X] CommonJS : `require`, `module.exports`
- [X] ES Modules : `import`, `export`
- [X] Différences CommonJS / ES Modules (syntaxe, chargement, moment d'exécution, extensions)
- [X] Activer les ES Modules : `"type": "module"` ou extension `.mjs`
- [X] `__dirname` / `__filename` en ES Modules (`import.meta.url`)

### Modules intégrés et système de fichiers
- [~] `fs` : `readFile`, `writeFile`, `appendFileSync`, `existsSync`
- [~] `fs` : répertoires (`readdir`, `mkdirSync`, `stat`)
- [~] Versions synchrones vs asynchrones de `fs`
- [~] `path` : `join`, `dirname`, `extname`
- [~] `os`
- [~] `crypto` (`randomInt`)
- [~] `http`

### Divers
- [X] Arguments en ligne de commande (`process.argv`)
- [X] Gestion d'erreurs avec `try/catch`
- [X] Promesses et `async/await`

---

## 4. Express.js

### Node.js natif
- [X] Exécution côté serveur et cycle de vie d'une requête HTTP dans Node.js
- [X] Serveur HTTP natif avec `http.createServer`
- [X] Limites de `http.createServer` (parsing manuel, code verbeux, pas de middleware, erreurs complexes)

### Express
- [X] Définition et avantages d'Express
- [X] Installation et premier serveur (`app.listen`)

### Routage
- [X] Méthodes de routage : `app.get`, `app.post`, `app.put`, `app.delete`
- [X] Paramètres de route (`req.params`) : simples, multiples, optionnels
- [X] Query parameters (`req.query`) : filtrer, trier, paginer
- [X] Combinaison paramètres de route + query parameters
- [X] Conversion de types (`parseInt`, `Number`)

### Middlewares
- [X] Anatomie d'un middleware `(req, res, next)`
- [X] Rôle de `next()`
- [X] Ce qu'un middleware peut faire (exécuter du code, modifier req/res, terminer le cycle, appeler le suivant)
- [X] Middleware au niveau application
- [X] Middleware au niveau route
- [X] Middleware de gestion d'erreurs (4 paramètres)
- [X] Middlewares intégrés : `express.json`, `express.urlencoded`, `express.static`
- [X] Ordre d'exécution des middlewares
- [X] Middleware d'authentification simple (`requireAuth`, en-tête `authorization`)
- [X] Middleware de logging

### Routers
- [X] Pourquoi utiliser des routers
- [X] `express.Router()` et montage avec `app.use('/api', …)`
- [X] Router avec middlewares spécifiques
- [X] Router avec paramètres et sous-routers
- [X] Application structurée en plusieurs routers

### Réponses
- [X] `res.send()` (texte)
- [X] `res.json()` (JSON, sérialisation automatique)
- [X] Choix du format de réponse
- [X] `res.status()`
- [X] Tester des endpoints avec `curl`

---

## 5. Client lourd

### SPA
- [~] SPA en JavaScript vanilla
- [X] Routage côté client (`pushState`, `popstate`)
- [X] Appels à une API avec `fetch`

### Stockage côté client
- [X] Vue d'ensemble des options de stockage
- [X] Cookies : `document.cookie`, `Set-Cookie`
- [X] Attributs de cookie : `Expires`, `Max-Age`, `Domain`, `Path`
- [X] Attributs de sécurité : `Secure`, `HttpOnly`, `SameSite` (`Strict`, `Lax`, `None`)
- [X] Envoi automatique des cookies, taille limitée
- [X] localStorage : persistance, API synchrone, portée par origine
- [X] sessionStorage : durée de vie liée à l'onglet
- [~] IndexedDB : asynchrone, grande capacité, index, transactions
- [ ] Cache API
- [X] Choix du bon mécanisme de stockage / architecture hybride
- [ ] Quotas et gestion des erreurs de stockage

### Client lourd + API
- [~] Application todolist : API REST Express + client JavaScript

---

## 6. API REST

### Principes REST
- [X] Contrainte client-serveur
- [X] Sans état (stateless)
- [X] Cacheable
- [X] Interface uniforme
- [X] Système en couches
- [X] Code à la demande
- [X] URLs orientées ressources
- [X] Codes de statut 2xx / 4xx / 5xx
- [X] Pagination
- [X] Versionnement (`/v1`, en-tête `API-Version`)
- [X] `Cache-Control` et `ETag`
- [X] HATEOAS (`_links`)

### Authentification (bases JWT)
- [X] Authentification vs autorisation
- [X] Pourquoi un JWT pour une API REST (stateless)
- [X] Structure `header.payload.signature`
- [X] Base64URL : encodé, pas chiffré
- [~] Claims : `sub`, `iat`, `exp`, `iss`, `aud`, `jti`
- [X] Génération et vérification d'un JWT

### Architecture en couches
- [X] Point d'entrée `app.js`
- [X] Couche routes (`routes/`)
- [X] Couche middleware (`middleware/`)
- [X] Couche controller (`controllers/`)
- [X] Couche service (`services/`) : orchestrateur métier
- [X] Couche model (`models/`) : entité métier, hydratation, `toJSON()`
- [X] Couche repository (`repositories/`) : accès aux données
- [X] Responsabilités « fait / ne fait pas » de chaque couche
- [X] Sens des appels autorisés entre couches
- [X] Flux complet d'une requête à travers les couches
- [X] Anti-patterns à éviter
- [X] Bénéfices : testabilité, maintenabilité, évolutivité, lisibilité

### Hygiène d'une API
- [X] Validation des entrées (`express-validator`)
- [~] Gestion d'erreurs : erreurs métier personnalisées (`UserError`, `AuthError`), `error.status`
- [X] Middleware `errorHandler` centralisé
- [X] Rate limiting
- [X] Hachage de mot de passe dans le model (`hashPassword`, `comparePassword`)
- [~] Documentation d'une API
- [~] Tests automatisés de l'API

---

## 7. Bases de données

### Motivation
- [ ] Méthodes HTTP dans le contexte des données (GET, POST, PUT/PATCH, DELETE)
- [ ] Limites du stockage en fichiers : concurrence
- [ ] Limites du stockage en fichiers : absence de transactions
- [ ] Limites du stockage en fichiers : performance et recherche
- [ ] Limites du stockage en fichiers : intégrité des données
- [ ] Limites du stockage en fichiers : sauvegarde et récupération

### Bases relationnelles
- [~] SQLite : base embarquée
- [~] MariaDB : base de production
- [~] Transactions et ACID
- [~] Jointures, index

### MongoDB
- [ ] Définition : base NoSQL orientée documents JSON
- [ ] Schéma flexible, requêtes riches, scalabilité horizontale
- [ ] Installation et driver Node.js
- [ ] Opérations CRUD (`find`, `findOne`, `findById`, insert, update, delete)
- [ ] Intégration avec Express
- [ ] Avantages et inconvénients de MongoDB

### ORM / ODM
- [ ] Définition ORM / ODM et intérêt (productivité, portabilité, sécurité)
- [ ] Sequelize : modèles, associations, query builder
- [ ] Sequelize CLI
- [ ] Mongoose : schémas et validation
- [ ] Mongoose : middleware (hooks), populations (`populate`), plugins

### API complète
- [ ] Architecture MVC avec Express
- [ ] Service CRUD
- [ ] Gestion des erreurs par middleware
- [ ] Initialisation de la base de données
- [ ] Migrations et évolution de schéma
- [ ] Seeds
- [ ] Tests unitaires et d'intégration avec Jest

---

## 8. Tests

- [ ] Pyramide des tests
- [ ] Tests unitaires : isolation, rapidité, reproductibilité
- [ ] Mocks et stubs
- [ ] Outils de tests unitaires : Jest, Mocha, Chai, Vitest
- [ ] Syntaxe Jest : `describe`, `it`/`test`, `expect`, `beforeEach`
- [ ] Tests d'intégration : horizontale, verticale, contractuelle
- [ ] Supertest
- [ ] Tests end-to-end : réalisme vs complexité et fragilité
- [ ] Outils E2E : Cypress, Playwright, Selenium

---

## 9. Sécurité

### Introduction
- [X] Enjeux : impact financier, réputation, conformité (RGPD), continuité
- [X] Triade CIA : confidentialité, intégrité, disponibilité
- [X] Authentification vs autorisation
- [X] Security by Design : sécurité proactive, sécurité par défaut
- [X] Défense en profondeur
- [X] Principe du moindre privilège
- [X] Validation complète des entrées

### Vulnérabilités (OWASP)
- [X] OWASP et le Top 10:2025 (vue d'ensemble)
- [~] A01 Broken Access Control (élévation de privilèges, IDOR, SSRF)
- [ ] A02 Security Misconfiguration
- [ ] A03 Software Supply Chain Failures
- [ ] A04 Cryptographic Failures
- [X] A05 Injection
- [ ] A06 Insecure Design
- [~] A07 Authentication Failures
- [ ] A08 Software or Data Integrity Failures
- [ ] A09 Security Logging and Alerting Failures
- [ ] A10 Mishandling of Exceptional Conditions
- [X] Injection SQL et requêtes paramétrées
- [ ] Injection NoSQL
- [ ] Injection de commandes système
- [X] XSS réfléchi
- [X] XSS stocké
- [X] XSS basé sur le DOM
- [X] CSRF
- [X] Conséquences : vol de données, usurpation, défiguration, ransomware, botnet

### Authentification et autorisation
- [X] Mots de passe : hachage (bcrypt), sel
- [ ] Anatomie technique d'un JWT (`alg`, `typ`, claims)
- [ ] Encodage ≠ chiffrement : ne jamais mettre de secret dans le payload
- [ ] HS256 (secret partagé) vs RS256/ES256 (clé privée/publique)
- [~] Famille JOSE : JWS, JWE, JWK, JWA
- [ ] Vérification stricte : `issuer`, `audience`, `jti`, `algorithms`, `expiresIn`
- [X] `jwt.sign` / `jwt.verify` (`jsonwebtoken`)
- [ ] Authentification multi-facteurs (2FA, TOTP)
- [~] RBAC (contrôle d'accès par rôles)
- [~] ABAC (contrôle d'accès par attributs)
- [X] Access token court + refresh token
- [X] Rotation du refresh token
- [X] Stockage du JWT dans `localStorage` / `sessionStorage` (risque XSS)
- [X] Stockage du JWT en cookie `HttpOnly` + `Secure` + `SameSite` (risque CSRF)
- [X] Piège : cookie HttpOnly ≠ immunité XSS (abus de session)
- [~] Révocation de tokens et blacklist (Redis)

### Validation et sanitisation
- [X] Validation vs sanitisation
- [X] Validation côté serveur obligatoire
- [~] Validation avec Joi
- [~] Validation des fichiers uploadés (multer, type MIME, taille, path traversal)
- [~] Sanitisation HTML contre le XSS (DOMPurify)
- [~] Protection DoS : rate limiting adaptatif (`express-rate-limit`, slow-down)
- [~] Validation métier et logique applicative

### Sécurisation des communications
- [ ] Chiffrement en transit : confidentialité, intégrité, authentification
- [ ] HTTPS et TLS : fonctionnement
- [ ] Configuration HTTPS robuste (versions TLS, cipher suites)
- [ ] Certificats auto-signés
- [ ] Let's Encrypt / Certbot
- [ ] Helmet
- [ ] Content Security Policy (CSP)
- [ ] HSTS
- [ ] `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- [~] CORS : principe (Same-Origin Policy)
- [~] En-têtes CORS `Access-Control-Allow-*` (Origin, Methods, Headers, Credentials, Max-Age)
- [ ] Requêtes preflight (`OPTIONS`)
- [ ] Détection d'anomalies de trafic
- [ ] Logging et alertes de sécurité (winston)

### Pratiques et outils
- [ ] Sessions serveur sécurisées (`express-session` : `secret`, `store`, cookie `httpOnly`/`secure`/`sameSite`)
- [ ] Déconnexion (`destroy`)
- [ ] Sessions serveur vs JWT : quand choisir l'un ou l'autre
- [ ] Variables d'environnement (`dotenv`, `process.env`)
- [ ] Gestion des erreurs sécurisée (pas de fuite d'informations)
- [ ] Audit des dépendances (`npm audit`)
- [ ] Protection contre le clickjacking
- [ ] Validation côté client (complément seulement)
- [ ] Politique de mots de passe
- [ ] Outils d'analyse de code : ESLint Security, SonarQube, Snyk
- [ ] Tests de pénétration
- [ ] Monitoring et alertes

---

## 10. Progressive Web Apps

### Introduction
- [ ] Définition d'une PWA
- [ ] Caractéristiques : progressive, responsive, offline, app-like, sécurisée, installable, réengageable

### Web App Manifest
- [ ] Rôle du `manifest.json`
- [ ] `name` / `short_name`, `start_url`, `display`
- [ ] `icons` (`purpose`), `background_color` / `theme_color`
- [ ] `screenshots`, `shortcuts`

### Service Workers
- [ ] Architecture (proxy réseau, thread séparé)
- [ ] Cycle de vie : enregistrement, installation, activation, fonctionnement, mise à jour
- [ ] Événements : `install`, `activate`, `fetch`, `push`, `sync`
- [ ] Sécurité des Service Workers

### HTTPS
- [ ] Pourquoi HTTPS est obligatoire pour une PWA
- [ ] HTTPS en local avec mkcert

### Construction d'une PWA
- [ ] Structure du projet
- [ ] Intégration PWA dans la page HTML
- [ ] Enregistrement et gestion des mises à jour du Service Worker
- [ ] Précaching

### Stratégies de cache
- [ ] Cache First
- [ ] Network First
- [ ] Stale While Revalidate
- [ ] Stratégie hybride

### Fonctionnalités avancées
- [ ] Notifications push : architecture (utilisateur, SW, service de push, serveur)
- [ ] Notifications push : envoi côté serveur
- [ ] Background Sync
- [ ] Stockage hors ligne avec IndexedDB
- [ ] Réconciliation des données et gestion des conflits

### Optimisation
- [ ] Lazy loading
- [ ] Code splitting / bundling
- [ ] Compression et minification
- [ ] Resource hints et préchargement
- [ ] Critical Rendering Path
- [ ] Core Web Vitals
- [ ] Accessibilité : WCAG 2.1 et 4 piliers (perceptible, utilisable, compréhensible, robuste)
- [ ] SEO : structure sémantique, métadonnées, sitemap

### Outils et frameworks
- [ ] Lighthouse
- [ ] Workbox (precaching, runtime caching)
- [ ] PWA Builder
- [ ] Angular PWA, React + Workbox, Vue PWA plugin, next-pwa

### Déploiement et distribution
- [ ] Exigences d'hébergement HTTPS, configuration Nginx
- [ ] CDN
- [ ] Hébergeurs : Netlify, Vercel, Firebase Hosting, GitHub Pages, Cloudflare Pages
- [ ] Play Store via Trusted Web Activities (Bubblewrap)
- [ ] Microsoft Store
- [ ] Tests automatisés et checklist de validation PWA
