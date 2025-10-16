# Guide d'utilisation du système de changement de mot de passe

## Endpoint pour changer le mot de passe

### PUT /api/users/change-password

Permet à un utilisateur authentifié de changer son mot de passe.

#### Headers requis
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

#### Corps de la requête
```json
{
  "currentPassword": "ancien_mot_de_passe",
  "newPassword": "nouveau_mot_de_passe",
  "confirmPassword": "nouveau_mot_de_passe"
}
```

#### Règles de validation
- `currentPassword` : requis, doit correspondre au mot de passe actuel
- `newPassword` : 
  - Minimum 6 caractères
  - Doit contenir au moins une minuscule, une majuscule et un chiffre
  - Doit être différent de l'ancien mot de passe
- `confirmPassword` : doit être identique à `newPassword`

#### Réponses possibles

##### Succès (200)
```json
{
  "success": true,
  "message": "Mot de passe modifié avec succès"
}
```

##### Erreurs de validation (400)
```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "msg": "Le nouveau mot de passe doit contenir au moins 6 caractères",
      "path": "newPassword",
      "location": "body"
    }
  ]
}
```

##### Ancien mot de passe incorrect (400)
```json
{
  "success": false,
  "message": "L'ancien mot de passe est incorrect"
}
```

##### Nouveau mot de passe identique à l'ancien (400)
```json
{
  "success": false,
  "message": "Le nouveau mot de passe doit être différent de l'ancien"
}
```

##### Non authentifié (401)
```json
{
  "success": false,
  "message": "Token manquant"
}
```

## Exemple d'utilisation avec curl

```bash
# 1. S'inscrire d'abord
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123"
  }'

# 2. Utiliser le token reçu pour changer le mot de passe
curl -X PUT http://localhost:3000/api/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "currentPassword": "Password123",
    "newPassword": "NewPassword456",
    "confirmPassword": "NewPassword456"
  }'
```

## Exemple avec JavaScript (fetch)

```javascript
async function changePassword(token, currentPassword, newPassword) {
  try {
    const response = await fetch('/api/users/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword: newPassword
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Mot de passe changé avec succès !');
    } else {
      console.error('Erreur :', data.message || data.errors);
    }
    
    return data;
  } catch (error) {
    console.error('Erreur réseau :', error);
  }
}

// Utilisation
changePassword('votre_token_jwt', 'ancienMotDePasse', 'nouveauMotDePasse123');
```

## Fonctionnalités de sécurité implémentées

✅ **Vérification de l'ancien mot de passe** - L'utilisateur doit prouver qu'il connaît son mot de passe actuel

✅ **Validation du nouveau mot de passe** - Règles de complexité strictes

✅ **Confirmation du mot de passe** - Évite les erreurs de saisie

✅ **Hachage sécurisé** - Utilisation de bcrypt avec salt

✅ **Authentification requise** - Seul l'utilisateur connecté peut changer son mot de passe

✅ **Prévention de la réutilisation** - Le nouveau mot de passe doit être différent de l'ancien

✅ **Messages d'erreur sécurisés** - Pas de fuite d'informations sensibles

## Tests automatisés

Le système inclut une suite de tests complète qui vérifie :
- Le changement de mot de passe réussi
- La validation des entrées
- La vérification de l'ancien mot de passe
- La prévention de la réutilisation du même mot de passe
- La gestion des erreurs d'authentification

Pour exécuter les tests :
```bash
npm test
```