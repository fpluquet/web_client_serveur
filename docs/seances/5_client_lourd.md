# Architecture Client Lourd

Comme nous l'avons vu dans la section sur les clients légers ou lourds, un client lourd est une application web qui s'exécute principalement dans le navigateur de l'utilisateur, mais qui télécharge initialement une seule page HTML/CSS/JS. Ensuite, toute l'interaction avec l'application se fait via des appels API asynchrones (généralement REST ou GraphQL) pour récupérer ou envoyer des données.

Nous allons montrer comment créer une application client lourd simple en JavaScript vanilla, puis comment cette application peut interagir avec un serveur backend via une API REST.

## 1. Mise en place d'une SPA basique avec JavaScript vanilla

Créons une application à page unique simple sans framework. Pour cela, nous allons structurer notre projet comme suit ([📁 Voir sur GitHub](https://github.com/fpluquet/web_client_serveur/tree/main/code/seance5/spa-basique)) :

```
spa-basique/
├── index.html
├── css/
│   └── style.css
└── js/
    └── app.js
```

L'index.html contiendra la structure de base de notre application, avec une barre de navigation et un conteneur principal où les différentes "pages" seront injectées dynamiquement via JavaScript.

Le fichier `app.js` gérera la navigation entre les différentes vues et les interactions utilisateur, en remplaçant le contenu du conteneur principal par le contenu approprié sans recharger la page.

::: details Le fichier index.html
<!-- @include:start spa-basique/index.html -->
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SPA Basique</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <!-- Barre de navigation -->
  <nav>
    <a href="#" data-route="home">Accueil</a>
    <a href="#" data-route="about">À propos</a>
    <a href="#" data-route="contact">Contact</a>
  </nav>
  
  <!-- Conteneur principal où les "pages" seront injectées -->
  <main id="app"></main>
  
  <script src="js/app.js"></script>
</body>
</html>
```
<!-- @include:end spa-basique/index.html -->
:::

::: details Le fichier app.js
<!-- @include:start spa-basique/js/app.js -->
```javascript
// app.js
document.addEventListener('DOMContentLoaded', () => {
  // Conteneur principal
  const appContainer = document.getElementById('app');
  
  // Routes et contenu associé
  const routes = {
    'home': {
      title: 'Accueil',
      content: `
        <div class="page">
          <h1>Bienvenue sur notre SPA</h1>
          <p>Cette application utilise JavaScript pour changer de page sans rechargement.</p>
          <button id="load-data">Charger des données</button>
          <div id="data-container"></div>
        </div>
      `
    },
    'about': {
      title: 'À propos',
      content: `
        <div class="page">
          <h1>À propos de nous</h1>
          <p>Nous sommes une équipe qui développe des applications web modernes.</p>
          <p>Cette page est chargée dynamiquement sans rechargement du navigateur.</p>
        </div>
      `
    },
    'contact': {
      title: 'Contact',
      content: `
        <div class="page">
          <h1>Contactez-nous</h1>
          <form id="contact-form">
            <div class="form-group">
              <label for="name">Nom</label>
              <input type="text" id="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" required>
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" rows="4" required></textarea>
            </div>
            <button type="submit">Envoyer</button>
          </form>
          <div id="form-response"></div>
        </div>
      `
    }
  };
  
  // Fonction pour naviguer vers une route
  function navigateTo(route) {
    if (routes[route]) {
      // Mettre à jour le contenu
      appContainer.innerHTML = routes[route].content;
      document.title = routes[route].title;
      
      // Ajouter les gestionnaires d'événements spécifiques à la page
      if (route === 'home') {
        document.getElementById('load-data')?.addEventListener('click', fetchData);
      } else if (route === 'contact') {
        document.getElementById('contact-form')?.addEventListener('submit', handleFormSubmit);
      }
    }
  }
  
  // Ajouter les écouteurs d'événements pour la navigation
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = e.target.getAttribute('data-route');
      navigateTo(route);
      // Mettre à jour l'URL sans recharger la page (navigation historique)
      window.history.pushState(null, routes[route].title, `#${route}`);
    });
  });
  
  // Gestion des données API
  async function fetchData() {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = 'Chargement...';
    
    try {
      // Simuler un appel API (remplacez par un vrai appel API dans un cas réel)
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: [
              { id: 1, name: 'Item 1', description: 'Description de l\'item 1' },
              { id: 2, name: 'Item 2', description: 'Description de l\'item 2' },
              { id: 3, name: 'Item 3', description: 'Description de l\'item 3' },
            ]
          });
        }, 1000);
      });
      
      // Générer le HTML pour les données
      const html = `
        <h3>Données chargées</h3>
        <ul class="data-list">
          ${response.data.map(item => `
            <li>
              <h4>${item.name}</h4>
              <p>${item.description}</p>
            </li>
          `).join('')}
        </ul>
      `;
      
      dataContainer.innerHTML = html;
    } catch (error) {
      dataContainer.innerHTML = `<p class="error">Erreur: ${error.message}</p>`;
    }
  }
  
  // Gestion du formulaire
  function handleFormSubmit(e) {
    e.preventDefault();
    const formResponse = document.getElementById('form-response');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simuler un envoi de formulaire
    formResponse.innerHTML = 'Envoi en cours...';
    
    // Simuler une réponse après 1 seconde
    setTimeout(() => {
      formResponse.innerHTML = `
        <div class="success">
          Message envoyé avec succès!
          <p>Résumé: ${name} (${email}): ${message.substring(0, 20)}...</p>
        </div>
      `;
    }, 1000);
  }
  
  // Navigation initiale basée sur le hash URL ou page d'accueil par défaut
  const initialRoute = window.location.hash.substring(1) || 'home';
  navigateTo(initialRoute);
  
  // Gestion du bouton retour du navigateur
  window.addEventListener('popstate', () => {
    const currentRoute = window.location.hash.substring(1) || 'home';
    navigateTo(currentRoute);
  });
});
```
<!-- @include:end spa-basique/js/app.js -->
:::

::: details Le fichier style.css
<!-- @include:start spa-basique/css/style.css -->
```css
/* Styles pour SPA Basique */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  background-color: #f4f4f4;
}

