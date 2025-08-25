# Node.js et npm

## Qu'est-ce que Node.js ?

Node.js est un environnement d'exécution JavaScript côté serveur qui permet d'exécuter du code JavaScript en dehors d'un navigateur web. Il est construit sur le moteur JavaScript V8 de Chrome et utilise un modèle d'I/O non-bloquant et événementiel qui le rend léger et efficace.

Le but principal de Node.js est de permettre aux développeurs de créer des applications réseau évolutives et performantes, notamment des serveurs web, des API RESTful et des applications en temps réel.

## Caractéristiques principales de Node.js :

- **Asynchrone et événementiel** : Node.js utilise un modèle d'I/O non-bloquant, ce qui signifie que les opérations d'entrée/sortie (comme la lecture de fichiers ou les requêtes réseau) ne bloquent pas l'exécution du code. Cela permet de gérer de nombreuses connexions simultanément sans créer de threads supplémentaires.
- **Single-threaded** : Node.js fonctionne sur un seul thread, mais utilise des événements et des callbacks pour gérer les opérations asynchrones. Cela réduit la surcharge liée à la gestion de plusieurs threads.
- **Écosystème riche** : Grâce à npm, Node.js dispose d'un vaste écosystème de bibliothèques et de modules open-source qui facilitent le développement d'applications.
- **Utilisation de JavaScript** : Node.js permet aux développeurs d'utiliser JavaScript à la fois côté client et côté serveur, ce qui simplifie le développement d'applications web complètes.
- **Compatible avec les microservices** : Node.js est idéal pour créer des architectures basées sur des microservices, où chaque service peut être développé, déployé et mis à l'échelle indépendamment.
- **Support des WebSockets** : Node.js facilite la création d'applications en temps réel, comme les chats ou les jeux en ligne, grâce à son support natif des WebSockets.
- **Gestion des fichiers et des flux** : Node.js offre des modules intégrés pour la manipulation de fichiers, la gestion des flux de données et l'interaction avec le système de fichiers.
- **Compatible avec les bases de données NoSQL** : Node.js fonctionne bien avec des bases de données NoSQL comme MongoDB, CouchDB et Redis, ce qui le rend adapté aux applications modernes.
- **Facilité de déploiement** : Node.js peut être facilement déployé sur des serveurs cloud, des conteneurs Docker ou des services de plateforme en tant que service (PaaS) comme Heroku ou AWS Elastic Beanstalk.
- **Support de TypeScript** : Node.js peut être utilisé avec TypeScript, un sur-ensemble typé de JavaScript, ce qui permet d'améliorer la maintenabilité et la robustesse du code.
- **Large communauté** : Node.js bénéficie d'une communauté active qui contribue à son développement et à la création de bibliothèques et de frameworks.
- **Performances élevées** : Grâce à son moteur V8 optimisé et à son architecture non-bloquante, Node.js offre des performances élevées pour les applications nécessitant une faible latence et un traitement rapide des données.
- **Facilité d'intégration** : Node.js s'intègre facilement avec d'autres technologies et services, ce qui le rend idéal pour créer des applications hybrides ou des API RESTful.
- **Support des promesses et async/await** : Node.js prend en charge les promesses et la syntaxe async/await, ce qui facilite la gestion des opérations asynchrones et améliore la lisibilité du code.

## Qu'est-ce que npm ?

npm (Node Package Manager) est le gestionnaire de paquets officiel de Node.js. Il est automatiquement installé avec Node.js et remplit plusieurs fonctions essentielles :

1. **Gestionnaire de dépendances** : npm permet d'installer, mettre à jour et gérer les bibliothèques externes (appelées "packages" ou "modules") nécessaires à votre projet.

