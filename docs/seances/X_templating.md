# Templating avec Express : Pug et Handlebars

## 1. Introduction au templating côté serveur

### 1.1 Qu'est-ce que le templating ?

Le templating côté serveur est une technique qui permet de générer dynamiquement du HTML en combinant des templates (modèles) avec des données. Cette approche offre plusieurs avantages :

- **Séparation des préoccupations** : La logique métier est séparée de la présentation
- **Réutilisabilité** : Les templates peuvent être réutilisés et composés
- **Maintenance facilitée** : Modification du design sans toucher à la logique
- **Performance** : Rendu côté serveur pour un premier affichage rapide
- **SEO-friendly** : Le contenu est directement disponible pour les moteurs de recherche

### 1.2 Moteurs de templates populaires pour Express

Express supporte de nombreux moteurs de templates :

- **Pug** (ex-Jade) : Syntaxe concise basée sur l'indentation
- **Handlebars** : Syntaxe simple et logique minimale
- **EJS** : Syntaxe proche de HTML avec des balises JavaScript
- **Mustache** : Templates sans logique (logic-less)
- **Nunjucks** : Inspiré de Jinja2 (Python)

Dans ce cours, nous nous concentrerons sur **Pug** et **Handlebars**, deux approches complémentaires du templating.

## 2. Pug (ex-Jade)

### 2.1 Introduction à Pug

Pug est un moteur de templates clean, sensible aux espaces et influencé par Haml. Sa syntaxe concise élimine les balises fermantes et utilise l'indentation pour définir la structure.

#### Installation et configuration

```bash
npm install pug
```

Configuration dans Express :

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Configuration du moteur de templates
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
```

### 2.2 Syntaxe de base de Pug

#### Structure HTML de base

```pug
doctype html
html(lang="fr")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Mon Site Web
    link(rel="stylesheet", href="/css/style.css")
  body
    header
      h1 Bienvenue sur mon site
    main
      p Ceci est un paragraphe.
      ul
        li Premier élément
        li Deuxième élément
    footer
      p &copy; 2024 Mon Site Web
```

#### Variables et interpolation

```pug
//- Définition de variables locales
- var siteName = "Mon Blog"
- var articles = [
    {title: "Article 1", content: "Contenu de l'article 1"},
    {title: "Article 2", content: "Contenu de l'article 2"}
  ]

h1= siteName
h2 #{siteName} - Derniers articles

//- Interpolation dans le texte
p Bienvenue sur #{siteName}, le meilleur blog de la région !

//- Interpolation d'attributs
a(href=`/articles/${article.slug}`, title=article.title) #{article.title}
```

#### Conditions et boucles

```pug
//- Conditions
if user.isLoggedIn
  p Bienvenue #{user.name} !
  a(href="/logout") Se déconnecter
else
  a(href="/login") Se connecter

//- Conditions avec unless
unless user.isAdmin
  p Vous n'avez pas les droits administrateur

//- Boucles
ul
  each article in articles
    li
      h3= article.title
      p= article.excerpt
      a(href=`/articles/${article.id}`) Lire la suite

//- Boucle avec index
ol
  each article, index in articles
    li(class=index === 0 ? 'featured' : '')= article.title

//- Boucle avec alternative si vide
ul
  each article in articles
    li= article.title
  else
    li Aucun article disponible
```

### 2.3 Layouts et composition avec Pug

#### Layout de base (views/layout.pug)

```pug
doctype html
html(lang="fr")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    meta(name="description", content=description || "Site web par défaut")
    title #{title || "Mon Site"} | Mon Application
    
    //- CSS
    link(rel="stylesheet", href="/css/bootstrap.min.css")
    link(rel="stylesheet", href="/css/style.css")
    
    //- CSS spécifique à la page
    block css
    
  body(class=bodyClass || "")
    //- Navigation
    include includes/navigation
    
    //- Contenu principal
    main(class="container mt-4")
      //- Messages flash
      if messages
        include includes/messages
      
      //- Contenu de la page
      block content
    
    //- Footer
    include includes/footer
    
    //- Scripts JavaScript
    script(src="/js/bootstrap.bundle.min.js")
    script(src="/js/main.js")
    
    //- Scripts spécifiques à la page
    block scripts
