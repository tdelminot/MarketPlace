 
-- BASE DE DONNÉES MARKETPLACE 
 

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS marketplace_db;
USE marketplace_db;

 
--   TABLE DES UTILISATEURS
 
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('user', 'seller') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

 
--   TABLE DES PRODUITS
- 
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    seller_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) DEFAULT 'other',
    `condition` ENUM('new', 'like-new', 'good', 'fair') DEFAULT 'good',
    images JSON,
    status ENUM('available', 'sold', 'reserved') DEFAULT 'available',
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_seller (seller_id),
    INDEX idx_status (status),
    INDEX idx_category (category)
);

 
-- 3. TABLE DES TRANSACTIONS
 
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    buyer_id VARCHAR(36) NOT NULL,
    seller_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_buyer (buyer_id),
    INDEX idx_seller (seller_id),
    INDEX idx_status (status)
);

 
--  TABLE DES STATISTIQUES VENDEUR
 
CREATE TABLE IF NOT EXISTS seller_stats (
    seller_id VARCHAR(36) PRIMARY KEY,
    total_products INT DEFAULT 0,
    active_products INT DEFAULT 0,
    sold_products INT DEFAULT 0,
    total_revenue DECIMAL(10, 2) DEFAULT 0,
    total_views INT DEFAULT 0,
    conversion_rate DECIMAL(5, 2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

 
-- 5. DONNÉES DE TEST - UTILISATEURS
 

-- Vendeurs de test
INSERT INTO users (id, email, password, name, role, created_at) VALUES
('vendeur-1', 'marc.dupont@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Marc Dupont', 'seller', NOW()),
('vendeur-2', 'sophie.bernard@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sophie Bernard', 'seller', NOW()),
('vendeur-3', 'thomas.petit@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Thomas Petit', 'seller', NOW()),
('vendeur-4', 'emilie.robert@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Émilie Robert', 'seller', NOW()),
('vendeur-5', 'lucas.moreau@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lucas Moreau', 'seller', NOW()),
('vendeur-6', 'camille.richard@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Camille Richard', 'seller', NOW()),
('vendeur-7', 'nathan.dubois@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nathan Dubois', 'seller', NOW()),
('vendeur-8', 'lea.lambert@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Léa Lambert', 'seller', NOW()),
('vendeur-9', 'hugo.garcia@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Hugo Garcia', 'seller', NOW()),
('vendeur-10', 'chloe.martin@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Chloé Martin', 'seller', NOW());

-- Acheteurs de test
INSERT INTO users (id, email, password, name, role, created_at) VALUES
('acheteur-1', 'alice.leroy@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alice Leroy', 'user', NOW()),
('acheteur-2', 'maxime.rousseau@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Maxime Rousseau', 'user', NOW()),
('acheteur-3', 'julie.mercier@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Julie Mercier', 'user', NOW()),
('acheteur-4', 'kevin.blanc@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Kevin Blanc', 'user', NOW()),
('acheteur-5', 'elise.fontaine@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Élise Fontaine', 'user', NOW());

 
--   DONNÉES DE TEST - PRODUITS
 

INSERT INTO products (id, seller_id, title, description, price, category, `condition`, images, status, views, created_at) VALUES

-- ÉLECTRONIQUE
('prod-1', 'vendeur-1', 'iPhone 13 Pro 256GB - Graphite', 
 'iPhone 13 Pro en excellent état. Batterie à 92%. Livré avec chargeur et câble d\'origine.', 
 799.00, 'electronics', 'like-new', '["/uploads/iphone13_1.jpg"]', 'available', 24, NOW()),

('prod-2', 'vendeur-2', 'MacBook Pro M1 14" - 16GB/512GB',
 'MacBook Pro 14 pouces avec puce M1. 16GB RAM, 512GB SSD. Écran parfait.', 
 1599.00, 'electronics', 'like-new', '["/uploads/macbook_1.jpg"]', 'available', 22, NOW()),

('prod-3', 'vendeur-3', 'Sony PlayStation 5 - Édition Standard',
 'PS5 en excellent état. Inclut deux manettes DualSense, chargeur, et 5 jeux physiques.',
 550.00, 'electronics', 'like-new', '["/uploads/ps5_1.jpg"]', 'available', 20, NOW()),

('prod-4', 'vendeur-4', 'Bose QuietComfort 45 - Noir',
 'Casque Bose QC45 en parfait état. Réduction de bruit exceptionnelle. Autonomie 24h.',
 250.00, 'electronics', 'like-new', '["/uploads/bose_1.jpg"]', 'available', 22, NOW()),

('prod-5', 'vendeur-5', 'Canon EOS R6 + Objectif 24-105mm',
 'Appareil photo Canon R6 avec objectif 24-105mm. Moins de 2000 déclenchements.',
 2100.00, 'electronics', 'like-new', '["/uploads/canon_1.jpg"]', 'available', 22, NOW()),

-- LIVRES
('prod-6', 'vendeur-1', 'Collection Harry Potter - 7 tomes',
 'Collection complète des 7 livres Harry Potter. État neuf, jamais lus.',
 120.00, 'books', 'new', '["/uploads/hp_1.jpg"]', 'available', 20, NOW()),

-- SPORT
('prod-7', 'vendeur-2', 'Vélo de route Trek Domane SL 5',
 'Vélo de route Trek Domane SL 5. Cadre carbone, groupe Shimano 105. Année 2022.',
 1800.00, 'sport', 'good', '["/uploads/trek_1.jpg"]', 'available', 22, NOW()),

('prod-8', 'vendeur-4', 'Planche de surf CI Pod Mod 5\'10"',
 'Planche de surf CI Pod Mod 5\'10". En très bon état, quelques scratches légers.',
 450.00, 'sport', 'good', '["/uploads/surf_1.jpg"]', 'available', 22, NOW()),

('prod-9', 'vendeur-6', 'Set de golf Titleist T300',
 'Set complet de clubs Titleist T300. Année 2021. Sac inclus.',
 700.00, 'sport', 'like-new', '["/uploads/golf_1.jpg"]', 'available', 22, NOW()),

-- MUSIQUE
('prod-10', 'vendeur-3', 'Guitare acoustique Taylor 814ce',
 'Guitare Taylor 814ce en bois massif. Édition limitée. Son exceptionnel.',
 2800.00, 'music', 'like-new', '["/uploads/taylor_1.jpg"]', 'available', 26, NOW()),

('prod-11', 'vendeur-8', 'Piano numérique Yamaha P-515',
 'Piano numérique Yamaha P-515 avec stand et pédalier. Toucher lourd.',
 1200.00, 'music', 'like-new', '["/uploads/yamaha_1.jpg"]', 'available', 24, NOW()),

-- VÊTEMENTS
('prod-12', 'vendeur-5', 'Montre Omega Seamaster 300M',
 'Montre Omega Seamaster 300M. Cadran bleu, bracelet acier. Année 2021. Boîte et papiers.',
 3200.00, 'clothing', 'good', '["/uploads/omega_1.jpg"]', 'available', 26, NOW()),

('prod-13', 'vendeur-6', 'Nike Air Jordan 1 Retro High',
 'Air Jordan 1 Retro High OG "Chicago". Taille 42. Édition limitée.',
 550.00, 'clothing', 'like-new', '["/uploads/jordan_1.jpg"]', 'available', 26, NOW()),

('prod-14', 'vendeur-7', 'Sac Louis Vuitton Speedy 30',
 'Sac Louis Vuitton Speedy 30 en toile Monogram. Très bon état, certificat d\'authenticité.',
 650.00, 'clothing', 'good', '["/uploads/lv_1.jpg"]', 'available', 24, NOW()),

('prod-15', 'vendeur-8', 'Polo Ralph Lauren - Collection été',
 'Polo Ralph Lauren en coton piqué. Couleur marine. Taille L.',
 45.00, 'clothing', 'like-new', '["/uploads/polo_1.jpg"]', 'available', 22, NOW()),

('prod-16', 'vendeur-9', 'Veste en cuir Schott NYC 613',
 'Veste en cuir de mouton Schott 613. Vintage des années 90. Cuir patiné.',
 450.00, 'clothing', 'good', '["/uploads/veste_1.jpg"]', 'available', 23, NOW()),

-- MAISON & JARDIN
('prod-17', 'vendeur-7', 'Canapé Chesterfield 3 places',
 'Canapé Chesterfield en cuir véritable. Marron vintage. Très confortable.',
 850.00, 'other', 'good', '["/uploads/chesterfield_1.jpg"]', 'available', 22, NOW()),

('prod-18', 'vendeur-9', 'Table basse design en marbre',
 'Table basse en marbre blanc avec piètement laiton. Design scandinave.',
 380.00, 'other', 'like-new', '["/uploads/table_1.jpg"]', 'available', 20, NOW()),

('prod-19', 'vendeur-10', 'Lampadaire design en bois et métal',
 'Lampadaire design scandinave. Pied en bois massif, abat-jour en métal noir.',
 150.00, 'other', 'like-new', '["/uploads/lampadaire_1.jpg"]', 'available', 22, NOW()),

('prod-20', 'vendeur-2', 'Lego Star Wars Millennium Falcon',
 'Lego Millennium Falcon - 7541 pièces. Boîte scellée, jamais ouvert.',
 650.00, 'other', 'new', '["/uploads/lego_1.jpg"]', 'available', 20, NOW()),

('prod-21', 'vendeur-4', 'Figurine Star Wars - Boba Fett',
 'Figurine Boba Fett signature edition. Édition limitée à 1000 exemplaires.',
 180.00, 'other', 'excellent', '["/uploads/boba_1.jpg"]', 'available', 22, NOW());

-- Produits vendus (pour démonstration)
INSERT INTO products (id, seller_id, title, description, price, category, `condition`, images, status, views, created_at) VALUES
('prod-22', 'vendeur-1', 'iPhone 12 Pro 128GB - Argent',
 'iPhone 12 Pro en bon état. Batterie à 78%. Quelques micro-rayures.',
 450.00, 'electronics', 'good', '["/uploads/iphone12_1.jpg"]', 'sold', 67, NOW()),

('prod-23', 'vendeur-3', 'Vélo électrique Giant Explore E+',
 'Vélo électrique Giant Explore E+. Batterie 500Wh. Autonomie 100km.',
 1200.00, 'sport', 'good', '["/uploads/giant_1.jpg"]', 'sold', 45, NOW());

 
--   TRANSACTIONS
 
INSERT INTO transactions (id, product_id, buyer_id, seller_id, amount, status, created_at, completed_at) VALUES
('trans-1', 'prod-22', 'acheteur-1', 'vendeur-1', 450.00, 'completed', NOW(), NOW()),
('trans-2', 'prod-23', 'acheteur-2', 'vendeur-3', 1200.00, 'completed', NOW(), NOW());
 
--   STATISTIQUES VENDEUR
 
INSERT INTO seller_stats (seller_id, total_products, active_products, sold_products, total_revenue, total_views, conversion_rate) VALUES
('vendeur-1', 3, 2, 1, 450.00, 67, 33.33),
('vendeur-2', 3, 3, 0, 0, 42, 0),
('vendeur-3', 3, 2, 1, 1200.00, 45, 33.33),
('vendeur-4', 3, 3, 0, 0, 22, 0),
('vendeur-5', 2, 2, 0, 0, 48, 0),
('vendeur-6', 2, 2, 0, 0, 22, 0),
('vendeur-7', 2, 2, 0, 0, 22, 0),
('vendeur-8', 2, 2, 0, 0, 22, 0),
('vendeur-9', 2, 2, 0, 0, 23, 0),
('vendeur-10', 1, 1, 0, 0, 22, 0);

 
--   VÉRIFICATION FINALE
 
SELECT '✅ Base de données initialisée avec succès !' as Status;
SELECT CONCAT('👤 ', COUNT(*), ' utilisateurs') as Info FROM users;
SELECT CONCAT('📦 ', COUNT(*), ' produits') as Info FROM products;
SELECT CONCAT('🛒 ', COUNT(*), ' transactions') as Info FROM transactions;
SELECT CONCAT('📈 ', COUNT(*), ' statistiques vendeur') as Info FROM seller_stats;

-- Afficher les produits disponibles
SELECT title, price, category, status FROM products WHERE status = 'available' LIMIT 5;
 