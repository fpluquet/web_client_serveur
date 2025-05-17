# Séance 1 : Introduction aux technologies web backend

## 1. Théorie

### 1.1 Architecture Client-Serveur

Le web fonctionne selon une architecture client-serveur où :
- Le **client** est le navigateur web qui envoie des requêtes et affiche les réponses
- Le **serveur** est l'application qui reçoit des requêtes et renvoie des réponses

```
Client (Navigateur) <---HTTP---> Serveur (Application backend)
```

### 1.2 Le protocole HTTP

HTTP (HyperText Transfer Protocol) est le protocole de communication utilisé sur le web. Ses caractéristiques principales sont :

- **Sans état** (stateless) : chaque requête est indépendante
- **Basé sur des requêtes et réponses** structurées
- **Méthodes HTTP** : GET, POST, PUT, DELETE, etc.
- **Codes de statut** : 200 (OK), 404 (Not Found), 500 (Server Error), etc.

### 1.3 Introduction aux technologies backend

#### Node.js et Express
- **Node.js** : environnement d'exécution JavaScript côté serveur
- **Express** : framework web minimaliste pour Node.js
- **Avantages** : Performance, JavaScript partout, écosystème riche (npm)

#### PHP
- Langage de script côté serveur spécialement conçu pour le web
- Facile à apprendre et largement déployé
- **Avantages** : Large adoption, documentation exhaustive, hébergement facile

## 2. Application

### 2.1 Mise en place d'un serveur Node.js/Express

::: details Code illustré (synchronisé depuis le fichier source)
```javascript
// Importer Express
const express = require('express');

// Créer une instance d'application
const app = express();

// Définir une route simple
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

> Le code complet se trouve dans `/code/seance1/nodejs/app.js`
:::

#### Points clés :
- Express simplifie la gestion des routes HTTP
- Les callbacks sont utilisés pour traiter les requêtes
- Le serveur écoute sur un port spécifique

### 2.2 Mise en place d'un serveur PHP

::: details Code illustré (synchronisé depuis le fichier source)
```php
<?php
// index.php - Point d'entrée simple

// Déterminer quelle page afficher
$route = $_GET['route'] ?? 'home';

// Une fonction simple pour router les requêtes
function handleRoute($route) {
    switch ($route) {
        case 'home':
            return 'Bienvenue sur la page d\'accueil!';
        case 'about':
            return 'À propos de nous';
        default:
            header('HTTP/1.0 404 Not Found');
            return 'Page non trouvée';
    }
}

// Afficher le contenu
echo handleRoute($route);
?>
```

> Le code complet se trouve dans `/code/seance1/php/index.php`
:::

#### Points clés :
- PHP est directement intégré aux pages web
- $_GET, $_POST pour accéder aux données de requête
- La fonction `header()` permet de modifier les en-têtes HTTP

## 3. Exercices

### Exercice 1.1 : Création d'un serveur simple

**Objectif** : Créer un serveur HTTP qui répond "Hello World" à la requête de la racine du site.

**Consignes** :
1. En Node.js/Express :
   - Créez un projet Node.js avec npm
   - Installez Express
   - Configurez un serveur sur le port 3000
   - Définissez une route pour l'URL racine ('/')

2. En PHP :
   - Créez un fichier index.php
   - Configurez-le pour qu'il réponde "Hello World" en texte brut

> Les solutions complètes sont disponibles dans `/solutions/seance1/nodejs/` et `/solutions/seance1/php/`

### Exercice 1.2 : Routage simple

**Objectif** : Créer plusieurs routes dans votre application.

**Consignes** :
1. Créez un serveur avec les routes suivantes :
   - `/` : Page d'accueil avec le texte "Accueil"
   - `/contact` : Page de contact avec le texte "Contactez-nous"
   - `/about` : Page à propos avec le texte "À propos"
   - Pour toute autre route, retournez un message "404 - Page non trouvée"

2. Implémentez cette logique en Node.js/Express et en PHP

> Les solutions complètes sont disponibles dans `/solutions/seance1/nodejs/` et `/solutions/seance1/php/`