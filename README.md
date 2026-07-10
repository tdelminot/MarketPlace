# 🛒 MarketPlace - Vente entre particuliers

Une plateforme de vente simplifiée où les utilisateurs peuvent acheter et vendre des objets d'occasion.

## ✨ Fonctionnalités

### 👤 Visiteur
- Navigation libre dans le catalogue
- Visualisation des produits (photos, prix, description, argumentaire vendeur)
- Interface responsive

### 👥 Utilisateur authentifié
- Dépôt d'annonces avec upload d'images
- Formulaire détaillé (titre, description, argumentaire, prix, catégorie)
- Gestion des annonces (modification/suppression)
- Tableau de bord vendeur avec statistiques

### 🛠️ Architecture
- Clean Architecture (backend)
- MVVM (frontend)
- Repository Pattern

## 🚀 Installation

```bash
# Cloner
git clone https://github.com/tdelminot/marketplace.git
cd marketplace

# Backend
cd backend
npm install
npm run dev

# Frontend (nouveau terminal)
cd frontend
npm install
npm start
🐳 Docker
bash
docker-compose up -d
📱 Accès
Frontend: http://localhost:3000

Backend API: http://localhost:5000

🛠️ Stack
Backend
Node.js + Express

MySQL

JWT Authentication

Clean Architecture

Frontend
React + Vite

MobX (MVVM)

Framer Motion

📊 Statistiques vendeur
Nombre de produits actifs

Revenus totaux

Vues totales

Taux de conversion

⭐ Développé par Tafara Delminot
 