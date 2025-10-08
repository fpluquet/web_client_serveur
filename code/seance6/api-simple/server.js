const express = require('express');
const app = express();

// Middleware pour parser JSON
app.use(express.json());

// Données en mémoire (en réalité, on utiliserait une base de données)
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

let nextId = 3;

// Route GET - Récupérer tous les utilisateurs
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: users
  });
});

// Route GET - Récupérer un utilisateur par ID
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// Route POST - Créer un nouvel utilisateur
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validation simple
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Le nom et l\'email sont requis'
    });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser
  });
});

// Route PUT - Modifier un utilisateur
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }
  
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Le nom et l\'email sont requis'
    });
  }
  
  users[userIndex] = { id, name, email };
  
  res.json({
    success: true,
    data: users[userIndex]
  });
});

// Route DELETE - Supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Utilisateur supprimé',
    data: deletedUser
  });
});

// Route par défaut
app.get('/', (req, res) => {
  res.json({
    message: 'API Simple - Gestion d\'utilisateurs',
    endpoints: {
      'GET /api/users': 'Récupérer tous les utilisateurs',
      'GET /api/users/:id': 'Récupérer un utilisateur',
      'POST /api/users': 'Créer un utilisateur',
      'PUT /api/users/:id': 'Modifier un utilisateur',
      'DELETE /api/users/:id': 'Supprimer un utilisateur'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}`);
});