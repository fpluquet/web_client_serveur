// Exemple d'API sécurisée avec JWT pour la séance 3
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// Secret pour signer les JWT
const JWT_SECRET = 'votre-secret-jwt-super-securise';

// Middleware pour parser le JSON
app.use(express.json());

// Base de données simulée des utilisateurs
let users = [
  { id: 1, username: 'alice', password: 'password123', email: 'alice@example.com' },
  { id: 2, username: 'bob', password: 'secret456', email: 'bob@example.com' }
];

// Middleware d'authentification
const authenticate = (req, res, next) => {
  // Récupérer le token du header Authorization
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes d'authentification
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  // Rechercher l'utilisateur
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Créer un token JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});

app.post('/auth/register', (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, password and email are required' });
  }
  
  // Vérifier si l'utilisateur existe déjà
  if (users.some(u => u.username === username || u.email === email)) {
    return res.status(409).json({ error: 'Username or email already exists' });
  }
  
  // Créer un nouvel utilisateur
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username,
    password, // NOTE: Dans une application réelle, on hasherait ce mot de passe
    email
  };
  
  users.push(newUser);
  
  // Créer un token JWT
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, email: newUser.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.status(201).json({ user: { id: newUser.id, username, email }, token });
});

// Route protégée - infos de l'utilisateur courant
app.get('/auth/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Route protégée - ressource sécurisée
app.get('/protected-resource', authenticate, (req, res) => {
  res.json({ 
    message: 'This is a protected resource',
    data: 'Secret information',
    user: req.user
  });
});

// Middleware de gestion d'erreurs centralisé
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
