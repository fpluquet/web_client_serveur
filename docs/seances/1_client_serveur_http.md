# Architecture Client-Serveur et Client Léger

## 1. Théorie

### 1.1 Architecture Client-Serveur

Le web fonctionne selon une architecture client-serveur où :
- Le **client** est l'application qui envoie des requêtes et utilise les ressources (généralement un navigateur web)
- Le **serveur** est l'application qui reçoit des requêtes et fournit des ressources (généralement une application comme Node.js, Apache, etc.)

Cette architecture constitue la base de presque toutes les applications web modernes.

```mermaid
graph TB
    subgraph "Client"
        Browser[Navigateur Web]
    end
    subgraph "Réseau"
        Internet((Internet))
    end
    subgraph "Serveur"
        WebServer[Serveur Web]
        App[Application]
        DB[(Base de données)]
    end
    
    Browser -->|Requête HTTP| Internet
    Internet -->|Requête HTTP| WebServer
    WebServer -->|Traitement| App
    App -->|Requêtes| DB
    DB -->|Données| App
    App -->|Réponse| WebServer
    WebServer -->|Réponse HTTP| Internet
    Internet -->|Réponse HTTP| Browser
```

#### Diagramme de séquence d'une interaction client-serveur basique

```mermaid
sequenceDiagram
    participant C as Client (Navigateur)
    participant S as Serveur Web
    C->>S: Requête HTTP (GET, POST, PUT, DELETE)
    Note over S: Traitement de la requête
    S->>C: Réponse HTTP (HTML, CSS, JS, JSON, etc.)
    Note over C: Rendu et affichage
    Note over C: Exécution JavaScript
```


## 2. Structure d'une URL

Avant d'étudier le protocole HTTP, il est essentiel de comprendre la structure d'une **URL** (Uniform Resource Locator), qui est l'adresse utilisée pour identifier et accéder aux ressources sur le web.

### 2.1 Anatomie d'une URL

Une URL complète se compose de plusieurs parties :

```
https://www.exemple.com:8080/chemin/vers/ressource?param1=valeur1&param2=valeur2#section
```

#### Décomposition des composants :

| Composant | Valeur dans l'exemple | Description |
|-----------|----------------------|-------------|
| **Schéma** | `https://` | Protocole utilisé pour accéder à la ressource |
| **Host** | `www.exemple.com` | Nom du serveur qui héberge la ressource |
| **Port** | `:8080` | Numéro du port sur lequel le serveur écoute |
| **Chemin** | `/chemin/vers/ressource` | Emplacement de la ressource sur le serveur |
| **Paramètres** | `?param1=valeur1&param2=valeur2` | Données supplémentaires envoyées au serveur |
| **Fragment** | `#section` | Référence à une section spécifique de la page |

### 2.2 Description des composants

#### 1. **Schéma (Protocole)**
- **Définition** : Indique le protocole utilisé pour accéder à la ressource
- **Exemples courants** :
  - `http://` - HyperText Transfer Protocol (non sécurisé)
  - `https://` - HTTP Secure (sécurisé avec SSL/TLS)
  - `ftp://` - File Transfer Protocol
  - `file://` - Accès aux fichiers locaux

#### 2. **Host (Nom d'hôte)**
- **Définition** : Identifie le serveur qui héberge la ressource
- **Formats possibles** :
  - **Nom de domaine** : `www.exemple.com`, `api.monsite.fr`
  - **Adresse IP** : `192.168.1.1`, `127.0.0.1` (localhost)
- **Sous-domaines** : `api.exemple.com`, `blog.exemple.com`

#### 3. **Port**
- **Définition** : Numéro du port sur lequel le serveur écoute
- **Comportement** :
  - **Optionnel** - si omis, utilise le port par défaut du protocole
  - **HTTP** : port 80 par défaut
  - **HTTPS** : port 443 par défaut
- **Exemples** : `:8080`, `:3000`, `:5432`

#### 4. **Chemin (Path)**
- **Définition** : Spécifie l'emplacement de la ressource sur le serveur
- **Structure hiérarchique** : `/dossier/sous-dossier/fichier`
- **Exemples** :
  - `/` - Page d'accueil
  - `/users` - Liste des utilisateurs
  - `/users/123` - Utilisateur avec l'ID 123
  - `/api/v1/products` - API des produits version 1

