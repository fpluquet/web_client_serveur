# Progressive Web Apps (PWA)

## 1. Introduction aux PWA

### Qu'est-ce qu'une Progressive Web App ?

Une Progressive Web App (PWA) représente une évolution majeure dans le développement web moderne. Il s'agit d'une application web qui tire parti des dernières technologies web pour offrir une expérience utilisateur qui rivalise avec celle des applications natives mobiles. Le terme "Progressive" n'est pas choisi au hasard : il reflète la philosophie d'amélioration progressive qui permet à ces applications de fonctionner sur tous les appareils et navigateurs, tout en offrant des fonctionnalités avancées là où elles sont supportées.

L'idée derrière les PWA est née d'un constat simple : les utilisateurs passent la majorité de leur temps sur mobile, mais ils préfèrent souvent utiliser des applications natives plutôt que des sites web mobiles. Cependant, développer et maintenir des applications natives pour différentes plateformes (iOS, Android, Windows) représente un coût et une complexité considérables. Les PWA proposent une solution élégante à ce dilemme en permettant de développer une seule application web qui peut se comporter comme une application native.

Le concept de PWA a été introduit par Google en 2015, avec l'objectif de combler le fossé entre le web et les applications mobiles. Depuis, cette technologie a été adoptée par de nombreuses grandes entreprises comme Twitter, Pinterest, Starbucks, et même Microsoft qui intègre désormais les PWA dans son Microsoft Store.

### Caractéristiques principales

Les PWA se distinguent par plusieurs caractéristiques fondamentales qui les rendent particulièrement attractives tant pour les développeurs que pour les utilisateurs finaux :

**Progressive** : Cette caractéristique est au cœur de la philosophie PWA. Elle signifie que l'application fonctionne pour tous les utilisateurs, quel que soit leur navigateur ou leur appareil. L'application s'adapte automatiquement aux capacités disponibles. Par exemple, sur un navigateur moderne, elle pourra utiliser les notifications push et fonctionner hors ligne, tandis que sur un navigateur plus ancien, elle se comportera comme un site web classique mais restera parfaitement fonctionnelle.

**Responsive** : Dans un monde où les utilisateurs accèdent au web depuis une multitude d'appareils (smartphones, tablettes, ordinateurs portables, écrans ultra-larges), la capacité d'adaptation est cruciale. Les PWA sont conçues dès le départ pour s'adapter à tous les facteurs de forme et toutes les tailles d'écran. Cela va au-delà du simple responsive design : il s'agit de repenser l'interface utilisateur pour qu'elle soit optimale sur chaque type d'appareil.

**Offline** : L'une des fonctionnalités les plus révolutionnaires des PWA est leur capacité à fonctionner sans connexion internet. Grâce aux Service Workers, ces applications peuvent mettre en cache les ressources essentielles et même certaines données, permettant aux utilisateurs de continuer à utiliser l'application même en cas de connexion instable ou inexistante. Cette fonctionnalité est particulièrement précieuse dans les zones où la connectivité internet est limitée.

**App-like** : Les PWA offrent une expérience utilisateur qui mimique celle des applications natives. Cela inclut une navigation fluide, des transitions animées, une interface utilisateur cohérente, et la possibilité de masquer la barre d'adresse du navigateur pour une immersion totale. L'utilisateur ne devrait pas pouvoir distinguer une PWA bien conçue d'une application native.

**Secure** : La sécurité est une priorité absolue pour les PWA. Elles ne peuvent fonctionner que via HTTPS, garantissant que toutes les communications entre l'application et le serveur sont chiffrées. Cette exigence protège non seulement les données des utilisateurs, mais assure également l'intégrité des Service Workers qui sont au cœur du fonctionnement des PWA.

**Installable** : Contrairement aux sites web traditionnels, les PWA peuvent être "installées" sur l'écran d'accueil de l'appareil de l'utilisateur. Une fois installée, l'application apparaît comme n'importe quelle autre application native, avec sa propre icône, et peut être lancée directement sans passer par un navigateur web. Cette fonctionnalité améliore considérablement l'engagement des utilisateurs.

**Re-engageable** : Les PWA peuvent envoyer des notifications push pour réengager les utilisateurs, même lorsque l'application n'est pas ouverte. Cette capacité, traditionnellement réservée aux applications natives, permet aux développeurs web de maintenir un lien constant avec leurs utilisateurs et d'améliorer significativement la rétention.

## 2. Les composants essentiels d'une PWA

Pour qu'une application web soit considérée comme une PWA, elle doit intégrer plusieurs composants techniques spécifiques. Ces composants travaillent ensemble pour créer l'expérience utilisateur caractéristique des PWA.

### 2.1 Le Web App Manifest

Le Web App Manifest est le document d'identité de votre PWA. Il s'agit d'un simple fichier JSON qui contient toutes les métadonnées nécessaires pour que les navigateurs comprennent comment traiter votre application lorsqu'elle est installée sur un appareil.

Ce fichier joue un rôle crucial dans la transformation de votre site web en application installable. Il indique au navigateur comment afficher l'application lorsqu'elle est lancée depuis l'écran d'accueil, quelle icône utiliser, quelles couleurs adopter pour l'interface, et bien d'autres détails importants.

#### Structure détaillée du manifest.json

```json
{
  "name": "Mon Application PWA Complète",
  "short_name": "MonApp",
  "description": "Une description détaillée de mon application qui explique ses fonctionnalités principales",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "lang": "fr-FR",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile-screenshot.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/desktop-screenshot.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "categories": ["productivity", "utilities"],
  "shortcuts": [
    {
      "name": "Nouvelle tâche",
      "short_name": "Nouvelle",
      "description": "Créer une nouvelle tâche rapidement",
      "url": "/new-task",
      "icons": [
        {
          "src": "/icons/new-task-icon.png",
          "sizes": "192x192"
        }
      ]
    }
  ]
}
```

#### Explication détaillée des propriétés

**name et short_name** : Le nom complet est utilisé dans les contextes où l'espace le permet (comme l'écran de démarrage), tandis que le nom court est utilisé sur l'écran d'accueil où l'espace est limité. Il est recommandé de garder le nom court sous 12 caractères pour éviter qu'il soit tronqué.

**start_url** : Cette propriété définit l'URL qui sera chargée lorsque l'utilisateur lance l'application depuis l'écran d'accueil. Elle peut inclure des paramètres de requête pour le tracking analytics, par exemple : `"start_url": "/?utm_source=pwa"`.

**display** : Cette propriété contr��le l'apparence de l'application :
- `"standalone"` : L'application ressemble à une app native, sans interface de navigateur
- `"fullscreen"` : L'application utilise tout l'écran disponible
- `"minimal-ui"` : Interface de navigateur minimale (boutons retour/avant)
- `"browser"` : Affichage dans un onglet de navigateur normal

**background_color et theme_color** : Ces couleurs définissent l'apparence visuelle de l'application. La couleur de fond est utilisée pour l'écran de démarrage, tandis que la couleur de thème influence la barre d'état du système et autres éléments d'interface.

**icons** : Un tableau d'icônes pour différentes tailles. Les tailles importantes incluent 192px et 512px qui sont requises par les spécifications PWA. La propriété `purpose` peut être `"any"`, `"maskable"`, ou `"monochrome"`. Les icônes maskables s'adaptent automatiquement aux différents styles d'icônes des systèmes d'exploitation.

**screenshots** : Nouveauté récente qui permet d'afficher des captures d'écran de l'application dans les interfaces d'installation, rendant l'application plus attrayante pour les utilisateurs.

**shortcuts** : Permettent d'ajouter des raccourcis dans le menu contextuel de l'application (accessible par un clic droit ou un appui long sur l'icône).

### 2.2 Les Service Workers

Les Service Workers constituent véritablement le cœur technologique des PWA. Il s'agit de scripts JavaScript qui s'exécutent en arrière-plan, indépendamment de votre page web, et qui agissent comme un proxy entre votre application et le réseau. Cette architecture unique permet d'implémenter des fonctionnalités qui étaient auparavant impossibles sur le web.

#### Comprendre l'architecture des Service Workers

Un Service Worker est essentiellement un worker web qui fonctionne de manière complètement séparée du thread principal de votre application. Cette séparation présente plusieurs avantages cruciaux :

1. **Non-bloquant** : Les opérations du Service Worker n'affectent jamais les performances de l'interface utilisateur
2. **Persistant** : Il peut continuer à fonctionner même quand votre application web est fermée
3. **Sécurisé** : Il ne peut pas accéder directement au DOM, ce qui évite les conflits et améliore la sécurité

#### Cycle de vie détaillé d'un Service Worker

Le cycle de vie d'un Service Worker est soigneusement orchestré pour garantir une expérience utilisateur fluide et prévisible :

**1. Enregistrement** : L'application principale enregistre le Service Worker auprès du navigateur. Cette étape vérifie que le fichier du Service Worker est accessible et valide.

**2. Installation** : Une fois enregistré, le Service Worker entre en phase d'installation. C'est durant cette phase que vous pouvez pré-charger les ressources critiques dans le cache. Si l'installation échoue, le Service Worker est rejeté.

**3. Activation** : Après une installation réussie, le Service Worker s'active. Il peut alors commencer à contrôler les pages de votre site. C'est également le moment idéal pour nettoyer les anciens caches.

**4. Fonctionnement** : Le Service Worker intercepte maintenant toutes les requêtes réseau de votre application et peut les traiter selon votre logique personnalisée.

**5. Mise à jour** : Lorsque vous modifiez le fichier du Service Worker, le navigateur détecte automatiquement le changement et démarre le processus d'installation d'une nouvelle version.

**6. Redondance** : L'ancien Service Worker reste actif jusqu'à ce que toutes les pages l'utilisant soient fermées, moment où la nouvelle version prend le relais.

#### Événements clés des Service Workers

```javascript
// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker : Installation en cours...');
    
    event.waitUntil(
        caches.open('ma-pwa-v1')
            .then((cache) => {
                console.log('Cache ouvert avec succès');
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/style.css',
                    '/app.js',
                    '/manifest.json'
                ]);
            })
            .then(() => {
                console.log('Toutes les ressources ont été mises en cache');
                // Force l'activation immédiate du nouveau Service Worker
                return self.skipWaiting();
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker : Activation en cours...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Supprime les anciens caches qui ne correspondent pas à la version actuelle
                    if (cacheName !== 'ma-pwa-v1') {
                        console.log('Suppression de l\'ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Prend immédiatement le contrôle de toutes les pages
            return self.clients.claim();
        })
    );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
    console.log('Service Worker : Interception de la requête vers', event.request.url);
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Ressource trouvée dans le cache:', event.request.url);
                    return response;
                }
                
                console.log('Ressource non trouvée dans le cache, téléchargement...');
                return fetch(event.request)
                    .then((response) => {
                        // Vérifie que la réponse est valide
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone la réponse car elle ne peut être lue qu'une seule fois
                        const responseToCache = response.clone();
                        
                        caches.open('ma-pwa-v1')
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    });
            })
            .catch(() => {
                // En cas d'échec, retourne une page hors ligne personnalisée
                if (event.request.destination === 'document') {
                    return caches.match('/offline.html');
                }
            })
    );
});
```

### 2.3 HTTPS : Un prérequis de sécurité

L'exigence HTTPS pour les PWA n'est pas simplement une recommandation, mais une nécessité technique et sécuritaire absolue. Cette exigence découle de plusieurs facteurs critiques :

#### Pourquoi HTTPS est-il obligatoire ?

**Sécurité des Service Workers** : Les Service Workers ont des capacités puissantes, notamment la possibilité d'intercepter et de modifier toutes les requêtes réseau de votre application. Sans HTTPS, un attaquant pourrait potentiellement injecter un Service Worker malveillant via une attaque man-in-the-middle, compromettant complètement la sécurité de l'application.

**Protection des données utilisateur** : Les PWA peuvent stocker des données sensibles localement et les synchroniser avec des serveurs. HTTPS garantit que ces données restent chiffrées pendant leur transmission.

**Intégrité du code** : HTTPS assure que le code de votre application n'a pas été modifié pendant sa transmission, garantissant que les utilisateurs exécutent exactement le code que vous avez déployé.

**APIs modernes** : De nombreuses APIs web modernes utilisées par les PWA (géolocalisation, caméra, microphone, notifications push) ne fonctionnent que dans un contexte sécurisé HTTPS.

#### Mise en place d'HTTPS

Pour le développement local, vous pouvez utiliser des outils comme `mkcert` pour générer des certificats SSL locaux valides :

```bash
# Installation de mkcert
npm install -g mkcert

# Création d'une autorité de certification locale
mkcert -install

# Génération de certificats pour localhost
mkcert localhost 127.0.0.1 ::1
```

Pour la production, vous avez plusieurs options :
- **Let's Encrypt** : Certificats SSL gratuits et automatiquement renouvelés
- **Cloudflare** : CDN avec SSL/TLS inclus
- **Services cloud** : La plupart des plateformes cloud (Netlify, Vercel, Firebase) incluent HTTPS par défaut

## 3. Création étape par étape d'une PWA

Maintenant que nous avons établi les bases théoriques, plongeons dans la création pratique d'une PWA complète. Nous allons construire une application de gestion de tâches qui illustrera tous les concepts importants.

### Étape 1 : Architecture et structure du projet

Avant de commencer à coder, il est crucial de bien organiser la structure de votre projet. Une bonne organisation facilitera la maintenance et l'évolution de votre PWA.

```
ma-todo-pwa/
├── index.html              # Page principale de l'application
├── manifest.json           # Manifeste de l'application
├── sw.js                   # Service Worker principal
├── app.js                  # Logique principale de l'application
├── style.css              # Styles CSS
├── offline.html           # Page affichée hors ligne
├── icons/                 # Dossier contenant toutes les icônes
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   ├── icon-512.png
│   └── favicon.ico
├── screenshots/           # Captures d'écran pour le manifeste
│   ├── mobile-screenshot.png
│   └── desktop-screenshot.png
├── js/                    # Scripts JavaScript modulaires
│   ├── db.js             # Gestion de la base de données locale
│   ├── ui.js             # Gestion de l'interface utilisateur
│   └── sync.js           # Synchronisation des données
└── css/                   # Feuilles de style modulaires
    ├── main.css
    ├── responsive.css
    └── themes.css
```

Cette structure modulaire présente plusieurs avantages :
- **Séparation des responsabilités** : Chaque fichier a un rôle spécifique
- **Maintenabilité** : Plus facile de localiser et modifier du code spécifique
- **Performance** : Possibilité de charger uniquement les modules nécessaires
- **Collaboration** : Plusieurs développeurs peuvent travailler sur différents modules

### Étape 2 : Page HTML principale avec intégration PWA

La page HTML constitue la fondation de votre PWA. Elle doit non seulement structurer votre contenu, mais aussi intégrer tous les éléments nécessaires au fonctionnement PWA.

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo PWA - Gestionnaire de tâches moderne</title>
    
    <!-- Description pour les moteurs de recherche -->
    <meta name="description" content="Une application de gestion de tâches moderne qui fonctionne hors ligne et peut être installée sur votre appareil">
    <meta name="keywords" content="todo, tâches, productivité, PWA, hors ligne">
    <meta name="author" content="Votre Nom">
    
    <!-- Lien vers le manifeste PWA -->
    <link rel="manifest" href="/manifest.json">
    
    <!-- Favicon traditionnel -->
    <link rel="icon" href="/icons/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/icons/icon-192.png" type="image/png">
    
    <!-- Configuration PWA pour navigateurs génériques -->
    <meta name="theme-color" content="#007bff">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="application-name" content="Todo PWA">
    
    <!-- Configuration spécifique pour iOS (Safari) -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Todo PWA">
    <link rel="apple-touch-icon" href="/icons/icon-152.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72.png">
    <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96.png">
    <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png">
    <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png">
    <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384.png">
    <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png">
    
    <!-- Configuration pour Windows/Microsoft -->
    <meta name="msapplication-TileImage" content="/icons/icon-144.png">
    <meta name="msapplication-TileColor" content="#007bff">
    <meta name="msapplication-config" content="/browserconfig.xml">
    
    <!-- Préchargement des ressources critiques -->
    <link rel="preload" href="/css/main.css" as="style">
    <link rel="preload" href="/js/app.js" as="script">
    
    <!-- Styles CSS -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/responsive.css">
</head>
<body>
    <!-- Écran de chargement initial -->
    <div id="loading-screen" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Chargement de Todo PWA...</p>
    </div>
    
    <!-- Structure principale de l'application -->
    <div id="app" class="app-container" style="display: none;">
        <!-- Header avec titre et actions -->
        <header class="app-header">
            <h1 class="app-title">
                <img src="/icons/icon-72.png" alt="Logo" class="app-logo">
                Todo PWA
            </h1>
            
            <!-- Bouton d'installation -->
            <div class="header-actions">
                <button id="install-button" class="install-btn" style="display: none;" aria-label="Installer l'application">
                    <svg class="install-icon" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                    </svg>
                    Installer
                </button>
                
                <button id="sync-button" class="sync-btn" aria-label="Synchroniser les données">
                    <svg class="sync-icon" viewBox="0 0 24 24">
                        <path d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 13.01 17.75 13.97 17.3 14.8L18.76 16.26C19.54 15.03 20 13.57 20 12C20 7.58 16.42 4 12 4Z"/>
                    </svg>
                </button>
                
                <button id="theme-toggle" class="theme-btn" aria-label="Changer le thème">
                    <svg class="theme-icon" viewBox="0 0 24 24">
                        <path d="M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21C16.97 21 21 16.97 21 12S16.97 3 12 3M12 19C8.13 19 5 15.87 5 12S8.13 5 12 5C15.87 5 19 8.13 19 12S15.87 19 12 19Z"/>
                    </svg>
                </button>
            </div>
        </header>
        
        <!-- Zone de notification -->
        <div id="notification-area" class="notification-container" aria-live="polite"></div>
        
        <!-- Indicateur de statut de connexion -->
        <div id="connection-status" class="connection-indicator" aria-live="polite">
            <span class="status-text">En ligne</span>
        </div>
        
        <!-- Contenu principal -->
        <main class="app-main">
            <!-- Formulaire d'ajout de tâche -->
            <section class="add-task-section">
                <form id="add-task-form" class="task-form">
                    <div class="input-group">
                        <input 
                            type="text" 
                            id="task-input" 
                            class="task-input" 
                            placeholder="Ajouter une nouvelle tâche..." 
                            maxlength="200"
                            required
                            aria-label="Nouvelle tâche"
                        >
                        <button type="submit" class="add-task-btn" aria-label="Ajouter la tâche">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Options avancées -->
                    <div class="task-options">
                        <select id="task-priority" class="priority-select" aria-label="Priorité de la tâche">
                            <option value="low">Priorité basse</option>
                            <option value="medium" selected>Priorité moyenne</option>
                            <option value="high">Priorité haute</option>
                        </select>
                        
                        <input type="date" id="task-deadline" class="deadline-input" aria-label="Date d'échéance">
                    </div>
                </form>
            </section>
            
            <!-- Filtres et tri -->
            <section class="filters-section">
                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="all">Toutes</button>
                    <button class="filter-btn" data-filter="pending">En cours</button>
                    <button class="filter-btn" data-filter="completed">Terminées</button>
                </div>
                
                <div class="sort-options">
                    <select id="sort-select" aria-label="Trier par">
                        <option value="created">Date de création</option>
                        <option value="deadline">Date d'échéance</option>
                        <option value="priority">Priorité</option>
                        <option value="alphabetical">Ordre alphabétique</option>
                    </select>
                </div>
            </section>
            
            <!-- Liste des tâches -->
            <section class="tasks-section">
                <div id="tasks-container" class="tasks-list" role="list">
                    <!-- Les tâches seront ajoutées dynamiquement ici -->
                </div>
                
                <!-- Message quand aucune tâche -->
                <div id="empty-state" class="empty-state" style="display: none;">
                    <svg class="empty-icon" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2M12 20C8.13 20 5 16.41 5 12S8.13 4 12 4 20 7.59 20 12 16.41 20 12 20Z"/>
                    </svg>
                    <h3>Aucune tâche pour le moment</h3>
                    <p>Ajoutez votre première tâche pour commencer à organiser votre journée !</p>
                </div>
            </section>
        </main>
        
        <!-- Footer avec statistiques -->
        <footer class="app-footer">
            <div class="stats-container">
                <div class="stat-item">
                    <span class="stat-value" id="total-tasks">0</span>
                    <span class="stat-label">Total</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value" id="completed-tasks">0</span>
                    <span class="stat-label">Terminées</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value" id="pending-tasks">0</span>
                    <span class="stat-label">En cours</span>
                </div>
            </div>
        </footer>
    </div>
    
    <!-- Scripts JavaScript -->
    <script src="/js/db.js"></script>
    <script src="/js/ui.js"></script>
    <script src="/js/sync.js"></script>
    <script src="/js/app.js"></script>
    
    <!-- Script d'initialisation -->
    <script>
        // Cache les éléments de chargement une fois que tout est prêt
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
                document.getElementById('app').style.display = 'block';
            }, 500);
        });
    </script>
