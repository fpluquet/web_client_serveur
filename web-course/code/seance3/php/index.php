<?php
// Exemple d'API sécurisée avec JWT pour la séance 3

// Configuration des en-têtes pour API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// En cas de requête OPTIONS (pre-flight), terminer immédiatement
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Clé secrète pour les JWT
$JWT_SECRET = 'votre-secret-jwt-super-securise';

// Simuler une "base de données" pour les utilisateurs
$users = [
    ['id' => 1, 'username' => 'alice', 'password' => 'password123', 'email' => 'alice@example.com'],
    ['id' => 2, 'username' => 'bob', 'password' => 'secret456', 'email' => 'bob@example.com']
];

// Récupérer la méthode HTTP et l'URI
$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];
$uri_parts = explode('/', trim(parse_url($request_uri, PHP_URL_PATH), '/'));

// Déterminer la ressource et l'identifiant
$resource = $uri_parts[0] ?? '';
$action = $uri_parts[1] ?? '';

// Fonction pour générer un JWT
function generateJWT($user, $secret, $expiry = 3600) {
    $issuedAt = time();
    $expiresAt = $issuedAt + $expiry;
    
    $payload = [
        'iat' => $issuedAt,        // Émis à (timestamp)
        'exp' => $expiresAt,       // Expiration (timestamp)
        'id' => $user['id'],
        'username' => $user['username'],
        'email' => $user['email']
    ];
    
    // Dans un cas réel, utilisez une bibliothèque comme firebase/php-jwt
    // Simulons un encodage JWT très basique
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode($payload));
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", $secret, true));
    
    return "$header.$payload.$signature";
}

// Fonction pour vérifier un JWT
function verifyJWT($token, $secret) {
    // Dans un cas réel, utilisez une bibliothèque comme firebase/php-jwt
    list($header, $payload, $signature) = explode('.', $token);
    
    $valid_signature = base64_encode(hash_hmac('sha256', "$header.$payload", $secret, true));
    if ($signature !== $valid_signature) {
        return false;
    }
    
    $payload_data = json_decode(base64_decode($payload), true);
    
    // Vérifier l'expiration
    if (isset($payload_data['exp']) && $payload_data['exp'] < time()) {
        return false;
    }
    
    return $payload_data;
}

// Middleware d'authentification
function authenticate() {
    global $JWT_SECRET;
    
    // Récupérer le token du header Authorization
    $headers = getallheaders();
    $auth = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (!preg_match('/Bearer\s(\S+)/', $auth, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit;
    }
    
    $token = $matches[1];
    $decoded = verifyJWT($token, $JWT_SECRET);
    
    if (!$decoded) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }
    
    return $decoded;
}

// Traiter les routes d'authentification
if ($resource === 'auth') {
    // Route de connexion
    if ($action === 'login' && $method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['username']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Username and password are required']);
            exit;
        }
        
        // Rechercher l'utilisateur
        $found_user = null;
        foreach ($users as $user) {
            if ($user['username'] === $data['username'] && $user['password'] === $data['password']) {
                $found_user = $user;
                break;
            }
        }
        
        if (!$found_user) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            exit;
        }
        
        // Générer un token
        $token = generateJWT($found_user, $JWT_SECRET);
        echo json_encode(['token' => $token]);
    }
    // Route d'inscription
    else if ($action === 'register' && $method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['username']) || !isset($data['password']) || !isset($data['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Username, password and email are required']);
            exit;
        }
        
        // Vérifier si l'utilisateur existe déjà
        foreach ($users as $user) {
            if ($user['username'] === $data['username'] || $user['email'] === $data['email']) {
                http_response_code(409);
                echo json_encode(['error' => 'Username or email already exists']);
                exit;
            }
        }
        
        // Trouver le prochain ID disponible
        $max_id = 0;
        foreach ($users as $user) {
            if ($user['id'] > $max_id) {
                $max_id = $user['id'];
            }
        }
        
        // Créer un nouvel utilisateur
        $new_user = [
            'id' => $max_id + 1,
            'username' => $data['username'],
            'password' => $data['password'], // NOTE: Dans une application réelle, on hasherait ce mot de passe
            'email' => $data['email']
        ];
        
        $users[] = $new_user;
        
        // Générer un token
        $token = generateJWT($new_user, $JWT_SECRET);
        
        http_response_code(201);
        echo json_encode([
            'user' => [
                'id' => $new_user['id'],
                'username' => $new_user['username'],
                'email' => $new_user['email']
            ],
            'token' => $token
        ]);
    }
    // Route protégée - infos de l'utilisateur courant
    else if ($action === 'me' && $method === 'GET') {
        $user = authenticate();
        echo json_encode(['user' => $user]);
    }
    else {
        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
    }
}
// Route protégée - ressource sécurisée
else if ($resource === 'protected-resource') {
    $user = authenticate();
    
    echo json_encode([
        'message' => 'This is a protected resource',
        'data' => 'Secret information',
        'user' => $user
    ]);
}
else {
    http_response_code(404);
    echo json_encode(['error' => 'Resource not found']);
}
