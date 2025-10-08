# Gestion des données et interaction avec la base de données

## 1. Introduction à la gestion des données dans les applications web

La gestion des données constitue le cœur de la plupart des applications web modernes. Que ce soit pour stocker les informations des utilisateurs, gérer un catalogue de produits, ou maintenir un système de contenu, l'interaction avec une base de données est incontournable. Dans ce chapitre, nous explorerons en détail comment construire des applications robustes en Node.js avec Express qui interagissent efficacement avec différents types de bases de données.

L'évolution des applications web a mené à l'adoption de patterns architecturaux qui séparent clairement les responsabilités. Le pattern MVC (Modèle-Vue-Contrôleur) est devenu un standard pour organiser le code de manière maintenable et évolutive. Dans ce contexte, la couche modèle gère toute la logique liée aux données, tandis que les contrôleurs orchestrent les interactions entre les requêtes HTTP et les modèles.

## 2. Comprendre les requêtes HTTP et la gestion des données

### 2.1 Les méthodes HTTP dans le contexte des données

Les méthodes HTTP forment la base de toute API RESTful moderne. Chaque méthode a une sémantique précise qui guide son utilisation dans la gestion des données :

**GET - Récupération de données**
La méthode GET est idempotente et ne doit jamais modifier l'état du serveur. Elle est utilisée pour récupérer des ressources existantes. Dans le contexte d'une base de données, GET correspond aux opérations de lecture (SELECT en SQL).

**POST - Création de ressources**
POST est utilisée pour créer de nouvelles ressources. Contrairement à PUT, POST n'est pas idempotente : effectuer la même requête POST plusieurs fois peut créer plusieurs ressources identiques. En base de données, cela correspond aux opérations INSERT.

**PUT et PATCH - Mise à jour de ressources**
PUT remplace complètement une ressource existante, tandis que PATCH applique une modification partielle. Ces méthodes correspondent aux opérations UPDATE en SQL, avec PUT nécessitant tous les champs et PATCH permettant des mises à jour partielles.

**DELETE - Suppression de ressources**
DELETE supprime une ressource existante. Elle est idempotente : supprimer une ressource déjà supprimée n'a pas d'effet de bord. Cela correspond aux opérations DELETE en SQL.

### 2.2 Limitations du stockage en fichiers

Avant d'aborder les bases de données, il est important de comprendre pourquoi la sauvegarde des données dans de simples fichiers texte ou JSON n'est pas une solution robuste pour les applications web modernes.

### Problèmes de concurrence

Lorsque plusieurs utilisateurs accèdent simultanément à une application, les opérations de lecture et d'écriture sur des fichiers peuvent entrer en conflit. Imaginez deux utilisateurs qui tentent de créer un compte simultanément :

```javascript
// Problème de concurrence avec les fichiers
import fs from 'fs/promises';

async function createUser(userData) {
    try {
        // Lecture du fichier existant
        const data = await fs.readFile('users.json', 'utf8');
        const users = JSON.parse(data);
        
        // Ajout du nouvel utilisateur
        const newUser = { id: users.length + 1, ...userData };
        users.push(newUser);
        
        // Écriture du fichier - PROBLÈME : un autre processus peut 
        // modifier le fichier entre la lecture et l'écriture !
        await fs.writeFile('users.json', JSON.stringify(users, null, 2));
        
        return newUser;
    } catch (error) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
    }
}
```

### Absence de transactions

