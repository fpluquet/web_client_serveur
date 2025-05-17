// Ce script synchronise les exemples de code depuis les fichiers sources
// vers les fichiers Markdown des séances

const fs = require('fs');
const path = require('path');

// Définir les chemins
const BASE_PATH = __dirname;
const DOCS_PATH = path.join(BASE_PATH, 'docs', 'seances');
const CODE_PATH = path.join(BASE_PATH, 'code');

// Fonction pour lire un fichier
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return null;
  }
}

// Fonction pour mettre à jour le contenu Markdown
function updateMarkdown(markdownPath, sourceFilePath, commentStart) {
  const markdownContent = readFile(markdownPath);
  const sourceContent = readFile(sourceFilePath);
  
  if (!markdownContent || !sourceContent) {
    return false;
  }
  
  // Identifiants pour trouver où insérer le code
  const fileExtension = path.extname(sourceFilePath);
  const language = fileExtension === '.js' ? 'javascript' : fileExtension.substring(1);
  const startCodeBlock = '```' + language;
  const endCodeBlock = '```';
  
  // Construire une expression régulière pour trouver le bloc de code
  const regexPattern = new RegExp(`${startCodeBlock}[\\s\\S]*?${endCodeBlock}`, 'g');
  
  // Commenter le code source pour le Markdown
  const sourceWithComment = sourceContent.split('\n')
    .map(line => {
      if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
        return line;  // Ne pas modifier les lignes qui sont déjà des commentaires
      }
      return line;
    })
    .join('\n');
  
  // Créer le nouveau bloc de code
  const newCodeBlock = `${startCodeBlock}\n${sourceWithComment}\n${endCodeBlock}`;
  
  // Vérifier si le bloc de code existe déjà
  if (regexPattern.test(markdownContent)) {
    // Remplacer le bloc de code existant
    const updatedContent = markdownContent.replace(regexPattern, newCodeBlock);
    fs.writeFileSync(markdownPath, updatedContent);
    console.log(`Bloc de code mis à jour dans ${markdownPath}`);
  } else {
    console.log(`Aucun bloc de code correspondant trouvé dans ${markdownPath}`);
  }
  
  return true;
}

// Synchroniser les exemples de code pour la séance 1
console.log('Synchronisation des exemples de code pour les séances...');

// Synchroniser le code Node.js pour la séance 1
updateMarkdown(
  path.join(DOCS_PATH, 'seance-1.md'),
  path.join(CODE_PATH, 'seance1', 'nodejs', 'app.js'),
  '//'
);

// Synchroniser le code PHP pour la séance 1
updateMarkdown(
  path.join(DOCS_PATH, 'seance-1.md'),
  path.join(CODE_PATH, 'seance1', 'php', 'index.php'),
  '//'
);

// Synchroniser le code pour les autres séances...
// ... (ajoutez du code similaire pour les autres séances)

console.log('Synchronisation terminée!');
