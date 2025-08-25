<?php
// Exemple d'API CRUD pour la séance 2

// Configuration des en-têtes pour API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Simuler une "base de données" avec un tableau
$users = [
    ['id' => 1, 'name' => 'Alice Smith', 'email' => 'alice@example.com'],
    ['id' => 2, 'name' => 'Bob Johnson', 'email' => 'bob@example.com']
];

// Récupérer la méthode HTTP et la route
$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];
$uri_parts = explode('/', trim(parse_url($request_uri, PHP_URL_PATH), '/'));

// Déterminer la ressource et l'identifiant (si fourni)
$resource = $uri_parts[0] ?? '';
$id = isset($uri_parts[1]) ? intval($uri_parts[1]) : null;

// Traiter les requêtes pour la ressource "users"
if ($resource === 'users') {
    switch ($method) {
        case 'GET':
            // GET /users - Lister tous les utilisateurs
            if ($id === null) {
                echo json_encode($users);
            } 
            // GET /users/{id} - Récupérer un utilisateur spécifique
            else {
                $user = null;
                foreach ($users as $u) {
                    if ($u['id'] === $id) {
                        $user = $u;
                        break;
                    }
                }
                
                if ($user) {
                    echo json_encode($user);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'User not found']);
                }
            }
            break;
            
        case 'POST':
            // POST /users - Créer un nouvel utilisateur
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['name']) || !isset($data['email'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Name and email are required']);
                break;
            }
            
            // Trouver le prochain ID disponible
            $max_id = 0;
            foreach ($users as $user) {
                if ($user['id'] > $max_id) {
                    $max_id = $user['id'];
                }
            }
            
            $new_user = [
                'id' => $max_id + 1,
                'name' => $data['name'],
                'email' => $data['email']
            ];
            
            $users[] = $new_user;
            
            http_response_code(201);
            echo json_encode($new_user);
            break;
            
        case 'PUT':
            // PUT /users/{id} - Mettre à jour un utilisateur existant
            if ($id === null) {
                http_response_code(400);
                echo json_encode(['error' => 'User ID is required']);
                break;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            $user_index = -1;
            
            // Trouver l'index de l'utilisateur à mettre à jour
            foreach ($users as $index => $user) {
                if ($user['id'] === $id) {
                    $user_index = $index;
                    break;
                }
            }
            
            if ($user_index === -1) {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
                break;
            }
            
            // Mettre à jour les champs fournis
            if (isset($data['name'])) {
                $users[$user_index]['name'] = $data['name'];
            }
            
            if (isset($data['email'])) {
                $users[$user_index]['email'] = $data['email'];
            }
            
            echo json_encode($users[$user_index]);
            break;
            
        case 'DELETE':
            // DELETE /users/{id} - Supprimer un utilisateur
            if ($id === null) {
                http_response_code(400);
                echo json_encode(['error' => 'User ID is required']);
                break;
            }
            
            $user_index = -1;
            $deleted_user = null;
            
            // Trouver l'index de l'utilisateur à supprimer
            foreach ($users as $index => $user) {
                if ($user['id'] === $id) {
                    $user_index = $index;
                    $deleted_user = $user;
                    break;
                }
            }
            
            if ($user_index === -1) {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
                break;
            }
            
            // Supprimer l'utilisateur du tableau
            unset($users[$user_index]);
            $users = array_values($users); // Réindexer le tableau
            
            echo json_encode([
                'message' => 'User deleted successfully',
                'user' => $deleted_user
            ]);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Resource not found']);
}
