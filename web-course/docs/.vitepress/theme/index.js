// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import MermaidGlobal from './MermaidGlobal.vue'
import './custom.css'

// Exporter le thème
export default {
  ...DefaultTheme,
  
  enhanceApp({ app }) {
    // Enregistrer notre composant global pour gérer Mermaid
    app.component('MermaidGlobal', MermaidGlobal)
    
    // Appel du setup original si existant
    if (DefaultTheme.enhanceApp) {
      DefaultTheme.enhanceApp({ app })
    }
  },
  
  // Utiliser une mise en page personnalisée avec notre composant Mermaid
  Layout() {
    // Rendre la mise en page par défaut avec notre composant en bas
    return h(DefaultTheme.Layout, null, {
      // Ajouter notre gestionnaire Mermaid dans la mise en page
      'layout-bottom': () => h(MermaidGlobal)
    })
  }
}
