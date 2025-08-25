# Tests en Développement Web

## Introduction

Les tests sont essentiels dans le développement web pour garantir la qualité, la fiabilité et les performances des applications. Cette séance couvre les différents types de tests applicables au développement web.

## Types de Tests

Dans l'écosystème du développement web moderne, les tests constituent une pratique incontournable qui permet de garantir la robustesse, la maintenabilité et la fiabilité des applications. La stratégie de test d'une application web s'articule généralement autour de plusieurs types de tests, chacun ayant un rôle spécifique et complémentaire dans la validation du bon fonctionnement du système.

La pyramide des tests, concept fondamental en ingénierie logicielle, nous guide dans la répartition optimale de nos efforts de test. À la base de cette pyramide se trouvent les tests unitaires (nombreux et rapides), au milieu les tests d'intégration (en quantité modérée), et au sommet les tests end-to-end (peu nombreux mais critiques). Cette répartition permet d'obtenir une couverture de test efficace tout en maintenant des temps d'exécution raisonnables et des coûts de maintenance acceptables.

### 1. Tests Unitaires

Les tests unitaires représentent le fondement de toute stratégie de test solide. Ils consistent à tester individuellement chaque unité de code (fonction, méthode, classe ou composant) de manière isolée, sans dépendance externe. L'objectif principal est de vérifier que chaque unité produit le résultat attendu pour un ensemble donné d'entrées.

#### Caractéristiques des tests unitaires

Les tests unitaires se caractérisent par leur **rapidité d'exécution** - ils doivent pouvoir s'exécuter en quelques millisecondes chacun, permettant ainsi de faire tourner des centaines ou des milliers de tests en quelques secondes. Cette rapidité est cruciale car elle permet aux développeurs de recevoir un feedback immédiat sur leurs modifications de code.

L'**isolation** est un autre aspect fondamental : chaque test unitaire doit être complètement indépendant des autres tests et ne doit pas dépendre de ressources externes comme des bases de données, des services web ou des fichiers. Cette isolation est généralement obtenue grâce à l'utilisation de **mocks** et de **stubs** qui simulent le comportement des dépendances.

La **reproductibilité** garantit qu'un test unitaire produira toujours le même résultat dans les mêmes conditions, indépendamment de l'environnement d'exécution ou du moment où il est lancé. Cette caractéristique est essentielle pour maintenir la confiance dans la suite de tests.

#### Frameworks et outils populaires

Dans l'écosystème JavaScript, plusieurs frameworks de test ont émergé pour faciliter l'écriture et l'exécution des tests unitaires :

**Jest** est devenu le standard de facto pour les tests JavaScript, particulièrement dans l'écosystème React. Développé par Facebook (Meta), Jest offre une solution complète incluant un test runner, un système d'assertions, des mocking capabilities, et des outils de mesure de couverture de code. Sa configuration "zero-config" permet de commencer à écrire des tests immédiatement sans setup complexe.

**Vitest** représente une alternative moderne à Jest, conçue spécifiquement pour les projets utilisant Vite. Il offre des performances supérieures grâce à sa parallélisation native et son utilisation d'ESM (ECMAScript Modules). Vitest maintient une compatibilité API avec Jest, facilitant la migration.

**Mocha** combiné avec **Chai** offre une approche plus modulaire et flexible. Mocha fournit la structure de test (describe/it) tandis que Chai apporte une bibliothèque d'assertions riche et expressive. Cette combinaison est particulièrement appréciée dans les projets Node.js pour sa flexibilité de configuration.

#### Exemple pratique avec Jest

Voici un exemple concret illustrant l'écriture de tests unitaires pour un module de calculs mathématiques :

```javascript
// math.js - Module à tester
class Calculator {
  add(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Les paramètres doivent être des nombres');
    }
    return a + b;
  }

  divide(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Les paramètres doivent être des nombres');
    }
    if (b === 0) {
      throw new Error('Division par zéro impossible');
    }
    return a / b;
  }

  factorial(n) {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error('Le factoriel n\'est défini que pour les entiers positifs');
    }
    if (n === 0 || n === 1) return 1;
    return n * this.factorial(n - 1);
  }
}

module.exports = Calculator;

// math.test.js - Tests unitaires
const Calculator = require('./math');

describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add method', () => {
    test('should add two positive numbers correctly', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test('should add negative numbers correctly', () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });

    test('should handle zero values', () => {
      expect(calculator.add(5, 0)).toBe(5);
      expect(calculator.add(0, 0)).toBe(0);
    });

    test('should throw error for non-numeric inputs', () => {
      expect(() => calculator.add('2', 3)).toThrow('Les paramètres doivent être des nombres');
      expect(() => calculator.add(2, null)).toThrow('Les paramètres doivent être des nombres');
    });
  });

  describe('divide method', () => {
    test('should divide numbers correctly', () => {
      expect(calculator.divide(10, 2)).toBe(5);
      expect(calculator.divide(7, 2)).toBe(3.5);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(5, 0)).toThrow('Division par zéro impossible');
    });

    test('should handle negative numbers', () => {
      expect(calculator.divide(-10, 2)).toBe(-5);
      expect(calculator.divide(10, -2)).toBe(-5);
    });
  });

  describe('factorial method', () => {
    test('should calculate factorial correctly', () => {
      expect(calculator.factorial(0)).toBe(1);
      expect(calculator.factorial(1)).toBe(1);
      expect(calculator.factorial(5)).toBe(120);
    });

    test('should throw error for negative numbers', () => {
      expect(() => calculator.factorial(-1)).toThrow();
    });

    test('should throw error for non-integers', () => {
      expect(() => calculator.factorial(3.5)).toThrow();
    });
  });
});
```