</body>
</html>
```

Cette structure HTML présente plusieurs caractéristiques importantes :

**Accessibilité** : Utilisation d'attributs ARIA, de labels appropriés, et d'une structure sémantique claire pour les lecteurs d'écran.

**Performance** : Préchargement des ressources critiques et optimisation du temps de chargement initial.

**Responsive** : Structure adaptée à tous les types d'écrans grâce à une approche mobile-first.

**PWA Ready** : Tous les éléments nécessaires pour l'installation et le fonctionnement en mode standalone.

### Étape 3 : Enregistrement et gestion avancée du Service Worker

L'enregistrement du Service Worker est une étape critique qui doit être gérée avec soin. Un Service Worker mal configuré peut causer des problèmes de cache difficiles à diagnostiquer.

```javascript
// app.js - Enregistrement intelligent du Service Worker
class ServiceWorkerManager {
    constructor() {
        this.swRegistration = null;
        this.updateAvailable = false;
        this.refreshing = false;
    }

    async init() {
        if ('serviceWorker' in navigator) {
            try {
                await this.registerServiceWorker();
                this.setupUpdateHandling();
                this.setupSyncHandling();
            } catch (error) {
                console.error('Erreur lors de l\'initialisation du Service Worker:', error);
                this.showNotification('Erreur lors de l\'initialisation du mode hors ligne', 'error');
            }
        } else {
            console.warn('Service Workers non supportés par ce navigateur');
            this.showNotification('Mode hors ligne non disponible sur ce navigateur', 'warning');
        }
    }

    async registerServiceWorker() {
        console.log('Enregistrement du Service Worker...');
        
        this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/' // Définit la portée du Service Worker
        });

        console.log('Service Worker enregistré avec succès:', this.swRegistration);

        // Écoute les changements d'état
        this.swRegistration.addEventListener('updatefound', () => {
            console.log('Nouvelle version du Service Worker détectée');
            const newWorker = this.swRegistration.installing;
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        // Une nouvelle version est disponible
                        this.updateAvailable = true;
                        this.showUpdateNotification();
                    } else {
                        // Service Worker installé pour la première fois
                        console.log('Service Worker installé pour la première fois');
                        this.showNotification('Application prête pour le mode hors ligne', 'success');
                    }
                }
            });
        });

        // Écoute les messages du Service Worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            this.handleServiceWorkerMessage(event.data);
        });

        // Vérifie immédiatement s'il y a des mises à jour
        this.swRegistration.update();
    }

    setupUpdateHandling() {
        // Vérifie périodiquement les mises à jour
        setInterval(() => {
            if (this.swRegistration) {
                this.swRegistration.update();
            }
        }, 60000); // Vérifie toutes les minutes

        // Vérifie lors du retour en ligne
        window.addEventListener('online', () => {
            if (this.swRegistration) {
                this.swRegistration.update();
            }
        });
    }

    setupSyncHandling() {
        // Enregistre la synchronisation en arrière-plan si supportée
        if ('sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then((swRegistration) => {
                return swRegistration.sync.register('background-sync');
            }).catch((error) => {
                console.warn('Synchronisation en arrière-plan non disponible:', error);
            });
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <p>Une nouvelle version de l'application est disponible !</p>
                <div class="notification-actions">
                    <button id="update-app" class="btn-primary">Mettre à jour</button>
                    <button id="dismiss-update" class="btn-secondary">Plus tard</button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        document.getElementById('update-app').addEventListener('click', () => {
            this.activateUpdate();
            document.body.removeChild(notification);
        });

        document.getElementById('dismiss-update').addEventListener('click', () => {
            document.body.removeChild(notification);
        });
    }

    activateUpdate() {
        if (!this.swRegistration || !this.swRegistration.waiting) {
            return;
        }

        this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Recharge la page une fois que le nouveau SW prend le contrôle
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (this.refreshing) return;
            this.refreshing = true;
            window.location.reload();
        });
    }

    handleServiceWorkerMessage(data) {
        switch (data.type) {
            case 'CACHE_UPDATED':
                console.log('Cache mis à jour:', data.payload);
                break;
            case 'SYNC_COMPLETED':
                console.log('Synchronisation terminée:', data.payload);
                this.showNotification('Données synchronisées avec succès', 'success');
                break;
            case 'SYNC_FAILED':
                console.error('Échec de la synchronisation:', data.payload);
                this.showNotification('Erreur lors de la synchronisation', 'error');
                break;
        }
    }

    showNotification(message, type = 'info') {
        const notificationArea = document.getElementById('notification-area');
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        notificationArea.appendChild(notification);

        // Supprime la notification après 5 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notificationArea.removeChild(notification);
            }
        }, 5000);
    }
}

// Gestion de l'installation PWA
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = document.getElementById('install-button');
        this.setupInstallHandling();
    }

    setupInstallHandling() {
        // Écoute l'événement beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (event) => {
            console.log('Événement beforeinstallprompt déclenché');
            
            // Empêche l'affichage automatique du prompt
            event.preventDefault();
            
            // Stocke l'événement pour l'utiliser plus tard
            this.deferredPrompt = event;
            
            // Affiche le bouton d'installation personnalisé
            this.showInstallButton();
        });

        // Écoute l'événement appinstalled
        window.addEventListener('appinstalled', (event) => {
            console.log('PWA installée avec succès');
            this.hideInstallButton();
            this.showNotification('Application installée avec succès !', 'success');
            
            // Analytics - track installation
            this.trackInstallation('installed');
        });

        // Gère le clic sur le bouton d'installation
        if (this.installButton) {
            this.installButton.addEventListener('click', () => {
                this.promptInstall();
            });
        }

        // Vérifie si l'app est déjà installée
        this.checkIfInstalled();
    }

    showInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'flex';
            
            // Animation d'apparition
            this.installButton.style.opacity = '0';
            this.installButton.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                this.installButton.style.transition = 'all 0.3s ease';
                this.installButton.style.opacity = '1';
                this.installButton.style.transform = 'scale(1)';
            }, 100);
        }
    }

    hideInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'none';
        }
    }

    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('Aucun prompt d\'installation disponible');
            return;
        }

        try {
            // Affiche le prompt d'installation
            this.deferredPrompt.prompt();
            
            // Attend la réponse de l'utilisateur
            const choiceResult = await this.deferredPrompt.userChoice;
            
            console.log('Choix de l\'utilisateur:', choiceResult.outcome);
            
            if (choiceResult.outcome === 'accepted') {
                console.log('Utilisateur a accepté l\'installation');
                this.trackInstallation('accepted');
            } else {
                console.log('Utilisateur a refusé l\'installation');
                this.trackInstallation('dismissed');
            }
            
            // Nettoie la référence
            this.deferredPrompt = null;
            this.hideInstallButton();
            
        } catch (error) {
            console.error('Erreur lors de l\'installation:', error);
        }
    }

    checkIfInstalled() {
        // Vérifie si l'application fonctionne en mode standalone
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('Application lancée en mode standalone');
            this.hideInstallButton();
            return true;
        }
        
        // Vérifie pour iOS
        if (window.navigator.standalone === true) {
            console.log('Application lancée en mode standalone sur iOS');
            this.hideInstallButton();
            return true;
        }
        
        return false;
    }

    trackInstallation(action) {
        // Envoi des données analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install', {
                event_category: 'PWA',
                event_label: action,
                value: 1
            });
        }
        
        // Ou utilisation d'une API analytics personnalisée
        if (window.analytics) {
            window.analytics.track('PWA Installation', {
                action: action,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            });
        }
    }

    showNotification(message, type) {
        // Réutilise la méthode de notification du ServiceWorkerManager
        const event = new CustomEvent('show-notification', {
            detail: { message, type }
        });
        window.dispatchEvent(event);
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initialisation de l\'application Todo PWA');
    
    // Initialise le gestionnaire de Service Worker
    const swManager = new ServiceWorkerManager();
    swManager.init();
    
    // Initialise le gestionnaire d'installation PWA
    const pwaInstaller = new PWAInstaller();
    
    // Écoute les événements de notification personnalisés
    window.addEventListener('show-notification', (event) => {
        swManager.showNotification(event.detail.message, event.detail.type);
    });
    
    // Initialise le reste de l'application
    initializeApp();
});

function initializeApp() {
    // Initialise la base de données locale
    TodoDB.init();
    
    // Initialise l'interface utilisateur
    TodoUI.init();
    
    // Configure la gestion des événements
    setupEventListeners();
    
    // Charge les tâches existantes
    loadTasks();
    
    console.log('Application Todo PWA initialisée avec succès');
}
```

Cette implémentation avancée du Service Worker offre plusieurs avantages :

**Gestion robuste des mises à jour** : Détection automatique des nouvelles versions et interface utilisateur pour les appliquer.

**Feedback utilisateur** : Notifications claires sur l'état de l'installation et des mises à jour.

**Dégradation gracieuse** : L'application fonctionne même si les Service Workers ne sont pas supportés.

**Analytics intégrées** : Suivi des installations et interactions pour améliorer l'expérience utilisateur.

### Étape 4 : Service Worker avancé avec stratégies de mise en cache intelligentes

Un Service Worker bien conçu est la clé d'une expérience utilisateur fluide. Il doit être capable de gérer différents types de ressources avec des stratégies appropriées.

```javascript
// sw.js - Service Worker avancé avec gestion intelligente du cache
const CACHE_VERSION = 'v2.1.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Ressources critiques à mettre en cache immédiatement
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/main.css',
    '/css/responsive.css',
    '/js/app.js',
    '/js/db.js',
    '/js/ui.js',
    '/js/sync.js',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/offline.html'
];

// URLs qui ne doivent jamais être mises en cache
const NEVER_CACHE = [
    '/api/auth/',
    '/api/analytics/',
    'chrome-extension://'
];

// Durée de vie des caches (en millisecondes)
const CACHE_EXPIRY = {
    static: 7 * 24 * 60 * 60 * 1000,    // 7 jours
    dynamic: 24 * 60 * 60 * 1000,       // 1 jour
    api: 5 * 60 * 1000,                 // 5 minutes
    images: 30 * 24 * 60 * 60 * 1000    // 30 jours
};

