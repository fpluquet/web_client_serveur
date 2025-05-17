// Script d'initialisation Mermaid injecté dans VitePress
export default {
  // Script à exécuter côté navigateur
  enhanceApp({ app, router }) {
    if (typeof window !== 'undefined') {
      router.onBeforeRouteChange = () => { }
      router.onAfterRouteChange = () => {
        // Attendre le DOM pour traiter les diagrammes mermaid
        window.addEventListener('DOMContentLoaded', () => {
          initializeMermaid();
        });

        // Même après DOMContentLoaded, attendez un peu pour être sûr
        setTimeout(() => {
          initializeMermaid();
        }, 500);
      }
    }
  }
}

// Fonction d'initialisation de Mermaid
function initializeMermaid() {
  // Script à injecter pour Mermaid
  const mermaidScript = document.createElement('script');
  mermaidScript.src = 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js';
  document.head.appendChild(mermaidScript);

  // Une fois le script chargé, initialiser Mermaid
  mermaidScript.onload = () => {
    if (window.mermaid) {
      window.mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose'
      });

      // Fonction pour traiter les diagrammes
      const renderMermaidDiagrams = () => {
        // Chercher les blocs de code mermaid
        document.querySelectorAll('pre.language-mermaid code').forEach(el => {
          // Créer un élément pour le diagramme
          const container = document.createElement('div');
          container.className = 'mermaid';
          container.textContent = el.textContent;
          
          // Remplacer le bloc de code par l'élément mermaid
          const pre = el.parentElement;
          if (pre && pre.parentElement) {
            pre.parentElement.replaceChild(container, pre);
          }
        });

        // Essayer d'initialiser les diagrammes
        try {
          window.mermaid.init();
        } catch (error) {
          console.error('Erreur lors du rendu Mermaid:', error);
        }
      };

      // Exécuter maintenant et observer les changements dans le DOM
      renderMermaidDiagrams();
      
      // Observer les changements dans le contenu
      const observer = new MutationObserver((mutations) => {
        renderMermaidDiagrams();
      });
      
      // Observer le contenu principal
      const content = document.querySelector('.VPContent') || document.body;
      observer.observe(content, {
        childList: true,
        subtree: true
      });
    }
  };
}
