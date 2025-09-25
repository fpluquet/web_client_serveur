# Architecture Client Lourd

## 1. Mise en place d'une SPA basique avec JavaScript vanilla

Créons une application à page unique simple sans framework :

```html
<!-- index.html -->
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
      // Mettre ���� jour l'URL sans recharger la page (navigation historique)
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

### Exercice 1.1: Étendre l'application SPA

Étendez l'application pour ajouter une nouvelle page "Produits" qui affiche une liste de produits à partir d'un API simulé.

## 2. Client lourd avec API REST Express

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

### Côté serveur (API REST avec Express)

Créons d'abord notre serveur Express qui fournira une API REST simple :

```javascript
// server/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

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

```json
// server/package.json
{
  "name": "todolist-api",
  "version": "1.0.0",
  "description": "API REST simple pour todolist",
  "main": "server.js",
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

### Côté client (Application JavaScript)

Maintenant, créons le client lourd qui va consommer notre API :

```html
<!-- client/index.html -->
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

```javascript
// client/js/app.js
class TodoApp {
  constructor() {
    this.apiUrl = 'http://localhost:3000/api';
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

### Instructions de démarrage

1. **Installation des dépendances du serveur :**
   ```bash
   cd server
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

### Exercice 2.1: Étendre l'application todolist

1. Ajoutez la possibilité de modifier le texte d'une todo existante
2. Implémentez un système de filtrage (toutes, complétées, en cours)
3. Ajoutez une fonctionnalité "Tout marquer comme complété"
4. Créez un système de catégories pour organiser les todos