class ServiceWorkerCore {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        self.addEventListener('install', this.handleInstall.bind(this));
        self.addEventListener('activate', this.handleActivate.bind(this));
        self.addEventListener('fetch', this.handleFetch.bind(this));
        self.addEventListener('sync', this.handleSync.bind(this));
        self.addEventListener('push', this.handlePush.bind(this));
        self.addEventListener('notificationclick', this.handleNotificationClick.bind(this));
        self.addEventListener('message', this.handleMessage.bind(this));
    }

    async handleInstall(event) {
        console.log('🔧 Service Worker: Installation en cours...');
        
        event.waitUntil(
            this.performInstallation()
                .then(() => {
                    console.log('✅ Service Worker: Installation terminée avec succès');
                    // Force l'activation immédiate
                    return self.skipWaiting();
                })
                .catch((error) => {
                    console.error('❌ Service Worker: Erreur lors de l\'installation:', error);
                    throw error;
                })
        );
    }

    async performInstallation() {
        // Ouvre le cache statique et stocke les ressources critiques
        const staticCache = await caches.open(STATIC_CACHE);
        
        console.log('📦 Mise en cache des ressources statiques...');
        await staticCache.addAll(STATIC_ASSETS);
        
        // Précharge les données essentielles si disponibles
        await this.preloadEssentialData();
        
        // Envoie un message à l'application principale
        this.sendMessageToClients({
            type: 'SW_INSTALLED',
            payload: { version: CACHE_VERSION }
        });
    }

    async preloadEssentialData() {
        try {
            // Tentative de préchargement des données utilisateur
            const response = await fetch('/api/user/essential-data');
            if (response.ok) {
                const cache = await caches.open(API_CACHE);
                cache.put('/api/user/essential-data', response.clone());
                console.log('📋 Données essentielles préchargées');
            }
        } catch (error) {
            console.log('⚠️ Impossible de précharger les données essentielles:', error.message);
        }
    }

    async handleActivate(event) {
        console.log('🚀 Service Worker: Activation en cours...');
        
        event.waitUntil(
            this.performActivation()
                .then(() => {
                    console.log('✅ Service Worker: Activation terminée');
                    return self.clients.claim();
                })
        );
    }

    async performActivation() {
        // Nettoie les anciens caches
        await this.cleanupOldCaches();
        
        // Initialise la synchronisation en arrière-plan
        await this.initializeBackgroundSync();
        
        // Envoie un message de confirmation
        this.sendMessageToClients({
            type: 'SW_ACTIVATED',
            payload: { version: CACHE_VERSION }
        });
    }

    async cleanupOldCaches() {
        const cacheNames = await caches.keys();
        const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGE_CACHE];
        
        const deletionPromises = cacheNames
            .filter(cacheName => !currentCaches.includes(cacheName))
            .map(cacheName => {
                console.log('🗑️ Suppression de l\'ancien cache:', cacheName);
                return caches.delete(cacheName);
            });
        
        await Promise.all(deletionPromises);
    }

    async initializeBackgroundSync() {
        // Configuration pour la synchronisation des données en attente
        console.log('🔄 Initialisation de la synchronisation en arrière-plan');
    }

    handleFetch(event) {
        const { request } = event;
        const url = new URL(request.url);
        
        // Ignore les requêtes qui ne doivent pas être mises en cache
        if (this.shouldNeverCache(request)) {
            return;
        }
        
        // Détermine la stratégie appropriée selon le type de ressource
        if (this.isStaticAsset(request)) {
            event.respondWith(this.handleStaticAsset(request));
        } else if (this.isAPIRequest(request)) {
            event.respondWith(this.handleAPIRequest(request));
        } else if (this.isImageRequest(request)) {
            event.respondWith(this.handleImageRequest(request));
        } else if (this.isNavigationRequest(request)) {
            event.respondWith(this.handleNavigationRequest(request));
        } else {
            event.respondWith(this.handleGenericRequest(request));
        }
    }

    shouldNeverCache(request) {
        return NEVER_CACHE.some(pattern => request.url.includes(pattern));
    }

    isStaticAsset(request) {
        return STATIC_ASSETS.some(asset => request.url.endsWith(asset));
    }

    isAPIRequest(request) {
        return request.url.includes('/api/');
    }

    isImageRequest(request) {
        return request.destination === 'image';
    }

    isNavigationRequest(request) {
        return request.mode === 'navigate';
    }

    // Stratégie Cache First pour les ressources statiques
    async handleStaticAsset(request) {
        try {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                console.log('📋 Cache hit pour ressource statique:', request.url);
                return cachedResponse;
            }
            
            console.log('🌐 Téléchargement de la ressource statique:', request.url);
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                const cache = await caches.open(STATIC_CACHE);
                cache.put(request, networkResponse.clone());
            }
            
            return networkResponse;
        } catch (error) {
            console.error('❌ Erreur lors du chargement de la ressource statique:', error);
            return new Response('Ressource non disponible', { status: 503 });
        }
    }

    // Stratégie Network First avec fallback cache pour les APIs
    async handleAPIRequest(request) {
        try {
            console.log('🌐 Requête API:', request.url);
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                // Met en cache les réponses GET uniquement
                if (request.method === 'GET') {
                    const cache = await caches.open(API_CACHE);
                    const responseToCache = networkResponse.clone();
                    
                    // Ajoute un timestamp pour la gestion de l'expiration
                    const responseWithTimestamp = new Response(responseToCache.body, {
                        status: responseToCache.status,
                        statusText: responseToCache.statusText,
                        headers: {
                            ...Object.fromEntries(responseToCache.headers.entries()),
                            'sw-cached-at': Date.now().toString()
                        }
                    });
                    
                    cache.put(request, responseWithTimestamp);
                }
                
                return networkResponse;
            }
            
            throw new Error(`Réponse réseau non valide: ${networkResponse.status}`);
            
        } catch (error) {
            console.log('⚠️ Réseau indisponible, tentative de récupération depuis le cache');
            
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                // Vérifie si la réponse en cache n'est pas expirée
                const cachedAt = cachedResponse.headers.get('sw-cached-at');
                if (cachedAt && (Date.now() - parseInt(cachedAt)) < CACHE_EXPIRY.api) {
                    console.log('📋 Cache hit pour API (dans les délais):', request.url);
                    return cachedResponse;
                }
            }
            
            // Si pas de cache ou cache expiré, enregistre pour synchronisation ultérieure
            if (request.method !== 'GET') {
                await this.queueForSync(request);
                return new Response(JSON.stringify({
                    error: 'Requête mise en attente pour synchronisation',
                    queued: true
                }), {
                    status: 202,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            return new Response('Service temporairement indisponible', { status: 503 });
        }
    }

    // Stratégie Cache First avec mise à jour en arrière-plan pour les images
    async handleImageRequest(request) {
        try {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                console.log('🖼️ Image trouvée dans le cache:', request.url);
                
                // Met à jour l'image en arrière-plan si elle est ancienne
                this.updateImageInBackground(request);
                
                return cachedResponse;
            }
            
            console.log('🌐 Téléchargement de l\'image:', request.url);
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                const cache = await caches.open(IMAGE_CACHE);
                cache.put(request, networkResponse.clone());
            }
            
            return networkResponse;
        } catch (error) {
            console.error('❌ Erreur lors du chargement de l\'image:', error);
            
            // Retourne une image placeholder
            return this.getPlaceholderImage();
        }
    }

    async updateImageInBackground(request) {
        try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
                const cache = await caches.open(IMAGE_CACHE);
                cache.put(request, networkResponse);
                console.log('🔄 Image mise à jour en arrière-plan:', request.url);
            }
        } catch (error) {
            console.log('⚠️ Impossible de mettre à jour l\'image en arrière-plan');
        }
    }

    getPlaceholderImage() {
        // Retourne une image SVG simple comme placeholder
        const svg = `
            <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="#999">
                    Image non disponible
                </text>
            </svg>
        `;
        
        return new Response(svg, {
            headers: { 'Content-Type': 'image/svg+xml' }
        });
    }

    // Gestion des requêtes de navigation avec fallback vers page hors ligne
    async handleNavigationRequest(request) {
        try {
            console.log('🧭 Requête de navigation:', request.url);
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                // Met en cache les pages importantes
                const cache = await caches.open(DYNAMIC_CACHE);
                cache.put(request, networkResponse.clone());
            }
            
            return networkResponse;
        } catch (error) {
            console.log('⚠️ Navigation hors ligne, affichage de la page de secours');
            
            // Tente de retourner la page depuis le cache
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Fallback vers la page hors ligne
            return caches.match('/offline.html');
        }
    }

    // Stratégie générique pour les autres requêtes
    async handleGenericRequest(request) {
        try {
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                const cache = await caches.open(DYNAMIC_CACHE);
                cache.put(request, networkResponse.clone());
            }
            
            return networkResponse;
        } catch (error) {
            const cachedResponse = await caches.match(request);
            return cachedResponse || new Response('Contenu non disponible', { status: 503 });
        }
    }

    async queueForSync(request) {
        // Stocke la requête pour synchronisation ultérieure
        const requestData = {
            url: request.url,
            method: request.method,
            headers: Object.fromEntries(request.headers.entries()),
            body: request.method !== 'GET' ? await request.text() : null,
            timestamp: Date.now()
        };
        
        // Utilise IndexedDB pour stocker les requêtes en attente
        // (Implémentation simplifiée - en production, utiliser une bibliothèque comme Workbox)
        console.log('📥 Requête mise en file d\'attente pour synchronisation:', requestData);
    }

    async handleSync(event) {
        console.log('🔄 Synchronisation en arrière-plan déclenchée:', event.tag);
        
        if (event.tag === 'background-sync') {
            event.waitUntil(this.performBackgroundSync());
        }
    }

    async performBackgroundSync() {
        try {
            console.log('🔄 Exécution de la synchronisation en arrière-plan...');
            
            // Récupère et traite les requêtes en attente
            // (Implémentation de la logique de synchronisation)
            
            this.sendMessageToClients({
                type: 'SYNC_COMPLETED',
                payload: { timestamp: Date.now() }
            });
            
        } catch (error) {
            console.error('❌ Erreur lors de la synchronisation:', error);
            
            this.sendMessageToClients({
                type: 'SYNC_FAILED',
                payload: { error: error.message }
            });
        }
    }

    async handlePush(event) {
        console.log('📬 Notification push reçue');
        
        const data = event.data ? event.data.json() : {};
        const options = {
            body: data.body || 'Vous avez un nouveau message',
            icon: '/icons/icon-192.png',
            badge: '/icons/badge-72.png',
            tag: data.tag || 'default',
            vibrate: [100, 50, 100],
            data: data,
            actions: [
                {
                    action: 'open',
                    title: 'Ouvrir',
                    icon: '/icons/open-icon.png'
                },
                {
                    action: 'dismiss',
                    title: 'Ignorer',
                    icon: '/icons/dismiss-icon.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'Notification', options)
        );
    }

    handleNotificationClick(event) {
        console.log('🔔 Clic sur notification:', event.action);
        
        event.notification.close();
        
        if (event.action === 'open' || !event.action) {
            // Ouvre l'application ou navigue vers une URL spécifique
            event.waitUntil(
                clients.openWindow(event.notification.data.url || '/')
            );
        }
    }

    handleMessage(event) {
        console.log('💬 Message reçu:', event.data);
        
        if (event.data.type === 'SKIP_WAITING') {
            self.skipWaiting();
        }
    }

    sendMessageToClients(message) {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage(message);
            });
        });
    }
}

// Initialise le Service Worker
new ServiceWorkerCore();
```

Cette implémentation avancée du Service Worker présente de nombreux avantages :

**Stratégies de cache intelligentes** : Chaque type de ressource est traité avec une stratégie optimisée pour ses caractéristiques spécifiques.

**Gestion robuste des erreurs** : Fallbacks appropriés et gestion gracieuse des pannes réseau.

**Performance optimisée** : Mise en cache sélective et gestion intelligente de l'expiration des caches.

**Synchronisation avancée** : Capacité de mettre en file d'attente les requêtes pour traitement ultérieur.

**Communication bidirectionnelle** : Messages entre le Service Worker et l'application principale pour une meilleure coordination.

## 4. Stratégies de mise en cache avancées

La mise en cache est l'un des aspects les plus critiques d'une PWA. Une stratégie de cache bien pensée peut transformer une application web ordinaire en une expérience fluide et rapide, même dans des conditions de réseau difficiles.

### 4.1 Cache First - Priorité au cache local

La stratégie "Cache First" est idéale pour les ressources qui changent rarement, comme les fichiers CSS, JavaScript, les images de l'interface utilisateur, et les polices. Cette approche privilégie la vitesse en servant immédiatement le contenu depuis le cache local.

```javascript
// Implémentation détaillée de la stratégie Cache First
async function cacheFirstStrategy(request, cacheName) {
    try {
        // 1. Vérifier d'abord dans le cache local
        console.log(`🔍 Recherche dans le cache: ${request.url}`);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            console.log(`✅ Trouvé dans le cache: ${request.url}`);
            
            // Optionnel: Mettre à jour en arrière-plan si la ressource est ancienne
            const cacheDate = cachedResponse.headers.get('date');
            if (cacheDate) {
                const ageInHours = (Date.now() - new Date(cacheDate).getTime()) / (1000 * 60 * 60);
                if (ageInHours > 24) { // Plus de 24h
                    updateResourceInBackground(request, cacheName);
                }
            }
            
            return cachedResponse;
        }
        
        // 2. Si pas en cache, télécharger depuis le réseau
        console.log(`🌐 Téléchargement depuis le réseau: ${request.url}`);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error(`❌ Erreur Cache First pour ${request.url}:`, error);
        
        // Fallback vers une réponse d'erreur personnalisée
        return new Response('Ressource temporairement indisponible', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
}

async function updateResourceInBackground(request, cacheName) {
    try {
        console.log(`🔄 Mise à jour en arrière-plan: ${request.url}`);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse);
            console.log(`✅ Ressource mise à jour: ${request.url}`);
        }
    } catch (error) {
        console.log(`⚠️ Impossible de mettre à jour: ${request.url}`);
    }
}
```

**Avantages de Cache First :**
- **Performance maximale** : Réponse instantanée pour les ressources en cache
- **Résilience hors ligne** : Fonctionne parfaitement sans connexion
- **Économie de bande passante** : Réduit la consommation de données

**Inconvénients :**
- **Contenu potentiellement obsolète** : Risque de servir d'anciennes versions
- **Gestion complexe des mises à jour** : Nécessite une stratégie de versioning

### 4.2 Network First - Fraîcheur des données prioritaire

La stratégie "Network First" est essentielle pour les données dynamiques et les API qui changent fréquemment. Elle garantit que l'utilisateur reçoit toujours les informations les plus récentes quand c'est possible.

```javascript
// Implémentation avancée de la stratégie Network First
async function networkFirstStrategy(request, cacheName, timeout = 3000) {
    try {
        console.log(`🌐 Tentative réseau: ${request.url}`);
        
        // Utilise un timeout pour éviter les attentes trop longues
        const networkResponse = await Promise.race([
            fetch(request),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), timeout)
            )
        ]);
        
        if (!networkResponse.ok) {
            throw new Error(`Réponse réseau non valide: ${networkResponse.status}`);
        }
        
        console.log(`✅ Réponse réseau reçue: ${request.url}`);
        
        // Mise en cache de la réponse fraîche
        if (request.method === 'GET') {
            const cache = await caches.open(cacheName);
            const responseToCache = networkResponse.clone();
            
            // Enrichit la réponse avec des métadonnées
            const enhancedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: {
                    ...Object.fromEntries(responseToCache.headers.entries()),
                    'cached-at': new Date().toISOString(),
                    'cache-strategy': 'network-first',
                    'network-success': 'true'
                }
            });
            
            cache.put(request, enhancedResponse);
            console.log(`💾 Réponse mise en cache: ${request.url}`);
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('⚠️ Réseau indisponible, tentative de récupération depuis le cache');
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            // Vérifie si la réponse en cache n'est pas expirée
            const cachedAt = cachedResponse.headers.get('sw-cached-at');
            if (cachedAt && (Date.now() - parseInt(cachedAt)) < CACHE_EXPIRY.api) {
                console.log('📋 Cache hit pour API (dans les délais):', request.url);
                return cachedResponse;
            }
        }
        
        // Si pas de cache ou cache expiré, enregistre pour synchronisation ultérieure
        if (request.method !== 'GET') {
            await this.queueForSync(request);
            return new Response(JSON.stringify({
                error: 'Requête mise en attente pour synchronisation',
                queued: true
            }), {
                status: 202,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response('Service temporairement indisponible', { status: 503 });
    }
}
```

**Avantages de Network First :**
- **Données toujours fraîches** : Garantit les informations les plus récentes
- **Fallback intelligent** : Fonctionne hors ligne avec des données obsolètes
- **Transparence** : L'application sait quand elle utilise des données obsolètes

**Inconvénients :**
- **Latence réseau** : Dépend de la qualité de la connexion
- **Consommation de données** : Plus de requêtes réseau

### 4.3 Stale While Revalidate - Le meilleur des deux mondes

Cette stratégie sophistiquée offre un équilibre optimal entre performance et fraîcheur des données. Elle sert immédiatement le contenu en cache tout en le mettant à jour en arrière-plan.

```javascript
// Implémentation complète de Stale While Revalidate
async function staleWhileRevalidateStrategy(request, cacheName, maxAge = 5 * 60 * 1000) {
    console.log(`🔄 SWR strategy pour: ${request.url}`);
    
    try {
        // 1. Récupère immédiatement depuis le cache s'il existe
        const cachedResponse = await caches.match(request);
        
        // 2. Lance la mise à jour en arrière-plan en parallèle
        const revalidatePromise = revalidateInBackground(request, cacheName);
        
        if (cachedResponse) {
            // Vérifie l'âge du cache
            const cachedAt = cachedResponse.headers.get('cached-at');
            const isStale = cachedAt ? 
                (Date.now() - new Date(cachedAt).getTime()) > maxAge : true;
            
            if (isStale) {
                console.log(`📋 Contenu obsolète servi immédiatement: ${request.url}`);
                
                // Marque la réponse comme obsolète
                const staleResponse = new Response(cachedResponse.body, {
                    status: cachedResponse.status,
                    statusText: cachedResponse.statusText,
                    headers: {
                        ...Object.fromEntries(cachedResponse.headers.entries()),
                        'cache-status': 'stale',
                        'revalidating': 'true'
                    }
                });
                
                // Notifie que le contenu est en cours de mise à jour
                notifyRevalidating(request.url);
                
                return staleResponse;
            } else {
                console.log(`📋 Contenu frais servi depuis le cache: ${request.url}`);
                return cachedResponse;
            }
        }
        
        // 3. Si pas de cache, attend la réponse réseau
        console.log(`⏳ Aucun cache disponible, attente de la réponse réseau...`);
        return await revalidatePromise;
        
    } catch (error) {
        console.error(`❌ Erreur SWR pour ${request.url}:`, error);
        
        // Fallback vers le cache même s'il est très obsolète
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

async function revalidateInBackground(request, cacheName) {
    try {
        console.log(`🔄 Revalidation en arrière-plan: ${request.url}`);
        
        const networkResponse = await fetch(request);
        
        if (!networkResponse.ok) {
            throw new Error(`Erreur réseau: ${networkResponse.status}`);
        }
        
        // Met à jour le cache
        const cache = await caches.open(cacheName);
        const responseToCache = networkResponse.clone();
        
        const enhancedResponse = new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: {
                ...Object.fromEntries(responseToCache.headers.entries()),
                'cached-at': new Date().toISOString(),
                'cache-strategy': 'stale-while-revalidate',
                'revalidated': 'true'
            }
        });
        
        await cache.put(request, enhancedResponse);
        console.log(`✅ Cache mis à jour en arrière-plan: ${request.url}`);
        
        // Notifie que le contenu a été mis à jour
        notifyContentUpdated(request.url);
        
        return networkResponse;
        
    } catch (error) {
        console.error(`❌ Échec de la revalidation pour ${request.url}:`, error);
        throw error;
    }
}

function notifyRevalidating(url) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'CONTENT_REVALIDATING',
                payload: { url, timestamp: Date.now() }
            });
        });
    });
}

