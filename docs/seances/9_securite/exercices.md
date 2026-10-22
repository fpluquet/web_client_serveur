# Exercices pratiques {#exercices}

Mettez en pratique les notions du chapitre Sécurité. Chaque exercice cible une compétence concrète (auth, XSS, audit, HTTPS).

## Exercice 1 : Sécurisation d'une API de connexion

**Objectif** : Implémenter une authentification sécurisée

**Tâches** :
1. Créer un endpoint de connexion avec validation
2. Implémenter le hachage des mots de passe
3. Générer et valider des JWT
4. Ajouter une limitation du taux de requêtes

## Exercice 2 : Protection contre XSS

**Objectif** : Sécuriser une application contre les attaques XSS

**Tâches** :
1. Identifier les vulnérabilités XSS dans le code fourni
2. Implémenter la sanitisation des données
3. Configurer CSP
4. Tester les protections

## Exercice 3 : Audit de sécurité

**Objectif** : Effectuer un audit complet d'une application

**Tâches** :
1. Scanner les vulnérabilités avec npm audit
2. Analyser les headers de sécurité
3. Tester les mécanismes d'authentification
4. Proposer des améliorations

## Exercice 4 : Implémentation HTTPS

**Objectif** : Configurer HTTPS et les headers de sécurité

**Tâches** :
1. Générer des certificats SSL
2. Configurer le serveur HTTPS
3. Implémenter HSTS
4. Rediriger HTTP vers HTTPS

## Conclusion

La sécurité des applications web est un domaine en constante évolution qui nécessite une vigilance permanente. Les concepts abordés dans ce chapitre constituent les fondements essentiels pour développer des applications web sécurisées.

### Points clés à retenir

- La sécurité doit être intégrée dès la conception
- Toujours valider et sanitiser les données d'entrée
- Utiliser HTTPS et des headers de sécurité appropriés
- Implémenter une authentification et autorisation robustes
- Maintenir les dépendances à jour
- Effectuer des tests de sécurité réguliers

### Ressources supplémentaires

- [OWASP Top 10:2025](https://owasp.org/Top10/2025/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

← [Pratiques et outils](./pratiques) · [Retour à la vue d'ensemble](./)