nav {
  background-color: #333;
  padding: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: #555;
}

#app {
  max-width: 800px;
  margin: 2rem auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.page h1 {
  color: #333;
  margin-bottom: 1rem;
}

.page p {
  margin-bottom: 1rem;
  color: #666;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.data-list {
  list-style: none;
  margin-top: 1rem;
}

.data-list li {
  background: #f8f9fa;
  margin-bottom: 0.5rem;
  padding: 1rem;
  border-radius: 4px;
}

.data-list h4 {
  color: #007bff;
  margin-bottom: 0.5rem;
}

.success {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.error {
  color: #dc3545;
}
```
<!-- @include:end spa-basique/css/style.css -->
:::

### Test de l'application SPA

Pour tester cette application :

1. **Naviguez vers le dossier :** ([📁 Voir sur GitHub](https://github.com/fpluquet/web_client_serveur/tree/main/code/seance5/spa-basique))
   ```bash
   cd code/seance5/spa-basique
   ```

2. **Démarrez un serveur web local :**
   ```bash
   # Avec Python (si installé)
   python -m http.server 8000
   
   # Ou avec Node.js (si vous avez npx)
   npx serve .
   
   # Ou utilisez l'extension Live Server de VS Code
   ```

3. **Ouvrez votre navigateur à l'adresse indiquée** (généralement http://localhost:8000)

### Exercice 1.1: Étendre l'application SPA

Étendez l'application pour ajouter une nouvelle page "Produits" qui affiche une liste de produits à partir d'un API simulé.

## 2. Stockage côté client

Dans les applications client lourd, il est crucial de comprendre les différentes options de stockage disponibles côté client. Ces mécanismes permettent de persistant des données localement dans le navigateur, d'améliorer les performances et de créer des expériences utilisateur plus fluides.

### 2.1. Vue d'ensemble des options de stockage

Il existe plusieurs mécanismes de stockage côté client, chacun avec ses propres caractéristiques, avantages et cas d'usage :

| Type de stockage | Capacité | Persistance | Portée | API | Cas d'usage |
|------------------|----------|-------------|---------|-----|-------------|
| **Cookies** | ~4KB | Configurable (expire) | Domaine/chemin | Document.cookie | Authentification, préférences simples |
| **localStorage** | ~5-10MB | Permanente | Origine (protocol+host+port) | Synchrone | Préférences utilisateur, cache simple |
| **sessionStorage** | ~5-10MB | Session (onglet) | Origine + onglet | Synchrone | État temporaire, données de session |
| **IndexedDB** | ~250MB+ | Permanente | Origine | Asynchrone | Applications hors-ligne, cache complexe |
| **Cache API** | Variable | Permanente | Origine | Asynchrone (Promises) | Cache de ressources, PWA |

### 2.2. Cookies

Les cookies sont le mécanisme de stockage le plus ancien et sont automatiquement envoyés avec chaque requête HTTP au serveur.

#### Caractéristiques des cookies :
- **Taille limitée** : 4KB maximum par cookie
- **Envoi automatique** : Inclus dans toutes les requêtes HTTP
- **Expiration configurable** : Peuvent expirer à une date donnée ou à la fermeture du navigateur
- **Sécurité** : Supportent les flags `HttpOnly`, `Secure`, `SameSite`

#### Exemple d'utilisation des cookies :

```javascript
// Créer un cookie
document.cookie = "username=john; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/";

// Créer un cookie de session (expire à la fermeture du navigateur)
document.cookie = "sessionId=abc123; path=/";

// Lire les cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Utilisation
const username = getCookie('username');
console.log(username); // "john"

// Supprimer un cookie (en le faisant expirer)
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

#### Syntaxe Set-Cookie côté serveur

Du côté serveur, les cookies sont définis via l'en-tête HTTP `Set-Cookie` avec une syntaxe plus riche incluant des attributs de sécurité :

```http
Set-Cookie: sessionId=abc123; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600
```

**Explication des attributs de sécurité :**

| Attribut | Description | Exemple | Sécurité |
|----------|-------------|---------|----------|
| **HttpOnly** | Empêche l'accès via JavaScript (`document.cookie`) | `HttpOnly` | ✅ Protection contre XSS |
| **Secure** | Cookie envoyé uniquement via HTTPS | `Secure` | ✅ Protection contre interception |
| **SameSite** | Contrôle l'envoi cross-site du cookie | `SameSite=Strict` | ✅ Protection contre CSRF |
| **Path** | Limite le cookie à un chemin spécifique | `Path=/admin` | ✅ Limitation de portée |
| **Domain** | Limite le cookie à un domaine | `Domain=.example.com` | ✅ Contrôle de portée |
| **Max-Age** | Durée de vie en secondes | `Max-Age=3600` | ⏱️ Expiration automatique |
| **Expires** | Date d'expiration absolue | `Expires=Wed, 09 Jun 2021 10:18:14 GMT` | ⏱️ Expiration à date fixe |

**Valeurs SameSite :**
- **`Strict`** : Cookie jamais envoyé cross-site (le plus sécurisé)
- **`Lax`** : Cookie envoyé uniquement sur navigation top-level (par défaut moderne)
- **`None`** : Cookie toujours envoyé (nécessite `Secure`)

#### Exemple côté serveur (Express.js) :

```javascript
// Express.js - Configuration sécurisée
app.post('/login', (req, res) => {
  // Authentification réussie
  const sessionId = generateSecureSessionId();
  
  // Cookie de session sécurisé
  res.cookie('sessionId', sessionId, {
    httpOnly: true,     // Pas d'accès JavaScript
    secure: true,       // HTTPS uniquement
    sameSite: 'strict', // Protection CSRF
    maxAge: 3600000     // 1 heure en milliseconds
  });
  
  // Cookie de préférence (accessible côté client)
  res.cookie('theme', 'dark', {
    secure: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 3600000 // 30 jours
  });
  
  res.json({ success: true });
});

// Lecture côté serveur
app.get('/profile', (req, res) => {
  const sessionId = req.cookies.sessionId; // Accessible malgré HttpOnly
  const theme = req.cookies.theme;
  
  if (!sessionId || !validateSession(sessionId)) {
    return res.status(401).json({ error: 'Session invalide' });
  }
  
  res.json({ user: getUserFromSession(sessionId), theme });
});
```

#### Bonnes pratiques de sécurité :

```javascript
// ✅ Cookie de session sécurisé
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600

// ✅ Cookie de préférence utilisateur
Set-Cookie: theme=dark; Secure; SameSite=Lax; Path=/; Max-Age=2592000

// ✅ Cookie de tracking (si nécessaire)
Set-Cookie: analytics=xyz789; Secure; SameSite=None; Path=/; Max-Age=31536000

// ❌ Cookie non sécurisé (à éviter)
Set-Cookie: sessionId=abc123
```

**Pourquoi ces attributs sont cruciaux :**

1. **HttpOnly** empêche le vol de session via XSS :
   ```javascript
   // ❌ Impossible si HttpOnly est défini
   const stolenSession = document.cookie.match(/sessionId=([^;]+)/)[1];
   ```

2. **Secure** empêche l'interception sur HTTP :
   ```http
   // ✅ Cookie envoyé uniquement sur HTTPS
   GET /api/data HTTP/1.1
   Cookie: sessionId=abc123  // Seulement si HTTPS
   ```

3. **SameSite=Strict** empêche les attaques CSRF :
   ```html
   <!-- ❌ Cookie pas envoyé depuis un autre site -->
   <img src="https://monsite.com/transfer?amount=1000&to=attacker">
   ```

### 2.3. localStorage

Le localStorage permet de stocker des données de manière permanente jusqu'à ce qu'elles soient explicitement supprimées.

#### Caractéristiques :
- **Persistance** : Les données survivent à la fermeture du navigateur
- **Portée** : Partagé entre tous les onglets du même domaine
- **Synchrone** : API simple et synchrone
- **Capacité** : Généralement 5-10MB par origine

#### Exemple d'utilisation :

```javascript
// Stocker des données simples
localStorage.setItem('theme', 'dark');
localStorage.setItem('language', 'fr');

// Stocker des objets (sérialisation JSON nécessaire)
const userPreferences = {
  theme: 'dark',
  notifications: true,
  autoSave: false
};
localStorage.setItem('userPrefs', JSON.stringify(userPreferences));

// Lire des données
const theme = localStorage.getItem('theme');
console.log(theme); // "dark"

// Lire et parser un objet
const prefs = JSON.parse(localStorage.getItem('userPrefs'));
console.log(prefs.notifications); // true

// Supprimer une entrée
localStorage.removeItem('theme');

// Vider tout le localStorage
localStorage.clear();

// Vérifier l'existence d'une clé
if (localStorage.getItem('theme') !== null) {
  // La clé existe
}

// Itérer sur toutes les clés
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}: ${value}`);
}
```

#### Exemple pratique : Sauvegarde automatique de formulaire

```javascript
// Sauvegarde automatique d'un formulaire
const form = document.getElementById('article-form');
const titleInput = document.getElementById('title');
const contentTextarea = document.getElementById('content');

