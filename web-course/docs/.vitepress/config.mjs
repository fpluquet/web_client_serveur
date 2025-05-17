import { defineConfig } from 'vitepress'
import mermaidPlugin from './mermaid-plugin'

export default defineConfig({
  title: "Cours Web BA2",
  description: "Syllabus du cours Web Bachelor 2",
  
  // Configuration pour la tête de document globale
  head: [
    // Métadonnées supplémentaires
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  
  // Utiliser les plugins personnalisés
  markdown: {
    config: (md) => {
      // Appliquer le plugin Mermaid au parseur Markdown
      if (mermaidPlugin.before) {
        mermaidPlugin.before({ md })
      }
    }
  },
  
  // Étendre VitePress avec notre plugin Mermaid
  vite: {
    plugins: [
      {
        name: 'vitepress-mermaid-plugin',
        configResolved(config) {
          // S'assurer que notre plugin est correctement chargé
          console.log('VitePress Mermaid Plugin chargé')
        }
      }
    ]
  },
  themeConfig: {
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Séances', link: '/seances/' }
    ],
    sidebar: {
      '/seances/': [
        {
          text: 'Séances',
          items: [
            { text: 'Introduction', link: '/seances/' },
            { text: 'Séance 1', link: '/seances/seance-1' },
            { text: 'Séance 2', link: '/seances/seance-2' },
            { text: 'Séance 3', link: '/seances/seance-3' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/votre-utilisateur/web-course' }
    ]
  }
})
