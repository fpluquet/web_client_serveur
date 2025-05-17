// Exemple de CRUD API pour la séance 2
const express = require('express');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Stockage temporaire des utilisateurs (à remplacer par une BD)
let users = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com' }
];

// Routes CRUD pour les utilisateurs
// GET - Récupérer tous les utilisateurs
app.get('/users', (req, res) => {
  res.json(users);
});

// GET - Récupérer un utilisateur spécifique
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// POST - Créer un utilisateur
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = { 
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name, 
    email 
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT - Mettre à jour un utilisateur
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email } = req.body;
  
  if (!name && !email) {
    return res.status(400).json({ error: 'At least one field (name or email) is required' });
  }
  
  users[userIndex] = { 
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email
  };
  
  res.json(users[userIndex]);
});

// DELETE - Supprimer un utilisateur
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = users[userIndex];
  users = users.filter(u => u.id !== id);
  
  res.json({ message: 'User deleted successfully', user: deletedUser });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
