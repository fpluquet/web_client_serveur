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

## Exercices pratiques Node.js

### Exercice 1 : Premiers pas avec Node.js

Créez un script Node.js qui :
1. Affiche "Bonjour, je suis [votre prénom]" dans la console
2. Affiche la date et l'heure actuelles
3. Utilise `process.argv` pour récupérer des arguments en ligne de commande et les affiche

**Exemples de sortie attendue :**

```bash
# Exécution : node script.js
Bonjour, je suis Alice
Date actuelle : 24/09/2025
Heure actuelle : 14:30:25

Arguments reçus :
```

```bash
# Exécution : node script.js hello world "test avec espaces"
Bonjour, je suis Alice
Date actuelle : 24/09/2025
Heure actuelle : 14:30:25

Arguments reçus :
Argument 1: hello
Argument 2: world
Argument 3: test avec espaces
```

<details>
<summary>Solution Exercice 1</summary>

```javascript
// script.js

// 1. Afficher un message personnalisé
const prenom = "Alice"; // Remplacez par votre prénom
console.log(`Bonjour, je suis ${prenom}`);

// 2. Afficher la date et l'heure actuelles
const maintenant = new Date();
console.log(`Date actuelle : ${maintenant.toLocaleDateString()}`);
console.log(`Heure actuelle : ${maintenant.toLocaleTimeString()}`);

// 3. Afficher les arguments en ligne de commande
console.log('\nArguments reçus :');
process.argv.forEach((arg, index) => {
  if (index >= 2) { // Les 2 premiers sont 'node' et le nom du script
    console.log(`Argument ${index - 1}: ${arg}`);
  }
});

// Exécution : node script.js arg1 arg2 "argument avec espaces"
```

</details>

### Exercice 2 : Calculatrice en ligne de commande

Créez une calculatrice simple qui prend deux nombres et une opération en paramètres :
- `node calculatrice.js 10 + 5` → devrait afficher 15
- Gérez les opérations : +, -, *, /
- Ajoutez une validation des entrées

**Exemples de sortie attendue :**

```bash
# Exécution : node calculatrice.js 10 + 5
10 + 5 = 15
```

```bash
# Exécution : node calculatrice.js 20 / 4
20 / 4 = 5
```

```bash
# Exécution : node calculatrice.js 15 * 3.5
15 * 3.5 = 52.5
```

```bash
# Exécution : node calculatrice.js 10 / 0
Erreur: Division par zéro impossible
```

```bash
# Exécution : node calculatrice.js 10
Usage: node calculatrice.js <nombre1> <opération> <nombre2>
Opérations supportées: +, -, *, /
```

```bash
# Exécution : node calculatrice.js abc + 5
Erreur: Les premier et troisième arguments doivent être des nombres
```

<details>
<summary>Solution Exercice 2</summary>

```javascript
// calculatrice.js

// Récupérer les arguments
const args = process.argv.slice(2);

// Vérifier qu'on a bien 3 arguments
if (args.length !== 3) {
  console.log('Usage: node calculatrice.js <nombre1> <opération> <nombre2>');
  console.log('Opérations supportées: +, -, *, /');
  process.exit(1);
}

const nombre1 = parseFloat(args[0]);
const operation = args[1];
const nombre2 = parseFloat(args[2]);

// Vérifier que les nombres sont valides
if (isNaN(nombre1) || isNaN(nombre2)) {
  console.log('Erreur: Les premier et troisième arguments doivent être des nombres');
  process.exit(1);
}

let resultat;

// Effectuer le calcul selon l'opération
switch (operation) {
  case '+':
    resultat = nombre1 + nombre2;
    break;
  case '-':
    resultat = nombre1 - nombre2;
    break;
  case '*':
    resultat = nombre1 * nombre2;
    break;
  case '/':
    if (nombre2 === 0) {
      console.log('Erreur: Division par zéro impossible');
      process.exit(1);
    }
    resultat = nombre1 / nombre2;
    break;
  default:
    console.log(`Erreur: Opération "${operation}" non supportée`);
    console.log('Opérations supportées: +, -, *, /');
    process.exit(1);
}

console.log(`${nombre1} ${operation} ${nombre2} = ${resultat}`);
```

</details>

