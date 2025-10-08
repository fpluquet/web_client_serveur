<?php
// Solution pour l'exercice 1.2 - Routage simple

// Récupérer la route depuis l'URL (par exemple: exercice1-2.php?route=contact)
$route = $_GET['route'] ?? '';

// Déterminer le contenu à afficher selon la route
switch ($route) {
    case '':
        echo "Accueil";
        break;
    case 'contact':
        echo "Contactez-nous";
        break;
    case 'about':
        echo "À propos";
        break;
    default:
        // En-tête HTTP 404 pour les pages non trouvées
        header('HTTP/1.0 404 Not Found');
        echo "404 - Page non trouvée";
        break;
}
