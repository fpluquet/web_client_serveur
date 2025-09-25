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

### 2.2 Gestion des paramètres et validation des données

La gestion appropriée des paramètres d'entrée est cruciale pour la sécurité et la robustesse de l'application. En Express, nous avons plusieurs moyens de récupérer des données :

```javascript
import express from 'express';
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour parser les données de formulaire
app.use(express.urlencoded({ extended: true }));

// Route avec paramètres d'URL et validation
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    
    // Validation du paramètre
    if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
            error: 'Invalid user ID. Must be a positive integer.'
        });
    }
    
    // Paramètres de requête optionnels
    const includeProfile = req.query.include_profile === 'true';
    
    // Logique de récupération des données
    // ... (sera implémentée avec la base de données)
});

// Route POST avec validation du corps de requête
app.post('/users', (req, res) => {
    const { name, email, age } = req.body;
    
    // Validation des champs requis
    if (!name || !email) {
        return res.status(400).json({
            error: 'Name and email are required fields.'
        });
    }
    
    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Invalid email format.'
        });
    }
    
    // Validation de l'âge si fourni
    if (age !== undefined && (isNaN(age) || age < 0 || age > 150)) {
        return res.status(400).json({
            error: 'Age must be a number between 0 and 150.'
        });
    }
    
    // Logique de création
    // ... (sera implémentée avec la base de données)
});
```

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

## 4. Introduction aux ORM (Object-Relational Mapping)

### 4.1 Pourquoi utiliser un ORM ?

Les ORM (Object-Relational Mapping) transforment la façon dont nous interagissons avec les bases de données en créant une couche d'abstraction entre le code JavaScript et le SQL. Cette approche offre plusieurs avantages significatifs :

**Productivité accrue** : Les ORM éliminent le besoin d'écrire du SQL répétitif, permettant aux développeurs de se concentrer sur la logique métier plutôt que sur les détails de la base de données.

**Sécurité renforcée** : Les ORM intègrent automatiquement des protections contre les injections SQL en utilisant des requêtes préparées et en échappant les données utilisateur.

**Portabilité** : Le même code peut fonctionner avec différents systèmes de base de données (SQLite, MySQL, PostgreSQL) avec des modifications minimales.

**Maintenance simplifiée** : Les migrations de schéma et les évolutions de structure de base de données sont gérées de manière cohérente et versionnée.

### 4.2 Sequelize : L'ORM mature pour Node.js

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

## 5. Construction d'une API RESTful complète

### 5.1 Architecture MVC avec Express

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

### 5.2 Gestion des erreurs et middleware

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

### 5.3 Application complète avec initialisation de la base de données

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

## 6. Migrations et gestion des évolutions de schéma

### 6.1 Introduction aux migrations

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

## 7. Tests et débogage

### 7.1 Tests unitaires avec Jest

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

Ce chapitre complet fournit maintenant une base solide pour comprendre et implémenter la gestion des données dans des applications Node.js/Express modernes, avec des exemples concrets couvrant SQLite, MariaDB, et l'utilisation d'ORM comme Sequelize.








