// Ce script synchronise les exemples de code depuis les fichiers sources
// vers les fichiers Markdown des séances

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Fonction pour obtenir l'extension de langage pour la coloration syntaxique
function getLanguageFromExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const languageMap = {
    '.js': 'javascript',
    '.ts': 'typescript',
    '.html': 'html',
    '.css': 'css',
    '.php': 'php',
    '.py': 'python',
    '.java': 'java',
    '.json': 'json',
    '.md': 'markdown'
  };
  return languageMap[ext] || 'text';
}

// Fonction pour remplacer les inclusions de code dans le markdown
function replaceCodeInclusions(markdownContent, codeBasePath) {
  // Pattern pour trouver les inclusions de code: <!-- @include: path/to/file -->
  const includePattern = /<!--\s*@include:\s*([^>]+?)\s*-->/g;
  
  return markdownContent.replace(includePattern, (match, relativePath) => {
    const trimmedPath = relativePath.trim();
    const fullPath = path.join(codeBasePath, trimmedPath);
    
    console.log(`  Inclusion trouvée: ${trimmedPath}`);
    console.log(`  Chemin complet: ${fullPath}`);
    
    const fileContent = readFile(fullPath);
    if (!fileContent) {
      console.error(`  ❌ Impossible de lire le fichier: ${fullPath}`);
      return `<!-- ERREUR: Impossible de lire ${trimmedPath} -->`;
    }
    
    const language = getLanguageFromExtension(fullPath);
    console.log(`  ✅ Fichier inclus avec le langage: ${language}`);
    
    // Retourner le bloc de code avec la coloration syntaxique appropriée
    return `\`\`\`${language}\n${fileContent}\n\`\`\``;
  });
}

// Fonction pour traiter un fichier markdown
function processMarkdownFile(markdownPath) {
  console.log(`\nTraitement de: ${markdownPath}`);
  
  const content = readFile(markdownPath);
  if (!content) {
    console.error(`❌ Impossible de lire le fichier markdown: ${markdownPath}`);
    return false;
  }
  
  // Déterminer le chemin de base pour le code (basé sur le nom du fichier)
  const fileName = path.basename(markdownPath, '.md');
  let codeBasePath;
  
  // Mapping des fichiers markdown vers les dossiers de code
  const fileToCodeMap = {
    '5_client_lourd': 'seance5',
    '3_nodejs': 'seance3',
    '1_client_serveur_http': 'seance1'
    // Ajoutez d'autres mappings selon vos besoins
  };
  
  const codeFolder = fileToCodeMap[fileName];
  if (codeFolder) {
    codeBasePath = path.join(CODE_PATH, codeFolder);
    console.log(`  Utilisation du dossier de code: ${codeBasePath}`);
  } else {
    console.log(`  Aucun mapping de code trouvé pour: ${fileName}`);
    return false;
  }
  
  // Vérifier s'il y a des inclusions à traiter
  if (!content.includes('@include:')) {
    console.log(`  Aucune inclusion trouvée dans ${fileName}.md`);
    return false;
  }
  
  console.log(`  Traitement des inclusions trouvées...`);
  
  // Traiter les inclusions
  const updatedContent = replaceCodeInclusions(content, codeBasePath);
  
  // Écrire le fichier mis à jour seulement si le contenu a changé
  if (updatedContent !== content) {
    try {
      fs.writeFileSync(markdownPath, updatedContent, 'utf8');
      console.log(`  ✅ Fichier mis à jour: ${markdownPath}`);
      return true;
    } catch (error) {
      console.error(`  ❌ Erreur lors de l'écriture: ${error}`);
      return false;
    }
  } else {
    console.log(`  ℹ️  Aucune modification nécessaire`);
    return false;
  }
}

// Fonction principale
function main() {
  console.log('🚀 Synchronisation des exemples de code pour les séances...\n');
  
  try {
    // Scanner tous les fichiers markdown dans le dossier docs/seances
    const markdownFiles = fs.readdirSync(DOCS_PATH)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(DOCS_PATH, file));
    
    console.log(`📁 Fichiers markdown trouvés: ${markdownFiles.length}`);
    
    let processedCount = 0;
    for (const markdownFile of markdownFiles) {
      if (processMarkdownFile(markdownFile)) {
        processedCount++;
      }
    }
    
    console.log(`\n✅ Synchronisation terminée!`);
    console.log(`📊 Résumé: ${processedCount}/${markdownFiles.length} fichiers traités`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
    process.exit(1);
  }
}

// Exécuter le script
main();