function notifyContentUpdated(url) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'CONTENT_UPDATED',
                payload: { url, timestamp: Date.now() }
            });
        });
    });
}
```

**Avantages de Stale While Revalidate :**
- **Performance optimale** : Réponse immédiate depuis le cache
- **Contenu automatiquement frais** : Mise à jour transparente en arrière-plan
- **Résilience** : Fonctionne hors ligne avec le dernier contenu disponible
- **Expérience utilisateur fluide** : Pas d'attente pour les mises à jour

**Utilisation recommandée :**
- APIs de données utilisateur
- Contenu qui change modérément
- Ressources où la fraîcheur est importante mais pas critique

### 4.4 Stratégie hybride intelligente

Pour une PWA complexe, il est souvent nécessaire de combiner plusieurs stratégies selon le contexte et le type de ressource.

```javascript
// Gestionnaire de stratégies intelligent
class IntelligentCacheManager {
    constructor() {
        this.strategies = {
            'cache-first': this.cacheFirst.bind(this),
            'network-first': this.networkFirst.bind(this),
            'stale-while-revalidate': this.staleWhileRevalidate.bind(this)
        };
        
        this.rules = [
            {
                test: /\.(css|js|woff2?|ttf|eot)$/,
                strategy: 'cache-first',
                cacheName: 'static-assets',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/,
                strategy: 'stale-while-revalidate',
                cacheName: 'images',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 jours
            },
            {
                test: /\/api\/user\//,
                strategy: 'network-first',
                cacheName: 'user-data',
                maxAge: 5 * 60 * 1000 // 5 minutes
            },
            {
                test: /\/api\/static\//,
                strategy: 'stale-while-revalidate',
                cacheName: 'static-api',
                maxAge: 60 * 60 * 1000 // 1 heure
            }
        ];
    }
    
    findRule(request) {
        return this.rules.find(rule => {
            if (rule.test instanceof RegExp) {
                return rule.test.test(request.url);
            }
            if (typeof rule.test === 'function') {
                return rule.test(request);
            }
            return false;
        });
    }
    
    async handleRequest(request) {
        const rule = this.findRule(request);
        
        if (!rule) {
            console.log(`⚠️ Aucune règle trouvée pour: ${request.url}`);
            return fetch(request);
        }
        
        console.log(`📋 Règle appliquée pour ${request.url}: ${rule.strategy}`);
        
        const strategy = this.strategies[rule.strategy];
        if (!strategy) {
            console.error(`❌ Stratégie inconnue: ${rule.strategy}`);
            return fetch(request);
        }
        
        return strategy(request, rule.cacheName, rule.maxAge);
    }
    
    async cacheFirst(request, cacheName, maxAge) {
        return cacheFirstStrategy(request, cacheName);
    }
    
    async networkFirst(request, cacheName, maxAge) {
        return networkFirstStrategy(request, cacheName);
    }
    
    async staleWhileRevalidate(request, cacheName, maxAge) {
        return staleWhileRevalidateStrategy(request, cacheName, maxAge);
    }
}
```

Cette approche intelligente offre plusieurs avantages :

**Flexibilité maximale** : Chaque type de ressource est traité avec la stratégie optimale.

**Configuration centralisée** : Facile de modifier les règles de cache.

**Évolutivité** : Nouvelle stratégies peuvent être ajoutées facilement.

**Performance optimisée** : Chaque ressource bénéficie de la meilleure approche pour son cas d'usage.

**Maintenance simplifiée** : Logique de cache centralisée et réutilisable.

## 5. Fonctionnalités avancées des PWA

Les PWA offrent des fonctionnalités avancées qui permettent de créer des expériences utilisateur véritablement immersives et engageantes. Ces fonctionnalités rapprochent considérablement les applications web des applications natives.

### 5.1 Notifications Push - Réengager les utilisateurs

Les notifications push représentent l'une des fonctionnalités les plus puissantes des PWA. Elles permettent de maintenir un lien constant avec vos utilisateurs, même lorsque l'application n'est pas ouverte, transformant ainsi l'engagement utilisateur de manière significative.

#### Architecture des notifications push

Le système de notifications push repose sur une architecture complexe impliquant plusieurs acteurs :

1. **Le serveur d'application** : Votre backend qui décide quand envoyer des notifications
2. **Le service de push** : Un service tiers (FCM pour Chrome, Mozilla's Push Service pour Firefox)
3. **Le Service Worker** : Qui reçoit et affiche les notifications
4. **L'utilisateur** : Qui reçoit et interagit avec les notifications

Cette architecture garantit que les notifications peuvent être délivrées même quand votre application n'est pas active, car elles transitent par l'infrastructure des navigateurs.

#### Mise en place complète des notifications push

```javascript
// Gestionnaire complet des notifications push
class PushNotificationManager {
    constructor() {
        this.publicVapidKey = 'YOUR_PUBLIC_VAPID_KEY'; // Clé publique VAPID
        this.privateVapidKey = 'YOUR_PRIVATE_VAPID_KEY'; // Clé privée (côté serveur uniquement)
        this.subscription = null;
        this.permission = Notification.permission;
    }

    async init() {
        // Vérifie le support des notifications
        if (!('Notification' in window)) {
            console.warn('Ce navigateur ne supporte pas les notifications');
            return false;
        }

        // Vérifie le support des Service Workers
        if (!('serviceWorker' in navigator)) {
            console.warn('Ce navigateur ne supporte pas les Service Workers');
            return false;
        }

        // Vérifie le support des notifications push
        if (!('PushManager' in window)) {
            console.warn('Ce navigateur ne supporte pas les notifications push');
            return false;
        }

        console.log('✅ Notifications push supportées');
        
        // Vérifie la permission actuelle
        await this.checkPermissionStatus();
        
        // Si déjà autorisé, configure l'abonnement
        if (this.permission === 'granted') {
            await this.setupPushSubscription();
        }

        return true;
    }

    async checkPermissionStatus() {
        this.permission = Notification.permission;
        console.log(`Permission actuelle pour les notifications: ${this.permission}`);
        
        // Met à jour l'interface utilisateur selon la permission
        this.updateUIBasedOnPermission();
    }

    updateUIBasedOnPermission() {
        const notificationButton = document.getElementById('notification-toggle');
        if (!notificationButton) return;

        switch (this.permission) {
            case 'granted':
                notificationButton.textContent = 'Notifications activées';
                notificationButton.classList.add('enabled');
                notificationButton.disabled = false;
                break;
            case 'denied':
                notificationButton.textContent = 'Notifications bloquées';
                notificationButton.classList.add('denied');
                notificationButton.disabled = true;
                break;
            case 'default':
                notificationButton.textContent = 'Activer les notifications';
                notificationButton.classList.remove('enabled', 'denied');
                notificationButton.disabled = false;
                break;
        }
    }

    async requestPermission() {
        try {
            console.log('Demande de permission pour les notifications...');
            
            // Demande la permission de manière moderne
            let permission;
            if ('Notification' in window && 'requestPermission' in Notification) {
                permission = await Notification.requestPermission();
            } else {
                // Fallback pour les navigateurs plus anciens
                permission = await new Promise((resolve) => {
                    Notification.requestPermission(resolve);
                });
            }

            this.permission = permission;
            console.log(`Permission accordée: ${permission}`);

            if (permission === 'granted') {
                await this.setupPushSubscription();
                this.showSuccessMessage('Notifications activées avec succès !');
            } else if (permission === 'denied') {
                this.showErrorMessage('Les notifications ont été bloquées. Vous pouvez les réactiver dans les paramètres du navigateur.');
            }

            this.updateUIBasedOnPermission();
            return permission;

        } catch (error) {
            console.error('Erreur lors de la demande de permission:', error);
            this.showErrorMessage('Erreur lors de l\'activation des notifications');
            throw error;
        }
    }

    async setupPushSubscription() {
        try {
            console.log('Configuration de l\'abonnement push...');
            
            const registration = await navigator.serviceWorker.ready;
            
            // Vérifie s'il existe déjà un abonnement
            let subscription = await registration.pushManager.getSubscription();
            
            if (!subscription) {
                console.log('Création d\'un nouvel abonnement push...');
                
                // Convertit la clé VAPID publique au bon format
                const applicationServerKey = this.urlBase64ToUint8Array(this.publicVapidKey);
                
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true, // Toutes les notifications doivent être visibles
                    applicationServerKey: applicationServerKey
                });
                
                console.log('✅ Nouvel abonnement push créé');
            } else {
                console.log('✅ Abonnement push existant récupéré');
            }

            this.subscription = subscription;
            
            // Envoie l'abonnement au serveur
            await this.sendSubscriptionToServer(subscription);
            
            return subscription;

        } catch (error) {
            console.error('Erreur lors de la configuration de l\'abonnement push:', error);
            throw error;
        }
    }

    async sendSubscriptionToServer(subscription) {
        try {
            console.log('Envoi de l\'abonnement au serveur...');
            
            const response = await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscription: subscription,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur serveur: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Abonnement envoyé au serveur:', result);

        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'abonnement:', error);
            // Ne pas faire échouer l'opération car l'abonnement local est valide
        }
    }

    async unsubscribe() {
        try {
            if (!this.subscription) {
                console.log('Aucun abonnement actif à annuler');
                return;
            }

            console.log('Annulation de l\'abonnement push...');
            
            // Annule l'abonnement localement
            const success = await this.subscription.unsubscribe();
            
            if (success) {
                console.log('✅ Abonnement annulé localement');
                
                // Informe le serveur de l'annulation
                await this.removeSubscriptionFromServer();
                
                this.subscription = null;
                this.showSuccessMessage('Notifications désactivées');
            } else {
                throw new Error('Échec de l\'annulation de l\'abonnement');
            }

        } catch (error) {
            console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
            this.showErrorMessage('Erreur lors de la désactivation des notifications');
        }
    }

    async removeSubscriptionFromServer() {
        try {
            await fetch('/api/push/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: this.subscription.endpoint
                })
            });
            console.log('✅ Abonnement supprimé du serveur');
        } catch (error) {
            console.error('Erreur lors de la suppression côté serveur:', error);
        }
    }

    // Utilitaire pour convertir la clé VAPID
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Méthodes d'affichage des messages
    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Réutilise le système de notification de l'application
        const event = new CustomEvent('show-notification', {
            detail: { message, type }
        });
        window.dispatchEvent(event);
    }

    // Test d'envoi de notification locale
    async testLocalNotification() {
        if (this.permission !== 'granted') {
            console.warn('Permission non accordée pour les notifications');
            return;
        }

        try {
            const notification = new Notification('Test de notification', {
                body: 'Ceci est une notification de test envoyée localement.',
                icon: '/icons/icon-192.png',
                badge: '/icons/badge-72.png',
                tag: 'test-notification',
                vibrate: [100, 50, 100],
                data: {
                    url: '/',
                    timestamp: Date.now()
                },
                actions: [
                    {
                        action: 'open',
                        title: 'Ouvrir l\'app'
                    },
                    {
                        action: 'close',
                        title: 'Fermer'
                    }
                ]
            });

            notification.onclick = () => {
                console.log('Notification cliquée');
                window.focus();
                notification.close();
            };

            // Auto-fermeture après 5 secondes
            setTimeout(() => {
                notification.close();
            }, 5000);

        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification test:', error);
        }
    }
}

// Gestion des notifications dans le Service Worker
// À ajouter dans sw.js
self.addEventListener('push', (event) => {
    console.log('📬 Notification push reçue dans le Service Worker');
    
    let notificationData = {};
    
    // Parse les données reçues
    if (event.data) {
        try {
            notificationData = event.data.json();
        } catch (error) {
            console.error('Erreur lors du parsing des données push:', error);
            notificationData = { title: 'Nouvelle notification', body: event.data.text() };
        }
    } else {
        notificationData = { title: 'Nouvelle notification', body: 'Vous avez reçu un nouveau message' };
    }

    // Configuration avancée de la notification
    const notificationOptions = {
        body: notificationData.body || 'Contenu de la notification',
        icon: notificationData.icon || '/icons/icon-192.png',
        badge: notificationData.badge || '/icons/badge-72.png',
        image: notificationData.image, // Image d'illustration (optionnelle)
        tag: notificationData.tag || 'default-notification',
        vibrate: notificationData.vibrate || [100, 50, 100],
        silent: notificationData.silent || false,
        requireInteraction: notificationData.requireInteraction || false,
        data: {
            url: notificationData.url || '/',
            timestamp: Date.now(),
            customData: notificationData.customData || {}
        },
        actions: notificationData.actions || [
            {
                action: 'open',
                title: 'Ouvrir',
                icon: '/icons/action-open.png'
            },
            {
                action: 'dismiss',
                title: 'Ignorer',
                icon: '/icons/action-dismiss.png'
            }
        ]
    };

    // Gestion des notifications groupées
    if (notificationData.group) {
        notificationOptions.tag = notificationData.group;
        notificationOptions.renotify = true;
    }

    // Affichage de la notification
    event.waitUntil(
        self.registration.showNotification(
            notificationData.title || 'Notification',
            notificationOptions
        ).then(() => {
            console.log('✅ Notification affichée avec succès');
            
            // Analytics - tracking de réception de notification
            trackNotificationEvent('received', notificationData);
        }).catch((error) => {
            console.error('❌ Erreur lors de l\'affichage de la notification:', error);
        })
    );
});

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Clic sur notification:', event.action, event.notification.data);
    
    const notification = event.notification;
    const action = event.action;
    const data = notification.data || {};
    
    // Ferme la notification
    notification.close();
    
    // Gestion des actions
    let responsePromise;
    
    switch (action) {
        case 'open':
            responsePromise = handleOpenAction(data);
            break;
        case 'dismiss':
            responsePromise = handleDismissAction(data);
            break;
        default:
            // Clic principal sur la notification
            responsePromise = handleDefaultAction(data);
            break;
    }
    
    // Analytics
    trackNotificationEvent('clicked', { action, data });
    
    event.waitUntil(responsePromise);
});

