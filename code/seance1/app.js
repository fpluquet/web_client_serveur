// Serveur Node.js/Express illustrant les approches client léger et client lourd
const express = require('express');
const path = require('path');
const app = express();

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());
// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Base de données simulée des utilisateurs
let users = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "User" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "User" }
];

// -------- ROUTES POUR CLIENT LÉGER --------
// Pages complètement générées côté serveur

app.get('/thin', (req, res) => {
  // Génération d'une page HTML complète côté serveur
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Client Léger</title>
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
      <h1>Liste d'utilisateurs (Client Léger)</h1>
      <p>Cette page est entièrement générée par le serveur</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>`;
  
  // Générer les lignes du tableau d'utilisateurs
  users.forEach(user => {
    html += `
          <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
              <a href="/thin/users/${user.id}">Voir</a>
            </td>
          </tr>`;
  });
  
  html += `
        </tbody>
      </table>
      <p>
        <a href="/">Retour à l'accueil</a>
      </p>
    </body>
    </html>`;
  
  res.send(html);
});

app.get('/thin/users/:id', (req, res) => {
  // Rechercher l'utilisateur par ID
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Erreur</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body>
        <h1>Erreur 404</h1>
        <p>Utilisateur non trouvé</p>
        <p><a href="/thin">Retour à la liste</a></p>
      </body>
      </html>`);
  }
  
  // Générer une page HTML complète pour afficher les détails de l'utilisateur
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Détails de l'utilisateur</title>
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
      <h1>Détails de l'utilisateur</h1>
      <div class="user-details">
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Nom:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Rôle:</strong> ${user.role}</p>
      </div>
      <p><a href="/thin">Retour à la liste</a></p>
    </body>
    </html>`;
  
  res.send(html);
});

// -------- ROUTES POUR CLIENT LOURD (API) --------
// API qui renvoie uniquement des données JSON

// Route API pour lister tous les utilisateurs
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Route API pour obtenir un utilisateur spécifique
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  res.json(user);
});

// Route API pour créer un nouvel utilisateur
app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Nom et email requis' });
  }
  
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    role: role || 'User'
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Route API pour mettre à jour un utilisateur
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  const { name, email, role } = req.body;
  
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  
  res.json(user);
});

// Route API pour supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  
  res.json({ message: 'Utilisateur supprimé', user: deletedUser });
});

// Route principale pour servir la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
