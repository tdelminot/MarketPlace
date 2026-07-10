# 🛒 MarketPlace - Vente entre particuliers

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/tdelminot/marketplace)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

##  Description

MarketPlace est une application full-stack de vente entre particuliers développée pour démontrer des compétences en développement full-stack avec des architectures modernes.

##  Fonctionnalités

### 👤 Authentification
- Inscription et connexion sécurisées
- JWT pour la gestion des sessions
- Rôle utilisateur / vendeur

###  Produits
- Catalogue de produits avec images
- Filtres par catégorie
- Recherche par mot-clé
- Détail du produit avec galerie

### 🛒 Transactions
- Simulation d'achat de produits
- Changement de statut "Disponible" → "Vendu"
- Message de confirmation

###  Dashboard Vendeur
- Statistiques : produits, revenus, vues
- Taux de conversion
- Liste des produits publiés

##  Architecture

### Backend (Clean Architecture)
Domain Layer (Entities, Repositories)
↓
Application Layer (Use Cases)
↓
Infrastructure Layer (Database, API)
↓
Presentation Layer (Controllers, Routes)

text

### Frontend (MVVM)
Views (React Components)
↓
ViewModels (MobX State)
↓
Models (Data Layer)

text

##  Stack Technique

| Catégorie | Technologies |
|-----------|--------------|
| Frontend | React 18, Vite, MobX, Framer Motion |
| Backend | Node.js, Express, JWT |
| Database | MySQL |
| DevOps | Docker, docker-compose |
| Architecture | Clean Architecture + MVVM |

##  Docker

```bash
# Démarrer l'application
docker-compose up -d

# Arrêter
docker-compose down

# Voir les logs
docker-compose logs -f
📊 Git Flow
text
main (production)
  └── develop (intégration)
       ├── feature/auth
       ├── feature/products
       ├── feature/purchase
       ├── feature/dashboard
       └── feature/docker
📞 Contact
tdelminot@gmail.com
 

⭐ Développé par Tafara Delminot  