### 2. Tests d'Intégration

Les tests d'intégration constituent le niveau intermédiaire de la pyramide des tests. Leur rôle est de vérifier que différents modules, composants ou services d'une application fonctionnent correctement lorsqu'ils sont combinés ensemble. Contrairement aux tests unitaires qui testent des unités en isolation, les tests d'intégration valident les interactions et les contrats entre ces unités.

#### Types de tests d'intégration

**L'intégration verticale** teste la communication entre les différentes couches d'une application : interface utilisateur, logique métier, accès aux données, et base de données. Ce type de test permet de s'assurer que les données transitent correctement à travers toute la pile technologique.

**L'intégration horizontale** se concentre sur les interactions entre modules de même niveau, par exemple entre différents services d'une architecture microservices ou entre différents composants d'une interface utilisateur.

**L'intégration contractuelle** vérifie que les contrats d'interface (API contracts) sont respectés entre les différents services, particulièrement important dans les architectures distribuées.

#### Mise en œuvre des tests d'intégration

Les tests d'intégration nécessitent généralement un environnement plus complexe que les tests unitaires. Ils peuvent requérir :

- Une base de données de test (souvent une base en mémoire comme SQLite pour la rapidité)
- Des services externes mockés ou des instances de test
- Un serveur web de test
- Des données de test cohérentes (fixtures)

Voici un exemple complet de test d'intégration pour une API utilisateur :

```javascript
// userService.js - Service métier
class UserService {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async createUser(userData) {
    // Validation métier
    if (!userData.email || !userData.name) {
      throw new Error('Email et nom requis');
    }

    // Vérifier l'unicité de l'email
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Créer l'utilisateur
    const user = await this.userRepository.create(userData);

    // Envoyer email de bienvenue
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    return user;
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return user;
  }
}

// userService.integration.test.js - Tests d'intégration
const UserService = require('./userService');
const UserRepository = require('./userRepository');
const EmailService = require('./emailService');
const Database = require('./database');

describe('UserService Integration Tests', () => {
  let userService;
  let userRepository;
  let emailService;
  let database;

  beforeAll(async () => {
    // Setup de la base de données de test
    database = new Database(process.env.TEST_DATABASE_URL);
    await database.connect();
    await database.migrate();
  });

  beforeEach(async () => {
    // Nettoyer les données entre chaque test
    await database.clear();
    
    // Initialiser les services avec de vraies dépendances
    userRepository = new UserRepository(database);
    emailService = new EmailService(process.env.TEST_EMAIL_API_KEY);
    userService = new UserService(userRepository, emailService);
  });

  afterAll(async () => {
    await database.disconnect();
  });

  describe('createUser', () => {
    test('should create user and send welcome email', async () => {
      const userData = {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        age: 30
      };

      const user = await userService.createUser(userData);

      // Vérifier que l'utilisateur a été créé en base
      expect(user.id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.createdAt).toBeDefined();

      // Vérifier que l'utilisateur peut être récupéré
      const retrievedUser = await userService.getUserById(user.id);
      expect(retrievedUser.name).toBe(userData.name);

      // Vérifier que l'email a bien été envoyé (via mock ou service de test)
      expect(emailService.lastSentEmail).toMatchObject({
        to: userData.email,
        subject: expect.stringContaining('Bienvenue')
      });
    });

    test('should throw error for duplicate email', async () => {
      const userData = {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com'
      };

      // Créer le premier utilisateur
      await userService.createUser(userData);

      // Tenter de créer un second utilisateur avec le même email
      await expect(userService.createUser({
        name: 'Marie Martin',
        email: 'jean.dupont@example.com' // même email
      })).rejects.toThrow('Un utilisateur avec cet email existe déjà');
    });

    test('should handle database transaction rollback on email failure', async () => {
      // Simuler une panne du service email
      emailService.simulateFailure(true);

      const userData = {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com'
      };

      await expect(userService.createUser(userData)).rejects.toThrow();

      // Vérifier que l'utilisateur n'a pas été créé en base (rollback)
      const users = await userRepository.findAll();
      expect(users).toHaveLength(0);
    });
  });

  describe('getUserById', () => {
    test('should retrieve existing user', async () => {
      // Préparer les données de test
      const userData = {
        name: 'Marie Martin',
        email: 'marie.martin@example.com'
      };
      
      const createdUser = await userService.createUser(userData);
      
      // Récupérer l'utilisateur
      const retrievedUser = await userService.getUserById(createdUser.id);
      
      expect(retrievedUser.id).toBe(createdUser.id);
      expect(retrievedUser.name).toBe(userData.name);
    });

    test('should throw error for non-existent user', async () => {
      await expect(userService.getUserById(999999))
        .rejects.toThrow('Utilisateur non trouvé');
    });
  });
});
```