Les fichiers ne supportent pas le concept de transactions. Si une opération complexe implique plusieurs modifications (par exemple, transférer de l'argent entre deux comptes), il n'y a aucun moyen de garantir que toutes les opérations réussissent ou échouent ensemble.

### Performance et recherche

Rechercher des données dans un fichier nécessite de le lire entièrement et de parcourir tous les enregistrements. Cette approche devient rapidement inefficace avec l'augmentation du volume de données :

```javascript
// Recherche inefficace dans un fichier
async function findUserByEmail(email) {
    const data = await fs.readFile('users.json', 'utf8');
    const users = JSON.parse(data);
    
    // Parcours linéaire - O(n) complexité
    return users.find(user => user.email === email);
}
```

### Problèmes d'intégrité des données

Les fichiers n'offrent aucune garantie sur la structure ou la validité des données. Un fichier corrompu ou une erreur d'écriture peut rendre toutes les données inutilisables.

### Limitations de sauvegarde et récupération

La sauvegarde d'un fichier en cours d'utilisation peut créer des incohérences. De plus, en cas de panne système, les données non sauvegardées sont perdues sans possibilité de récupération.

## 3. Introduction aux bases de données relationnelles

### 3.1 SQLite : La base de données embarquée

SQLite est une base de données relationnelle légère et autonome, parfaite pour le développement, les tests, et les applications de taille modeste. Elle ne nécessite pas de serveur séparé et stocke toutes les données dans un seul fichier.

**Installation et configuration avec Node.js :**

```bash
npm install sqlite3
```

**Exemple d'utilisation basique :**

```javascript
import sqlite3 from 'sqlite3';
import path from 'path';

// Connexion à la base de données
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à SQLite:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
    }
});

// Création de la table users
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        age INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Classe pour gérer les opérations CRUD
class UserService {
    static create(userData) {
        return new Promise((resolve, reject) => {
            const { name, email, age } = userData;
            const stmt = db.prepare(`
                INSERT INTO users (name, email, age) 
                VALUES (?, ?, ?)
            `);
            
            stmt.run([name, email, age], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, name, email, age });
                }
            });
            
            stmt.finalize();
        });
    }
    
    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE id = ?', 
                [id], 
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        });
    }
    
    static findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM users ORDER BY created_at DESC', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    static update(id, userData) {
        return new Promise((resolve, reject) => {
            const { name, email, age } = userData;
            db.run(
                'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
                [name, email, age, id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ changes: this.changes });
                    }
                }
            );
        });
    }
    
    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }
}
```

### 3.2 MariaDB : Base de données robuste pour la production

MariaDB est un fork de MySQL qui offre des performances excellentes et une robustesse nécessaire pour les applications en production. Elle supporte les transactions ACID, les index complexes, et la réplication.

**Installation et configuration :**

```bash
npm install mariadb
```

**Configuration de la connexion :**

```javascript
import mariadb from 'mariadb';

// Configuration du pool de connexions
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'web_app_db',
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000
});

// Classe de service pour MariaDB
class MariaDBUserService {
    static async create(userData) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const { name, email, age } = userData;
            const result = await conn.query(
                'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
                [name, email, age]
            );
            
            return {
                id: result.insertId.toString(),
                name,
                email,
                age
            };
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
    
    static async findById(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows[0] || null;
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
    
    static async findAll(limit = 50, offset = 0) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(
                'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
                [limit, offset]
            );
            return rows;
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
    
    static async update(id, userData) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const { name, email, age } = userData;
            const result = await conn.query(
                'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
                [name, email, age, id]
            );
            
            return { affectedRows: result.affectedRows };
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
    
    static async delete(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query('DELETE FROM users WHERE id = ?', [id]);
            return { affectedRows: result.affectedRows };
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}
```

## 4. Introduction à MongoDB

### 4.1 Qu'est-ce que MongoDB ?

MongoDB est une base de données NoSQL orientée documents qui stocke les données au format BSON (Binary JSON), un format binaire dérivé de JSON. Contrairement aux bases de données relationnelles qui organisent les données en tables avec des schémas fixes, MongoDB organise les données en collections de documents flexibles.

**Caractéristiques principales de MongoDB :**

- **Documents JSON** : Les données sont stockées sous forme de documents BSON, similaires aux objets JavaScript
- **Schéma flexible** : Chaque document peut avoir une structure différente
- **Requêtes riches** : Support des requêtes complexes, des index, et de l'agrégation
- **Scalabilité horizontale** : Support natif de la réplication et du sharding
- **Performance** : Optimisé pour les opérations de lecture et d'écriture rapides

### 4.2 Installation et configuration de MongoDB

**Installation de MongoDB (macOS avec Homebrew) :**

```bash
# Installation de MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# Démarrage du service MongoDB
brew services start mongodb/brew/mongodb-community
```

**Installation du driver MongoDB pour Node.js :**

```bash
npm install mongodb
```

### 4.3 Connexion et opérations de base avec MongoDB

**Configuration de la connexion :**

```javascript
import { MongoClient } from 'mongodb';

class DatabaseService {
    constructor() {
        this.client = null;
        this.db = null;
        this.uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
        this.dbName = process.env.DB_NAME || 'myapp';
    }

    async connect() {
        try {
            this.client = new MongoClient(this.uri, {
                useUnifiedTopology: true,
            });
            
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            console.log('Connecté à MongoDB');
        } catch (error) {
            console.error('Erreur de connexion à MongoDB:', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.close();
            console.log('Déconnecté de MongoDB');
        }
    }

    getCollection(name) {
        return this.db.collection(name);
    }
}

const dbService = new DatabaseService();
export default dbService;
```

### 4.4 Modèle de données et opérations CRUD

**Exemple de structure de document utilisateur :**

```javascript
// Structure d'un document utilisateur dans MongoDB
const userDocument = {
    _id: new ObjectId(), // ID généré automatiquement par MongoDB
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    age: 30,
    profile: {
        bio: "Développeur passionné",
        avatar: "https://example.com/avatar.jpg",
        socialLinks: {
            twitter: "@jeandupont",
            linkedin: "jean-dupont"
        }
    },
    tags: ["développeur", "javascript", "mongodb"],
    createdAt: new Date(),
    updatedAt: new Date()
};
```

**Classe de service pour les opérations CRUD :**

```javascript
import { ObjectId } from 'mongodb';
import dbService from './database.js';

class UserService {
    constructor() {
        this.collection = null;
    }

    async initialize() {
        this.collection = dbService.getCollection('users');
        
        // Création d'index pour optimiser les performances
        await this.collection.createIndex({ email: 1 }, { unique: true });
        await this.collection.createIndex({ name: "text" }); // Index de recherche textuelle
    }

    // CREATE - Création d'un utilisateur
    async create(userData) {
        try {
            const newUser = {
                ...userData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await this.collection.insertOne(newUser);
            return { _id: result.insertedId, ...newUser };
        } catch (error) {
            if (error.code === 11000) {
                throw new Error('Un utilisateur avec cet email existe déjà');
            }
            throw error;
        }
    }

    // READ - Lecture d'un utilisateur par ID
    async findById(id) {
        try {
            const objectId = new ObjectId(id);
            return await this.collection.findOne({ _id: objectId });
        } catch (error) {
            throw new Error('ID utilisateur invalide');
        }
    }

    // READ - Recherche d'utilisateurs avec filtres
    async find(filters = {}, options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = -1,
            search
        } = options;

        let query = { ...filters };

        // Ajout de la recherche textuelle si fournie
        if (search) {
            query.$text = { $search: search };
        }

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            this.collection
                .find(query)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .toArray(),
            this.collection.countDocuments(query)
        ]);

        return {
            users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        };
    }

    // UPDATE - Mise à jour d'un utilisateur
    async update(id, updateData) {
        try {
            const objectId = new ObjectId(id);
            const updateDoc = {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            };

            const result = await this.collection.updateOne(
                { _id: objectId },
                updateDoc
            );

            if (result.matchedCount === 0) {
                throw new Error('Utilisateur non trouvé');
            }

            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // DELETE - Suppression d'un utilisateur
    async delete(id) {
        try {
            const objectId = new ObjectId(id);
            const result = await this.collection.deleteOne({ _id: objectId });
            
            if (result.deletedCount === 0) {
                throw new Error('Utilisateur non trouvé');
            }

            return { success: true, deletedCount: result.deletedCount };
        } catch (error) {
            throw error;
        }
    }

    // Opérations avancées avec MongoDB
    async getUserStats() {
        return await this.collection.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    avgAge: { $avg: "$age" },
                    oldestUser: { $max: "$age" },
                    youngestUser: { $min: "$age" }
                }
            }
        ]).toArray();
    }

    async getUsersByAgeRange(minAge, maxAge) {
        return await this.collection.find({
            age: { $gte: minAge, $lte: maxAge }
        }).toArray();
    }
}

export default UserService;
```

### 4.5 Intégration avec Express

**Contrôleur Express utilisant MongoDB :**

```javascript
import express from 'express';
import UserService from '../services/UserService.js';
import dbService from '../services/database.js';

const router = express.Router();
const userService = new UserService();

// Middleware d'initialisation
router.use(async (req, res, next) => {
    if (!userService.collection) {
        await userService.initialize();
    }
    next();
});

// GET /users - Liste des utilisateurs avec pagination et recherche
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            minAge,
            maxAge,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        let filters = {};
        
        // Filtrage par âge si fourni
        if (minAge || maxAge) {
            filters.age = {};
            if (minAge) filters.age.$gte = parseInt(minAge);
            if (maxAge) filters.age.$lte = parseInt(maxAge);
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            search,
            sortBy,
            sortOrder: sortOrder === 'desc' ? -1 : 1
        };

        const result = await userService.find(filters, options);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /users - Création d'un utilisateur
router.post('/', async (req, res) => {
    try {
        const user = await userService.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /users/:id - Récupération d'un utilisateur
router.get('/:id', async (req, res) => {
    try {
        const user = await userService.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /users/:id - Mise à jour d'un utilisateur
router.put('/:id', async (req, res) => {
    try {
        const user = await userService.update(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /users/:id - Suppression d'un utilisateur
router.delete('/:id', async (req, res) => {
    try {
        await userService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
```

### 4.6 Avantages et inconvénients de MongoDB

**Avantages :**
- **Flexibilité du schéma** : Parfait pour des données qui évoluent rapidement
- **Performance** : Excellent pour les applications avec beaucoup de lectures
- **Scalabilité** : Facilité de scaling horizontal
- **Développement rapide** : Structure proche du JavaScript natif

**Inconvénients :**
- **Consistance** : Par défaut, privilégie la disponibilité à la consistance stricte
- **Transactions** : Support limité des transactions ACID complexes
- **Stockage** : Peut consommer plus d'espace que les bases relationnelles
- **Apprentissage** : Requiert une approche différente de la modélisation des données

## 5. Introduction aux ORM et ODM (Object-Relational/Document Mapping)

### 5.1 Pourquoi utiliser un ORM ou un ODM ?

Les ORM (Object-Relational Mapping) et ODM (Object-Document Mapping) transforment la façon dont nous interagissons avec les bases de données en créant une couche d'abstraction entre le code JavaScript et les requêtes de base de données. Cette approche offre plusieurs avantages significatifs :

**Productivité accrue** : Les ORM/ODM éliminent le besoin d'écrire des requêtes répétitives, permettant aux développeurs de se concentrer sur la logique métier plutôt que sur les détails de la base de données.

**Sécurité renforcée** : Les ORM intègrent automatiquement des protections contre les injections SQL en utilisant des requêtes préparées et en échappant les données utilisateur. Les ODM offrent des validations et des sanitisations des données.

**Portabilité** : Le même code peut fonctionner avec différents systèmes de base de données avec des modifications minimales.

**Maintenance simplifiée** : Les migrations de schéma et les évolutions de structure de base de données sont gérées de manière cohérente et versionnée.

### 5.2 Sequelize : L'ORM mature pour les bases de données relationnelles

Sequelize est l'un des ORM les plus populaires et matures pour Node.js. Il supporte TypeScript nativement et offre une API riche pour la gestion des modèles, des associations, et des migrations.

**Installation et configuration :**

```bash
npm install sequelize sqlite3 mariadb
npm install --save-dev sequelize-cli
```

**Configuration de base :**

```javascript
import { Sequelize, DataTypes } from 'sequelize';

// Configuration pour SQLite (développement)
const sequelizeSQLite = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log // Affiche les requêtes SQL
});

// Configuration pour MariaDB (production)
const sequelizeMariaDB = new Sequelize('web_app_db', 'username', 'password', {
    host: 'localhost',
    dialect: 'mariadb',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false // Désactive les logs en production
});

// Sélection de la base selon l'environnement
const sequelize = process.env.NODE_ENV === 'production' 
    ? sequelizeMariaDB 
    : sequelizeSQLite;
```

**Définition des modèles :**

```javascript
// Modèle User
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    age: {
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 150
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'users',
    timestamps: true, // Ajoute createdAt et updatedAt
    underscored: true // Utilise snake_case pour les colonnes
});

// Modèle Post pour démontrer les associations
const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [5, 200]
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    tableName: 'posts',
    timestamps: true,
    underscored: true
});

// Définition des associations
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });
```

**Service utilisant Sequelize :**

```javascript
class SequelizeUserService {
    static async create(userData) {
        try {
            const user = await User.create(userData);
            return user.toJSON();
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }
    
    static async findById(id) {
        const user = await User.findByPk(id, {
            include: [{
                model: Post,
                as: 'posts',
                where: { published: true },
                required: false // LEFT JOIN au lieu de INNER JOIN
            }]
        });
        
        return user ? user.toJSON() : null;
    }
    
    static async findAll(options = {}) {
        const {
            page = 1,
            limit = 10,
            search = '',
            includeInactive = false
        } = options;
        
        const whereClause = {};
        
        if (search) {
            whereClause[Sequelize.Op.or] = [
                { name: { [Sequelize.Op.iLike]: `%${search}%` } },
                { email: { [Sequelize.Op.iLike]: `%${search}%` } }
            ];
        }
        
        if (!includeInactive) {
            whereClause.isActive = true;
        }
        
        const offset = (page - 1) * limit;
        
        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['created_at', 'DESC']],
            include: [{
                model: Post,
                as: 'posts',
                attributes: ['id', 'title', 'published']
            }]
        });
        
        return {
            users: rows.map(user => user.toJSON()),
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit)
            }
        };
    }
    
    static async update(id, userData) {
        const user = await User.findByPk(id);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        await user.update(userData);
        return user.toJSON();
    }
    
    static async delete(id) {
        const user = await User.findByPk(id);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        await user.destroy();
        return { message: 'User deleted successfully' };
    }
    
    static async softDelete(id) {
        const user = await User.findByPk(id);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        await user.update({ isActive: false });
        return { message: 'User deactivated successfully' };
    }
}
```

### 5.3 Mongoose : L'ODM élégant pour MongoDB

Mongoose est l'ODM (Object-Document Mapping) le plus populaire pour MongoDB en Node.js. Il apporte une couche d'abstraction puissante avec des schémas, des validations, des middlewares, et des méthodes de requête intuitives.

**Installation et configuration :**

```bash
npm install mongoose
```

**Configuration de la connexion :**

```javascript
import mongoose from 'mongoose';

class MongooseService {
    constructor() {
        this.isConnected = false;
    }

    async connect() {
        try {
            const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';
            
            await mongoose.connect(mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            this.isConnected = true;
            console.log('Connecté à MongoDB via Mongoose');

            // Gestion des événements de connexion
            mongoose.connection.on('error', (err) => {
                console.error('Erreur de connexion MongoDB:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('Déconnecté de MongoDB');
                this.isConnected = false;
            });

        } catch (error) {
            console.error('Erreur lors de la connexion à MongoDB:', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await mongoose.connection.close();
            console.log('Connexion MongoDB fermée');
        }
    }
}

export default new MongooseService();
```

**Définition de schémas et modèles :**

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom est obligatoire'],
        trim: true,
        minlength: [2, 'Le nom doit faire au moins 2 caractères'],
        maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    email: {
        type: String,
        required: [true, 'L\'email est obligatoire'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Format d\'email invalide']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est obligatoire'],
        minlength: [6, 'Le mot de passe doit faire au moins 6 caractères'],
        select: false // N'inclut pas le mot de passe dans les requêtes par défaut
    },
    age: {
        type: Number,
        min: [13, 'L\'âge minimum est 13 ans'],
        max: [120, 'L\'âge maximum est 120 ans']
    },
    profile: {
        bio: {
            type: String,
            maxlength: [500, 'La bio ne peut pas dépasser 500 caractères']
        },
        avatar: {
            type: String,
            match: [/^https?:\/\/.+/, 'L\'avatar doit être une URL valide']
        },
        socialLinks: {
            twitter: String,
            linkedin: String,
            github: String
        }
    },
    tags: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    }
}, {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    toJSON: { virtuals: true }, // Inclut les propriétés virtuelles dans JSON
    toObject: { virtuals: true }
});