// Sauvegarder à chaque modification
titleInput.addEventListener('input', () => {
  localStorage.setItem('draft-title', titleInput.value);
});

contentTextarea.addEventListener('input', () => {
  localStorage.setItem('draft-content', contentTextarea.value);
});

// Restaurer au chargement de la page
window.addEventListener('load', () => {
  const savedTitle = localStorage.getItem('draft-title');
  const savedContent = localStorage.getItem('draft-content');
  
  if (savedTitle) titleInput.value = savedTitle;
  if (savedContent) contentTextarea.value = savedContent;
});

// Nettoyer après envoi réussi
form.addEventListener('submit', (e) => {
  // Après envoi réussi...
  localStorage.removeItem('draft-title');
  localStorage.removeItem('draft-content');
});
```

### 2.4. sessionStorage

Le sessionStorage fonctionne comme localStorage mais les données ne persistent que durant la session du navigateur (onglet).

#### Caractéristiques :
- **Durée de vie** : Jusqu'à la fermeture de l'onglet
- **Portée** : Isolé par onglet
- **API identique** à localStorage

#### Exemple d'utilisation :

```javascript
// API identique à localStorage
sessionStorage.setItem('currentStep', '3');
sessionStorage.setItem('formData', JSON.stringify(formDataObject));

// Exemple : Wizard multi-étapes
class FormWizard {
  constructor() {
    this.currentStep = parseInt(sessionStorage.getItem('currentStep')) || 1;
    this.loadSavedData();
  }
  