### Exercice 3 : Utilisation de packages externes - Cowsay

Installez le package `cowsay` et créez un script qui :
1. Affiche un message amusant avec une vache
2. Permet de choisir différents animaux (cow, dragon, tux)
3. Lit le message depuis les arguments en ligne de commande

**Exemples de sortie attendue :**

```bash
# Exécution : node cowsay-fun.js "Hello World!"
 _____________
< Hello World! >
 -------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

```bash
# Exécution : node cowsay-fun.js -a dragon "Je suis un dragon!"
 ____________________
< Je suis un dragon! >
 --------------------
      \                    / \  //\
       \    |\___/|      /   \//  \\
            /0  0  \__  /    //  | \ \    
           /     /  \/_/    //   |  \  \  
           @_^_@'/   \/_   //    |   \   \ 
           //_^_/     \/_ //     |    \    \
        ( //) |        \///      |     \     \
      ( / /) _|_ /   )  //       |      \     _\
    ( // /) '/,_ _ _/  ( ; -.    |    _ _\.-~        .-~~~^-.
  (( / / )) ,-{        _      `-.|.-~-.           .~         `.
 (( // / ))  '/\      /                 ~-. _ .-~      .-~^-.  \
 (( /// ))      `.   {            }                   /      \  \
  (( / ))     .----~-.\        \-'                 .~         \  `. \^-.
             ///.----..>        \             _ -~             `.  ^-`  ^-_
               ///-._ _ _ _ _ _ _}^ - - - - ~                     ~-- ,.-~
                                                                  /.-~
```

```bash
# Exécution : node cowsay-fun.js
 ________________________
< Salut depuis Node.js ! >
 ------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

<details>
<summary>Solution Exercice 3</summary>

Premièrement, installez le package :
```bash
npm install cowsay
```

```javascript
// cowsay-fun.js

const cowsay = require('cowsay');

// Récupérer les arguments
const args = process.argv.slice(2);

// Message par défaut
let message = "Salut depuis Node.js !";
let animal = "cow";

// Parser les arguments
if (args.length > 0) {
  // Premier argument = message
  message = args.join(' ');
  
  // Chercher l'option -a ou --animal
  const animalIndex = args.findIndex(arg => arg === '-a' || arg === '--animal');
  if (animalIndex !== -1 && args[animalIndex + 1]) {
    animal = args[animalIndex + 1];
    // Retirer l'option animal du message
    message = args.filter((arg, index) => 
      index !== animalIndex && index !== animalIndex + 1
    ).join(' ');
  }
}

// Animaux disponibles
const animauxDisponibles = ['cow', 'dragon', 'tux', 'koala', 'moose'];

// Vérifier si l'animal est disponible
if (!animauxDisponibles.includes(animal)) {
  console.log(`Animal "${animal}" non disponible.`);
  console.log(`Animaux disponibles: ${animauxDisponibles.join(', ')}`);
  animal = 'cow'; // Animal par défaut
}

// Afficher le message avec cowsay
try {
  console.log(cowsay.say({
    text: message,
    e: "oo", // yeux
    T: "U ",  // langue
    f: animal
  }));
} catch (error) {
  // Si l'animal n'existe pas, utiliser la vache par défaut
  console.log(cowsay.say({
    text: message
  }));
}

// Usage:
// node cowsay-fun.js "Hello World!"
// node cowsay-fun.js -a dragon "Je suis un dragon!"
```

</details>

### Exercice 4 : Manipulateur de fichiers

Créez un script qui :
1. Crée un fichier `notes.txt` s'il n'existe pas
2. Permet d'ajouter une note avec la date/heure actuelle
3. Permet de lister toutes les notes
4. Utilise les arguments : `add "ma note"` ou `list`

**Exemples de sortie attendue :**

```bash
# Exécution : node notes.js
Usage:
  node notes.js add "votre note"
  node notes.js list
```

```bash
# Exécution : node notes.js add "Première note de test"
✅ Note ajoutée avec succès !
📝 "Première note de test"
```

```bash
# Exécution : node notes.js add "Réunion équipe à 14h"
✅ Note ajoutée avec succès !
📝 "Réunion équipe à 14h"
```

```bash
# Exécution : node notes.js list
📚 2 note(s) trouvée(s):

1. [24/09/2025 14:30:25] Première note de test
2. [24/09/2025 14:35:12] Réunion équipe à 14h
```

```bash
# Exécution : node notes.js list (quand aucune note)
📝 Aucune note trouvée. Ajoutez votre première note !
```

```bash
# Exécution : node notes.js add
❌ Erreur: Vous devez spécifier le texte de la note
Usage: node notes.js add "votre note"
```

<details>
<summary>Solution Exercice 4</summary>

```javascript
// notes.js

const fs = require('fs');
const path = require('path');

const fichierNotes = path.join(__dirname, 'notes.txt');

// Récupérer les arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage:');
  console.log('  node notes.js add "votre note"');
  console.log('  node notes.js list');
  process.exit(1);
}

const commande = args[0];

function ajouterNote(texte) {
  const maintenant = new Date();
  const horodatage = maintenant.toLocaleString();
  const note = `[${horodatage}] ${texte}\n`;
  
  try {
    // Ajouter la note au fichier (créer le fichier s'il n'existe pas)
    fs.appendFileSync(fichierNotes, note, 'utf8');
    console.log('✅ Note ajoutée avec succès !');
    console.log(`📝 "${texte}"`);
  } catch (error) {
    console.log('❌ Erreur lors de l\'ajout de la note:', error.message);
  }
}

function listerNotes() {
  try {
    // Vérifier si le fichier existe
    if (!fs.existsSync(fichierNotes)) {
      console.log('📝 Aucune note trouvée. Ajoutez votre première note !');
      return;
    }
    
    // Lire le fichier
    const contenu = fs.readFileSync(fichierNotes, 'utf8');
    
    if (contenu.trim() === '') {
      console.log('📝 Aucune note dans le fichier.');
      return;
    }
    
    const notes = contenu.trim().split('\n');
    console.log(`📚 ${notes.length} note(s) trouvée(s):\n`);
    
    notes.forEach((note, index) => {
      console.log(`${index + 1}. ${note}`);
    });
    
  } catch (error) {
    console.log('❌ Erreur lors de la lecture des notes:', error.message);
  }
}

// Traitement des commandes
switch (commande.toLowerCase()) {
  case 'add':
    if (args.length < 2) {
      console.log('❌ Erreur: Vous devez spécifier le texte de la note');
      console.log('Usage: node notes.js add "votre note"');
      process.exit(1);
    }
    const texteNote = args.slice(1).join(' ');
    ajouterNote(texteNote);
    break;
    
  case 'list':
    listerNotes();
    break;
    
  default:
    console.log(`❌ Commande "${commande}" inconnue`);
    console.log('Commandes disponibles: add, list');
    process.exit(1);
}
```

</details>

### Exercice 5 : Générateur de mots de passe

Créez un générateur de mots de passe qui :
1. Génère des mots de passe de longueur variable (défaut: 12 caractères)
2. Permet de choisir les types de caractères (majuscules, minuscules, chiffres, symboles)
3. Utilise le module `crypto` intégré à Node.js pour plus de sécurité
4. Peut générer plusieurs mots de passe d'un coup

**Exemples de sortie attendue :**

```bash
# Exécution : node generateur-mdp.js
🔐 Génération de 1 mot(s) de passe de 12 caractères

1. aB3$kL9pQ#2x
   Force: 🟢 Très fort

📊 Configuration:
   Longueur: 12 caractères
   Types inclus: Majuscules, Minuscules, Chiffres, Symboles
```

```bash
# Exécution : node generateur-mdp.js -l 16 -n 3
🔐 Génération de 3 mot(s) de passe de 16 caractères

1. mK8$nP2qR@5tV&9w
   Force: 🟢 Très fort

2. bD7#cF4xS!1uY+8z
   Force: 🟢 Très fort

3. eG6%hJ3vW*7iA-5o
   Force: 🟢 Très fort

📊 Configuration:
   Longueur: 16 caractères
   Types inclus: Majuscules, Minuscules, Chiffres, Symboles
```

```bash
# Exécution : node generateur-mdp.js --no-symbols -l 8
🔐 Génération de 1 mot(s) de passe de 8 caractères

1. aB3kL9pQ
   Force: 🟡 Fort
   Suggestions: Manque de symboles

📊 Configuration:
   Longueur: 8 caractères
   Types inclus: Majuscules, Minuscules, Chiffres
```

```bash
# Exécution : node generateur-mdp.js --help
🔐 Générateur de mots de passe sécurisés

Usage: node generateur-mdp.js [options]

Options:
  -l, --length <n>    Longueur du mot de passe (défaut: 12)
  -n, --number <n>    Nombre de mots de passe à générer (défaut: 1)
  --no-upper          Exclure les majuscules
  --no-lower          Exclure les minuscules
  --no-digits         Exclure les chiffres
  --no-symbols        Exclure les symboles
  -h, --help          Afficher cette aide

Exemples:
  node generateur-mdp.js
  node generateur-mdp.js -l 16 -n 5
  node generateur-mdp.js --no-symbols -l 20
```

<details>
<summary>Solution Exercice 5</summary>

```javascript
// generateur-mdp.js

const crypto = require('crypto');

// Récupérer les arguments
const args = process.argv.slice(2);

// Configuration par défaut
let longueur = 12;
let nombre = 1;
let inclureMajuscules = true;
let inclureMinuscules = true;
let inclureChiffres = true;
let inclureSymboles = true;

// Jeux de caractères
const majuscules = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const minuscules = 'abcdefghijklmnopqrstuvwxyz';
const chiffres = '0123456789';
const symboles = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Parser les arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  switch (arg) {
    case '-l':
    case '--length':
      if (i + 1 < args.length) {
        longueur = parseInt(args[i + 1]);
        i++; // Skip next argument
      }
      break;
    case '-n':
    case '--number':
      if (i + 1 < args.length) {
        nombre = parseInt(args[i + 1]);
        i++; // Skip next argument
      }
      break;
    case '--no-upper':
      inclureMajuscules = false;
      break;
    case '--no-lower':
      inclureMinuscules = false;
      break;
    case '--no-digits':
      inclureChiffres = false;
      break;
    case '--no-symbols':
      inclureSymboles = false;
      break;
    case '-h':
    case '--help':
      afficherAide();
      process.exit(0);
      break;
  }
}

function afficherAide() {
  console.log('🔐 Générateur de mots de passe sécurisés\n');
  console.log('Usage: node generateur-mdp.js [options]');
  console.log('\nOptions:');
  console.log('  -l, --length <n>    Longueur du mot de passe (défaut: 12)');
  console.log('  -n, --number <n>    Nombre de mots de passe à générer (défaut: 1)');
  console.log('  --no-upper          Exclure les majuscules');
  console.log('  --no-lower          Exclure les minuscules');
  console.log('  --no-digits         Exclure les chiffres');
  console.log('  --no-symbols        Exclure les symboles');
  console.log('  -h, --help          Afficher cette aide');
  console.log('\nExemples:');
  console.log('  node generateur-mdp.js');
  console.log('  node generateur-mdp.js -l 16 -n 5');
  console.log('  node generateur-mdp.js --no-symbols -l 20');
}

function genererMotDePasse() {
  // Construire le jeu de caractères
  let caracteresPossibles = '';
  
  if (inclureMajuscules) caracteresPossibles += majuscules;
  if (inclureMinuscules) caracteresPossibles += minuscules;
  if (inclureChiffres) caracteresPossibles += chiffres;
  if (inclureSymboles) caracteresPossibles += symboles;
  
  // Vérifier qu'on a au moins un type de caractère
  if (caracteresPossibles === '') {
    console.log('❌ Erreur: Aucun type de caractère sélectionné!');
    process.exit(1);
  }
  
  // Générer le mot de passe
  let motDePasse = '';
  
  for (let i = 0; i < longueur; i++) {
    // Utiliser crypto pour une génération cryptographiquement sécurisée
    const indexAleatoire = crypto.randomInt(0, caracteresPossibles.length);
    motDePasse += caracteresPossibles[indexAleatoire];
  }
  
  return motDePasse;
}

function evaluerForce(motDePasse) {
  let score = 0;
  let commentaires = [];
  
  // Longueur
  if (motDePasse.length >= 12) score += 2;
  else if (motDePasse.length >= 8) score += 1;
  else commentaires.push('Trop court (moins de 8 caractères)');
  
  // Types de caractères
  if (/[a-z]/.test(motDePasse)) score += 1;
  else commentaires.push('Manque de minuscules');
  
  if (/[A-Z]/.test(motDePasse)) score += 1;
  else commentaires.push('Manque de majuscules');
  
  if (/[0-9]/.test(motDePasse)) score += 1;
  else commentaires.push('Manque de chiffres');
  
  if (/[^a-zA-Z0-9]/.test(motDePasse)) score += 1;
  else commentaires.push('Manque de symboles');
  
  // Évaluation
  let force;
  if (score >= 6) force = '🟢 Très fort';
  else if (score >= 4) force = '🟡 Fort';
  else if (score >= 2) force = '🟠 Moyen';
  else force = '🔴 Faible';
  
  return { force, commentaires };
}

// Validation des paramètres
if (longueur < 1 || isNaN(longueur)) {
  console.log('❌ Erreur: La longueur doit être un nombre positif');
  process.exit(1);
}

if (nombre < 1 || isNaN(nombre)) {
  console.log('❌ Erreur: Le nombre doit être un nombre positif');
  process.exit(1);
}

// Génération des mots de passe
console.log(`🔐 Génération de ${nombre} mot(s) de passe de ${longueur} caractères\n`);

for (let i = 0; i < nombre; i++) {
  const mdp = genererMotDePasse();
  const evaluation = evaluerForce(mdp);
  
  console.log(`${i + 1}. ${mdp}`);
  console.log(`   Force: ${evaluation.force}`);
  
  if (evaluation.commentaires.length > 0) {
    console.log(`   Suggestions: ${evaluation.commentaires.join(', ')}`);
  }
  console.log();
}

// Afficher la configuration utilisée
console.log('📊 Configuration:');
console.log(`   Longueur: ${longueur} caractères`);
console.log(`   Types inclus: ${[
  inclureMajuscules && 'Majuscules',
  inclureMinuscules && 'Minuscules', 
  inclureChiffres && 'Chiffres',
  inclureSymboles && 'Symboles'
].filter(Boolean).join(', ')}`);
```

</details>

### Exercice 6 : Analyseur de logs

Créez un analyseur de fichiers de logs de serveur HTTP (comme Apache ou Nginx) qui :
1. Lit un fichier de log ligne par ligne
2. Extrait les informations importantes (IP, méthode HTTP, code de statut)
3. Génère des statistiques (nombre de requêtes par IP, codes d'erreur les plus fréquents)
4. Utilise des expressions régulières pour parser les logs

Les logs sont au format commun (Common Log Format) :
```
IP - - [date] "Méthode Ressource Protocole" code_reponse taille
```

**Exemples de sortie attendue :**

Soit le fichier `server.log` :
```
127.0.0.1 - - [23/Sep/2024:10:30:45 +0000] "GET /index.html HTTP/1.1" 200 1234
192.168.1.100 - - [23/Sep/2024:10:31:12 +0000] "POST /api/users HTTP/1.1" 201 567
127.0.0.1 - - [23/Sep/2024:10:32:01 +0000] "GET /style.css HTTP/1.1" 200 890
10.0.0.50 - - [23/Sep/2024:10:32:30 +0000] "GET /missing.html HTTP/1.1" 404 123
192.168.1.100 - - [23/Sep/2024:10:33:15 +0000] "DELETE /api/users/123 HTTP/1.1" 204 0
127.0.0.1 - - [23/Sep/2024:10:34:22 +0000] "GET /app.js HTTP/1.1" 500 234
```

Exécution : `node analyseur-logs.js server.log`

```bash
🔍 Analyse du fichier: server.log

==================================================
📈 RAPPORT D'ANALYSE DES LOGS
==================================================

📋 Résumé général:
  Total de lignes: 6
  Lignes valides: 6
  Lignes avec erreurs: 0

📊 Top des adresses IP:
  1. 127.0.0.1: 3 requêtes
  2. 192.168.1.100: 2 requêtes
  3. 10.0.0.50: 1 requêtes

🌐 Répartition des méthodes HTTP:
  GET: 4 requêtes
  POST: 1 requêtes
  DELETE: 1 requêtes

📊 Codes de statut par catégorie:
  Succès: 4 requêtes
  Erreur client: 1 requêtes
  Erreur serveur: 1 requêtes

🔢 Détail des codes de statut:
  200: 3 requêtes
  201: 1 requêtes
  204: 1 requêtes
  404: 1 requêtes
  500: 1 requêtes

📊 Top des URLs les plus visitées:
  1. /index.html: 1 requêtes
  2. /style.css: 1 requêtes
  3. /missing.html: 1 requêtes
  4. /api/users: 1 requêtes
  5. /api/users/123: 1 requêtes

🚨 Alertes:
  ⚠️  1 erreurs client (4xx) détectées
  🚨 1 erreurs serveur (5xx) détectées
```

Exécution de `node analyseur-logs.js fichier_inexistant.log` :

```bash
🔍 Analyse du fichier: fichier_inexistant.log

❌ Erreur: Le fichier "fichier_inexistant.log" n'existe pas
```

Exécution de `node analyseur-logs.js logs_vides.log` :

```bash
🔍 Analyse du fichier: logs_vides.log

==================================================
📈 RAPPORT D'ANALYSE DES LOGS
==================================================

📋 Résumé général:
  Total de lignes: 0
  Lignes valides: 0
  Lignes avec erreurs: 0

📊 Top des adresses IP:
  Aucune donnée

🌐 Répartition des méthodes HTTP:

📊 Codes de statut par catégorie:

🔢 Détail des codes de statut:

📊 Top des URLs les plus visitées:
  Aucune donnée

🚨 Alertes:
  ✅ Aucune erreur majeure détectée
```

<details>
<summary>Solution Exercice 6</summary>

```javascript
// analyseur-logs.js

const fs = require('fs');
const path = require('path');

// Récupérer le fichier de log depuis les arguments
const args = process.argv.slice(2);
const fichierLog = args[0] || 'server.log';

// Expression régulière pour parser les logs au format Common Log Format
const regexLog = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) (\S+)" (\d+) (\d+)$/;

// Structures pour stocker les statistiques
const stats = {
  totalLignes: 0,
  lignesValides: 0,
  ips: {},
  methodes: {},
  codesStatut: {},
  urls: {},
  erreurs: []
};

function analyserLigne(ligne, numeroLigne) {
  const match = ligne.match(regexLog);
  
  if (!match) {
    stats.erreurs.push(`Ligne ${numeroLigne}: Format invalide`);
    return null;
  }
  
  const [, ip, timestamp, methode, url, protocol, codeStatut, taille] = match;
  
  return {
    ip,
    timestamp: new Date(timestamp.replace('/', ' ').replace('/', ' ')),
    methode,
    url,
    protocol,
    codeStatut: parseInt(codeStatut),
    taille: parseInt(taille)
  };
}

function mettreAJourStats(entree) {
  if (!entree) return;
  
  stats.lignesValides++;
  
  // Comptage par IP
  stats.ips[entree.ip] = (stats.ips[entree.ip] || 0) + 1;
  
  // Comptage par méthode HTTP
  stats.methodes[entree.methode] = (stats.methodes[entree.methode] || 0) + 1;
  
  // Comptage par code de statut
  stats.codesStatut[entree.codeStatut] = (stats.codesStatut[entree.codeStatut] || 0) + 1;
  
  // Comptage par URL
  stats.urls[entree.url] = (stats.urls[entree.url] || 0) + 1;
}

function trierParValeur(obj) {
  return Object.entries(obj)
    .sort(([,a], [,b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}

function afficherTop(titre, donnees, limite = 5) {
  console.log(`\n📊 ${titre}:`);
  const trie = trierParValeur(donnees);
  const entrees = Object.entries(trie).slice(0, limite);
  
  if (entrees.length === 0) {
    console.log('  Aucune donnée');
    return;
  }
  
  entrees.forEach(([cle, valeur], index) => {
    console.log(`  ${index + 1}. ${cle}: ${valeur} requêtes`);
  });
}

function categoriserCodeStatut(code) {
  if (code >= 200 && code < 300) return 'Succès';
  if (code >= 300 && code < 400) return 'Redirection';
  if (code >= 400 && code < 500) return 'Erreur client';
  if (code >= 500) return 'Erreur serveur';
  return 'Autre';
}

async function analyserFichier() {
  try {
    console.log(`🔍 Analyse du fichier: ${fichierLog}\n`);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(fichierLog)) {
      console.log(`❌ Erreur: Le fichier "${fichierLog}" n'existe pas`);
      process.exit(1);
    }
    
    // Lire le fichier ligne par ligne
    const contenu = fs.readFileSync(fichierLog, 'utf8');
    const lignes = contenu.split('\n').filter(ligne => ligne.trim() !== '');
    
    stats.totalLignes = lignes.length;
    
    // Traiter chaque ligne
    lignes.forEach((ligne, index) => {
      const entree = analyserLigne(ligne, index + 1);
      mettreAJourStats(entree);
    });
    
    // Afficher les résultats
    console.log('='.repeat(50));
    console.log('📈 RAPPORT D\'ANALYSE DES LOGS');
    console.log('='.repeat(50));
    
    console.log(`\n📋 Résumé général:`);
    console.log(`  Total de lignes: ${stats.totalLignes}`);
    console.log(`  Lignes valides: ${stats.lignesValides}`);
    console.log(`  Lignes avec erreurs: ${stats.totalLignes - stats.lignesValides}`);
    
    if (stats.erreurs.length > 0) {
      console.log(`\n❌ Erreurs de parsing:`);
      stats.erreurs.forEach(erreur => console.log(`  ${erreur}`));
    }
    
    // Top des IPs
    afficherTop('Top des adresses IP', stats.ips);
    
    // Méthodes HTTP
    console.log(`\n🌐 Répartition des méthodes HTTP:`);
    Object.entries(stats.methodes).forEach(([methode, count]) => {
      console.log(`  ${methode}: ${count} requêtes`);
    });
    
    // Codes de statut par catégorie
    console.log(`\n📊 Codes de statut par catégorie:`);
    const categories = {};
    Object.entries(stats.codesStatut).forEach(([code, count]) => {
      const categorie = categoriserCodeStatut(parseInt(code));
      categories[categorie] = (categories[categorie] || 0) + count;
    });
    
    Object.entries(categories).forEach(([categorie, count]) => {
      console.log(`  ${categorie}: ${count} requêtes`);
    });
    
    // Détail des codes de statut
    console.log(`\n🔢 Détail des codes de statut:`);
    const codesTriés = trierParValeur(stats.codesStatut);
    Object.entries(codesTriés).forEach(([code, count]) => {
      console.log(`  ${code}: ${count} requêtes`);
    });
    
    // Top des URLs
    afficherTop('Top des URLs les plus visitées', stats.urls);
    
    // Détection des problèmes
    console.log(`\n🚨 Alertes:`);
    const erreurs4xx = Object.entries(stats.codesStatut)
      .filter(([code]) => code >= 400 && code < 500)
      .reduce((total, [, count]) => total + count, 0);
      
    const erreurs5xx = Object.entries(stats.codesStatut)
      .filter(([code]) => code >= 500)
      .reduce((total, [, count]) => total + count, 0);
    
    if (erreurs4xx > 0) {
      console.log(`  ⚠️  ${erreurs4xx} erreurs client (4xx) détectées`);
    }
    
    if (erreurs5xx > 0) {
      console.log(`  🚨 ${erreurs5xx} erreurs serveur (5xx) détectées`);
    }
    
    if (erreurs4xx === 0 && erreurs5xx === 0) {
      console.log(`  ✅ Aucune erreur majeure détectée`);
    }
    
  } catch (error) {
    console.log(`❌ Erreur lors de l'analyse: ${error.message}`);
  }
}

// Lancer l'analyse
analyserFichier();
```

</details>

## Conclusion

Node.js est un outil puissant pour développer des applications JavaScript côté serveur. Ce tutoriel vous a fourni les bases pour commencer à utiliser Node.js, mais il existe bien d'autres fonctionnalités à explorer comme :

- La gestion asynchrone avec les callbacks, promises et async/await
- Les modules ESM (ES Modules)
- L'interaction avec les bases de données
- Le déploiement d'applications Node.js
- Les frameworks avancés comme NestJS, Fastify, etc.

N'hésitez pas à consulter la [documentation officielle de Node.js](https://nodejs.org/docs/) pour approfondir vos connaissances.