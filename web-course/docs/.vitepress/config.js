import footnote from "markdown-it-footnote";
import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    lang: "fr-FR",
    title: "Cours Web BA2",
    description:
      "Syllabus du cours Web Bachelor 2 pour les étudiants de BA2 - HELHa",
    // Configuration pour la tête de document globale
    head: [
      ["link", { rel: "icon", href: "/favicon.ico" }],
      // Métadonnées supplémentaires
      ["meta", { name: "theme-color", content: "#3eaf7c" }],
      ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
      [
        "meta",
        { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      ],
    ],

    // Configuration de Mermaid
    mermaid: {
      theme: "neutral",
      darkMode: false,
      securityLevel: "loose",
      logLevel: "error",
      htmlLabels: true,
      flowchart: {
        htmlLabels: true,
        useMaxWidth: true,
        rankSpacing: 65,
        nodeSpacing: 30,
        padding: 15,
      },
      // Styles personnalisés pour améliorer la lisibilité
      themeVariables: {
        primaryColor: "#5D8AA8",
        primaryTextColor: "#fff",
        primaryBorderColor: "#7C0200",
        lineColor: "#404040",
        secondaryColor: "#006100",
        tertiaryColor: "#fff",
        nodeBorder: "#2b6387", // Couleur des bordures de nœuds
        clusterBkg: "#e9f3f8", // Couleur de fond des subgraphs
        clusterBorder: "#2b6387", // Couleur de bordure des subgraphs
        titleColor: "#333333", // Couleur du texte des titres
      },
    },

    markdown: {
      config: (md) => {
        md.use(footnote);
      },
    },

    // Étendre VitePress avec notre plugin Mermaid
    vite: {
      plugins: [
        {
          name: "vitepress-mermaid-plugin",
          configResolved(config) {
            // S'assurer que notre plugin est correctement chargé
            console.log("VitePress Mermaid Plugin chargé");
          },
        },
      ],
    },

    themeConfig: {
      nav: [
        { text: "Accueil", link: "/" },
      ],
      sidebar: {
        "/seances/": [
          {
            text: "Chapitres",
            items: [
              { text: "Introduction", link: "/seances/" },
              {
                text: "Architecture Client-Serveur et HTTP",
                link: "/seances/1_client_serveur_http",
              },
              {
                text: "Client Léger vs Lourd",
                link: "/seances/2_client_leger_lourd",
              },
              { text: "Node.js", link: "/seances/3_nodejs" },
              { text: "Express.js", link: "/seances/4_express" },
              { text: "Architecture Client Lourd", link: "/seances/5_client_lourd" },
              { text: "API Rest", link: "/seances/6_api_rest" },
              { text: "Base de données", link: "/seances/7_db" },
              { text: "Tests", link: "/seances/8_tests" },
              { text: "Sécurité", link: "/seances/9_securite" },
              { text: "Progressive Web App", link: "/seances/10_pwa" },
              { text: "Conclusion", link: "/seances/11_conclusion" },
            ],
          },
        ],
      },
      // Pied de page
      footer: {
        message: "Syllabus créé par Prof. Frédéric Pluquet",
        copyright: "Copyright © 2024-2025 HELHa",
      },

      // Options de recherche
      search: {
        provider: "local",
      },

      // Fonctionnalités sociales
      socialLinks: [{ icon: "github", link: "https://github.com/fpluquet/web_client_serveur" }],

      // Fonctionnalités supplémentaires - Outline dans la colonne de droite
      outline: {
        level: [2,3], // Affiche les titres de niveau 2 à 6
        label: "Sur cette page",
      },

      // Configuration pour les libellés
      outlineTitle: "Sommaire",
      sidebarMenuLabel: "Menu",

      // Dernier mis à jour
      lastUpdated: {
        text: "Mis à jour le",
        formatOptions: {
          dateStyle: "long",
          timeStyle: "short",
        },
      },

      // Liens de navigation en bas de page
      docFooter: {
        prev: "Page précédente",
        next: "Page suivante",
      },
    },
  })
);