```

#### Partial de navigation (views/includes/navigation.pug)

```pug
nav.navbar.navbar-expand-lg.navbar-dark.bg-dark
  .container
    a.navbar-brand(href="/") Mon Site
    
    button.navbar-toggler(type="button", data-bs-toggle="collapse", data-bs-target="#navbarNav")
      span.navbar-toggler-icon
    
    .collapse.navbar-collapse#navbarNav
      ul.navbar-nav.me-auto
        li.nav-item
          a.nav-link(href="/", class=currentPage === 'home' ? 'active' : '') Accueil
        li.nav-item
          a.nav-link(href="/articles", class=currentPage === 'articles' ? 'active' : '') Articles
        li.nav-item
          a.nav-link(href="/contact", class=currentPage === 'contact' ? 'active' : '') Contact
      
      ul.navbar-nav
        if user
          li.nav-item.dropdown
            a.nav-link.dropdown-toggle(href="#", data-bs-toggle="dropdown") #{user.name}
            ul.dropdown-menu
              li: a.dropdown-item(href="/profile") Mon profil
              li: hr.dropdown-divider
              li: a.dropdown-item(href="/logout") Se déconnecter
        else
          li.nav-item
            a.nav-link(href="/login") Connexion
```

#### Partial de footer (views/includes/footer.pug)

```pug
footer.bg-dark.text-light.py-4.mt-5
  .container
    .row
      .col-md-6
        h5 Mon Site Web
        p Une description de mon site web et de ses objectifs.
      .col-md-3
        h6 Liens utiles
        ul.list-unstyled
          li: a.text-light(href="/") Accueil
          li: a.text-light(href="/articles") Articles
          li: a.text-light(href="/contact") Contact
      .col-md-3
        h6 Nous suivre
        .d-flex.gap-2
          a.text-light(href="#", title="Facebook")
            i.fab.fa-facebook-f
          a.text-light(href="#", title="Twitter")
            i.fab.fa-twitter
          a.text-light(href="#", title="LinkedIn")
            i.fab.fa-linkedin-in
    hr.my-3
    .text-center
      p.mb-0 &copy; #{new Date().getFullYear()} Mon Site Web. Tous droits réservés.
```

#### Partial pour les messages (views/includes/messages.pug)

```pug
if messages.success
  each message in messages.success
    .alert.alert-success.alert-dismissible.fade.show
      = message
      button.btn-close(type="button", data-bs-dismiss="alert")

if messages.error
  each message in messages.error
    .alert.alert-danger.alert-dismissible.fade.show
      = message
      button.btn-close(type="button", data-bs-dismiss="alert")

if messages.warning
  each message in messages.warning
    .alert.alert-warning.alert-dismissible.fade.show
      = message
      button.btn-close(type="button", data-bs-dismiss="alert")

if messages.info
  each message in messages.info
    .alert.alert-info.alert-dismissible.fade.show
      = message
      button.btn-close(type="button", data-bs-dismiss="alert")
```

#### Page d'accueil (views/home.pug)

```pug
extends layout

block css
  style.
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 0;
    }

block content
  .hero.text-center
    .container
      h1.display-4 Bienvenue sur #{siteName}
      p.lead Découvrez nos derniers articles et contenus
      a.btn.btn-light.btn-lg(href="/articles") Voir les articles

  .container.my-5
    .row
      .col-md-8
        h2 Derniers articles
        if articles && articles.length
          .row
            each article in articles.slice(0, 3)
              .col-md-4.mb-4
                .card
                  if article.image
                    img.card-img-top(src=article.image, alt=article.title)
                  .card-body
                    h5.card-title= article.title
                    p.card-text= article.excerpt
                    a.btn.btn-primary(href=`/articles/${article.slug}`) Lire la suite
        else
          p Aucun article disponible pour le moment.
      
      .col-md-4
        h3 À propos
        p Bienvenue sur notre site web. Nous partageons régulièrement des articles sur le développement web, les nouvelles technologies et bien plus encore.
        
        h3 Newsletter
        form(action="/newsletter", method="post")
          .mb-3
            input.form-control(type="email", name="email", placeholder="Votre email", required)
          button.btn.btn-success(type="submit") S'abonner

block scripts
  script.
    // JavaScript spécifique à la page d'accueil
    console.log('Page d\'accueil chargée');
```

#### Page d'article (views/article.pug)

```pug
extends layout

block css
  link(rel="stylesheet", href="/css/prism.css")