#### 5. **Paramètres de requête (Query String)**
- **Définition** : Données supplémentaires envoyées au serveur
- **Format** : `?clé1=valeur1&clé2=valeur2`
- **Syntaxe détaillée** :
  - **`?`** : Marque le début des paramètres (obligatoire)
  - **`=`** : Sépare la clé de sa valeur (`clé=valeur`)
  - **`&`** : Sépare plusieurs paramètres entre eux
- **Structure** : `?paramètre1=valeur1&paramètre2=valeur2&paramètre3=valeur3`
- **Utilisations courantes** :
  - Filtrage : `?category=electronics&price=100`
  - Pagination : `?page=2&limit=10`
  - Recherche : `?q=nodejs&sort=date`, `?q=nodejs`, `?sort=date`
  - Combinaisons : `?search=laptop&category=tech&min_price=500&max_price=1500&sort=price_asc`

#### 6. **Fragment (Anchor)**
- **Définition** : Référence à une section spécifique de la page
- **Format** : `#nomDeLaSection`
- **Comportement** : Traité côté client (navigateur)
- **Exemples** : `#introduction`, `#chapitre-2`

### 2.3 Exemples pratiques

#### URL simple
```
https://www.google.com/
```
- **Protocole** : HTTPS
- **Host** : www.google.com
- **Port** : 443 (implicite)
- **Chemin** : / (racine)

#### URL d'API REST
```
https://api.github.com:443/users/octocat/repos?type=public&sort=updated
```
- **Protocole** : HTTPS
- **Host** : api.github.com
- **Port** : 443 (explicite)
- **Chemin** : /users/octocat/repos
- **Paramètres** : type=public et sort=updated

#### URL avec fragment
```
https://developer.mozilla.org/fr/docs/Web/HTTP#methods
```
- **Protocole** : HTTPS
- **Host** : developer.mozilla.org
- **Chemin** : /fr/docs/Web/HTTP
- **Fragment** : #methods

### 2.4 Encodage des URLs

Certains caractères doivent être encodés dans les URLs :

| Caractère | Encodage | Usage |
|-----------|----------|--------|
| Espace | `%20` ou `+` | Séparation des mots |
| `&` | `%26` | Paramètres multiples |
| `?` | `%3F` | Début des paramètres |
| `#` | `%23` | Fragment |
| `%` | `%25` | Encodage |

**Exemple** :
```
Original : https://site.com/search?q=hello world&type=article
Encodé   : https://site.com/search?q=hello%20world&type=article
```

### 2.5 Conclusion

Maintenant que nous comprenons la structure d'une URL, il est important de noter que :

- Le **client** (navigateur) envoie des **URLs bien formées** au serveur pour identifier précisément la ressource demandée
- Lorsque le **schéma/protocole** de l'URL est `http:` ou `https:`, le navigateur utilise le **protocole HTTP** pour communiquer avec le serveur
- Cette communication HTTP suit des règles précises que nous allons détailler dans la section suivante

L'URL constitue donc le "pont" entre le client et le serveur : elle indique **où** se trouve la ressource (host, port, chemin) et **comment** y accéder (protocole HTTP/HTTPS).

## 3. Le protocole HTTP

### 3.1 Introduction au protocole HTTP

Le **protocole HTTP** (HyperText Transfer Protocol) est le langage de communication entre les clients (navigateurs) et les serveurs web. Comprendre HTTP est essentiel pour développer des applications web efficaces.

#### Structure d'une requête HTTP

Une requête HTTP contient plusieurs éléments :

```
GET /accueil HTTP/1.1
Host: localhost:3000
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: fr-FR,fr;q=0.8,en-US;q=0.5,en;q=0.3
Connection: keep-alive

[Corps de la requête - optionnel]
```

**Composants :**
1. **Ligne de requête** : `GET /accueil HTTP/1.1`
   - **Méthode HTTP** : GET, POST, PUT, DELETE, etc.
   - **URL/Chemin** : `/accueil`
   - **Version HTTP** : HTTP/1.1
2. **En-têtes (Headers)** : Métadonnées sur la requête
3. **Corps (Body)** : Données envoyées (pour POST, PUT, etc.)

#### Méthodes HTTP principales

