// app.js
document.addEventListener('DOMContentLoaded', () => {
  // Conteneur principal
  const appContainer = document.getElementById('app');
  
  // Routes et contenu associé
  const routes = {
    'home': {
      title: 'Accueil',
      content: `
        <div class="page">
          <h1>Bienvenue sur notre SPA</h1>
          <p>Cette application utilise JavaScript pour changer de page sans rechargement.</p>
          <button id="load-data">Charger des données</button>
          <div id="data-container"></div>
        </div>
      `
    },
    'about': {
      title: 'À propos',
      content: `
        <div class="page">
          <h1>À propos de nous</h1>
          <p>Nous sommes une équipe qui développe des applications web modernes.</p>
          <p>Cette page est chargée dynamiquement sans rechargement du navigateur.</p>
        </div>
      `
    },
    'contact': {
      title: 'Contact',
      content: `
        <div class="page">
          <h1>Contactez-nous</h1>
          <form id="contact-form">
            <div class="form-group">
              <label for="name">Nom</label>
              <input type="text" id="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" required>
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" rows="4" required></textarea>
            </div>
            <button type="submit">Envoyer</button>
          </form>
          <div id="form-response"></div>
        </div>
      `
    }
  };
  
  // Fonction pour naviguer vers une route
  function navigateTo(route) {
    if (routes[route]) {
      // Mettre à jour le contenu
      appContainer.innerHTML = routes[route].content;
      document.title = routes[route].title;
      
      // Ajouter les gestionnaires d'événements spécifiques à la page
      if (route === 'home') {
        document.getElementById('load-data')?.addEventListener('click', fetchData);
      } else if (route === 'contact') {
        document.getElementById('contact-form')?.addEventListener('submit', handleFormSubmit);
      }
    }
  }
  
  // Ajouter les écouteurs d'événements pour la navigation
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = e.target.getAttribute('data-route');
      navigateTo(route);
      // Mettre à jour l'URL sans recharger la page (navigation historique)
      window.history.pushState(null, routes[route].title, `#${route}`);
    });
  });
  
  // Gestion des données API
  async function fetchData() {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = 'Chargement...';
    
    try {
      // Simuler un appel API (remplacez par un vrai appel API dans un cas réel)
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: [
              { id: 1, name: 'Item 1', description: 'Description de l\'item 1' },
              { id: 2, name: 'Item 2', description: 'Description de l\'item 2' },
              { id: 3, name: 'Item 3', description: 'Description de l\'item 3' },
            ]
          });
        }, 1000);
      });
      
      // Générer le HTML pour les données
      const html = `
        <h3>Données chargées</h3>
        <ul class="data-list">
          ${response.data.map(item => `
            <li>
              <h4>${item.name}</h4>
              <p>${item.description}</p>
            </li>
          `).join('')}
        </ul>
      `;
      
      dataContainer.innerHTML = html;
    } catch (error) {
      dataContainer.innerHTML = `<p class="error">Erreur: ${error.message}</p>`;
    }
  }
  
  // Gestion du formulaire
  function handleFormSubmit(e) {
    e.preventDefault();
    const formResponse = document.getElementById('form-response');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simuler un envoi de formulaire
    formResponse.innerHTML = 'Envoi en cours...';
    
    // Simuler une réponse après 1 seconde
    setTimeout(() => {
      formResponse.innerHTML = `
        <div class="success">
          Message envoyé avec succès!
          <p>Résumé: ${name} (${email}): ${message.substring(0, 20)}...</p>
        </div>
      `;
    }, 1000);
  }
  
  // Navigation initiale basée sur le hash URL ou page d'accueil par défaut
  const initialRoute = window.location.hash.substring(1) || 'home';
  navigateTo(initialRoute);
  
  // Gestion du bouton retour du navigateur
  window.addEventListener('popstate', () => {
    const currentRoute = window.location.hash.substring(1) || 'home';
    navigateTo(currentRoute);
  });
});