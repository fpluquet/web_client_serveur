// .vitepress/theme/mermaid-init.js
if (typeof window !== 'undefined') {
  // Fonction pour transformer les blocs mermaid
  const processMermaidBlocks = () => {
    // Attendre que le DOM soit chargé et que mermaid soit disponible
    if (typeof window.mermaid !== 'undefined') {
      try {
        // Chercher les blocs de code mermaid
        document.querySelectorAll('pre.language-mermaid code').forEach(el => {
          // Récupérer le contenu du bloc
          const content = el.textContent || '';
          
          // Créer un élément div pour le diagramme
          const div = document.createElement('div');
          div.classList.add('mermaid');
          div.textContent = content;
          
          // Remplacer le bloc de code par le div mermaid
          const pre = el.parentElement;
          if (pre && pre.parentElement) {
            pre.parentElement.replaceChild(div, pre);
          }
        });
        
        // Initialiser mermaid
        window.mermaid.initialize({
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose'
        });
        
        // Rendre les diagrammes
        window.mermaid.init(undefined, document.querySelectorAll('.mermaid'));
      } catch (error) {
        console.error('Error processing mermaid blocks:', error);
      }
    }
  };

  // Exécuter une première fois au chargement de la page
  document.addEventListener('DOMContentLoaded', processMermaidBlocks);
  
  // Puis observer les changements de navigation
  const setupObserver = () => {
    const targetNode = document.querySelector('.VPContent') || document.body;
    const observer = new MutationObserver((mutations) => {
      // Petit délai pour laisser les éléments se mettre en place
      setTimeout(processMermaidBlocks, 100);
    });
    
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
  };
  
  // Attendre que la page soit complètement chargée pour observer
  window.addEventListener('load', setupObserver);
}

export {};
