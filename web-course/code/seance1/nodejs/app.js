// Exemple de serveur Express simple pour la séance 1

const express = require('express');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Route racine
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Route contact
app.get('/contact', (req, res) => {
  res.send('Contactez-nous à contact@example.com');
});

// Route about
app.get('/about', (req, res) => {
  res.send('À propos de notre application web');
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).send('404 - Page non trouvée');
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