// Propriété virtuelle (calculée dynamiquement)
userSchema.virtual('fullProfile').get(function() {
    return {
        name: this.name,
        email: this.email,
        age: this.age,
        bio: this.profile?.bio,
        memberSince: this.createdAt
    };
});

// Middleware pre-save pour hasher le mot de passe
userSchema.pre('save', async function(next) {
    // Seulement si le mot de passe a été modifié
    if (!this.isModified('password')) return next();

    try {
        // Hash du mot de passe avec bcrypt
        const saltRounds = 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode d'instance pour vérifier le mot de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Méthodes statiques personnalisées
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
    return this.find({ isActive: true });
};

userSchema.statics.searchByName = function(searchTerm) {
    return this.find({
        name: { $regex: searchTerm, $options: 'i' }
    });
};

// Index pour optimiser les performances
userSchema.index({ email: 1 });
userSchema.index({ name: 'text', 'profile.bio': 'text' });
userSchema.index({ tags: 1 });
userSchema.index({ createdAt: -1 });

// Création du modèle
const User = mongoose.model('User', userSchema);

export default User;
```

**Service utilisant Mongoose :**

```javascript
import User from '../models/User.js';

class UserService {
    // CREATE - Création d'un utilisateur
    async create(userData) {
        try {
            const user = new User(userData);
            const savedUser = await user.save();
            
            // Retourner l'utilisateur sans le mot de passe
            return await User.findById(savedUser._id).select('-password');
        } catch (error) {
            if (error.code === 11000) {
                throw new Error('Un utilisateur avec cet email existe déjà');
            }
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(err => err.message);
                throw new Error(`Erreurs de validation: ${messages.join(', ')}`);
            }
            throw error;
        }
    }

    // READ - Récupération d'un utilisateur par ID
    async findById(id) {
        try {
            const user = await User.findById(id).select('-password');
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            return user;
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error('ID utilisateur invalide');
            }
            throw error;
        }
    }

    // READ - Recherche d'utilisateurs avec pagination et filtres
    async find(filters = {}, options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search,
            isActive,
            role,
            tags
        } = options;

        // Construction de la requête
        let query = { ...filters };

        // Filtrage par statut actif
        if (isActive !== undefined) {
            query.isActive = isActive;
        }

        // Filtrage par rôle
        if (role) {
            query.role = role;
        }

        // Filtrage par tags
        if (tags && tags.length > 0) {
            query.tags = { $in: tags };
        }

        // Recherche textuelle
        if (search) {
            query.$text = { $search: search };
        }

        // Options de pagination et tri
        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        try {
            const [users, total] = await Promise.all([
                User.find(query)
                    .select('-password')
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(), // Améliore les performances en retournant des objets JS simples
                User.countDocuments(query)
            ]);

            return {
                users,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit,
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // UPDATE - Mise à jour d'un utilisateur
    async update(id, updateData) {
        try {
            // Empêcher la modification directe du mot de passe (utiliser une méthode dédiée)
            const { password, ...allowedUpdates } = updateData;

            const user = await User.findByIdAndUpdate(
                id,
                { $set: allowedUpdates },
                { 
                    new: true,
                    runValidators: true
                }
            ).select('-password');

            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            return user;
        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(err => err.message);
                throw new Error(`Erreurs de validation: ${messages.join(', ')}`);
            }
            if (error.code === 11000) {
                throw new Error('Un utilisateur avec cet email existe déjà');
            }
            throw error;
        }
    }

    // Méthode spécifique pour changer le mot de passe
    async changePassword(id, oldPassword, newPassword) {
        try {
            const user = await User.findById(id).select('+password');
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            const isOldPasswordValid = await user.comparePassword(oldPassword);
            if (!isOldPasswordValid) {
                throw new Error('Ancien mot de passe incorrect');
            }

            user.password = newPassword;
            await user.save();

            return { message: 'Mot de passe mis à jour avec succès' };
        } catch (error) {
            throw error;
        }
    }

    // DELETE - Suppression d'un utilisateur
    async delete(id) {
        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            return { message: 'Utilisateur supprimé avec succès' };
        } catch (error) {
            throw error;
        }
    }

    // Opérations avancées
    async getUserStats() {
        try {
            const stats = await User.aggregate([
                {
                    $group: {
                        _id: null,
                        totalUsers: { $sum: 1 },
                        activeUsers: {
                            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                        },
                        avgAge: { $avg: '$age' },
                        oldestUser: { $max: '$age' },
                        youngestUser: { $min: '$age' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalUsers: 1,
                        activeUsers: 1,
                        inactiveUsers: { $subtract: ['$totalUsers', '$activeUsers'] },
                        avgAge: { $round: ['$avgAge', 1] },
                        oldestUser: 1,
                        youngestUser: 1
                    }
                }
            ]);

            return stats[0] || {};
        } catch (error) {
            throw error;
        }
    }

    async getUsersByRole() {
        try {
            return await User.aggregate([
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 },
                        users: { $push: { name: '$name', email: '$email' } }
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]);
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;
```

**Intégration avec Express :**

```javascript
import express from 'express';
import User from '../models/User.js';
import UserService from '../services/UserService.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const userService = new UserService();

// Middleware de validation pour la création d'utilisateur
const validateUserCreation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom doit faire entre 2 et 50 caractères'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email invalide'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit faire au moins 6 caractères'),
    body('age')
        .optional()
        .isInt({ min: 13, max: 120 })
        .withMessage('L\'âge doit être entre 13 et 120 ans')
];

// GET /users - Liste des utilisateurs avec filtres avancés
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            isActive,
            role,
            tags,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const options = {
            page: parseInt(page),
            limit: Math.min(parseInt(limit), 100), // Limite maximale
            search,
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
            role,
            tags: tags ? tags.split(',') : undefined,
            sortBy,
            sortOrder
        };

        const result = await userService.find({}, options);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /users - Création d'un utilisateur avec validation
router.post('/', validateUserCreation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Erreurs de validation',
                details: errors.array()
            });
        }

        const user = await userService.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /users/:id - Récupération d'un utilisateur