  saveStep(stepData) {
    sessionStorage.setItem(`step-${this.currentStep}`, JSON.stringify(stepData));
    sessionStorage.setItem('currentStep', this.currentStep);
  }
  
  nextStep() {
    this.currentStep++;
    sessionStorage.setItem('currentStep', this.currentStep);
  }
  
  loadSavedData() {
    // Charger les données de toutes les étapes précédentes
    for (let i = 1; i <= this.currentStep; i++) {
      const stepData = sessionStorage.getItem(`step-${i}`);
      if (stepData) {
        // Restaurer les données de l'étape
        this.populateStep(i, JSON.parse(stepData));
      }
    }
  }
}
```

### 2.5. IndexedDB

IndexedDB est une base de données NoSQL côté client pour stocker de grandes quantités de données structurées.

#### Caractéristiques :
- **Capacité élevée** : Peut stocker plusieurs centaines de MB
- **API asynchrone** : Basée sur des événements ou des Promises
- **Transactions** : Support des transactions ACID
- **Index** : Permet de créer des index pour des requêtes efficaces
- **Types de données** : Supporte les objets JavaScript, Blobs, ArrayBuffers

#### Exemple basique d'IndexedDB :

```javascript
// Ouverture de la base de données
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TodoAppDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Créer un object store (table)
      if (!db.objectStoreNames.contains('todos')) {
        const todoStore = db.createObjectStore('todos', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        
        // Créer des index
        todoStore.createIndex('completed', 'completed', { unique: false });
        todoStore.createIndex('created', 'created', { unique: false });
      }
    };
  });
}

