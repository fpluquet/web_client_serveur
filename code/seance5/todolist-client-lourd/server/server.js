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