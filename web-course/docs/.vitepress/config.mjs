import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Cours Web BA2",
  description: "Syllabus du cours Web Bachelor 2",
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