| Méthode | Description | Utilisation courante |
|---------|-------------|---------------------|
| **GET** | Récupérer des données | Afficher une page, récupérer des informations |
| **POST** | Envoyer des données | Soumettre un formulaire, créer une ressource |
| **PUT** | Mettre à jour complètement | Modifier une ressource existante |
| **DELETE** | Supprimer | Supprimer une ressource |
| **PATCH** | Mettre à jour partiellement | Modifier une partie d'une ressource |

#### Structure d'une réponse HTTP

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 452
Date: Fri, 23 Aug 2025 14:30:00 GMT
Server: Node.js

<!DOCTYPE html>
<html>
<head>
    <title>Ma page</title>
</head>
<body>
    <h1>Bonjour!</h1>
</body>
</html>
```

**Composants :**
1. **Ligne de statut** : `HTTP/1.1 200 OK`
   - **Version HTTP** : HTTP/1.1
   - **Code de statut** : 200 (succès)
   - **Message de statut** : OK
2. **En-têtes de réponse** : Métadonnées sur la réponse
3. **Corps de la réponse** : Le contenu HTML, CSS, JavaScript, etc.

#### Codes de statut HTTP essentiels

| Code | Signification | Description |
|------|---------------|-------------|
| **200** | OK | Requête réussie |
| **201** | Created | Ressource créée avec succès |
| **301** | Moved Permanently | Redirection permanente |
| **302** | Found | Redirection temporaire |
| **400** | Bad Request | Requête malformée |
| **401** | Unauthorized | Authentification requise |
| **403** | Forbidden | Accès refusé |
| **404** | Not Found | Ressource non trouvée |
| **500** | Internal Server Error | Erreur serveur |

### 3.2 Cycle de vie d'une communication HTTP

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant B as Navigateur
    participant S as Serveur Web
    
    U->>B: 1. Saisit une URL ou clique sur un lien
    B->>B: 2. Analyse l'URL
    B->>S: 3. Établit une connexion TCP
    B->>S: 4. Envoie une requête HTTP
    Note over S: 5. Traite la requête
    S->>B: 6. Renvoie une réponse HTTP
    B->>B: 7. Analyse la réponse
    B->>B: 8. Rend le contenu (HTML, CSS, JS)
    B->>U: 9. Affiche la page
    Note over B,S: 10. Ferme la connexion (ou maintient si keep-alive)
```

### 3.3 En-têtes HTTP importants

#### En-têtes de requête courants

| En-tête | Description | Exemple |
|---------|-------------|---------|
| `Host` | Nom du serveur cible | `Host: www.example.com` |
| `User-Agent` | Information sur le navigateur | `User-Agent: Mozilla/5.0...` |
| `Accept` | Types de contenu acceptés | `Accept: text/html,application/json` |
| `Accept-Language` | Langues préférées | `Accept-Language: fr-FR,en;q=0.9` |
| `Cookie` | Cookies envoyés au serveur | `Cookie: sessionId=abc123` |
| `Authorization` | Informations d'authentification | `Authorization: Bearer token123` |

#### En-têtes de réponse courants

| En-tête | Description | Exemple |
|---------|-------------|---------|
| `Content-Type` | Type du contenu retourné | `Content-Type: text/html; charset=utf-8` |
| `Content-Length` | Taille du contenu en octets | `Content-Length: 1024` |
| `Set-Cookie` | Définit un cookie | `Set-Cookie: sessionId=abc123; HttpOnly` |
| `Cache-Control` | Directives de mise en cache | `Cache-Control: no-cache, must-revalidate` |
| `Location` | URL de redirection | `Location: https://example.com/login` |

## 4. Exercices théoriques

### Exercice 4.1 : Analyse d'une communication HTTP

Analysez la communication HTTP suivante et répondez aux questions :

```
Requête :
GET /products/123 HTTP/1.1
Host: api.ecommerce.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)

Réponse :
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 245
Cache-Control: max-age=3600

{
  "id": 123,
  "name": "Ordinateur portable",
  "price": 899.99,
  "category": "Informatique"
}
```

**Questions :**
1. Quelle méthode HTTP est utilisée ?
2. Quel type de contenu le client accepte-t-il ?
3. Le client est-il authentifié ? Comment le savez-vous ?
4. Quel est le code de statut de la réponse ?
5. Combien de temps la réponse peut-elle être mise en cache ?

<details>
<summary>Solution</summary>

1. **Méthode HTTP utilisée :** GET
   - La première ligne de la requête indique `GET /products/123 HTTP/1.1`

