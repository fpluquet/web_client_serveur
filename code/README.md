# Index des Exemples de Code

Ce dossier contient tous les exemples de code pratiques du cours Web Client-Serveur.

## Structure du Projet

```
code/
├── seance1/          # Client-Serveur HTTP
├── seance2/          # Client Léger vs Lourd  
├── seance3/          # Node.js
├── seance4/          # Express.js (à venir)
├── seance5/          # Architecture Client Lourd ✅
│   ├── spa-basique/
│   └── todolist-client-lourd/
├── seance6/          # API REST (à venir)
├── seance7/          # Bases de données (à venir)
└── seance8/          # Tests (à venir)
```

## Séances Disponibles

### 📁 [Séance 5 - Architecture Client Lourd](seance5/)

**Exemples inclus :**
- **SPA Basique** : Application à page unique en JavaScript vanilla
- **TodoList Client Lourd** : Client lourd avec API REST Express

**Concepts couverts :**
- Single Page Applications (SPA)
- Navigation côté client
- Appels API avec fetch()
- Gestion d'état côté client
- Architecture client-serveur séparée

### 🚀 Comment Utiliser

1. **Naviguez vers une séance :**
   ```bash
   cd seance5
   ```

2. **Lisez le README :**
   Chaque séance contient un README détaillé avec les instructions

3. **Testez les exemples :**
   Suivez les instructions dans le README de chaque séance

### 🔄 Synchronisation Automatique

Le code de ces dossiers est automatiquement synchronisé avec la documentation VitePress via le script `sync-code.js`.

**Pour synchroniser manuellement :**
```bash
# Depuis la racine du projet
npm run sync-code
```

**Comment ajouter de nouveaux exemples :**

1. Créez vos fichiers dans le bon dossier `seanceX/`
2. Ajoutez les balises `<!-- @include: chemin/vers/fichier -->` dans le markdown
3. Ajoutez le mapping dans `sync-code.js`
4. Exécutez `npm run sync-code`

### 📚 Documentation

La documentation complète est disponible dans le dossier `docs/` et peut être consultée via :

```bash
npm run docs:dev
```

## Avantages de cette Architecture

✅ **Code Externe et Testable** : Le code est dans des fichiers séparés, facilement exécutables et testables  
✅ **Synchronisation Automatique** : Le code est automatiquement injecté dans la documentation  
✅ **Navigation Facile** : Structure claire avec README dans chaque dossier  
✅ **Réutilisabilité** : Code facilement copiable et modifiable  
✅ **Maintenance** : Une seule source de vérité pour le code  