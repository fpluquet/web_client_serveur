<template>
  <ClientOnly>
    <!-- Le composant ne sera rendu que côté client -->
    <div class="mermaid-global-wrapper">
      <slot />
    </div>
  </ClientOnly>
</template>

<script setup>
import { onMounted, onUpdated, nextTick } from 'vue'

// Initialiser et rendre les diagrammes Mermaid
const initMermaid = async () => {
  // S'assurer que mermaid est chargé
  if (typeof window !== 'undefined') {
    try {
      // S'assurer que mermaid est disponible
      if (typeof window.mermaid === 'undefined') {
        // Charger mermaid dynamiquement si nécessaire
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js'
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }
      
      await nextTick() // Attendre le rendu du DOM
      
      // Configurer mermaid
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      })
      
      // Rendre tous les diagrammes
      document.querySelectorAll('pre.language-mermaid, div.language-mermaid pre').forEach(el => {
        // Si c'est déjà un élément mermaid avec SVG, ignorer
        if (el.classList.contains('mermaid-processed') || el.querySelector('svg')) {
          return
        }
        
        // Créer un div mermaid
        const code = el.querySelector('code') || el
        if (code) {
          const content = code.textContent
          const div = document.createElement('div')
          div.className = 'mermaid'
          div.textContent = content
          
          // Remplacer le bloc de code par le div
          if (el.parentNode) {
            // Ajouter une référence à l'élément original
            el.classList.add('mermaid-processed')
            
            // Placer le div immédiatement après le pré
            el.insertAdjacentElement('afterend', div)
            
            // Cacher l'élément original au lieu de le remplacer
            el.style.display = 'none'
            
            // Initialiser le diagramme asynchroniquement
            try {
              window.mermaid.render(`mermaid-diagram-${Date.now()}-${Math.floor(Math.random() * 10000)}`, content)
                .then(result => {
                  div.innerHTML = result.svg
                })
                .catch(err => {
                  console.error('Mermaid rendering error:', err)
                  div.textContent = 'Error rendering diagram: ' + err.message
                  div.className = 'mermaid-error'
                })
            } catch (err) {
              console.error('Mermaid initialization error:', err)
              div.textContent = 'Error rendering diagram: ' + err.message
              div.className = 'mermaid-error'
            }
          }
        }
      })
    } catch (err) {
      console.error('Mermaid error:', err)
    }
  }
}

// Exécuter à chaque montage et mise à jour du composant
onMounted(() => {
  // S'exécute quand le composant est monté
  setTimeout(initMermaid, 500)
})

onUpdated(() => {
  // S'exécute après chaque mise à jour du DOM
  setTimeout(initMermaid, 500)
})
</script>

<style>
.mermaid {
  text-align: center;
  margin: 1em 0;
  padding: 1em;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow-x: auto;
  max-width: 100%;
}

.mermaid svg {
  max-width: 100%;
  height: auto !important;
}

.mermaid-error {
  color: red;
  padding: 1em;
  border: 1px solid red;
  background-color: #fff0f0;
  border-radius: 4px;
}

.mermaid-processed {
  display: none;
}
</style>