### 3. Tests End-to-End (E2E)

Les tests end-to-end représentent le niveau le plus élevé de la pyramide des tests. Ils simulent des scénarios utilisateur complets en testant l'application dans son ensemble, depuis l'interface utilisateur jusqu'à la base de données, en passant par tous les services intermédiaires. Ces tests valident que l'application fonctionne correctement du point de vue de l'utilisateur final.

#### Caractéristiques des tests E2E

Les tests E2E se distinguent par leur **r��alisme** : ils utilisent un navigateur réel (ou headless) pour interagir avec l'application exactement comme le ferait un utilisateur. Ils cliquent sur des boutons, remplissent des formulaires, naviguent entre les pages, et vérifient que les résultats attendus s'affichent à l'écran.

La **complexité** de ces tests est généralement plus élevée car ils doivent gérer des aspects comme les temps de chargement, les animations, les interactions asynchrones, et les états transitoires de l'interface utilisateur.

Leur **fragilité** peut être un défi : les tests E2E sont plus susceptibles de tomber en panne suite à des changements dans l'interface utilisateur, même si la fonctionnalité sous-jacente reste correcte.

#### Outils et frameworks pour les tests E2E

**Cypress** s'est imposé comme l'un des outils les plus populaires pour les tests E2E grâce à sa facilité d'utilisation et ses capacités de débogage avancées. Il offre un environnement de développement intégré avec une interface graphique qui permet de voir les tests s'exécuter en temps réel.

**Playwright** développé par Microsoft, supporte multiple navigateurs (Chrome, Firefox, Safari) et offre des performances excellentes ainsi que des fonctionnalités avancées comme les tests en parallèle et la capture automatique de traces de débogage.

**Selenium** reste une référence historique, particulièrement pour les projets multi-navigateurs et multi-plateformes, bien qu'il soit généralement plus complexe à configurer et maintenir.

#### Exemple de test E2E avec Cypress

Voici un exemple complet de test E2E pour une application de gestion d'utilisateurs :

