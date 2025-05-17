// docs/.vitepress/mermaid-plugin.js
import { h } from 'vue'

export default {
  name: 'mermaid-plugin',
  // Avant que VitePress processe le Markdown
  before({ md }) {
    // Utilisons un fence (bloc de code) personnalisé pour Mermaid
    const defaultRender = md.renderer.rules.fence || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options, env, self)
    }

    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      if (token.info.trim() === 'mermaid') {
        // Pour les blocs Mermaid, créer un marquage spécial pour faciliter la détection côté client
        return `<div class="mermaid-wrapper">
          <pre class="language-mermaid"><code>${md.utils.escapeHtml(token.content)}</code></pre>
        </div>`
      }
      return defaultRender(tokens, idx, options, env, self)
    }
  },
    // Après que VitePress a rendu la page
  enhanceApp({ app, router }) {
    // Ajouter un hook global de navigation
    router.onAfterEach(() => {
      // Attendre que le DOM soit mis à jour
      setTimeout(() => {
        // Essayer de charger et initialiser Mermaid
        if (typeof window !== 'undefined') {
          import('mermaid').then(module => {
            const mermaid = module.default
            
            try {
              // Configurer Mermaid
              mermaid.initialize({
                startOnLoad: false, // Important: désactiver le chargement automatique
                theme: 'default',
                securityLevel: 'loose',
                fontFamily: 'sans-serif',
                flowchart: {
                  useMaxWidth: true,
                  htmlLabels: true
                }
              })
              
              // Traiter chaque élément mermaid dans la page
              document.querySelectorAll('.mermaid-wrapper pre.language-mermaid code, pre.language-mermaid code').forEach((el, index) => {
                // Assurez-vous que le contenu n'est pas déjà rendu
                if (!el.parentElement.classList.contains('mermaid-processed')) {
                  try {
                    // Marquer comme traité pour éviter les doublons
                    el.parentElement.classList.add('mermaid-processed')
                    
                    // Créer un ID unique pour ce diagramme
                    const id = `mermaid-diagram-${Date.now()}-${index}`
                    
                    // Obtenir le code Mermaid
                    const content = el.textContent
                    
                    // Créer un conteneur pour le diagramme rendu
                    const container = document.createElement('div')
                    container.className = 'mermaid-diagram'
                    el.parentElement.insertAdjacentElement('afterend', container)
                    
                    // Rendre le diagramme de manière asynchrone
                    mermaid.render(id, content)
                      .then(result => {
                        container.innerHTML = result.svg
                      })
                      .catch(error => {
                        console.error('Mermaid render error:', error)
                        container.innerHTML = `<pre class="mermaid-error">Erreur de rendu du diagramme: ${error.message}</pre>`
                      })
                  } catch (error) {
                    console.error('Mermaid init error:', error)
                    el.innerHTML += `<pre class="mermaid-error">Erreur Mermaid: ${error.message}</pre>`                  }
                }
              })
              
              // Ajouter des styles pour les diagrammes Mermaid
              if (!document.getElementById('mermaid-styles')) {
                const styles = document.createElement('style')
                styles.id = 'mermaid-styles'
                styles.textContent = `
                  .mermaid-diagram {
                    text-align: center;
                    margin: 1.5em 0;
                    padding: 1em;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    overflow-x: auto;
                  }
                  .mermaid-diagram svg {
                    max-width: 100%;
                    height: auto !important;
                  }
                  .mermaid-processed {
                    display: none;
                  }
                  .mermaid-error {
                    color: red;
                    padding: 1em;
                    border: 1px solid red;
                    background-color: #fff0f0;
                    border-radius: 4px;
                  }
                `
                document.head.appendChild(styles)
              }
            } catch (error) {
              console.error('Mermaid initialize error:', error)
            }
          }).catch(error => {
            console.error('Failed to load Mermaid:', error)
          })
        }
      }, 300) // Augmenter le délai pour s'assurer que le DOM est complètement chargé
    })
  }
}