2. **Référentiel de packages** : npm est également une immense base de données en ligne (sur [npmjs.com](https://www.npmjs.com/)) contenant plus d'un million de packages JavaScript open-source que vous pouvez utiliser dans vos projets.

3. **Outil de configuration de projet** : npm utilise un fichier `package.json` qui sert de manifeste pour votre projet, définissant ses métadonnées, ses dépendances et ses scripts.

4. **Exécuteur de scripts** : npm permet de définir et d'exécuter des scripts pour automatiser des tâches courantes comme le démarrage de l'application, l'exécution des tests ou la construction du projet.

Parmi les commandes npm les plus utilisées, on trouve :
- `npm init` : initialise un nouveau projet avec un fichier package.json
- `npm install` : installe les dépendances d'un projet
- `npm run` : exécute les scripts définis dans package.json
- `npm publish` : publie un package sur le référentiel npm

## Installation de Node.js

### Windows

1. **Téléchargement de l'installateur :**
   - Rendez-vous sur le [site officiel de Node.js](https://nodejs.org/fr/)
   - Téléchargez la version LTS (Long Term Support) recommandée pour la plupart des utilisateurs

2. **Installation :**
   - Exécutez le fichier `.msi` téléchargé
   - Suivez les instructions du programme d'installation
   - Laissez les options par défaut (notamment l'ajout de Node.js au PATH)
   - Cliquez sur "Installer"

3. **Vérification de l'installation :**
   - Ouvrez PowerShell ou l'invite de commandes
   - Tapez les commandes suivantes :
   ```powershell
   node -v
   npm -v
   ```
   - Ces commandes devraient afficher les versions respectives de Node.js et npm

### macOS

1. **Méthode avec l'installateur :**
   - Rendez-vous sur le [site officiel de Node.js](https://nodejs.org/fr/)
   - Téléchargez la version LTS pour macOS
   - Exécutez le fichier `.pkg` et suivez les instructions

2. **Méthode avec Homebrew (recommandée) :**
   - Si vous n'avez pas Homebrew, installez-le avec :
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   - Puis, installez Node.js avec :
   ```bash
   brew install node
   ```

3. **Vérification de l'installation :**
   - Ouvrez le Terminal
   - Tapez les commandes suivantes :
   ```bash
   node -v
   npm -v
   ```

### Linux (Ubuntu/Debian)

1. **Installation via apt :**
   ```bash
   # Mise à jour des paquets
   sudo apt update
   
   # Installation de Node.js et npm
   sudo apt install nodejs npm
   ```

2. **Installation via le gestionnaire de versions (recommandée) :**
   ```bash
   # Installation de nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   
   # Rechargement des variables d'environnement
   export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   
   # Installation de la dernière version LTS de Node.js
   nvm install --lts
   ```

3. **Vérification de l'installation :**
   ```bash
   node -v
   npm -v
   ```

## Premiers pas avec Node.js

### Création d'un premier projet

1. **Création d'un nouveau répertoire :**
   ```bash
   mkdir mon-premier-projet-node
   cd mon-premier-projet-node
   ```

2. **Initialisation du projet :**
   ```bash
   npm init -y
   ```
   Cette commande génère un fichier `package.json` avec des valeurs par défaut. Il va contenir des informations sur votre projet, y compris les dépendances et les scripts.

    Voici un exemple de contenu du fichier `package.json` :
   ```json
   {
     "name": "mon-premier-projet-node",
     "version": "1.0.0",
     "description": "",
     "main": "app.js",
     "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1"
     },
     "author": "",
     "license": "ISC"
   }
   ```

3. **Structure du projet :**
   ```
   mon-premier-projet-node/
   ├── package.json
   └── app.js (à créer)
   ```


4. **Création du premier fichier JavaScript :**
   Créez un fichier `app.js` avec le contenu suivant :
   ```javascript
   console.log("Bonjour depuis Node.js !");
   ```

5. **Exécution du script :**
   ```bash
   node app.js
   ```
   Vous devriez voir "Bonjour depuis Node.js !" s'afficher dans votre terminal.

### Utilisation de modules intégrés

Node.js dispose de modules intégrés qui fournissent des fonctionnalités de base. Voici un exemple d'utilisation du module `http` pour créer un serveur web simple :

```javascript
// Importation du module http
const http = require('http');

// Création du serveur
const serveur = http.createServer((requete, reponse) => {
    // Configuration de l'en-tête de réponse
    reponse.setHeader('Content-Type', 'text/html');
    
    // Envoi du corps de la réponse
    reponse.end('<h1>Bonjour depuis mon serveur Node.js!</h1>');
});

// Configuration du port d'écoute
const PORT = 3000;
serveur.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
```

Pour exécuter ce serveur :
```bash
node app.js
```

Ouvrez ensuite votre navigateur et accédez à `http://localhost:3000` pour voir le résultat.

### Installation de packages externes

Node.js s'accompagne de npm (Node Package Manager), qui permet d'installer et de gérer des packages externes.

1. **Installation d'un package :**

   ```bash
   npm install systeminformation
   ```
   Cette commande installe le framework SystemInformation et l'ajoute à votre fichier `package.json` dans les dépendances.

  ::: tip
  Vous pouvez installer d'autres packages en utilisant la même commande `npm install <nom_du_package>`. 
  :::

2. **Exemple d'utilisation de SystemInformation :**

   Modifiez votre fichier `app.js` comme suit :
   
   ```javascript
    const si  = require('systeminformation');

    setInterval(async () => {
      const cpu = await si.currentLoad();
      const mem = await si.mem();
      const network = await si.networkStats();

      console.clear();
      console.log('🧠 CPU Load :', cpu.currentLoad?.toFixed(2) + '%');
      console.log('💾 RAM Used :', (mem.active / 1024 / 1024 / 1024).toFixed(2) + ' GB');
      console.log('🌐 Network :', 
        (network[0].rx_bytes / 1024 / 1024).toFixed(2) + ' MB received, ' 
        + (network[0].tx_bytes / 1024 / 1024).toFixed(2) + ' MB sent');
    }, 1000);
   ```

3. **Exécution de l'application :**

   ```bash
   node app.js
   ```

  ::: tip
  Pour arrêter le programme, utilisez `Ctrl + C` dans le terminal.
  :::

## Gestion des dépendances

### Différence entre dependencies et devDependencies

- **dependencies** : Packages nécessaires au fonctionnement de votre application en production
  ```bash
  npm install systeminformation
  ```

- **devDependencies** : Packages utilisés uniquement pendant le développement (tests, compilation, etc.)
  ```bash
  npm install --save-dev nodemon
  ```

  ::: tip
  `nodemon` est un outil qui surveille les modifications dans votre code et redémarre automatiquement le serveur. Cela facilite le développement en évitant de devoir redémarrer manuellement le serveur à chaque modification.
  :::

### Scripts npm

Les scripts npm permettent d'exécuter des commandes fréquentes. Ils sont définis dans le fichier `package.json` :

```json
{
  "name": "mon-projet",
  "version": "1.0.0",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "systeminformation": "^5.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

Pour exécuter ces scripts :
```bash
npm run start # Exécute node app.js
npm run dev   # Exécute nodemon app.js (redémarrage automatique sur modifications)
```

## Interaction avec le système de fichiers

Node.js fournit le module natif `fs` (File System) qui permet d'interagir avec le système de fichiers de l'ordinateur. Voici quelques exemples d'opérations courantes :

### Lecture et écriture de fichiers

```javascript
// Importation du module fs
const fs = require('fs');
const path = require('path');

// Chemin du fichier à manipuler
const filePath = path.join(__dirname, 'exemple.txt');

// Écriture synchrone dans un fichier (bloque l'exécution jusqu'à la fin de l'opération)
fs.writeFileSync(filePath, 'Ceci est un exemple de contenu.\nSur plusieurs lignes.', 'utf8');
console.log('Fichier créé avec succès !');

// Lecture synchrone d'un fichier
try {
  const contenu = fs.readFileSync(filePath, 'utf8');
  console.log('Contenu du fichier :', contenu);
} catch (err) {
  console.error('Erreur de lecture :', err);
}

// Écriture asynchrone dans un fichier (ne bloque pas l'exécution)
fs.writeFile(filePath, 'Nouveau contenu écrit de façon asynchrone.', 'utf8', (err) => {
  if (err) {
    console.error('Erreur d\'écriture :', err);
    return;
  }
  console.log('Écriture asynchrone terminée !');
  
  // Lecture asynchrone d'un fichier
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur de lecture :', err);
      return;
    }
    console.log('Contenu lu de façon asynchrone :', data);
  });
});

// Version moderne avec Promises (disponible depuis Node.js 10)
const fsPromises = require('fs').promises;

async function manipulerFichier() {
  try {
    await fsPromises.writeFile(filePath, 'Contenu écrit avec promises', 'utf8');
    console.log('Écriture avec promises terminée !');
    
    const contenu = await fsPromises.readFile(filePath, 'utf8');
    console.log('Contenu lu avec promises :', contenu);
  } catch (err) {
    console.error('Erreur avec promises :', err);
  }
}

manipulerFichier();
```

### Manipulation de répertoires

```javascript
const fs = require('fs');
const path = require('path');

// Création d'un répertoire
const dirPath = path.join(__dirname, 'nouveau-repertoire');

// Vérifier si un répertoire existe
if (!fs.existsSync(dirPath)) {
  // Créer le répertoire s'il n'existe pas
  fs.mkdirSync(dirPath);
  console.log(`Répertoire créé : ${dirPath}`);
} else {
  console.log(`Le répertoire existe déjà : ${dirPath}`);
}

// Lister le contenu d'un répertoire
fs.readdir(__dirname, (err, files) => {
  if (err) {
    console.error('Erreur lors de la lecture du répertoire :', err);
    return;
  }
  
  console.log('Contenu du répertoire :');
  files.forEach((file, index) => {
    // Obtenir des informations sur chaque élément
    const filePath = path.join(__dirname, file);
    const stats = fs.statSync(filePath);
    
    // Déterminer si c'est un fichier ou un répertoire
    const type = stats.isDirectory() ? 'répertoire' : 'fichier';
    const taille = stats.size;
    
    console.log(`${index + 1}. ${file} (${type}, ${taille} octets)`);
  });
});

// Version avec les promises
async function explorerRepertoire(dir) {
  try {
    const fsPromises = require('fs').promises;
    const files = await fsPromises.readdir(dir);
    
    console.log(`\nContenu du répertoire ${dir} :`);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fsPromises.stat(filePath);
      const type = stats.isDirectory() ? 'répertoire' : 'fichier';
      
      console.log(`- ${file} (${type})`);
      
      // Exploration récursive si c'est un répertoire
      if (type === 'répertoire') {
        await explorerRepertoire(filePath);
      }
    }
  } catch (err) {
    console.error('Erreur lors de l\'exploration :', err);
  }
}

// Explorer le répertoire courant jusqu'à une profondeur maximale de 1
explorerRepertoire(__dirname);
```

### Exemple d'application pratique : analyseur de répertoire

Voici un exemple plus complet d'application Node.js qui analyse une structure de répertoire et génère un rapport sur les types de fichiers présents :

```javascript
const fs = require('fs').promises;
const path = require('path');

async function analyserRepertoire(repertoireCible) {
  // Statistiques
  const statistiques = {
    totalFichiers: 0,
    totalRepertoires: 0,
    extensionsCount: {},
    tailleTotale: 0
  };
  
  // Fonction récursive pour parcourir l'arborescence
  async function scanner(repertoire) {
    try {
      const elements = await fs.readdir(repertoire);
      
      for (const element of elements) {
        const elementPath = path.join(repertoire, element);
        const stats = await fs.stat(elementPath);
        
        if (stats.isDirectory()) {
          statistiques.totalRepertoires++;
          // Exploration récursive du sous-répertoire
          await scanner(elementPath);
        } else {
          statistiques.totalFichiers++;
          statistiques.tailleTotale += stats.size;
          
          // Comptage des extensions
          const extension = path.extname(element).toLowerCase() || '(sans extension)';
          if (!statistiques.extensionsCount[extension]) {
            statistiques.extensionsCount[extension] = 0;
          }
          statistiques.extensionsCount[extension]++;
        }
      }
    } catch (err) {
      console.error(`Erreur lors de l'analyse de ${repertoire}:`, err);
    }
  }
  
  // Démarrage de l'analyse
  console.log(`Analyse du répertoire: ${repertoireCible}`);
  await scanner(repertoireCible);
  
  // Affichage du rapport
  console.log('\n===== RAPPORT D\'ANALYSE =====');
  console.log(`Répertoires trouvés: ${statistiques.totalRepertoires}`);
  console.log(`Fichiers trouvés: ${statistiques.totalFichiers}`);
  console.log(`Taille totale: ${(statistiques.tailleTotale / 1024 / 1024).toFixed(2)} Mo`);
  
  console.log('\nDistribution par extension:');
  const extensions = Object.keys(statistiques.extensionsCount).sort();
  for (const ext of extensions) {
    const count = statistiques.extensionsCount[ext];
    const pourcentage = ((count / statistiques.totalFichiers) * 100).toFixed(1);
    console.log(`  ${ext}: ${count} fichiers (${pourcentage}%)`);
  }
  
  return statistiques;
}

// Utilisation de la fonction
const repertoireACibler = process.argv[2] || __dirname;
analyserRepertoire(repertoireACibler)
  .then(() => console.log('Analyse terminée!'))
  .catch(err => console.error('Erreur lors de l\'analyse:', err));
```

Pour exécuter ce programme :
```bash
node analyse-repertoire.js [chemin_du_repertoire_a_analyser]
```

Si aucun chemin n'est spécifié, le programme analysera le répertoire courant où se trouve le script.

### Questions sur ce code

- Que se passe-t-il si vous essayez d'analyser un répertoire qui n'existe pas ?
- Comment pourriez-vous modifier le code pour ignorer les erreurs d'accès aux fichiers (par exemple, si vous n'avez pas les permissions nécessaires) ?
- A quoi correspond la ligne `const extension = path.extname(element).toLowerCase() || '(sans extension)';` ? Pourquoi est-elle importante ?
- A quoi correspond la variable `__dirname` ? Que contient-elle ?

::: details Réponses

- Si vous essayez d'analyser un répertoire qui n'existe pas, le programme affichera une erreur dans la console, indiquant que le répertoire n'a pas pu être trouvé.
- Pour ignorer les erreurs d'accès aux fichiers, vous pouvez entourer la ligne de code qui tente d'accéder au répertoire avec un bloc `try-catch` et simplement enregistrer l'erreur sans interrompre l'exécution du programme.
- La ligne `const extension = path.extname(element).toLowerCase() || '(sans extension)';` permet d'obtenir l'extension du fichier en minuscules. Si le fichier n'a pas d'extension, elle renvoie '(sans extension)' pour éviter d'avoir une valeur vide.
- La variable `__dirname` contient le chemin absolu du répertoire dans lequel se trouve le script en cours d'exécution. Cela permet de s'assurer que les chemins relatifs sont correctement résolus, peu importe où le script est exécuté.
:::

## Conclusion

Node.js est un outil puissant pour développer des applications JavaScript côté serveur. Ce tutoriel vous a fourni les bases pour commencer à utiliser Node.js, mais il existe bien d'autres fonctionnalités à explorer comme :

- La gestion asynchrone avec les callbacks, promises et async/await
- Les modules ESM (ES Modules)
- L'interaction avec les bases de données
- Le déploiement d'applications Node.js
- Les frameworks avancés comme NestJS, Fastify, etc.

N'hésitez pas à consulter la [documentation officielle de Node.js](https://nodejs.org/docs/) pour approfondir vos connaissances.