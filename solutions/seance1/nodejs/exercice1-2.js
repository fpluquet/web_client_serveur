// Solution pour l'exercice 1.2 - Routage simple

const express = require('express');
const app = express();

// Route racine
app.get('/', (req, res) => {
  res.send('Accueil');
});

// Route contact
app.get('/contact', (req, res) => {
  res.send('Contactez-nous');
});

// Route about
app.get('/about', (req, res) => {
  res.send('À propos');
});

// Gestion des routes non trouvées (doit être placé après toutes les autres routes)
app.use((req, res) => {
  res.status(404).send('404 - Page non trouvée');
});

// Démarrer le serveur sur le port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