2. **Type de contenu accepté par le client :** application/json
   - L'en-tête `Accept: application/json` indique que le client souhaite recevoir du JSON

3. **Authentification du client :** Oui, le client est authentifié
   - Présence de l'en-tête `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
   - Utilise un token Bearer (probablement JWT, voir la partie sur la sécurité)

4. **Code de statut de la réponse :** 200 OK
   - Indiqué dans la ligne de statut `HTTP/1.1 200 OK`
   - Signifie que la requête a été traitée avec succès

5. **Durée de mise en cache :** 3600 secondes (1 heure)
   - L'en-tête `Cache-Control: max-age=3600` indique que la réponse peut être mise en cache pendant 3600 secondes

</details>

### Exercice 4.2 : Conception d'une API REST

Concevez les requêtes HTTP pour une API de gestion de livres avec les opérations suivantes :
- Récupérer tous les livres
- Récupérer un livre spécifique
- Créer un nouveau livre
- Mettre à jour un livre existant
- Supprimer un livre

Pour chaque opération, spécifiez :
- La méthode HTTP
- L'URL
- Les en-têtes nécessaires
- Le corps de la requête (si applicable)
- Le code de statut de réponse attendu

<details>
<summary>Solution</summary>

#### 1. Récupérer tous les livres
```
GET /books HTTP/1.1
Host: api.bibliotheque.com
Accept: application/json
Authorization: Bearer [token] (optionnel selon l'API)

Corps de la requête : Aucun
Code de statut attendu : 200 OK
```

#### 2. Récupérer un livre spécifique
```
GET /books/{id} HTTP/1.1
Host: api.bibliotheque.com
Accept: application/json
Authorization: Bearer [token] (optionnel selon l'API)

Exemple : GET /books/123

Corps de la requête : Aucun
Code de statut attendu : 200 OK (si trouvé) ou 404 Not Found (si non trouvé)
```

#### 3. Créer un nouveau livre
```
POST /books HTTP/1.1
Host: api.bibliotheque.com
Content-Type: application/json
Accept: application/json
Authorization: Bearer [token]

{
  "title": "Le Petit Prince",
  "author": "Antoine de Saint-Exupéry",
  "isbn": "978-2-07-040847-4",
  "publicationYear": 1943,
  "genre": "Littérature"
}
```

Code de statut attendu : 201 Created

#### 4. Mettre à jour un livre existant
```
PUT /books/{id} HTTP/1.1
Host: api.bibliotheque.com
Content-Type: application/json
Accept: application/json
Authorization: Bearer [token]

Exemple : PUT /books/123

Corps de la requête :
{
  "title": "Le Petit Prince - Édition spéciale",
  "author": "Antoine de Saint-Exupéry",
  "isbn": "978-2-07-040847-4",
  "publicationYear": 1943,
  "genre": "Littérature jeunesse"
}

Code de statut attendu : 200 OK (si mis à jour) ou 404 Not Found (si non trouvé)
```

#### 5. Supprimer un livre
```
DELETE /books/{id} HTTP/1.1
Host: api.bibliotheque.com
Authorization: Bearer [token]

Exemple : DELETE /books/123

Corps de la requête : Aucun
Code de statut attendu : 204 No Content (si supprimé) ou 404 Not Found (si non trouvé)
```

**Notes importantes :**
- L'URL suit les conventions REST : `/books` pour la collection, `/books/{id}` pour une ressource spécifique
- Les en-têtes `Content-Type` et `Accept` sont essentiels pour indiquer le format des données
- L'authentification peut être requise selon les besoins de sécurité de l'API
- Les codes de statut suivent les standards HTTP pour chaque type d'opération

</details>


### Exercice 4.3 : Exemple d'analyse live

Rendez-vous sur votre navigateur web, ouvrez "Google.com" et ouvrez les outils de développement (F12 ou clic droit > Inspecter). Allez dans l'onglet "Réseau" (Network) et rechargez la page (F5).

**Questions :**
1. Quelle est la méthode HTTP de la requête principale pour charger la page ?
2. Quel est le code de statut de la réponse pour cette requête ?
3. Combien de requêtes ont été faites pour charger la page complète ?
4. Quel est le type de contenu de la réponse principale ?
5. Y a-t-il des requêtes qui ont échoué ? Si oui, lesquelles et pourquoi ?
6. Quels sont les en-têtes importants que vous pouvez identifier dans la requête et la réponse principales ?