block content
  .container
    nav(aria-label="breadcrumb")
      ol.breadcrumb
        li.breadcrumb-item: a(href="/") Accueil
        li.breadcrumb-item: a(href="/articles") Articles
        li.breadcrumb-item.active= article.title

    article
      header.mb-4
        h1= article.title
        .d-flex.justify-content-between.align-items-center.text-muted.mb-3
          div
            small Publié le #{article.publishedAt.toLocaleDateString('fr-FR')}
            if article.author
              |  par 
              strong= article.author.name
          div
            each tag in article.tags
              span.badge.bg-secondary.me-1= tag

      if article.image
        img.img-fluid.mb-4(src=article.image, alt=article.title)

      .content
        != article.content

      if article.tags && article.tags.length
        .mt-4
          h5 Tags :
          each tag in article.tags
            a.badge.bg-primary.text-decoration-none.me-2(href=`/articles/tag/${tag}`)= tag

    hr.my-5

    //- Articles similaires
    if relatedArticles && relatedArticles.length
      section
        h3 Articles similaires
        .row
          each related in relatedArticles
            .col-md-4.mb-3
              .card
                .card-body
                  h6.card-title
                    a.text-decoration-none(href=`/articles/${related.slug}`)= related.title
                  p.card-text.small= related.excerpt

block scripts
  script(src="/js/prism.js")
```

### 2.4 Mixins Pug

Les mixins permettent de créer des composants réutilisables :

```pug
//- Mixin pour une carte d'article
mixin articleCard(article, showExcerpt = true)
  .card.h-100
    if article.image
      img.card-img-top(src=article.image, alt=article.title)
    .card-body.d-flex.flex-column
      h5.card-title= article.title
      if showExcerpt && article.excerpt
        p.card-text= article.excerpt
      .mt-auto
        .d-flex.justify-content-between.align-items-center
          small.text-muted= article.publishedAt.toLocaleDateString('fr-FR')
          a.btn.btn-primary.btn-sm(href=`/articles/${article.slug}`) Lire

//- Mixin pour un formulaire de contact
mixin contactForm(action = "/contact", method = "post")
  form(action=action, method=method)
    .row
      .col-md-6.mb-3
        label.form-label(for="name") Nom *
        input.form-control(type="text", id="name", name="name", required)
      .col-md-6.mb-3
        label.form-label(for="email") Email *
        input.form-control(type="email", id="email", name="email", required)
    .mb-3
      label.form-label(for="subject") Sujet
      input.form-control(type="text", id="subject", name="subject")
    .mb-3
      label.form-label(for="message") Message *
      textarea.form-control(id="message", name="message", rows="5", required)
    button.btn.btn-primary(type="submit") Envoyer

//- Utilisation des mixins
.row
  each article in articles
    .col-md-4.mb-4
      +articleCard(article)

+contactForm("/contact", "post")
```

## 3. Handlebars

### 3.1 Introduction à Handlebars

Handlebars est un moteur de templates logique minimal qui étend Mustache. Il conserve une syntaxe proche du HTML tout en offrant des fonctionnalités avancées.

#### Installation et configuration

```bash
npm install express-handlebars
```

Configuration dans Express :

```javascript
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const app = express();

// Configuration du moteur de templates
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: {
    // Helpers personnalisés
    formatDate: (date) => {
      return new Date(date).toLocaleDateString('fr-FR');
    },
    eq: (a, b) => a === b,
    gt: (a, b) => a > b,
    lt: (a, b) => a < b
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
```

### 3.2 Syntaxe de base de Handlebars

#### Structure HTML et interpolation

```handlebars
{{!-- Commentaire Handlebars --}}
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} | {{siteName}}</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <h1>{{title}}</h1>
    <p>Bienvenue {{user.name}} !</p>
    
    {{!-- Échapper les caractères HTML --}}
    <div>{{{htmlContent}}}</div>
    
    {{!-- Interpolation avec fallback --}}
    <p>{{description}} ou "Description par défaut"</p>
