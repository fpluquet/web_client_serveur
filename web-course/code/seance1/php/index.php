<?php
// index.php - Point d'entrée principal

// Fonction pour déterminer le contenu à afficher selon la route
function handleRoute() {
    // Récupérer la route depuis l'URL (par exemple: index.php?route=contact)
    $route = $_GET['route'] ?? 'home';
    
    switch ($route) {
        case 'home':
            return 'Bienvenue sur la page d\'accueil!';
        case 'contact':
            return 'Contactez-nous à contact@example.com';
        case 'about':
            return 'À propos de notre application web';
        default:
            // En-tête HTTP 404 pour les pages non trouvées
            header('HTTP/1.0 404 Not Found');
            return '404 - Page non trouvée';
    }
}

// Configuration simple du type de contenu
header('Content-Type: text/html; charset=utf-8');
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exemple PHP - Séance 1</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
        header { margin-bottom: 20px; }
        nav { margin-bottom: 20px; }
        nav a { margin-right: 10px; }
        .content { padding: 20px; border: 1px solid #ddd; border-radius: 4px; }
    </style>
</head>
<body>
    <header>
        <h1>Application PHP Simple</h1>
    </header>
    
    <nav>
        <a href="index.php">Accueil</a>
        <a href="index.php?route=contact">Contact</a>
        <a href="index.php?route=about">À propos</a>
    </nav>
    
    <div class="content">
        <?php echo handleRoute(); ?>
    </div>
    
    <footer>
        <p><small>&copy; 2025 - Cours Web BA2</small></p>
    </footer>
</body>
</html>
