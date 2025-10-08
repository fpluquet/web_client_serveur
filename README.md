# Cours Web BA2 - Syllabus 2025-2026

Ce dépôt contient le syllabus complet du cours Web Bachelor 2 de la Haute École Louvain en Hainaut.

## 📋 Aperçu du cours

Le cours couvre l'architecture web moderne, le développement backend avec Node.js/Express, les APIs RESTful, la sécurité web et les Progressive Web Apps sur **11 séances** complètes.

## 🏗️ Structure du projet

```
├── docs/                    # Documentation VitePress
│   ├── index.md            # Page d'accueil du syllabus
│   ├── seances/            # Contenu des 11 séances
│   └── tutos/              # Tutoriels additionnels
├── code/                   # Exemples de code pratiques
│   ├── seance1/            # Code de la séance 1
│   ├── seance2/            # Code de la séance 2
│   └── seance3/            # Code de la séance 3
├── solutions/              # Solutions des exercices
└── sync-code.js           # Script de synchronisation
```

## 📚 Programme des séances

### 🏗️ **Fondements de l'Architecture Web**
1. **Architecture Client-Serveur et HTTP** - Concepts fondamentaux et protocole HTTP
2. **Client Léger vs Client Lourd** - Comparaison des approches architecturales

### 🚀 **Technologies Backend**
3. **Node.js et l'Écosystème npm** - Environnement JavaScript côté serveur
4. **Serveurs Web avec Express.js** - Framework et middleware
5. **Architecture Client Lourd et SPA** - Single Page Applications

### 🔌 **APIs et Données**
6. **APIs RESTful** - Principes REST et bonnes pratiques
7. **Gestion des Données et Bases de Données** - Pattern MVC et ORM

### 🛡️ **Qualité et Sécurité**
8. **Tests et Qualité du Code** - Stratégies de test complètes
9. **Sécurité des Applications Web** - OWASP Top 10 et authentification

### 🌐 **Technologies Avancées**
10. **Progressive Web Apps (PWA)** - Service Workers et expérience native
11. **Conclusion et Perspectives** - Récapitulatif et évolutions

## 🚀 Démarrage rapide

### Prérequis
- Git pour cloner le dépôt

### Installation et lancement 

```bash
# Cloner le dépôt
git clone https://github.com/fpluquet/web_client_serveur.git
cd web_client_serveur

# Installer les dépendances
npm install

# Lancer le serveur de développement (documentation + synchronisation)
npm start

# Ou seulement la documentation
npm run docs:dev
```

La documentation sera accessible sur `http://localhost:5173`

## 📖 Utilisation

- **Documentation principale** : Consultez `docs/` pour le contenu théorique complet
- **Exemples pratiques** : Le dossier `code/` contient les applications d'exemple pour chaque séance
- **Solutions d'exercices** : Disponibles dans `solutions/` après avoir tenté les exercices

## 🛠️ Technologies utilisées

- **Documentation** : [VitePress](https://vitepress.dev/) avec support Mermaid pour les diagrammes
- **Backend** : Node.js, Express.js
- **Frontend** : JavaScript vanilla, HTML5, CSS3
- **Outils** : npm, Git, WebStorm, Visual Studio Code, ...

## 📜 Scripts disponibles

- `npm start` - Lance la synchronisation du code et le serveur de documentation
- `npm run docs:dev` - Mode développement de la documentation
- `npm run docs:build` - Build de production de la documentation
- `npm run docs:preview` - Preview du build de production
- `npm run sync-code` - Synchronise les exemples de code avec la documentation

## 🎯 Objectifs pédagogiques

À la fin de ce cours, vous maîtriserez :
- ✅ Les architectures web modernes (client léger/lourd)
- ✅ Le développement d'applications Node.js/Express robustes
- ✅ La création d'APIs RESTful professionnelles
- ✅ La gestion sécurisée des données et authentification
- ✅ Les stratégies de tests complets (unitaires, intégration, E2E)
- ✅ Le développement de Progressive Web Apps

---

**Haute École Louvain en Hainaut - Bachelor en Informatique de Gestion**  
*Année académique 2025-2026*