router.get('/:id', async (req, res) => {
    try {
        const user = await userService.findById(req.params.id);
        res.json(user);
    } catch (error) {
        const status = error.message.includes('non trouvé') ? 404 : 400;
        res.status(status).json({ error: error.message });
    }
});

// PUT /users/:id - Mise à jour d'un utilisateur
router.put('/:id', async (req, res) => {
    try {
        const user = await userService.update(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        const status = error.message.includes('non trouvé') ? 404 : 400;
        res.status(status).json({ error: error.message });
    }
});

// PATCH /users/:id/password - Changement de mot de passe
router.patch('/:id/password', async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ 
                error: 'Ancien et nouveau mot de passe requis' 
            });
        }

        const result = await userService.changePassword(
            req.params.id, 
            oldPassword, 
            newPassword
        );
        res.json(result);
    } catch (error) {
        const status = error.message.includes('non trouvé') ? 404 : 400;
        res.status(status).json({ error: error.message });
    }
});

// DELETE /users/:id - Suppression d'un utilisateur
router.delete('/:id', async (req, res) => {
    try {
        await userService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        const status = error.message.includes('non trouvé') ? 404 : 400;
        res.status(status).json({ error: error.message });
    }
});

// GET /users/stats/overview - Statistiques des utilisateurs
router.get('/stats/overview', async (req, res) => {
    try {
        const stats = await userService.getUserStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /users/stats/by-role - Utilisateurs par rôle
router.get('/stats/by-role', async (req, res) => {
    try {
        const stats = await userService.getUsersByRole();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
```

**Avantages de Mongoose :**

- **Schémas et validation** : Définition stricte de la structure des données avec validation automatique
- **Middleware** : Hooks pour exécuter du code avant/après certaines opérations
- **Populations** : Gestion élégante des références entre documents
- **Plugins** : Système d'extensions pour ajouter des fonctionnalités
- **TypeScript** : Support excellent pour le développement typé
- **Query Builder** : API fluide et intuitive pour construire des requêtes complexes

## 6. Construction d'une API RESTful complète

### 6.1 Architecture MVC avec Express

Le pattern MVC (Modèle-Vue-Contrôleur) sépare les responsabilités de l'application en trois couches distinctes. Dans le contexte d'une API, la vue est généralement remplacée par des réponses JSON, mais la séparation entre modèles et contrôleurs reste cruciale.

**Structure des dossiers :**

```
src/
├── controllers/
│   ├── userController.js
│   └── postController.js
├── models/
│   ├── index.js
│   ├── User.js
│   └── Post.js
├── routes/
│   ├── index.js
│   ├── users.js
│   └── posts.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── services/
│   ├── userService.js
│   └── postService.js
└── app.js
```

**Contrôleur utilisateur complet :**

```javascript
// controllers/userController.js
import UserService from '../services/userService.js';
import { validationResult } from 'express-validator';

class UserController {
    static async createUser(req, res, next) {
        try {
            // Vérification des erreurs de validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array()
                });
            }
            
            const userData = req.body;
            const user = await UserService.create(userData);
            
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
    
    static async getUser(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserService.findById(id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
    
    static async getUsers(req, res, next) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                search: req.query.search || '',
                includeInactive: req.query.include_inactive === 'true'
            };
            
            const result = await UserService.findAll(options);
            
            res.json({
                success: true,
                data: result.users,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }
    
    static async updateUser(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array()
                });
            }
            
            const { id } = req.params;
            const userData = req.body;
            
            const user = await UserService.update(id, userData);
            
            res.json({
                success: true,
                message: 'User updated successfully',
                data: user
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }
    
    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const { soft } = req.query;
            
            if (soft === 'true') {
                await UserService.softDelete(id);
            } else {
                await UserService.delete(id);
            }
            
            res.json({
                success: true,
                message: soft === 'true' ? 'User deactivated successfully' : 'User deleted successfully'
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }
}

module.exports = UserController;
```

**Routes avec validation :**

```javascript
// routes/users.js
import express from 'express';
import { body, param, query } from 'express-validator';
import UserController from '../controllers/userController.js';

const router = express.Router();

// Middleware de validation pour la création d'utilisateur
const createUserValidation = [
    body('name')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email'),
    body('age')
        .optional()
        .isInt({ min: 0, max: 150 })
        .withMessage('Age must be between 0 and 150')
];

// Middleware de validation pour la mise à jour
const updateUserValidation = [
    param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
    body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email'),
    body('age')
        .optional()
        .isInt({ min: 0, max: 150 })
        .withMessage('Age must be between 0 and 150')
];

// Validation pour les paramètres d'ID
const idValidation = [
    param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')
];

// Validation pour les paramètres de requête
const queryValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('search')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Search term cannot exceed 100 characters')
];

// Routes
router.post('/', createUserValidation, UserController.createUser);
router.get('/', queryValidation, UserController.getUsers);
router.get('/:id', idValidation, UserController.getUser);
router.put('/:id', updateUserValidation, UserController.updateUser);
router.delete('/:id', idValidation, UserController.deleteUser);

module.exports = router;
```

### 6.2 Gestion des erreurs et middleware

Une gestion d'erreur robuste est essentielle pour une API de production. Express permet de centraliser la gestion des erreurs avec des middleware spécialisés.

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error('Error stack:', err.stack);
    
    // Erreurs de validation Sequelize
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }
    
    // Erreurs de contrainte unique
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            message: 'Resource already exists',
            field: err.errors[0].path
        });
    }
    
    // Erreurs de base de données
    if (err.name === 'SequelizeDatabaseError') {
        return res.status(500).json({
            success: false,
            message: 'Database error'
        });
    }
    
    // Erreur par défaut
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
};

// middleware/notFound.js
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};

module.exports = { errorHandler, notFound };
```

### 6.3 Application complète avec initialisation de la base de données

```javascript
// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { sequelize } from './models/index.js';
import userRoutes from './routes/users.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    }
});
app.use(limiter);

// Middleware de logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/users', userRoutes);

// Route de santé
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Middleware de gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Initialisation de la base de données et démarrage du serveur
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Test de la connexion à la base
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        
        // Synchronisation des modèles (uniquement en développement)
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ alter: true });
            console.log('Database synced successfully.');
        }
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}

// Gestion gracieuse de l'arrêt
process.on('SIGINT', async () => {
    console.log('Received SIGINT. Graceful shutdown...');
    await sequelize.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Graceful shutdown...');
    await sequelize.close();
    process.exit(0);
});

if (require.main === module) {
    startServer();
}

module.exports = app;
```

## 7. Migrations et gestion des évolutions de schéma

### 7.1 Introduction aux migrations

Les migrations sont des scripts qui permettent de modifier la structure de la base de données de manière versionnée et reproductible. Elles sont essentielles pour maintenir la cohérence entre les environnements de développement, test et production.

**Configuration de Sequelize CLI :**

```javascript
// .sequelizerc
import path from 'path';

module.exports = {
    'config': path.resolve('config', 'database.js'),
    'models-path': path.resolve('src', 'models'),
    'seeders-path': path.resolve('database', 'seeders'),
    'migrations-path': path.resolve('database', 'migrations')
};
```

**Configuration de la base de données :**

```javascript
// config/database.js
module.exports = {
    development: {
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: console.log
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    },
    production: {
        dialect: 'mariadb',
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    }
};
```

**Exemple de migration :**

```javascript
// database/migrations/20231201120000-create-users.js
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
        
        // Ajout d'index pour les performances
        await queryInterface.addIndex('users', ['email'], {
            unique: true,
            name: 'users_email_unique'
        });
        
        await queryInterface.addIndex('users', ['is_active'], {
            name: 'users_is_active_index'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};
```

## 8. Tests et débogage

### 8.1 Tests unitaires avec Jest

Les tests sont cruciaux pour maintenir la qualité du code et s'assurer que les modifications n'introduisent pas de régressions.

```bash
npm install --save-dev jest supertest
```

**Configuration Jest :**

```javascript
// jest.config.js
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/migrations/**',
        '!src/seeders/**'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
```

**Tests d'intégration :**

```javascript
// __tests__/users.test.js
import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/models/index.js';

describe('Users API', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        // Nettoyer la base entre les tests
        await sequelize.models.User.destroy({ where: {} });
    });

    describe('POST /api/users', () => {
        it('should create a new user with valid data', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const response = await request(app)
                .post('/api/users')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(userData.name);
            expect(response.body.data.email).toBe(userData.email);
            expect(response.body.data.id).toBeDefined();
        });

        it('should reject user creation with invalid email', async () => {
            const userData = {
                name: 'John Doe',
                email: 'invalid-email',
                age: 30
            };

            const response = await request(app)
                .post('/api/users')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });

        it('should reject user creation with duplicate email', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            // Créer le premier utilisateur
            await request(app)
                .post('/api/users')
                .send(userData)
                .expect(201);

            // Tenter de créer un utilisateur avec le même email
            const response = await request(app)
                .post('/api/users')
                .send({ ...userData, name: 'Jane Doe' })
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('already exists');
        });
    });

    describe('GET /api/users', () => {
        beforeEach(async () => {
            // Créer des utilisateurs de test
            await sequelize.models.User.bulkCreate([
                { name: 'User 1', email: 'user1@example.com', age: 25 },
                { name: 'User 2', email: 'user2@example.com', age: 30 },
                { name: 'User 3', email: 'user3@example.com', age: 35, isActive: false }
            ]);
        });

        it('should return paginated users', async () => {
            const response = await request(app)
                .get('/api/users?page=1&limit=2')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.pagination.page).toBe(1);
            expect(response.body.pagination.limit).toBe(2);
        });

        it('should filter users by search term', async () => {
            const response = await request(app)
                .get('/api/users?search=User 1')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].name).toBe('User 1');
        });
    });
});
```

Ce chapitre complet fournit maintenant une base solide pour comprendre et implémenter la gestion des données dans des applications Node.js/Express modernes, avec des exemples concrets couvrant SQLite, MariaDB, MongoDB, et l'utilisation d'ORM comme Sequelize et d'ODM comme Mongoose.