```javascript
// cypress/e2e/user-management.cy.js
describe('User Management Application', () => {
  beforeEach(() => {
    // Réinitialiser la base de données avant chaque test
    cy.task('db:reset');
    
    // Visiter la page d'accueil
    cy.visit('/');
  });

  describe('User Registration Flow', () => {
    it('should allow new user to register successfully', () => {
      // Naviguer vers la page d'inscription
      cy.get('[data-testid="register-link"]').click();
      
      // Vérifier que nous sommes sur la bonne page
      cy.url().should('include', '/register');
      cy.get('h1').should('contain', 'Créer un compte');

      // Remplir le formulaire d'inscription
      cy.get('[data-testid="name-input"]').type('Jean Dupont');
      cy.get('[data-testid="email-input"]').type('jean.dupont@example.com');
      cy.get('[data-testid="password-input"]').type('MotDePasse123!');
      cy.get('[data-testid="confirm-password-input"]').type('MotDePasse123!');

      // Accepter les conditions d'utilisation
      cy.get('[data-testid="terms-checkbox"]').check();

      // Soumettre le formulaire
      cy.get('[data-testid="register-submit"]').click();

      // Vérifier la redirection et le message de succès
      cy.url().should('include', '/welcome');
      cy.get('[data-testid="success-message"]')
        .should('be.visible')
        .and('contain', 'Compte créé avec succès');

      // Vérifier que l'email de bienvenue a été envoyé
      cy.task('email:getLastSent').then((email) => {
        expect(email.to).to.equal('jean.dupont@example.com');
        expect(email.subject).to.contain('Bienvenue');
      });
    });

    it('should show validation errors for invalid data', () => {
      cy.get('[data-testid="register-link"]').click();

      // Tenter de soumettre un formulaire vide
      cy.get('[data-testid="register-submit"]').click();

      // Vérifier les messages d'erreur
      cy.get('[data-testid="name-error"]')
        .should('be.visible')
        .and('contain', 'Le nom est requis');
      
      cy.get('[data-testid="email-error"]')
        .should('be.visible')
        .and('contain', 'L\'email est requis');

      // Remplir avec un email invalide
      cy.get('[data-testid="email-input"]').type('email-invalide');
      cy.get('[data-testid="register-submit"]').click();

      cy.get('[data-testid="email-error"]')
        .should('contain', 'Format d\'email invalide');

      // Remplir avec des mots de passe qui ne correspondent pas
      cy.get('[data-testid="name-input"]').type('Jean Dupont');
      cy.get('[data-testid="email-input"]').clear().type('jean@example.com');
      cy.get('[data-testid="password-input"]').type('MotDePasse123!');
      cy.get('[data-testid="confirm-password-input"]').type('MotDePasseDifferent');
      cy.get('[data-testid="register-submit"]').click();

      cy.get('[data-testid="confirm-password-error"]')
        .should('contain', 'Les mots de passe ne correspondent pas');
    });

    it('should prevent registration with existing email', () => {
      // Créer un utilisateur existant via l'API
      cy.task('db:createUser', {
        name: 'Utilisateur Existant',
        email: 'existant@example.com'
      });

      cy.get('[data-testid="register-link"]').click();

      // Tenter de s'inscrire avec le même email
      cy.get('[data-testid="name-input"]').type('Nouveau Utilisateur');
      cy.get('[data-testid="email-input"]').type('existant@example.com');
      cy.get('[data-testid="password-input"]').type('MotDePasse123!');
      cy.get('[data-testid="confirm-password-input"]').type('MotDePasse123!');
      cy.get('[data-testid="terms-checkbox"]').check();
      cy.get('[data-testid="register-submit"]').click();

      // Vérifier le message d'erreur
      cy.get('[data-testid="global-error"]')
        .should('be.visible')
        .and('contain', 'Un compte avec cet email existe déjà');
    });
  });

  describe('User Login Flow', () => {
    beforeEach(() => {
      // Créer un utilisateur de test
      cy.task('db:createUser', {
        name: 'Utilisateur Test',
        email: 'test@example.com',
        password: 'MotDePasse123!'
      });
    });

    it('should allow existing user to login', () => {
      cy.get('[data-testid="login-link"]').click();

      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('MotDePasse123!');
      cy.get('[data-testid="login-submit"]').click();

      // Vérifier la redirection vers le dashboard
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="welcome-message"]')
        .should('contain', 'Bienvenue, Utilisateur Test');

      // Vérifier que le menu utilisateur est visible
      cy.get('[data-testid="user-menu"]').should('be.visible');
    });

    it('should show error for invalid credentials', () => {
      cy.get('[data-testid="login-link"]').click();

      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('MauvaisMotDePasse');
      cy.get('[data-testid="login-submit"]').click();

      cy.get('[data-testid="login-error"]')
        .should('be.visible')
        .and('contain', 'Email ou mot de passe incorrect');

      // Vérifier que nous sommes toujours sur la page de connexion
      cy.url().should('include', '/login');
    });
  });

  describe('User Profile Management', () => {
    beforeEach(() => {
      // Créer et connecter un utilisateur
      cy.task('db:createUser', {
        name: 'Utilisateur Test',
        email: 'test@example.com',
        password: 'MotDePasse123!'
      });
      
      cy.login('test@example.com', 'MotDePasse123!'); // Commande personnalisée
    });

    it('should allow user to update their profile', () => {
      // Naviguer vers le profil
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="profile-link"]').click();

      // Modifier les informations
      cy.get('[data-testid="name-input"]').clear().type('Nom Modifié');
      cy.get('[data-testid="bio-textarea"]').type('Nouvelle biographie');
      
      // Télécharger une photo de profil
      cy.get('[data-testid="avatar-upload"]')
        .selectFile('cypress/fixtures/avatar.jpg');

      // Sauvegarder
      cy.get('[data-testid="save-profile"]').click();

      // Vérifier le message de succès
      cy.get('[data-testid="success-message"]')
        .should('be.visible')
        .and('contain', 'Profil mis à jour');

      // Vérifier que les changements sont persistés
      cy.reload();
      cy.get('[data-testid="name-input"]').should('have.value', 'Nom Modifié');
      cy.get('[data-testid="bio-textarea"]').should('contain', 'Nouvelle biographie');
      cy.get('[data-testid="avatar-image"]').should('be.visible');
    });
  });
});
```

## Conclusion

Une stratégie de test complète combine plusieurs types de tests pour assurer la qualité du code, les performances et l'expérience utilisateur. L'automatisation de ces tests dans un pipeline CI/CD garantit une détection précoce des problèmes et une livraison fiable.
