# 🗃️ Démonstration - Stockage Côté Client

Cette démonstration interactive vous permet de comprendre et tester les différents mécanismes de stockage disponibles côté client dans les navigateurs web modernes.

[📁 **Voir le code sur GitHub**](https://github.com/fpluquet/web_client_serveur/tree/main/code/seance5/demo-stockage)

## 📁 Types de stockage couverts

### 1. **localStorage**
- **Persistance** : Permanente jusqu'à suppression manuelle
- **Portée** : Partagé entre tous les onglets du même domaine
- **Capacité** : ~5-10MB
- **API** : Synchrone

### 2. **sessionStorage**
- **Persistance** : Jusqu'à fermeture de l'onglet
- **Portée** : Onglet actuel uniquement
- **Capacité** : ~5-10MB
- **API** : Synchrone (identique à localStorage)

### 3. **Cookies**
- **Persistance** : Configurable (session ou expiration)
- **Portée** : Domaine/chemin
- **Capacité** : ~4KB par cookie
- **Envoi** : Automatiquement inclus dans les requêtes HTTP

## 🚀 Comment utiliser la démonstration

### Installation
```bash
# Aller dans le dossier de la démonstration
cd code/seance5/demo-stockage

# Démarrer un serveur web local
python -m http.server 8000
# OU
npx serve .
# OU utiliser l'extension Live Server de VS Code
```

### Accès
Ouvrez votre navigateur à l'adresse : `http://localhost:8000`

## 🧪 Expériences suggérées

### Expérience 1 : Comprendre la persistance
1. **Sauvegardez** des données dans localStorage, sessionStorage et cookies
2. **Rafraîchissez** la page (F5)
   - ✅ localStorage et cookies persistent
   - ❌ sessionStorage peut persister (même onglet)
3. **Fermez l'onglet** et rouvrez la page
   - ✅ localStorage et cookies persistent
   - ❌ sessionStorage est perdu

### Expérience 2 : Comprendre la portée
1. **Sauvegardez** des données dans tous les types
2. **Ouvrez un nouvel onglet** vers la même page
3. **Chargez** les données depuis le nouvel onglet
   - ✅ localStorage et cookies sont partagés
   - ❌ sessionStorage est isolé par onglet

### Expérience 3 : Sauvegarde automatique
1. **Tapez du texte** dans la section "Sauvegarde Automatique"
2. **Rafraîchissez** la page ou fermez/rouvrez l'onglet
3. **Observez** que le texte est automatiquement restauré

### Expérience 4 : Limites et gestion d'erreurs
1. **Testez** avec de très longues chaînes de caractères
2. **Observez** les messages d'erreur de quota dépassé
3. **Explorez** les informations de stockage disponible

## 💡 Points d'apprentissage clés

### Quand utiliser chaque type :

**localStorage** :
- ✅ Préférences utilisateur (thème, langue)
- ✅ Cache de données non-critiques
- ✅ Brouillons sauvegardés automatiquement
- ❌ Données sensibles ou confidentielles

**sessionStorage** :
- ✅ État temporaire d'un formulaire multi-étapes
- ✅ Données de navigation dans une session
- ✅ Cache temporaire pour une session de travail
- ❌ Données qui doivent persister entre sessions

**Cookies** :
- ✅ Tokens d'authentification
- ✅ Préférences simples à envoyer au serveur
- ✅ Suivi des sessions utilisateur
- ❌ Stockage de grandes quantités de données
- ❌ Données qui ne doivent jamais être envoyées au serveur

## 🔧 Fonctionnalités de la démonstration

### Sections interactives :
1. **localStorage** - Opérations CRUD complètes
2. **sessionStorage** - Opérations CRUD complètes  
3. **Cookies** - Création, lecture, suppression avec expiration
4. **Sauvegarde automatique** - Exemple pratique de brouillon
5. **Comparaison en temps réel** - Test côte à côte
6. **Informations de stockage** - Analyse de l'usage et support

### Fonctionnalités techniques :
- ✅ Interface responsive
- ✅ Gestion d'erreurs robuste
- ✅ Messages de statut informatifs
- ✅ Tests de support d'API
- ✅ Estimation de l'usage du quota (API expérimentale)

## 📚 Liens avec le cours

Cette démonstration accompagne la **Section 2 : Stockage côté client** du cours "Client Lourd" et illustre concrètement :

- Les différences pratiques entre les types de stockage
- Les patterns d'usage courants
- La gestion d'erreurs et des limitations
- L'intégration dans des applications réelles

## 🎯 Exercices suggérés

1. **Modifiez** le code pour ajouter un nouveau type de stockage (par exemple, une simulation d'IndexedDB simple)

2. **Créez** votre propre exemple d'application utilisant plusieurs types de stockage en même temps

3. **Implémentez** un système de synchronisation entre localStorage et sessionStorage

4. **Ajoutez** une fonctionnalité d'export/import des données stockées

## 🔍 Pour aller plus loin

- Explorez **IndexedDB** pour des cas d'usage plus complexes
- Découvrez l'**API Cache** pour les Progressive Web Apps
- Étudiez les considérations de **sécurité** et de **vie privée**
- Apprenez la **gestion des quotas** et l'optimisation de l'espace

---

**Note** : Cette démonstration fonctionne dans tous les navigateurs modernes. Certaines fonctionnalités avancées (comme l'estimation du quota) peuvent ne pas être disponibles dans tous les navigateurs.