// Classe pour gérer les todos avec IndexedDB
class TodoDB {
  constructor() {
    this.db = null;
  }
  
  async init() {
    this.db = await openDatabase();
  }
  
  async addTodo(todo) {
    const transaction = this.db.transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');
    
    const todoWithDate = {
      ...todo,
      created: new Date(),
      completed: false
    };
    
    return new Promise((resolve, reject) => {
      const request = store.add(todoWithDate);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getAllTodos() {
    const transaction = this.db.transaction(['todos'], 'readonly');
    const store = transaction.objectStore('todos');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async updateTodo(id, updates) {
    const transaction = this.db.transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');
    
    // D'abord récupérer l'objet existant
    const getRequest = store.get(id);
    
    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const todo = getRequest.result;
        if (todo) {
          Object.assign(todo, updates);
          const updateRequest = store.put(todo);
          updateRequest.onsuccess = () => resolve(todo);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Todo not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }
  
  async deleteTodo(id) {
    const transaction = this.db.transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  async getCompletedTodos() {
    const transaction = this.db.transaction(['todos'], 'readonly');
    const store = transaction.objectStore('todos');
    const index = store.index('completed');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(true); // true = completed
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Utilisation
async function example() {
  const todoDB = new TodoDB();
  await todoDB.init();
  
  // Ajouter des todos
  await todoDB.addTodo({ text: 'Apprendre IndexedDB', priority: 'high' });
  await todoDB.addTodo({ text: 'Créer une app todo', priority: 'medium' });
  
  // Récupérer tous les todos
  const todos = await todoDB.getAllTodos();
  console.log('Tous les todos:', todos);
  
  // Marquer comme complété
  if (todos.length > 0) {
    await todoDB.updateTodo(todos[0].id, { completed: true });
  }
  
  // Récupérer les todos complétés
  const completed = await todoDB.getCompletedTodos();
  console.log('Todos complétés:', completed);
}
```

### 2.6. Cache API

L'API Cache est principalement utilisée dans le contexte des Service Workers et des PWA pour mettre en cache des ressources réseau.

#### Exemple d'utilisation :

```javascript
// Dans un service worker ou une page
async function cacheResources() {
  // Ouvrir un cache nommé
  const cache = await caches.open('app-cache-v1');
  
  // Mettre en cache des ressources
  await cache.addAll([
    '/',
    '/css/style.css',
    '/js/app.js',
    '/api/data'
  ]);
}

// Récupérer depuis le cache
async function getFromCache(request) {
  const cache = await caches.open('app-cache-v1');
  const response = await cache.match(request);
  return response || fetch(request);
}

// Stratégie cache-first
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Si pas en cache, fetch et mettre en cache
  const response = await fetch(request);
  const cache = await caches.open('app-cache-v1');
  cache.put(request, response.clone());
  return response;
}
```

### 2.7. Comparaison et choix du bon mécanisme

#### Quand utiliser chaque type de stockage :

**Cookies** :
- ✅ Authentification (tokens JWT)
- ✅ Préférences simples à envoyer au serveur
- ✅ Suivi des sessions
- ❌ Stockage de grandes quantités de données
- ❌ Données qui ne doivent pas être envoyées au serveur

**localStorage** :
- ✅ Préférences utilisateur (thème, langue)
- ✅ Cache de données non-critiques
- ✅ État de l'application entre sessions
- ✅ Brouillons sauvegardés automatiquement
- ❌ Données sensibles (pas de chiffrement)
- ❌ Données partagées entre onglets avec mise à jour temps réel

**sessionStorage** :
- ✅ État temporaire d'un formulaire multi-étapes
- ✅ Données de navigation dans une session
- ✅ Cache temporaire pour une session
- ❌ Données qui doivent persister après fermeture

**IndexedDB** :
- ✅ Applications hors-ligne complexes
- ✅ Stockage de grandes quantités de données structurées
- ✅ Cache sophistiqué avec requêtes
- ✅ Historique local détaillé
- ❌ Données simples (overkill)
- ❌ Quand vous avez besoin d'une API synchrone simple

#### Exemple d'architecture hybride :

```javascript
class DataManager {
  constructor() {
    this.initIndexedDB();
  }
  
  // Préférences utilisateur -> localStorage
  saveUserPreference(key, value) {
    localStorage.setItem(`pref_${key}`, JSON.stringify(value));
  }
  
  getUserPreference(key, defaultValue = null) {
    const value = localStorage.getItem(`pref_${key}`);
    return value ? JSON.parse(value) : defaultValue;
  }
  
  // Session temporaire -> sessionStorage
  saveSessionData(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  
  getSessionData(key) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  
  // Données complexes -> IndexedDB
  async saveComplexData(storeName, data) {
    // Utiliser IndexedDB pour des données complexes
    const db = await this.getDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return store.add(data);
  }
  
  // Authentication token -> Cookie sécurisé
  setAuthToken(token) {
    document.cookie = `authToken=${token}; secure; httpOnly; sameSite=strict; path=/`;
  }
}
```

### 2.8. Gestion des quotas et erreurs

Il est important de gérer les limitations de stockage :

```javascript
// Vérifier l'espace disponible (API expérimentale)
if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate().then(estimate => {
    console.log(`Utilisé: ${estimate.usage} bytes`);
    console.log(`Disponible: ${estimate.quota} bytes`);
    console.log(`Pourcentage utilisé: ${(estimate.usage / estimate.quota * 100).toFixed(2)}%`);
  });
}

// Gestion des erreurs de stockage
function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('Quota de stockage dépassé');
      // Nettoyer des données anciennes ou non-critiques
      cleanupOldData();
      return false;
    }
    console.error('Erreur de stockage:', error);
    return false;
  }
}

function cleanupOldData() {
  // Supprimer les données anciennes ou non-critiques
  const keysToCheck = Object.keys(localStorage);
  keysToCheck.forEach(key => {
    if (key.startsWith('cache_') || key.startsWith('temp_')) {
      localStorage.removeItem(key);
    }
  });
}
```

Cette section vous donne maintenant une compréhension complète des différents mécanismes de stockage côté client. Dans la prochaine section, nous verrons comment intégrer ces concepts dans une vraie application client lourd.

### 💻 Démonstration Interactive

Une démonstration complète et interactive est disponible pour tester tous ces concepts :

**📁 Emplacement :** `code/seance5/demo-stockage/` ([📁 Voir sur GitHub](https://github.com/fpluquet/web_client_serveur/tree/main/code/seance5/demo-stockage))

**🚀 Pour lancer la démonstration :**
```bash
cd code/seance5/demo-stockage
python -m http.server 8000
# Puis ouvrir http://localhost:8000
```

Cette démonstration vous permet de :
- ✅ Tester tous les types de stockage côté client
- ✅ Comparer leur comportement en temps réel
- ✅ Voir des exemples pratiques (sauvegarde automatique)
- ✅ Comprendre les limitations et quotas
- ✅ Expérimenter avec la persistance et la portée

**💡 Expériences recommandées :**
1. Sauvegardez des données puis rafraîchissez la page
2. Ouvrez plusieurs onglets pour tester la portée
3. Fermez/rouvrez le navigateur pour tester la persistance
4. Utilisez la sauvegarde automatique avec de longs textes

## 3. Client lourd avec API REST Express

Pour illustrer un vrai client lourd, créons une application todolist simple qui communique avec un serveur Express via une API REST. Cette architecture sépare clairement le frontend (client lourd) du backend (API).

### Structure du projet

```
todolist-client-lourd/
├── server/
│   ├── package.json
│   └── server.js
├── client/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
└── README.md
```

[📁 **Voir le projet complet sur GitHub**](https://github.com/fpluquet/web_client_serveur/tree/main/code/seance5/todolist-client-lourd)

### Côté serveur (API REST avec Express)

Créons d'abord notre serveur Express qui fournira une API REST simple :

::: details server/server.js
<!-- @include:start todolist-client-lourd/server/server.js -->
```javascript
// server/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Données en mémoire (dans un vrai projet, cela viendrait d'une base de données)
let todos = [
  { id: 1, text: 'Apprendre JavaScript', completed: false },
  { id: 2, text: 'Créer une API REST', completed: true },
  { id: 3, text: 'Développer le client lourd', completed: false }
];

let nextId = 4;

// Routes API
// GET - Récupérer toutes les todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST - Créer une nouvelle todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Le texte de la todo est requis' });
  }
  
  const newTodo = {
    id: nextId++,
    text: text.trim(),
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT - Mettre à jour une todo (marquer comme complétée/non complétée)
app.put('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = todos.find(t => t.id === todoId);
  
  if (!todo) {
    return res.status(404).json({ message: 'Todo non trouvée' });
  }
  
  const { completed } = req.body;
  if (completed !== undefined) {
    todo.completed = completed;
  }
  
  res.json(todo);
});

// DELETE - Supprimer une todo
app.delete('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === todoId);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo non trouvée' });
  }
  
