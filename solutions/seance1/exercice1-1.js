// Solution pour l'exercice 1.1 - Serveur simple

const express = require('express');
const app = express();

// Route racine qui renvoie "Hello World"
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Démarrer le serveur sur le port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