async function handleOpenAction(data) {
    const url = data.url || '/';
    
    // Essaie d'ouvrir l'URL dans un onglet existant de l'application
    const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    });
    
    // Cherche une fenêtre existante avec l'application
    for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
            await client.focus();
            if (url !== '/') {
                client.postMessage({
                    type: 'NAVIGATE_TO',
                    payload: { url }
                });
            }
            return;
        }
    }
    
    // Aucune fenêtre existante, ouvre une nouvelle fenêtre
    return self.clients.openWindow(url);
}

async function handleDismissAction(data) {
    console.log('Notification ignorée');
    // Optionnel: marquer comme lu côté serveur
    if (data.customData && data.customData.messageId) {
        try {
            await fetch('/api/notifications/mark-read', {
                method: 'POST',
                body: JSON.stringify({ messageId: data.customData.messageId })
            });
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
        }
    }
}

async function handleDefaultAction(data) {
    // Action par défaut = ouvrir l'application
    return handleOpenAction(data);
}

function trackNotificationEvent(eventType, data) {
    // Envoi des analytics
    try {
        // Exemple avec Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'notification_' + eventType, {
                event_category: 'Push Notifications',
                event_label: data.tag || 'default',
                value: 1
            });
        }
        
        // Ou avec une API analytics personnalisée
        fetch('/api/analytics/notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: eventType,
                timestamp: Date.now(),
                data: data
            })
        }).catch(console.error);
        
    } catch (error) {
        console.error('Erreur lors du tracking:', error);
    }
}
```

#### Côté serveur - Envoi des notifications

```javascript
// Exemple d'implémentation côté serveur (Node.js avec web-push)
import webpush from 'web-push';