</body>
</html>
```

#### Conditions et boucles

```handlebars
{{!-- Conditions --}}
{{#if user.isLoggedIn}}
    <p>Bienvenue {{user.name}} !</p>
    <a href="/logout">Se déconnecter</a>
{{else}}
    <a href="/login">Se connecter</a>
{{/if}}

{{!-- Condition avec unless --}}
{{#unless user.isAdmin}}
    <p>Vous n'avez pas les droits administrateur</p>
{{/unless}}

{{!-- Boucles --}}
<ul>
{{#each articles}}
    <li>
        <h3>{{title}}</h3>
        <p>{{excerpt}}</p>
        <small>Par {{author.name}} le {{formatDate publishedAt}}</small>
    </li>
{{else}}
    <li>Aucun article disponible</li>
{{/each}}
</ul>

{{!-- Boucle avec index --}}
<ol>
{{#each articles}}
    <li class="{{#if @first}}featured{{/if}}">
        {{@index}}. {{title}}
    </li>
{{/each}}
</ol>
```

### 3.3 Layouts et partials avec Handlebars

#### Layout principal (views/layouts/main.handlebars)

```handlebars
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{{description}}">
    <title>{{#if title}}{{title}} | {{/if}}{{siteName}}</title>
    
    <!-- CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
    
    <!-- CSS spécifique à la page -->
    {{{block "css"}}}
</head>
<body class="{{bodyClass}}">
    <!-- Navigation -->
    {{> navigation}}
    
    <!-- Contenu principal -->
    <main class="container mt-4">
        <!-- Messages flash -->
        {{#if messages}}
            {{> messages}}
        {{/if}}
        
        <!-- Contenu de la page -->
        {{{body}}}
    </main>
    
    <!-- Footer -->
    {{> footer}}
    
    <!-- Scripts JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/main.js"></script>
    
    <!-- Scripts spécifiques à la page -->
    {{{block "scripts"}}}
</body>
</html>
```

#### Partial de navigation (views/partials/navigation.handlebars)

```handlebars
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="/">{{siteName}}</a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link {{#if (eq currentPage 'home')}}active{{/if}}" href="/">Accueil</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{#if (eq currentPage 'articles')}}active{{/if}}" href="/articles">Articles</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{#if (eq currentPage 'contact')}}active{{/if}}" href="/contact">Contact</a>
                </li>
            </ul>
            
            <ul class="navbar-nav">
                {{#if user}}
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">{{user.name}}</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/profile">Mon profil</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="/logout">Se déconnecter</a></li>
                        </ul>
                    </li>
                {{else}}
                    <li class="nav-item">
                        <a class="nav-link" href="/login">Connexion</a>
                    </li>
                {{/if}}
            </ul>
        </div>
    </div>
</nav>
```

#### Partial de footer (views/partials/footer.handlebars)

```handlebars
<footer class="bg-dark text-light py-4 mt-5">
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <h5>{{siteName}}</h5>
                <p>{{siteDescription}}</p>
            </div>
            <div class="col-md-3">
                <h6>Liens utiles</h6>
                <ul class="list-unstyled">
                    <li><a class="text-light" href="/">Accueil</a></li>
                    <li><a class="text-light" href="/articles">Articles</a></li>
                    <li><a class="text-light" href="/contact">Contact</a></li>
                </ul>
            </div>
            <div class="col-md-3">
                <h6>Nous suivre</h6>
                <div class="d-flex gap-2">
                    {{#each socialLinks}}
                        <a class="text-light" href="{{url}}" title="{{name}}">
                            <i class="fab fa-{{icon}}"></i>
                        </a>
                    {{/each}}
                </div>
            </div>
        </div>
        <hr class="my-3">
        <div class="text-center">
            <p class="mb-0">&copy; {{currentYear}} {{siteName}}. Tous droits réservés.</p>
        </div>
    </div>
</footer>
```

#### Partial pour les messages (views/partials/messages.handlebars)

```handlebars
{{#each messages.success}}
    <div class="alert alert-success alert-dismissible fade show">
        {{this}}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
{{/each}}

{{#each messages.error}}
    <div class="alert alert-danger alert-dismissible fade show">
        {{this}}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
{{/each}}

{{#each messages.warning}}
    <div class="alert alert-warning alert-dismissible fade show">
        {{this}}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
{{/each}}

{{#each messages.info}}
    <div class="alert alert-info alert-dismissible fade show">
        {{this}}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
{{/each}}
```

#### Page d'accueil (views/home.handlebars)

```handlebars
{{#block "css"}}
<style>
    .hero {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4rem 0;
    }
</style>
{{/block}}

<div class="hero text-center">
    <div class="container">
        <h1 class="display-4">Bienvenue sur {{siteName}}</h1>
        <p class="lead">Découvrez nos derniers articles et contenus</p>
        <a class="btn btn-light btn-lg" href="/articles">Voir les articles</a>
    </div>
</div>

<div class="container my-5">
    <div class="row">
        <div class="col-md-8">
            <h2>Derniers articles</h2>
            {{#if articles.length}}
                <div class="row">
                    {{#each (limit articles 3)}}
                        <div class="col-md-4 mb-4">
                            {{> articleCard}}
                        </div>
                    {{/each}}
                </div>
            {{else}}
                <p>Aucun article disponible pour le moment.</p>
            {{/if}}
        </div>
        
        <div class="col-md-4">
            <h3>À propos</h3>
            <p>{{siteDescription}}</p>
            
            <h3>Newsletter</h3>
            {{> newsletterForm}}
        </div>
    </div>
</div>

{{#block "scripts"}}
<script>
    // JavaScript spécifique à la page d'accueil
    console.log('Page d\'accueil chargée');
</script>
{{/block}}
```

#### Page d'article (views/article.handlebars)

```handlebars
{{#block "css"}}
<link rel="stylesheet" href="/css/prism.css">
{{/block}}

<div class="container">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Accueil</a></li>
            <li class="breadcrumb-item"><a href="/articles">Articles</a></li>
            <li class="breadcrumb-item active">{{article.title}}</li>
        </ol>
    </nav>

    <article>
        <header class="mb-4">
            <h1>{{article.title}}</h1>
            <div class="d-flex justify-content-between align-items-center text-muted mb-3">
                <div>
                    <small>Publié le {{formatDate article.publishedAt}}</small>
                    {{#if article.author}}
                        par <strong>{{article.author.name}}</strong>
                    {{/if}}
                </div>
                <div>
                    {{#each article.tags}}
                        <span class="badge bg-secondary me-1">{{this}}</span>
                    {{/each}}
                </div>
            </div>
        </header>

        {{#if article.image}}
            <img class="img-fluid mb-4" src="{{article.image}}" alt="{{article.title}}">
        {{/if}}

        <div class="content">
            {{{article.content}}}
        </div>

        {{#if article.tags.length}}
            <div class="mt-4">
                <h5>Tags :</h5>
                {{#each article.tags}}
                    <a class="badge bg-primary text-decoration-none me-2" href="/articles/tag/{{this}}">{{this}}</a>
                {{/each}}
            </div>
        {{/if}}
    </article>

    <hr class="my-5">

    {{#if relatedArticles.length}}
        <section>
            <h3>Articles similaires</h3>
            <div class="row">
                {{#each relatedArticles}}
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <a class="text-decoration-none" href="/articles/{{slug}}">{{title}}</a>
                                </h6>
                                <p class="card-text small">{{excerpt}}</p>
                            </div>
                        </div>
                    </div>
                {{/each}}
            </div>
        </section>
    {{/if}}
</div>

{{#block "scripts"}}
<script src="/js/prism.js"></script>
{{/block}}
```

### 3.4 Helpers Handlebars

Les helpers permettent d'étendre les fonctionnalités :

```javascript
// Configuration avec helpers personnalisés
app.engine('handlebars', engine({
  defaultLayout: 'main',
  helpers: {
    // Helper pour formater les dates
    formatDate: (date, format = 'fr-FR') => {
      return new Date(date).toLocaleDateString(format);
    },
    
    // Helper pour formater les dates relatives
    timeAgo: (date) => {
      const now = new Date();
      const diffTime = Math.abs(now - new Date(date));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'hier';
      if (diffDays < 7) return `il y a ${diffDays} jours`;
      if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} semaines`;
      return `il y a ${Math.floor(diffDays / 30)} mois`;
    },
    
    // Helpers de comparaison
    eq: (a, b) => a === b,
    ne: (a, b) => a !== b,
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
    gte: (a, b) => a >= b,
    lte: (a, b) => a <= b,
    
    // Helper pour limiter un tableau
    limit: (array, limit) => {
      return array.slice(0, limit);
    },
    
    // Helper pour truncate
    truncate: (text, length = 100) => {
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    },
    
    // Helper pour capitaliser
    capitalize: (text) => {
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    
    // Helper conditionnel pour les classes CSS
    ifCond: function(v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    }
  }
}));
```

## 4. Comparaison Pug vs Handlebars

### 4.1 Avantages et inconvénients

#### Pug

**Avantages :**
- Syntaxe très concise et élégante
- Moins de code à écrire
- Indentation force une structure claire
- Mixins puissants pour la réutilisabilité
- JavaScript intégré nativement

**Inconvénients :**
- Courbe d'apprentissage plus élevée
- Syntaxe très différente du HTML
- Sensible aux espaces (peut créer des erreurs)
- Difficile à utiliser pour des designers non-développeurs

#### Handlebars

**Avantages :**
- Syntaxe proche du HTML
- Facile à apprendre
- Logic-less (séparation claire logique/présentation)
- Compatible avec les outils de design
- Helpers extensibles

**Inconvénients :**
- Plus verbeux que Pug
- Nécessite des helpers pour la logique complexe
- Peut devenir difficile à maintenir sur de gros projets

### 4.2 Exemple de contrôleur Express

```javascript
const express = require('express');
const router = express.Router();

// Page d'accueil
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .sort({ publishedAt: -1 })
      .limit(6)
      .populate('author');
    
    res.render('home', {
      title: 'Accueil',
      currentPage: 'home',
      articles,
      siteName: 'Mon Blog',
      siteDescription: 'Un blog sur le développement web',
      user: req.user,
      messages: req.flash()
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Erreur',
      error: 'Une erreur est survenue' 
    });
  }
});

// Page d'article
router.get('/articles/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ 
      slug: req.params.slug,
      published: true 
    }).populate('author');
    
    if (!article) {
      return res.status(404).render('error', {
        title: 'Article non trouvé',
        error: 'Cet article n\'existe pas'
      });
    }
    
    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      tags: { $in: article.tags },
      published: true
    }).limit(3);
    
    res.render('article', {
      title: article.title,
      description: article.excerpt,
      currentPage: 'articles',
      article,
      relatedArticles,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Erreur',
      error: 'Une erreur est survenue' 
    });
  }
});

module.exports = router;
```

## 5. Bonnes pratiques

### 5.1 Organisation des fichiers

```
views/
├── layouts/
│   ├── main.handlebars (ou layout.pug)
│   ├── admin.handlebars
│   └── minimal.handlebars
├── partials/ (ou includes/ pour Pug)
│   ├── navigation.handlebars
│   ├── footer.handlebars
│   ├── messages.handlebars
│   └── forms/
│       ├── contact.handlebars
│       └── newsletter.handlebars
├── pages/
│   ├── home.handlebars
│   ├── about.handlebars
│   └── contact.handlebars
├── articles/
│   ├── index.handlebars
│   ├── show.handlebars
│   └── edit.handlebars
└── admin/
    ├── dashboard.handlebars
    └── users.handlebars
```

### 5.2 Sécurité

- **Échapper les données utilisateur** : Toujours échapper les données non fiables
- **Valider les données** : Valider côté serveur avant de passer aux templates
- **CSP (Content Security Policy)** : Implémenter une politique de sécurité du contenu
- **CSRF Protection** : Protéger contre les attaques CSRF

```javascript
// Middleware de sécurité
app.use((req, res, next) => {
  // Variables globales sécurisées
  res.locals.user = req.user || null;
  res.locals.siteName = 'Mon Site';
  res.locals.currentYear = new Date().getFullYear();
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
  next();
});
```

### 5.3 Performance

- **Cache des templates** : Activer le cache en production
- **Minification** : Minifier CSS et JavaScript
- **CDN** : Utiliser un CDN pour les ressources statiques
- **Compression** : Compresser les réponses HTTP

```javascript
// Configuration pour la production
if (process.env.NODE_ENV === 'production') {
  app.enable('view cache');
  app.use(compression());
}
```

### 5.4 Accessibilité

- **Structure sémantique** : Utiliser les balises HTML appropriées
- **Alt text** : Ajouter des textes alternatifs aux images
- **Labels** : Associer les labels aux champs de formulaire
- **Navigation** : Implémenter une navigation au clavier

## 6. Conclusion

Le templating côté serveur reste une technique fondamentale pour créer des applications web robustes et performantes. Pug et Handlebars offrent deux approches complémentaires :

- **Choisir Pug** pour des projets où l'équipe maîtrise JavaScript et privilégie la concision
- **Choisir Handlebars** pour des projets avec des designers ou une équipe mixte, privilégiant la simplicité

Dans tous les cas, une bonne organisation des templates, l'utilisation de layouts et de partials, ainsi que le respect des bonnes pratiques de sécurité et de performance sont essentiels pour maintenir un code de qualité.

## 7. Exercices pratiques

### Exercice 1 : Blog avec Pug
Créez un blog complet avec Pug comprenant :
- Une page d'accueil avec les derniers articles
- Une page de liste d'articles avec pagination
- Une page de détail d'article
- Un système de commentaires

### Exercice 2 : Site e-commerce avec Handlebars
Développez un site e-commerce basique avec Handlebars :
- Page d'accueil avec produits vedettes
- Catalogue de produits avec filtres
- Page produit avec galerie d'images
- Panier d'achat

### Exercice 3 : Conversion
Convertissez un template existant de Pug vers Handlebars ou vice versa, en maintenant la même fonctionnalité et apparence.