  const deletedTodo = todos.splice(todoIndex, 1)[0];
  res.json(deletedTodo);
});

// Route pour servir le client
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
```
<!-- @include:end todolist-client-lourd/server/server.js -->
:::

::: details server/package.json
<!-- @include:start todolist-client-lourd/server/package.json -->
```json
{
  "name": "todolist-api",
  "version": "1.0.0",
  "description": "API REST simple pour todolist",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```
<!-- @include:end todolist-client-lourd/server/package.json -->
:::

### Côté client (Application JavaScript)

Maintenant, créons le client lourd qui va consommer notre API :

::: details client/index.html
<!-- @include:start todolist-client-lourd/client/index.html -->
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TodoList - Client Lourd</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>Ma TodoList</h1>
      <p>Exemple de client lourd avec API REST</p>
    </header>

    <main>
      <!-- Formulaire pour ajouter une todo -->
      <div class="add-todo-section">
        <form id="add-todo-form">
          <input type="text" id="todo-input" placeholder="Nouvelle tâche..." required>
          <button type="submit">Ajouter</button>
        </form>
      </div>

      <!-- Liste des todos -->
      <div class="todos-section">
        <div class="todos-header">
          <h2>Mes tâches</h2>
          <div class="todos-count">
            <span id="total-count">0</span> tâche(s) - 
            <span id="pending-count">0</span> en cours
          </div>
        </div>
        <div id="todos-container">
          <p class="loading">Chargement des tâches...</p>
        </div>
      </div>
    </main>

    <!-- Zone de notifications -->
    <div id="notifications"></div>
  </div>

  <script src="js/app.js"></script>
</body>
</html>
```
<!-- @include:end todolist-client-lourd/client/index.html -->
:::

::: details client/js/app.js
<!-- @include:start todolist-client-lourd/client/js/app.js -->
```javascript
// client/js/app.js
class TodoApp {
  constructor() {
    this.apiUrl = 'http://localhost:3001/api';
    this.todos = [];
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadTodos();
  }

  bindEvents() {
    // Formulaire d'ajout de todo
    document.getElementById('add-todo-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTodo();
    });
  }

  // Appels API
  async fetchAPI(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      this.showNotification('Erreur de communication avec le serveur', 'error');
      throw error;
    }
  }

  async loadTodos() {
    try {
      this.todos = await this.fetchAPI('/todos');
      this.renderTodos();
      this.updateCounts();
    } catch (error) {
      console.error('Erreur lors du chargement des todos:', error);
      document.getElementById('todos-container').innerHTML = 
        '<p class="error">Erreur lors du chargement des tâches</p>';
    }
  }

  async addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    
    if (!text) return;

    try {
      const newTodo = await this.fetchAPI('/todos', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      
      this.todos.push(newTodo);
      this.renderTodos();
      this.updateCounts();
      input.value = '';
      this.showNotification('Tâche ajoutée avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  }

  async toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const updatedTodo = await this.fetchAPI(`/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !todo.completed })
      });
      
      // Mettre à jour localement
      const index = this.todos.findIndex(t => t.id === id);
      this.todos[index] = updatedTodo;
      
      this.renderTodos();
      this.updateCounts();
      this.showNotification('Tâche mise à jour', 'success');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  }

  async deleteTodo(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }

    try {
      await this.fetchAPI(`/todos/${id}`, { method: 'DELETE' });
      
      // Supprimer localement
      this.todos = this.todos.filter(t => t.id !== id);
      
      this.renderTodos();
      this.updateCounts();
      this.showNotification('Tâche supprimée', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }

  renderTodos() {
    const container = document.getElementById('todos-container');
    
    if (this.todos.length === 0) {
      container.innerHTML = '<p class="no-todos">Aucune tâche pour le moment</p>';
      return;
    }

    const todosHTML = this.todos.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}">
        <input 
          type="checkbox" 
          ${todo.completed ? 'checked' : ''} 
          onchange="app.toggleTodo(${todo.id})"
          class="todo-checkbox"
        >
        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
        <button 
          onclick="app.deleteTodo(${todo.id})" 
          class="delete-btn"
          title="Supprimer"
        >
          ✕
        </button>
      </div>
    `).join('');

    container.innerHTML = todosHTML;
  }

  updateCounts() {
    const total = this.todos.length;
    const pending = this.todos.filter(t => !t.completed).length;
    
    document.getElementById('total-count').textContent = total;
    document.getElementById('pending-count').textContent = pending;
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const container = document.getElementById('notifications');
    container.appendChild(notification);
    
    // Faire disparaître la notification après 3 secondes
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialiser l'application
const app = new TodoApp();
```
<!-- @include:end todolist-client-lourd/client/js/app.js -->
:::

::: details client/css/style.css
<!-- @include:start todolist-client-lourd/client/css/style.css -->
```css
/* client/css/style.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

header p {
  color: #7f8c8d;
  font-size: 0.9em;
}

main {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.add-todo-section {
  padding: 25px;
  background: #3498db;
  color: white;
}

#add-todo-form {
  display: flex;
  gap: 15px;
}

#todo-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  outline: none;
}

#todo-input:focus {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

button[type="submit"] {
  padding: 12px 24px;
  background: #2980b9;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: background 0.3s;
}

button[type="submit"]:hover {
  background: #21618c;
}

.todos-section {
  padding: 25px;
}

.todos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ecf0f1;
}

.todos-header h2 {
  color: #2c3e50;
}

.todos-count {
  color: #7f8c8d;
  font-size: 0.9em;
}

#todos-container {
  min-height: 100px;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ecf0f1;
  transition: all 0.3s;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background: #f8f9fa;
  margin: 0 -15px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 8px;
}

.todo-checkbox {
  margin-right: 15px;
  transform: scale(1.2);
  cursor: pointer;
}

.todo-text {
  flex: 1;
  font-size: 1em;
  transition: all 0.3s;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #95a5a6;
}

.delete-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  opacity: 0.7;
}

.delete-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.loading, .error, .no-todos {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-style: italic;
}

.error {
  color: #e74c3c;
}

#notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.notification {
  background: #2ecc71;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

.notification.error {
  background: #e74c3c;
}

.notification.info {
  background: #3498db;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  #add-todo-form {
    flex-direction: column;
  }
  
  .todos-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
```
<!-- @include:end todolist-client-lourd/client/css/style.css -->
:::

### Instructions de démarrage

1. **Installation des dépendances du serveur :** ([📁 Voir sur GitHub](https://github.com/fpluquet/web_client_serveur/tree/main/code/seance5/todolist-client-lourd))
   ```bash
   cd code/seance5/todolist-client-lourd/server
   npm install
   ```

2. **Démarrage du serveur :**
   ```bash
   npm start
   # ou pour le développement avec redémarrage automatique :
   npm run dev
   ```

3. **Accès à l'application :**
   Ouvrez votre navigateur et allez à `http://localhost:3000`

### Exercice 3.1: Étendre l'application todolist

1. Ajoutez la possibilité de modifier le texte d'une todo existante
2. Implémentez un système de filtrage (toutes, complétées, en cours)
3. Ajoutez une fonctionnalité "Tout marquer comme complété"
4. Créez un système de catégories pour organiser les todos