// Configuration VAPID
webpush.setVapidDetails(
    'mailto:votre-email@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

class PushNotificationService {
    constructor() {
        this.subscriptions = new Map(); // En production, utiliser une base de données
    }
    
    // Stocke un abonnement
    addSubscription(userId, subscription) {
        this.subscriptions.set(userId, subscription);
        console.log(`Abonnement stocké pour l'utilisateur ${userId}`);
    }
    
    // Supprime un abonnement
    removeSubscription(userId) {
        this.subscriptions.delete(userId);
        console.log(`Abonnement supprimé pour l'utilisateur ${userId}`);
    }
    
    // Envoie une notification à un utilisateur spécifique
    async sendNotificationToUser(userId, payload) {
        const subscription = this.subscriptions.get(userId);
        if (!subscription) {
            throw new Error(`Aucun abonnement trouvé pour l'utilisateur ${userId}`);
        }
        
        try {
            const result = await webpush.sendNotification(subscription, JSON.stringify(payload));
            console.log(`✅ Notification envoyée à l'utilisateur ${userId}`);
            return result;
        } catch (error) {
            console.error(`❌ Erreur lors de l'envoi à l'utilisateur ${userId}:`, error);
            
            // Si l'abonnement n'est plus valide, le supprimer
            if (error.statusCode === 410) {
                this.removeSubscription(userId);
            }
            
            throw error;
        }
    }
    
    // Envoie une notification à tous les utilisateurs abonnés
    async sendBroadcastNotification(payload) {
        const results = [];
        const promises = [];
        
        for (const [userId, subscription] of this.subscriptions) {
            const promise = this.sendNotificationToUser(userId, payload)
                .then(() => ({ userId, success: true }))
                .catch((error) => ({ userId, success: false, error: error.message }));
            
            promises.push(promise);
        }
        
        const allResults = await Promise.allSettled(promises);
        allResults.forEach(result => {
            if (result.status === 'fulfilled') {
                results.push(result.value);
            }
        });
        
        console.log(`📊 Diffusion terminée: ${results.length} tentatives`);
        return results;
    }
}

// API endpoints Express
import express from 'express';
const app = express();
const pushService = new PushNotificationService();

// Endpoint pour l'abonnement
app.post('/api/push/subscribe', (req, res) => {
    const { subscription, userId } = req.body;
    
    try {
        pushService.addSubscription(userId || 'anonymous', subscription);
        res.json({ success: true, message: 'Abonnement enregistré' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint pour se désabonner
app.post('/api/push/unsubscribe', (req, res) => {
    const { userId } = req.body;
    
    try {
        pushService.removeSubscription(userId || 'anonymous');
        res.json({ success: true, message: 'Désabonnement effectué' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint pour envoyer une notification
app.post('/api/push/send', async (req, res) => {
    const { userId, title, body, url, options } = req.body;
    
    const payload = {
        title,
        body,
        url: url || '/',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        ...options
    };
    
    try {
        if (userId) {
            await pushService.sendNotificationToUser(userId, payload);
        } else {
            await pushService.sendBroadcastNotification(payload);
        }
        
        res.json({ success: true, message: 'Notification envoyée' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

### 5.2 Synchronisation en arrière-plan

La synchronisation en arrière-plan permet à votre PWA de synchroniser des données même lorsque l'utilisateur n'utilise pas activement l'application. Cette fonctionnalité est essentielle pour maintenir la cohérence des données et offrir une expérience utilisateur transparente.

#### Concepts fondamentaux

La synchronisation en arrière-plan implique plusieurs défis techniques :
- **Stockage local** : Où et comment stocker les données sur l'appareil de l'utilisateur
- **Synchronisation** : Comment et quand synchroniser les données avec le serveur
- **Gestion des conflits** : Que faire en cas de conflit entre les données locales et celles du serveur

#### Stockage local avec IndexedDB

IndexedDB est une API de stockage côté client qui permet de stocker des objets JavaScript dans des bases de données indexées. Elle est idéale pour les PWA car elle permet un accès asynchrone et ne bloque pas le fil d'exécution principal.

```javascript
// Exemple de gestion de la base de données avec IndexedDB
class TodoDB {
    static init() {
        return this.openDB('TodoDB', 1, (upgradeDB) => {
            if (!upgradeDB.objectStoreNames.contains('tasks')) {
                const taskStore = upgradeDB.createObjectStore('tasks', { keyPath: 'id' });
                taskStore.createIndex('completed', 'completed');
                taskStore.createIndex('dueDate', 'dueDate');
            }
        });
    }

    static openDB(dbName, version, upgradeCallback) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('tasks')) {
                    const store = db.createObjectStore('tasks', { keyPath: 'id' });
                    store.createIndex('completed', 'completed', { unique: false });
                    store.createIndex('dueDate', 'dueDate', { unique: false });
                }
            };
        });
    }

    static addTask(task) {
        return this.openDB('TodoDB', 1).then((db) => {
            const transaction = db.transaction('tasks', 'readwrite');
            const store = transaction.objectStore('tasks');
            store.add(task);
            return transaction.complete;
        });
    }

    static getTask(id) {
        return this.openDB('TodoDB', 1).then((db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction('tasks', 'readonly');
                const store = transaction.objectStore('tasks');
                const request = store.get(id);
                
                request.onerror = (event) => {
                    console.error('Erreur lors de la récupération de la tâche:', event);
                    reject(event);
                };
                
                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };
            });
        });
    }

    static getAllTasks() {
        return this.openDB('TodoDB', 1).then((db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction('tasks', 'readonly');
                const store = transaction.objectStore('tasks');
                const request = store.getAll();
                
                request.onerror = (event) => {
                    console.error('Erreur lors de la récupération des tâches:', event);
                    reject(event);
                };
                
                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };
            });
        });
    }

    static updateTask(task) {
        return this.openDB('TodoDB', 1).then((db) => {
            const transaction = db.transaction('tasks', 'readwrite');
            const store = transaction.objectStore('tasks');
            store.put(task);
            return transaction.complete;
        });
    }

    static deleteTask(id) {
        return this.openDB('TodoDB', 1).then((db) => {
            const transaction = db.transaction('tasks', 'readwrite');
            const store = transaction.objectStore('tasks');
            store.delete(id);
            return transaction.complete;
        });
    }
}
```

#### Réconciliation des données

La réconciliation des données est le processus qui consiste à s'assurer que les données stockées localement et celles sur le serveur sont cohérentes. Cela peut impliquer la résolution de conflits, le téléchargement de données manquantes, ou la suppression de données obsolètes.

```javascript
// Exemple de réconciliation des données
class DataSyncManager {
    constructor() {
        this.localChanges = [];
    }

    // Enregistre une modification locale pour synchronisation ultérieure
    queueLocalChange(change) {
        this.localChanges.push(change);
        this.saveChangesToDB();
    }

    // Sauvegarde les changements en attente dans IndexedDB
    async saveChangesToDB() {
        const db = await this.openSyncDB();
        const transaction = db.transaction(['changes'], 'readwrite');
        const store = transaction.objectStore('changes');
        
        for (const change of this.localChanges) {
            store.put(change);
        }
        
        await transaction.complete;
        console.log('Changements sauvegardés en base de données');
    }

    // Synchronise les changements locaux avec le serveur
    async syncWithServer() {
        const changes = await this.getPendingChanges();
        
        for (const change of changes) {
            try {
                await this.sendChangeToServer(change);
                await this.removeChangeFromDB(change.id);
            } catch (error) {
                console.error('Erreur lors de la synchronisation du changement:', error);
            }
        }
    }

    async sendChangeToServer(change) {
        const response = await fetch('/api/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify(change)
        });
        
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        
        return await response.json();
    }

    async getPendingChanges() {
        const db = await this.openSyncDB();
        const transaction = db.transaction(['changes'], 'readonly');
        const store = transaction.objectStore('changes');
        return await store.getAll();
    }

    async removeChangeFromDB(id) {
        const db = await this.openSyncDB();
        const transaction = db.transaction(['changes'], 'readwrite');
        const store = transaction.objectStore('changes');
        await store.delete(id);
        await transaction.complete;
    }
}
```

Cette gestion avancée des données hors ligne permet de :
- **Stocker efficacement les données** sur l'appareil de l'utilisateur
- **Synchroniser automatiquement** les données avec le serveur
- **Gérer les conflits** de manière transparente
- **Offrir une expérience utilisateur fluide**, même en cas de connexion instable

## 6. Optimisation et bonnes pratiques pour les PWA

L'optimisation d'une PWA ne se limite pas aux aspects techniques ; elle englobe l'ensemble de l'expérience utilisateur, des performances, de l'accessibilité et du référencement. Une PWA bien optimisée doit rivaliser avec les meilleures applications natives en termes de vitesse, de fluidité et d'engagement utilisateur.

### 6.1 Optimisation des performances

Les performances sont cruciales pour le succès d'une PWA. Les utilisateurs s'attendent à des temps de chargement rapides et à une interaction fluide, quel que soit l'appareil ou la qualité de la connexion réseau.

#### Stratégies de chargement optimisé

**Lazy Loading (Chargement paresseux)**

Le lazy loading consiste à ne charger les ressources que lorsqu'elles sont nécessaires, réduisant ainsi le temps de chargement initial et la consommation de bande passante.

```javascript
// Implémentation du lazy loading pour les images
class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.setupIntersectionObserver();
        this.observeImages();
    }

    setupIntersectionObserver() {
        // Vérifie le support de l'Intersection Observer
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                // Commence à charger 50px avant que l'image soit visible
                rootMargin: '50px 0px',
                threshold: 0.01
            });
        }
    }

    observeImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (this.imageObserver) {
            lazyImages.forEach(img => {
                this.imageObserver.observe(img);
            });
        } else {
            // Fallback pour les navigateurs sans Intersection Observer
            lazyImages.forEach(img => {
                this.loadImage(img);
            });
        }
    }

    loadImage(img) {
        // Précharge l'image
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Applique l'image avec une transition douce
            img.src = img.dataset.src;
            img.classList.add('loaded');
            
            // Supprime l'attribut data-src devenu inutile
            img.removeAttribute('data-src');
        };

        imageLoader.onerror = () => {
            // Image de fallback en cas d'erreur
            img.src = '/images/placeholder-error.svg';
            img.classList.add('error');
        };

        // Déclenche le chargement
        imageLoader.src = img.dataset.src;
    }

    // Méthode pour observer de nouvelles images ajoutées dynamiquement
    observeNewImages(container) {
        if (!this.imageObserver) return;
        
        const newImages = container.querySelectorAll('img[data-src]');
        newImages.forEach(img => {
            this.imageObserver.observe(img);
        });
    }
}

// Lazy loading pour les modules JavaScript
class ModuleLoader {
    static async loadModule(moduleName) {
        try {
            console.log(`📦 Chargement du module: ${moduleName}`);
            
            // Utilise l'import dynamique pour charger le module à la demande
            const module = await import(`/js/modules/${moduleName}.js`);
            
            console.log(`✅ Module chargé: ${moduleName}`);
            return module;
        } catch (error) {
            console.error(`❌ Erreur lors du chargement du module ${moduleName}:`, error);
            throw error;
        }
    }

    static async loadFeature(featureName) {
        const loadingIndicator = this.showLoadingIndicator(featureName);
        
        try {
            const module = await this.loadModule(featureName);
            
            // Initialise le module
            if (module.init && typeof module.init === 'function') {
                await module.init();
            }
            
            this.hideLoadingIndicator(loadingIndicator);
            return module;
        } catch (error) {
            this.hideLoadingIndicator(loadingIndicator);
            this.showErrorMessage(`Impossible de charger la fonctionnalité: ${featureName}`);
            throw error;
        }
    }

    static showLoadingIndicator(featureName) {
        const indicator = document.createElement('div');
        indicator.className = 'loading-indicator';
        indicator.innerHTML = `
            <div class="spinner"></div>
            <p>Chargement de ${featureName}...</p>
        `;
        document.body.appendChild(indicator);
        return indicator;
    }

    static hideLoadingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }

    static showErrorMessage(message) {
        // Utilise le système de notification de l'application
        window.dispatchEvent(new CustomEvent('show-notification', {
            detail: { message, type: 'error' }
        }));
    }
}
```

**Code Splitting et bundling intelligent**

Le code splitting permet de diviser votre application en plusieurs petits bundles qui peuvent être chargés à la demande, réduisant considérablement le temps de chargement initial.

```javascript
// Configuration webpack pour le code splitting
// webpack.config.js
module.exports = {
    entry: {
        main: './src/app.js',
        vendor: ['react', 'lodash'] // Bibliothèques externes dans un bundle séparé
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 10
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'all',
                    priority: 5
                }
            }
        }
    }
};

// Utilisation du code splitting dans l'application
class FeatureManager {
    static async loadDashboard() {
        const { Dashboard } = await import('./features/dashboard');
        return new Dashboard();
    }

    static async loadReports() {
        const { Reports } = await import('./features/reports');
        return new Reports();
    }

    static async loadSettings() {
        const { Settings } = await import('./features/settings');
        return new Settings();
    }
}
```

**Compression et minification**

La compression des ressources est essentielle pour réduire la taille des fichiers transférés.

```javascript
// Configuration pour la compression des ressources
// Dans votre serveur Express
import compression from 'compression';
import express from 'express';
const app = express();

// Active la compression gzip
app.use(compression({
    level: 6, // Niveau de compression (1-9)
    threshold: 1024, // Ne compresse que les fichiers > 1KB
    filter: (req, res) => {
        // Ne compresse pas les images déjà compressées
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

// Configuration de la mise en cache des ressources statiques
app.use('/static', express.static('public', {
    maxAge: '1y', // Cache pendant 1 an
    immutable: true // Les fichiers ne changent jamais
}));

// Configuration des en-têtes de cache pour différents types de fichiers
app.use((req, res, next) => {
    // Images et fonts - cache long terme
    if (req.url.match(/\.(jpg|jpeg|png|gif|webp|svg|woff|woff2|ttf|eot)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // CSS et JS - cache avec validation
    else if (req.url.match(/\.(css|js)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // HTML - pas de cache
    else if (req.url.match(/\.html$/)) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    
    next();
});
```

#### Optimisation du Critical Rendering Path

Le Critical Rendering Path est la séquence d'étapes que le navigateur doit suivre pour rendre la page. L'optimiser est crucial pour améliorer les performances perçues.

```html
<!-- Optimisation du Critical CSS -->
<head>
    <!-- CSS critique inline pour un rendu immédiat -->
    <style>
        /* CSS critique pour le contenu above-the-fold */
        body { margin: 0; font-family: Arial, sans-serif; }
        .header { background: #007bff; color: white; padding: 1rem; }
        .loading { display: flex; justify-content: center; padding: 2rem; }
        .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
    
    <!-- Préchargement des ressources critiques -->
    <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/css/main.css" as="style">
    <link rel="preload" href="/js/app.js" as="script">
    
    <!-- CSS non-critique chargé de manière asynchrone -->
    <link rel="preload" href="/css/non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="/css/non-critical.css"></noscript>
</head>
```

**Resource Hints et préchargement intelligent**

```javascript
// Gestionnaire de préchargement intelligent
class ResourcePreloader {
    constructor() {
        this.preloadedResources = new Set();
        this.setupPredictivePreloading();
    }

    // Précharge une ressource
    preload(url, type = 'fetch') {
        if (this.preloadedResources.has(url)) {
            return; // Déjà préchargé
        }

        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        
        switch (type) {
            case 'style':
                link.as = 'style';
                break;
            case 'script':
                link.as = 'script';
                break;
            case 'image':
                link.as = 'image';
                break;
            case 'font':
                link.as = 'font';
                link.crossOrigin = 'anonymous';
                break;
            default:
                link.as = 'fetch';
                link.crossOrigin = 'anonymous';
        }

        document.head.appendChild(link);
        this.preloadedResources.add(url);
        
        console.log(`🔮 Ressource préchargée: ${url}`);
    }

    // Précharge les ressources au survol des liens
    setupPredictivePreloading() {
        document.addEventListener('mouseover', (event) => {
            if (event.target.tagName === 'A') {
                const href = event.target.href;
                if (href && !this.preloadedResources.has(href)) {
                    this.preload(href);
                }
            }
        });

        document.addEventListener('touchstart', (event) => {
            if (event.target.tagName === 'A') {
                const href = event.target.href;
                if (href && !this.preloadedResources.has(href)) {
                    this.preload(href);
                }
            }
        });
    }
}
```

### 6.2 Accessibilité (A11y) - Concevoir pour tous

L'accessibilité n'est pas une option mais une nécessité. Une PWA accessible garantit que tous les utilisateurs, y compris ceux ayant des handicaps, peuvent utiliser votre application efficacement.

#### Principes fondamentaux de l'accessibilité

**WCAG 2.1 et les quatre piliers**

Les Web Content Accessibility Guidelines (WCAG) 2.1 reposent sur quatre principes fondamentaux :

1. **Perceptible** : L'information doit être présentée de manière que tous les utilisateurs puissent la percevoir
2. **Utilisable** : L'interface doit être utilisable par tous, y compris avec des technologies d'assistance
3. **Compréhensible** : L'information et l'interface doivent être compréhensibles
4. **Robuste** : Le contenu doit être suffisamment robuste pour être interprété par une grande variété d'agents utilisateur

#### Implémentation pratique de l'accessibilité

```javascript
// Gestionnaire d'accessibilité pour PWA
class AccessibilityManager {
    constructor() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
        this.setupColorContrastChecking();
    }

    setupKeyboardNavigation() {
        // Navigation au clavier améliorée
        document.addEventListener('keydown', (event) => {
            // Navigation par onglets personnalisée
            if (event.key === 'Tab') {
                this.handleTabNavigation(event);
            }
            
            // Raccourcis clavier globaux
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case '/':
                        event.preventDefault();
                        this.focusSearchInput();
                        break;
                    case 'k':
                        event.preventDefault();
                        this.openCommandPalette();
                        break;
                }
            }
            
            // Échapper pour fermer les modales
            if (event.key === 'Escape') {
                this.closeActiveModal();
            }
        });

        // Ajoute des indicateurs visuels pour la navigation clavier
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    handleTabNavigation(event) {
        const focusableElements = this.getFocusableElements();
        const currentIndex = focusableElements.indexOf(document.activeElement);
        
        if (event.shiftKey) {
            // Tab + Shift = navigation arrière
            const previousIndex = currentIndex - 1;
            if (previousIndex >= 0) {
                focusableElements[previousIndex].focus();
                event.preventDefault();
            }
        } else {
            // Tab = navigation avant
            const nextIndex = currentIndex + 1;
            if (nextIndex < focusableElements.length) {
                focusableElements[nextIndex].focus();
                event.preventDefault();
            }
        }
    }

    getFocusableElements() {
        const selector = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ].join(', ');

        return Array.from(document.querySelectorAll(selector))
            .filter(element => {
                // Exclut les éléments cachés
                return element.offsetWidth > 0 && element.offsetHeight > 0;
            });
    }

    setupScreenReaderSupport() {
        // Annonces dynamiques pour les lecteurs d'écran
        this.createAriaLiveRegions();
        
        // Mise à jour automatique des attributs ARIA
        this.updateAriaLabels();
        
        // Gestion des changements de contenu dynamique
        this.setupDynamicContentAnnouncements();
    }

    createAriaLiveRegions() {
        // Région pour les annonces polies (non urgentes)
        if (!document.getElementById('aria-live-polite')) {
            const politeRegion = document.createElement('div');
            politeRegion.id = 'aria-live-polite';
            politeRegion.setAttribute('aria-live', 'polite');
            politeRegion.setAttribute('aria-atomic', 'true');
            politeRegion.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
            document.body.appendChild(politeRegion);
        }

        // Région pour les annonces assertives (urgentes)
        if (!document.getElementById('aria-live-assertive')) {
            const assertiveRegion = document.createElement('div');
            assertiveRegion.id = 'aria-live-assertive';
            assertiveRegion.setAttribute('aria-live', 'assertive');
            assertiveRegion.setAttribute('aria-atomic', 'true');
            assertiveRegion.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
            document.body.appendChild(assertiveRegion);
        }
    }

    announceToScreenReader(message, priority = 'polite') {
        const regionId = priority === 'assertive' ? 'aria-live-assertive' : 'aria-live-polite';
        const region = document.getElementById(regionId);
        
        if (region) {
            // Nettoie d'abord la région pour forcer l'annonce
            region.textContent = '';
            
            // Ajoute le message après un court délai
            setTimeout(() => {
                region.textContent = message;
            }, 100);
            
            // Nettoie après l'annonce
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }
    }

    updateAriaLabels() {
        // Met à jour automatiquement les labels ARIA
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        
        buttons.forEach(button => {
            const text = button.textContent.trim();
            const icon = button.querySelector('svg, i, .icon');
            
            if (!text && icon) {
                // Bouton avec icône seulement - ajoute un label descriptif
                const action = this.inferActionFromContext(button);
                if (action) {
                    button.setAttribute('aria-label', action);
                }
            }
        });

        // Met à jour les formulaires
        const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        
        inputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label && input.placeholder) {
                input.setAttribute('aria-label', input.placeholder);
            }
        });
    }

    inferActionFromContext(button) {
        const classes = Array.from(button.classList);
        const parent = button.parentElement;
        
        // Devine l'action basée sur les classes CSS
        if (classes.includes('delete') || classes.includes('remove')) {
            return 'Supprimer';
        }
        if (classes.includes('edit') || classes.includes('modify')) {
            return 'Modifier';
        }
        if (classes.includes('add') || classes.includes('create')) {
            return 'Ajouter';
        }
        if (classes.includes('close')) {
            return 'Fermer';
        }
        if (classes.includes('menu') || classes.includes('hamburger')) {
            return 'Ouvrir le menu';
        }
        
        // Devine basé sur le contexte parent
        if (parent && parent.classList.contains('task-item')) {
            return 'Action sur la tâche';
        }
        
        return null;
    }

    setupFocusManagement() {
        // Gestion du focus pour les SPA
        this.setupRouteChangeFocus();
        
        // Piège de focus pour les modales
        this.setupModalFocusTrap();
        
        // Restauration du focus
        this.setupFocusRestoration();
    }

    setupRouteChangeFocus() {
        // Écoute les changements de route (si utilisation d'un router)
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });
    }

    handleRouteChange() {
        // Place le focus sur le titre principal de la nouvelle page
        const mainHeading = document.querySelector('h1');
        if (mainHeading) {
            mainHeading.setAttribute('tabindex', '-1');
            mainHeading.focus();
            
            // Annonce le changement de page
            this.announceToScreenReader(`Page chargée: ${mainHeading.textContent}`);
        }
    }

    setupColorContrastChecking() {
        if (process.env.NODE_ENV === 'development') {
            // Vérification automatique du contraste en mode développement
            this.checkColorContrast();
        }
    }

    checkColorContrast() {
        const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
        
        textElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const textColor = this.parseColor(styles.color);
            const backgroundColor = this.parseColor(styles.backgroundColor);
            
            if (backgroundColor.a === 0) {
                // Couleur de fond transparente, cherche l'arrière-plan parent
                const parentBg = this.getEffectiveBackgroundColor(element);
                if (parentBg) {
                    const contrast = this.calculateContrast(textColor, parentBg);
                    this.reportContrastIssues(element, contrast);
                }
            } else {
                const contrast = this.calculateContrast(textColor, backgroundColor);
                this.reportContrastIssues(element, contrast);
            }
        });
    }

    calculateContrast(color1, color2) {
        // Calcule le ratio de contraste selon les WCAG
        const l1 = this.getLuminance(color1);
        const l2 = this.getLuminance(color2);
        
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    getLuminance(color) {
        // Calcule la luminance relative
        const { r, g, b } = color;
        
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    reportContrastIssues(element, ratio) {
        const minRatio = 4.5; // WCAG AA standard
        
        if (ratio < minRatio) {
            console.warn(`⚠️ Problème de contraste détecté:`, {
                element: element,
                ratio: ratio.toFixed(2),
                minimum: minRatio,
                text: element.textContent.substring(0, 50)
            });
            
            // Ajoute une classe pour identifier visuellement les problèmes
            element.classList.add('contrast-issue');
        }
    }

    parseColor(colorString) {
        // Parse une chaîne de couleur CSS en objet RGB
        const div = document.createElement('div');
        div.style.color = colorString;
        document.body.appendChild(div);
        
        const computed = window.getComputedStyle(div).color;
        document.body.removeChild(div);
        
        const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3]),
                a: 1
            };
        }
        
        return { r: 0, g: 0, b: 0, a: 1 };
    }
}

// CSS pour améliorer l'accessibilité
const accessibilityCSS = `
/* Indicateurs de focus améliorés */
.keyboard-navigation *:focus {
    outline: 3px solid #007bff;
    outline-offset: 2px;
}

/* Cache les éléments visuellement mais les garde accessibles aux lecteurs d'écran */
.sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}

/* Styles pour les problèmes de contraste en mode développement */
.contrast-issue {
    border: 2px dashed red !important;
}

/* Amélioration de la lisibilité */
body {
    line-height: 1.5;
    font-size: 16px;
}

/* Focus visible pour tous les éléments interactifs */
a, button, input, select, textarea {
    transition: outline 0.2s ease;
}

/* États de boutons accessibles */
button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

button[aria-pressed="true"] {
    background-color: #007bff;
    color: white;
}

/* Espacement minimal pour les cibles tactiles */
button, a, input[type="checkbox"], input[type="radio"] {
    min-height: 44px;
    min-width: 44px;
}
`;

// Injection du CSS d'accessibilité
function injectAccessibilityCSS() {
    const style = document.createElement('style');
    style.textContent = accessibilityCSS;
    document.head.appendChild(style);
}
```

### 6.3 SEO et discoverabilité

Bien que les PWA soient des applications, elles bénéficient grandement d'une bonne optimisation pour les moteurs de recherche. Une PWA bien référencée atteint plus d'utilisateurs et offre une meilleure discoverabilité.

#### Stratégies SEO pour PWA

**Structure sémantique et métadonnées**

```html
<!-- Structure HTML sémantique optimisée pour le SEO -->
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Métadonnées de base -->
    <title>Todo PWA - Gestionnaire de tâches moderne</title>
    <meta name="description" content="Organisez vos tâches avec notre gestionnaire moderne. Fonctionne hors ligne, synchronisation automatique, notifications intelligentes.">
    <meta name="keywords" content="gestionnaire tâches, todo, productivité, PWA, hors ligne">
    <meta name="author" content="Votre Entreprise">
    
    <!-- Open Graph pour les réseaux sociaux -->
    <meta property="og:title" content="Todo PWA - Gestionnaire de tâches moderne">
    <meta property="og:description" content="Organisez vos tâches avec notre gestionnaire moderne qui fonctionne hors ligne">
    <meta property="og:image" content="https://votre-domaine.com/images/og-image.png">
    <meta property="og:url" content="https://votre-domaine.com">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="fr_FR">
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Todo PWA - Gestionnaire de tâches moderne">
    <meta name="twitter:description" content="Organisez vos tâches avec notre gestionnaire moderne qui fonctionne hors ligne">
    <meta name="twitter:image" content="https://votre-domaine.com/images/twitter-card.png">
    
    <!-- Données structurées JSON-LD -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Todo PWA",
        "description": "Gestionnaire de tâches moderne avec support hors ligne",
        "url": "https://votre-domaine.com",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "All",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
        },
        "author": {
            "@type": "Organization",
            "name": "Votre Entreprise"
        }
    }
    </script>
    
    <!-- Liens canoniques -->
    <link rel="canonical" href="https://votre-domaine.com">
    
    <!-- Sitemap -->
    <link rel="sitemap" type="application/xml" href="/sitemap.xml">
</head>
<body>
    <!-- Structure sémantique claire -->
    <header role="banner">
        <nav role="navigation" aria-label="Navigation principale">
            <!-- Navigation -->
        </nav>
    </header>
    
    <main role="main">
        <h1>Gestionnaire de tâches Todo PWA</h1>
        <!-- Contenu principal -->
    </main>
    
    <aside role="complementary">
        <!-- Contenu complémentaire -->
    </aside>
    
    <footer role="contentinfo">
        <!-- Pied de page -->
    </footer>
</body>
</html>
```

**Optimisation pour les Core Web Vitals**

```javascript
// Surveillance et optimisation des Core Web Vitals
class WebVitalsOptimizer {
    constructor() {
        this.metrics = {};
        this.setupWebVitalsTracking();
        this.optimizeMetrics();
    }

    setupWebVitalsTracking() {
        // Largest Contentful Paint (LCP)
        this.observeLCP();
        
        // First Input Delay (FID)
        this.observeFID();
        
        // Cumulative Layout Shift (CLS)
        this.observeCLS();
        
        // First Contentful Paint (FCP)
        this.observeFCP();
    }

    observeLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.metrics.lcp = lastEntry.startTime;
                console.log('LCP:', lastEntry.startTime);
                
                // Optimisation si LCP trop élevé
                if (lastEntry.startTime > 2500) {
                    this.optimizeLCP();
                }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    observeFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    console.log('FID:', this.metrics.fid);
                    
                    // Optimisation si FID trop élevé
                    if (this.metrics.fid > 100) {
                        this.optimizeFID();
                    }
                }
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        }
    }

    observeCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                
                this.metrics.cls = clsValue;
                console.log('CLS:', clsValue);
                
                // Optimisation si CLS trop élevé
                if (clsValue > 0.1) {
                    this.optimizeCLS();
                }
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }

    observeFCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.fcp = entry.startTime;
                        console.log('FCP:', entry.startTime);
                    }
                }
            });
            
            observer.observe({ entryTypes: ['paint'] });
        }
    }

    optimizeLCP() {
        console.log('🚀 Optimisation LCP en cours...');
        
        // Précharge les images critiques
        const heroImage = document.querySelector('.hero-image img');
        if (heroImage && !heroImage.loading) {
            heroImage.loading = 'eager';
        }
        
        // Optimise les fonts
        this.optimizeFontLoading();
        
        // Supprime les ressources bloquantes non critiques
        this.deferNonCriticalResources();
    }

    optimizeFID() {
        console.log('⚡ Optimisation FID en cours...');
        
        // Divise les tâches longues
        this.breakUpLongTasks();
        
        // Reporte l'exécution de JavaScript non critique
        this.deferNonCriticalJS();
    }

    optimizeCLS() {
        console.log('📐 Optimisation CLS en cours...');
        
        // Ajoute des dimensions fixes aux images
        this.addImageDimensions();
        
        // Réserve l'espace pour le contenu dynamique
        this.reserveSpaceForDynamicContent();
    }

    optimizeFontLoading() {
        // Utilise font-display: swap pour les fonts personnalisées
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'CustomFont';
                src: url('/fonts/custom-font.woff2') format('woff2');
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }

    breakUpLongTasks() {
        // Utilise scheduler.postTask si disponible, sinon setTimeout
        const scheduleTask = (task) => {
            if ('scheduler' in window && 'postTask' in scheduler) {
                scheduler.postTask(task, { priority: 'user-blocking' });
            } else {
                setTimeout(task, 0);
            }
        };

        // Exemple de division d'une tâche longue
        const processLargeDataset = (data) => {
            const chunkSize = 1000;
            let index = 0;

            const processChunk = () => {
                const end = Math.min(index + chunkSize, data.length);
                
                for (let i = index; i < end; i++) {
                    // Traite un élément
                    this.processDataItem(data[i]);
                }
                
                index = end;
                
                if (index < data.length) {
                    scheduleTask(processChunk);
                }
            };

            scheduleTask(processChunk);
        };
    }

    addImageDimensions() {
        const images = document.querySelectorAll('img:not([width]):not([height])');
        
        images.forEach(img => {
            // Utilise l'Intersection Observer pour charger les dimensions
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Calcule et applique les dimensions appropriées
                        const aspectRatio = this.getImageAspectRatio(img.src);
                        if (aspectRatio) {
                            const computedWidth = img.getBoundingClientRect().width;
                            const computedHeight = computedWidth / aspectRatio;
                            
                            img.setAttribute('width', computedWidth);
                            img.setAttribute('height', computedHeight);
                        }
                        
                        observer.unobserve(img);
                    }
                });
            });
            
            observer.observe(img);
        });
    }

    getImageAspectRatio(src) {
        // Cache des ratios d'aspect des images
        const ratioCache = this.getFromCache('imageRatios') || {};
        
        if (ratioCache[src]) {
            return ratioCache[src];
        }
        
        // Charge l'image pour obtenir ses dimensions
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const ratio = img.naturalWidth / img.naturalHeight;
                ratioCache[src] = ratio;
                this.saveToCache('imageRatios', ratioCache);
                resolve(ratio);
            };
            img.src = src;
        });
    }

    reserveSpaceForDynamicContent() {
        // Ajoute des placeholders pour le contenu chargé dynamiquement
        const dynamicContainers = document.querySelectorAll('[data-dynamic-content]');
        
        dynamicContainers.forEach(container => {
            if (!container.style.minHeight) {
                // Estime la hauteur basée sur le contenu type
                const estimatedHeight = this.estimateContentHeight(container);
                container.style.minHeight = `${estimatedHeight}px`;
                container.classList.add('dynamic-content-placeholder');
            }
        });
    }

    estimateContentHeight(container) {
        const contentType = container.dataset.dynamicContent;
        
        // Estimations basées sur des mesures typiques
        switch (contentType) {
            case 'task-list':
                return 300; // Hauteur moyenne pour une liste de tâches
            case 'user-profile':
                return 200;
            case 'notification-center':
                return 400;
            default:
                return 150;
        }
    }

    // Méthodes utilitaires de cache
    getFromCache(key) {
        try {
            const cached = localStorage.getItem(`webvitals_${key}`);
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    }

    saveToCache(key, data) {
        try {
            localStorage.setItem(`webvitals_${key}`, JSON.stringify(data));
        } catch {
            // Ignore les erreurs de stockage
        }
    }
}
```

**Génération de sitemap dynamique**

```javascript
// Générateur de sitemap pour PWA
class SitemapGenerator {
    constructor() {
        this.urls = [];
        this.baseUrl = 'https://votre-domaine.com';
    }

    addUrl(url, lastmod = new Date(), changefreq = 'weekly', priority = 0.5) {
        this.urls.push({
            loc: `${this.baseUrl}${url}`,
            lastmod: lastmod.toISOString().split('T')[0],
            changefreq,
            priority
        });
    }

    addStaticPages() {
        // Pages statiques importantes
        this.addUrl('/', new Date(), 'daily', 1.0);
        this.addUrl('/about', new Date(), 'monthly', 0.8);
        this.addUrl('/contact', new Date(), 'monthly', 0.7);
        this.addUrl('/help', new Date(), 'weekly', 0.6);
    }

    async addDynamicPages() {
        // Pages générées dynamiquement (si applicable)
        try {
            const response = await fetch('/api/public-tasks');
            const tasks = await response.json();
            
            tasks.forEach(task => {
                this.addUrl(
                    `/task/${task.id}`,
                    new Date(task.updatedAt),
                    'weekly',
                    0.6
                );
            });
        } catch (error) {
            console.error('Erreur lors de la génération du sitemap:', error);
        }
    }

    generateXML() {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        this.urls.forEach(url => {
            xml += '  <url>\n';
            xml += `    <loc>${url.loc}</loc>\n`;
            xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
            xml += `    <priority>${url.priority}</priority>\n`;
            xml += '  </url>\n';
        });
        
        xml += '</urlset>';
        return xml;
    }

    async generate() {
        this.addStaticPages();
        await this.addDynamicPages();
        return this.generateXML();
    }
}

// Utilisation côté serveur (Express)
app.get('/sitemap.xml', async (req, res) => {
    try {
        const generator = new SitemapGenerator();
        const sitemap = await generator.generate();
        
        res.set('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (error) {
        res.status(500).send('Erreur lors de la génération du sitemap');
    }
});
```

Cette approche complète de l'optimisation et des bonnes pratiques garantit que votre PWA :

- **Charge rapidement** grâce aux optimisations de performance
- **Fonctionne pour tous** grâce à l'accessibilité intégrée
- **Est bien référencée** grâce aux optimisations SEO
- **Offre une expérience utilisateur exceptionnelle** sur tous les appareils et dans toutes les conditions

## 7. Outils de développement et frameworks PWA

Le développement de PWA peut être grandement facilité par l'utilisation d'outils spécialisés et de frameworks dédiés. Ces outils permettent d'automatiser de nombreuses tâches complexes et d'adopter les meilleures pratiques de façon transparente.

### 7.1 Lighthouse - L'audit PWA de référence

Lighthouse est l'outil d'audit de référence développé par Google pour évaluer la qualité des PWA. Il analyse votre application selon plusieurs critères et fournit des recommandations concrètes pour l'améliorer.

#### Utilisation de Lighthouse

Lighthouse peut être utilisé de plusieurs façons :

**Via Chrome DevTools** : L'option la plus simple pour les développeurs. Il suffit d'ouvrir les outils de développement, d'aller dans l'onglet "Lighthouse" et de lancer un audit.

**En ligne de commande** : Pour intégrer les audits dans votre processus de build ou de CI/CD.

```bash
# Installation de Lighthouse CLI
npm install -g lighthouse

# Audit complet d'une PWA
lighthouse https://votre-pwa.com --view

# Audit spécifiquement PWA avec format JSON
lighthouse https://votre-pwa.com --only-categories=pwa --output=json

# Audit avec émulation mobile
lighthouse https://votre-pwa.com --preset=perf --chrome-flags="--headless"
```

**Via l'API Node.js** : Pour une intégration programmatique dans vos outils de développement.

```javascript
// Intégration Lighthouse dans un script Node.js
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

async function runLighthouseAudit(url) {
    // Lance Chrome en mode headless
    const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
    });

    const options = {
        logLevel: 'info',
        output: 'html',
        onlyCategories: ['pwa', 'performance', 'accessibility'],
        port: chrome.port,
    };

    // Lance l'audit
    const runnerResult = await lighthouse(url, options);

    // Ferme Chrome
    await chrome.kill();

    // Analyse des résultats
    const report = runnerResult.report;
    const lhr = runnerResult.lhr;
    
    console.log('Score PWA:', lhr.categories.pwa.score * 100);
    console.log('Score Performance:', lhr.categories.performance.score * 100);
    console.log('Score Accessibilité:', lhr.categories.accessibility.score * 100);

    // Sauvegarde du rapport
    import fs from 'fs';
    fs.writeFileSync('lighthouse-report.html', report);
    
    return lhr;
}

// Utilisation
runLighthouseAudit('https://votre-pwa.com')
    .then(results => {
        console.log('Audit terminé avec succès');
    })
    .catch(error => {
        console.error('Erreur lors de l\'audit:', error);
    });
```

#### Critères d'évaluation PWA

Lighthouse évalue votre PWA selon plusieurs critères essentiels :

**Fast and reliable** :
- Le site charge en moins de 10 secondes sur réseau 3G lent
- Démarre rapidement lors des visites répétées
- Répond de manière fiable même sur réseau instable

**Installable** :
- Manifeste web app valide
- Servie via HTTPS
- Service Worker enregistré qui gère les requêtes offline

**PWA Optimized** :
- Redirections HTTP vers HTTPS
- Responsive sur mobile et desktop
- Charge rapide sur réseau lent
- Fournit une page offline personnalisée

### 7.2 Workbox - La boîte à outils Service Worker

Workbox est une collection de bibliothèques développées par Google qui simplifient considérablement l'ajout de capacités offline aux applications web. Elle automatise de nombreuses tâches complexes liées aux Service Workers.

#### Fonctionnalités principales de Workbox

**Gestion intelligente du cache** : Workbox propose des stratégies de mise en cache prêtes à l'emploi et permet de créer facilement des stratégies personnalis��es.

**Précaching** : Automatisation de la mise en cache des ressources statiques lors de l'installation du Service Worker.

**Runtime caching** : Mise en cache dynamique des ressources lors de leur première utilisation.

**Background sync** : Synchronisation automatique des données lorsque la connectivité est rétablie.

**Notifications push** : Gestion simplifiée des notifications push.

#### Installation et configuration de Workbox

```bash
# Installation via npm
npm install workbox-webpack-plugin --save-dev

# Ou installation globale du CLI
npm install workbox-cli --global
```

**Configuration avec Webpack** :

```javascript
// webpack.config.js
import { GenerateSW } from 'workbox-webpack-plugin';

module.exports = {
    // ... autres configurations webpack
    plugins: [
        new GenerateSW({
            // Génère automatiquement un Service Worker
            clientsClaim: true,
            skipWaiting: true,
            
            // Fichiers à exclure du precaching
            exclude: [/\.map$/, /^manifest$/, /\.htaccess$/],
            
            // Stratégies de cache runtime
            runtimeCaching: [
                {
                    // Cache les images avec stratégie Cache First
                    urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'images',
                        expiration: {
                            maxEntries: 60,
                            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
                        },
                    },
                },
                {
                    // Cache les API avec stratégie Network First
                    urlPattern: /^https:\/\/api\.example\.com\//,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api-cache',
                        networkTimeoutSeconds: 3,
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 5 * 60, // 5 minutes
                        },
                        cacheKeyWillBeUsed: async ({request}) => {
                            // Personnalise la clé de cache
                            return `${request.url}?version=1`;
                        },
                    },
                },
                {
                    // Cache les Google Fonts
                    urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'google-fonts-stylesheets',
                    },
                },
                {
                    urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'google-fonts-webfonts',
                        expiration: {
                            maxEntries: 30,
                            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
                        },
                    },
                },
            ],
        }),
    ],
};
```

**Service Worker personnalisé avec Workbox** :

```javascript
// sw.js - Service Worker personnalisé utilisant Workbox
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { Queue } from 'workbox-background-sync';

// Précache et route automatiquement toutes les ressources générées par le build
precacheAndRoute(self.__WB_MANIFEST);

// Nettoie automatiquement les anciens caches
cleanupOutdatedCaches();

// Stratégie pour les images
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
                purgeOnQuotaError: true, // Supprime automatiquement en cas de quota dépassé
            }),
        ],
    })
);

// Stratégie pour les API critiques
registerRoute(
    ({ url }) => url.pathname.startsWith('/api/critical'),
    new NetworkFirst({
        cacheName: 'critical-api',
        networkTimeoutSeconds: 3,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
            }),
        ],
    })
);

// Stratégie pour les API non critiques avec background sync
const bgSyncPlugin = new BackgroundSyncPlugin('api-queue', {
    maxRetentionTime: 24 * 60 // Retry for up to 24 Hours (specified in minutes)
});

registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 5,
        plugins: [
            bgSyncPlugin,
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 10 * 60, // 10 minutes
            }),
        ],
    })
);

// Queue personnalisée pour les actions utilisateur
const userActionQueue = new Queue('user-actions', {
    onSync: async ({ queue }) => {
        let entry;
        while ((entry = await queue.shiftRequest())) {
            try {
                await fetch(entry.request);
                console.log('Action utilisateur synchronisée:', entry.request.url);
            } catch (error) {
                console.error('Échec de la synchronisation:', error);
                // Remet en queue pour une nouvelle tentative
                await queue.unshiftRequest(entry);
                throw error;
            }
        }
    }
});

// Écoute les actions utilisateur et les met en queue si hors ligne
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'USER_ACTION') {
        const request = new Request(event.data.url, {
            method: event.data.method,
            body: event.data.body,
            headers: event.data.headers
        });
        
        if (navigator.onLine) {
            // En ligne : exécute immédiatement
            fetch(request);
        } else {
            // Hors ligne : met en queue
            userActionQueue.pushRequest({ request });
        }
    }
});

// Gestion des notifications push avec Workbox
import { messagingSW } from 'workbox-messaging';

self.addEventListener('push', (event) => {
    const data = event.data?.json() ?? {};
    
    const notificationOptions = {
        body: data.body,
        icon: data.icon || '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        vibrate: [100, 50, 100],
        data: data.data,
        actions: data.actions,
        tag: data.tag,
    };

    event.waitUntil(
        self.registration.showNotification(data.title, notificationOptions)
    );
});

// Communication avec l'application principale
messagingSW.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
```

### 7.3 PWA Builder - De Microsoft

PWA Builder est un outil développé par Microsoft qui aide à transformer des sites web existants en PWA et à les publier sur différents app stores.

#### Fonctionnalités de PWA Builder

**Audit automatique** : Analyse votre site web et identifie ce qui manque pour en faire une PWA complète.

**Génération de manifeste** : Crée automatiquement un manifeste optimisé pour votre application.

**Service Worker generator** : Génère des Service Workers personnalisés selon vos besoins.

**Package generation** : Crée des packages pour différentes plateformes (Microsoft Store, Google Play, App Store).

#### Utilisation de PWA Builder

**Interface web** : Accessible sur [pwabuilder.com](https://www.pwabuilder.com/)

**CLI** : Pour une intégration dans votre workflow de développement

```bash
# Installation du CLI PWA Builder
npm install -g @pwabuilder/cli

# Analyse d'un site web
pwa-builder analyze https://votre-pwa.com

# Génération d'un Service Worker
pwa-builder service-worker

# Génération de packages pour les app stores
pwa-builder package --platform windows --output ./packages
pwa-builder package --platform android --output ./packages
```

**Exemple de configuration** :

```json
// pwabuilder.json
{
    "name": "Ma PWA",
    "short_name": "MaPWA",
    "description": "Description de mon application",
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#007bff",
    "background_color": "#ffffff",
    "categories": ["productivity"],
    "screenshots": [
        {
            "src": "/screenshots/mobile.png",
            "sizes": "750x1334",
            "type": "image/png",
            "form_factor": "narrow"
        }
    ],
    "features": {
        "backgroundSync": true,
        "pushNotifications": true,
        "offlineSupport": true
    },
    "platforms": {
        "windows": {
            "package": {
                "identityName": "MonEntreprise.MaPWA",
                "publisherDisplayName": "Mon Entreprise"
            }
        },
        "android": {
            "package": {
                "packageId": "com.monentreprise.mapwa"
            }
        }
    }
}
```

### 7.4 Frameworks et bibliothèques PWA

Plusieurs frameworks facilitent le développement de PWA en intégrant automatiquement les bonnes pratiques.

#### Angular PWA

Angular offre un excellent support PWA avec le package `@angular/pwa`.

```bash
# Ajout du support PWA à un projet Angular existant
ng add @angular/pwa

# Ou création d'un nouveau projet avec PWA
ng new mon-app --routing --style=scss
cd mon-app
ng add @angular/pwa
```

**Fonctionnalités automatiques** :
- Service Worker généré automatiquement
- Manifeste web app
- Icônes par défaut
- Configuration Lighthouse optimisée

#### Create React App avec Workbox

```bash
# Création d'une PWA React
npx create-react-app ma-pwa-react --template pwa

# Ou ajout à un projet existant
npm install workbox-webpack-plugin --save-dev
```

#### Vue CLI PWA Plugin

```bash
# Création d'un projet Vue avec PWA
vue create ma-pwa-vue
# Sélectionner PWA dans les features

# Ou ajout à un projet existant
vue add pwa
```

#### Next.js avec next-pwa

```bash
# Installation
npm install next-pwa

# Configuration dans next.config.js
import withPWA from 'next-pwa';
    dest: 'public',
    register: true,
    skipWaiting: true,
});

module.exports = withPWA({
    // Configuration Next.js
});
```

## 8. Déploiement et distribution des PWA

Le déploiement d'une PWA implique plusieurs considérations spécifiques pour garantir une expérience optimale sur toutes les plateformes et appareils.

### 8.1 Hébergement et infrastructure

#### Exigences d'hébergement HTTPS

Comme mentionné précédemment, HTTPS est obligatoire pour les PWA. Voici les meilleures options d'hébergement :

**Services cloud avec HTTPS automatique** :
- **Netlify** : Déploiement automatique depuis Git avec HTTPS gratuit
- **Vercel** : Optimisé pour les applications JavaScript modernes
- **Firebase Hosting** : Service Google avec CDN global
- **GitHub Pages** : Gratuit pour les projets open source
- **Cloudflare Pages** : Avec optimisations automatiques

**Configuration serveur traditionnel** :

```nginx
# Configuration Nginx pour PWA
server {
    listen 443 ssl http2;
    server_name votre-domaine.com;
    
    # Certificats SSL
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Configuration PWA spécifique
    location / {
        root /var/www/pwa;
        try_files $uri $uri/ /index.html;
        
        # Headers pour PWA
        add_header X-Frame-Options SAMEORIGIN;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        
        # Cache pour les assets statiques
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Pas de cache pour le manifest et le SW
        location ~* (manifest\.json|sw\.js)$ {
            expires 0;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
    
    # Redirection HTTP vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 80;
    server_name votre-domaine.com;
    return 301 https://$server_name$request_uri;
}
```

#### Configuration CDN pour performance globale

```javascript
// Configuration Cloudflare Workers pour optimisations PWA
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    
    // Optimisations spécifiques aux PWA
    if (url.pathname.endsWith('/manifest.json')) {
        const response = await fetch(request);
        const newResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                ...response.headers,
                'Cache-Control': 'public, max-age=86400', // 24h
                'Content-Type': 'application/manifest+json'
            }
        });
        return newResponse;
    }
    
    // Service Worker avec cache court
    if (url.pathname.endsWith('/sw.js')) {
        const response = await fetch(request);
        const newResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                ...response.headers,
                'Cache-Control': 'public, max-age=0, must-revalidate',
                'Service-Worker-Allowed': '/'
            }
        });
        return newResponse;
    }
    
    // Autres ressources
    return fetch(request);
}
```

### 8.2 Distribution via les App Stores

#### Google Play Store avec Trusted Web Activities (TWA)

Les TWA permettent de publier votre PWA sur le Google Play Store comme une application Android native.

**Configuration avec Bubblewrap** :

```bash
# Installation de Bubblewrap
npm install -g @bubblewrap/cli

# Initialisation du projet TWA
bubblewrap init --manifest https://votre-pwa.com/manifest.json

# Build de l'APK
bubblewrap build

# Génération du bundle pour le Play Store
bubblewrap build --release
```

**Configuration avancée** :

```json
// twa-manifest.json
{
    "packageId": "com.votre-entreprise.votre-pwa",
    "host": "votre-pwa.com",
    "name": "Votre PWA",
    "launcherName": "PWA",
    "display": "standalone",
    "orientation": "default",
    "themeColor": "#007bff",
    "navigationColor": "#000000",
    "backgroundColor": "#ffffff",
    "enableNotifications": true,
    "startUrl": "/",
    "iconUrl": "https://votre-pwa.com/icons/icon-512.png",
    "maskableIconUrl": "https://votre-pwa.com/icons/icon-512-maskable.png",
    "splashScreenFadeOutDuration": 300,
    "signingKey": {
        "path": "./android.keystore",
        "alias": "android"
    },
    "appVersionName": "1.0.0",
    "appVersionCode": 1,
    "shortcuts": [
        {
            "name": "Nouvelle tâche",
            "short_name": "Nouvelle",
            "url": "/new-task",
            "icon": "https://votre-pwa.com/icons/shortcut-new.png"
        }
    ],
    "additionalTrustedOrigins": [],
    "retainedBundles": [],
    "fallbackType": "customtabs"
}
```

#### Microsoft Store

Microsoft Store accepte directement les PWA sans wrapper supplémentaire.

**Soumission via PWA Builder** :

```bash
# Génération du package Windows
pwa-builder package --platform windows --output ./packages/windows

# Le package généré peut être directement soumis au Microsoft Store
```

**Configuration spécifique Windows** :

```json
// Ajout au manifest.json pour Windows
{
    "name": "Votre PWA",
    "short_name": "PWA",
    // ... autres propriétés
    "categories": ["productivity"],
    "edge_side_panel": {
        "preferred_width": 400
    },
    "scope_extensions": [
        {
            "origin": "https://votre-domaine.com"
        }
    ]
}
```

#### Distribution Web classique

**Stratégies de promotion de l'installation** :

```javascript
// Bannière d'installation intelligente
class InstallPromptManager {
    constructor() {
        this.deferredPrompt = null;
        this.installPromptShown = false;
        this.setupInstallPrompt();
    }
    
    setupInstallPrompt() {
        // Écoute l'événement d'installation
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });
    }
    
    showInstallPrompt() {
        // Conditions pour afficher le prompt
        const shouldShow = this.shouldShowInstallPrompt();
        
        if (shouldShow && !this.installPromptShown) {
            this.createInstallBanner();
            this.installPromptShown = true;
        }
    }
    
    shouldShowInstallPrompt() {
        // Logique métier pour décider quand afficher
        const isReturningUser = this.isReturningUser();
        const hasEngagement = this.hasUserEngagement();
        const isNotInstalled = !this.isAppInstalled();
        
        return isReturningUser && hasEngagement && isNotInstalled;
    }
    
    isReturningUser() {
        const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
        localStorage.setItem('visitCount', (visitCount + 1).toString());
        return visitCount >= 3; // Affiche après 3 visites
    }
    
    hasUserEngagement() {
        // Vérifie l'engagement (temps passé, actions effectuées, etc.)
        const sessionStart = sessionStorage.getItem('sessionStart');
        if (!sessionStart) {
            sessionStorage.setItem('sessionStart', Date.now().toString());
            return false;
        }
        
        const timeSpent = Date.now() - parseInt(sessionStart);
        return timeSpent > 30000; // 30 secondes minimum
    }
    
    isAppInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }
    
    createInstallBanner() {
        const banner = document.createElement('div');
        banner.className = 'install-banner';
        banner.innerHTML = `
            <div class="install-banner-content">
                <div class="install-banner-text">
                    <h3>Installer l'application</h3>
                    <p>Ajoutez notre app à votre écran d'accueil pour un accès rapide et une meilleure expérience.</p>
                </div>
                <div class="install-banner-actions">
                    <button id="install-app-btn" class="btn-primary">Installer</button>
                    <button id="dismiss-banner-btn" class="btn-secondary">Plus tard</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Gestion des événements
        document.getElementById('install-app-btn').addEventListener('click', () => {
            this.promptInstall();
            banner.remove();
        });
        
        document.getElementById('dismiss-banner-btn').addEventListener('click', () => {
            banner.remove();
            // Marque comme rejeté pour ne pas re-afficher immédiatement
            localStorage.setItem('installPromptDismissed', Date.now().toString());
        });
        
        // Auto-suppression après 10 secondes
        setTimeout(() => {
            if (banner.parentNode) {
                banner.remove();
            }
        }, 10000);
    }
    
    async promptInstall() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        const choiceResult = await this.deferredPrompt.userChoice;
        
        // Analytics
        this.trackInstallChoice(choiceResult.outcome);
        
        this.deferredPrompt = null;
    }
    
    trackInstallChoice(outcome) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install_prompt', {
                event_category: 'PWA',
                event_label: outcome,
                value: outcome === 'accepted' ? 1 : 0
            });
        }
    }
}

// Initialisation
new InstallPromptManager();
```

### 8.3 Tests et validation

#### Tests automatisés pour PWA

```javascript
// Tests Playwright pour PWA
import { test, expect } from '@playwright/test';

test.describe('PWA Tests', () => {
    test('should have valid manifest', async ({ page }) => {
        await page.goto('https://votre-pwa.com');
        
        // Vérifie la présence du manifeste
        const manifestLink = page.locator('link[rel="manifest"]');
        await expect(manifestLink).toBeVisible();
        
        // Vérifie le contenu du manifeste
        const manifestHref = await manifestLink.getAttribute('href');
        const manifestResponse = await page.request.get(manifestHref);
        const manifest = await manifestResponse.json();
        
        expect(manifest.name).toBeTruthy();
        expect(manifest.short_name).toBeTruthy();
        expect(manifest.start_url).toBeTruthy();
        expect(manifest.display).toBe('standalone');
        expect(manifest.icons).toHaveLength.greaterThan(0);
    });
    
    test('should register service worker', async ({ page }) => {
        await page.goto('https://votre-pwa.com');
        
        // Vérifie l'enregistrement du Service Worker
        const swRegistered = await page.evaluate(() => {
            return new Promise((resolve) => {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.ready.then(() => {
                        resolve(true);
                    });
                } else {
                    resolve(false);
                }
            });
        });
        
        expect(swRegistered).toBe(true);
    });
    
    test('should work offline', async ({ page, context }) => {
        await page.goto('https://votre-pwa.com');
        
        // Attend que le SW soit prêt
        await page.waitForFunction(() => {
            return 'serviceWorker' in navigator && navigator.serviceWorker.controller;
        });
        
        // Simule le mode hors ligne
        await context.setOffline(true);
        
        // Recharge la page
        await page.reload();
        
        // Vérifie que la page se charge toujours
        await expect(page.locator('h1')).toBeVisible();
    });
    
    test('should be installable', async ({ page }) => {
        await page.goto('https://votre-pwa.com');
        
        // Vérifie que l'événement beforeinstallprompt est déclenché
        const installable = await page.evaluate(() => {
            return new Promise((resolve) => {
                window.addEventListener('beforeinstallprompt', () => {
                    resolve(true);
                });
                
                // Timeout après 5 secondes
                setTimeout(() => resolve(false), 5000);
            });
        });
        
        expect(installable).toBe(true);
    });
});
```

#### Checklist de validation PWA

```javascript
// Script de validation automatique
class PWAValidator {
    constructor(url) {
        this.url = url;
        this.results = {};
    }
    
    async validate() {
        console.log(`🔍 Validation PWA pour: ${this.url}`);
        
        await this.checkHTTPS();
        await this.checkManifest();
        await this.checkServiceWorker();
        await this.checkIcons();
        await this.checkResponsive();
        await this.checkOffline();
        
        this.generateReport();
    }
    
    async checkHTTPS() {
        const url = new URL(this.url);
        this.results.https = {
            passed: url.protocol === 'https:',
            message: url.protocol === 'https:' ? 
                '✅ Site servi via HTTPS' : 
                '❌ Site non sécurisé (HTTP)'
        };
    }
    
    async checkManifest() {
        try {
            const response = await fetch(`${this.url}/manifest.json`);
            const manifest = await response.json();
            
            const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
            const missingFields = requiredFields.filter(field => !manifest[field]);
            
            this.results.manifest = {
                passed: missingFields.length === 0,
                message: missingFields.length === 0 ? 
                    '✅ Manifeste valide' : 
                    `❌ Champs manquants: ${missingFields.join(', ')}`,
                details: manifest
            };
        } catch (error) {
            this.results.manifest = {
                passed: false,
                message: '❌ Manifeste non trouvé ou invalide',
                error: error.message
            };
        }
    }
    
    async checkServiceWorker() {
        try {
            const response = await fetch(`${this.url}/sw.js`);
            this.results.serviceWorker = {
                passed: response.ok,
                message: response.ok ? 
                    '✅ Service Worker accessible' : 
                    '❌ Service Worker non trouvé'
            };
        } catch (error) {
            this.results.serviceWorker = {
                passed: false,
                message: '❌ Service Worker non accessible',
                error: error.message
            };
        }
    }
    
    async checkIcons() {
        if (!this.results.manifest?.details?.icons) {
            this.results.icons = {
                passed: false,
                message: '❌ Aucune icône définie'
            };
            return;
        }
        
        const icons = this.results.manifest.details.icons;
        const requiredSizes = ['192x192', '512x512'];
        const availableSizes = icons.map(icon => icon.sizes);
        const missingRequiredSizes = requiredSizes.filter(size => 
            !availableSizes.includes(size)
        );
        
        this.results.icons = {
            passed: missingRequiredSizes.length === 0,
            message: missingRequiredSizes.length === 0 ? 
                '✅ Icônes requises présentes' : 
                `❌ Tailles d'icônes manquantes: ${missingRequiredSizes.join(', ')}`
        };
    }
    
    async checkResponsive() {
        // Cette vérification nécessiterait un navigateur headless
        // Pour cet exemple, on vérifie juste la meta viewport
        try {
            const response = await fetch(this.url);
            const html = await response.text();
            const hasViewport = html.includes('name="viewport"');
            
            this.results.responsive = {
                passed: hasViewport,
                message: hasViewport ? 
                    '✅ Meta viewport présent' : 
                    '❌ Meta viewport manquant'
            };
        } catch (error) {
            this.results.responsive = {
                passed: false,
                message: '❌ Impossible de vérifier la responsivité',
                error: error.message
            };
        }
    }
    
    async checkOffline() {
        // Vérification basique - en pratique nécessiterait un test plus complexe
        this.results.offline = {
            passed: this.results.serviceWorker?.passed,
            message: this.results.serviceWorker?.passed ? 
                '✅ Support hors ligne possible (SW présent)' : 
                '❌ Aucun support hors ligne'
        };
    }
    
    generateReport() {
        console.log('\n📊 RAPPORT DE VALIDATION PWA');
        console.log('='.repeat(50));
        
        let totalChecks = 0;
        let passedChecks = 0;
        
        Object.entries(this.results).forEach(([check, result]) => {
            console.log(`${result.message}`);
            if (result.error) {
                console.log(`   Erreur: ${result.error}`);
            }
            totalChecks++;
            if (result.passed) passedChecks++;
        });
        
        const score = Math.round((passedChecks / totalChecks) * 100);
        console.log('\n' + '='.repeat(50));
        console.log(`📈 Score PWA: ${score}% (${passedChecks}/${totalChecks})`);
        
        if (score >= 80) {
            console.log('🎉 Excellente PWA !');
        } else if (score >= 60) {
            console.log('👍 Bonne PWA, quelques améliorations possibles');
        } else {
            console.log('⚠️ PWA nécessite des améliorations importantes');
        }
        
        return { score, results: this.results };
    }
}

// Utilisation
const validator = new PWAValidator('https://votre-pwa.com');
validator.validate();
```

Cette infrastructure complète de développement, déploiement et validation garantit que votre PWA respecte tous les standards et offre une expérience utilisateur optimale sur toutes les plateformes.




