const { v4: uuidv4 } = require('uuid');

class Product {
  constructor({
    id = null,
    sellerId,
    title,
    description = '',
    sellerArgs = '',
    price,
    category = 'other',
    images = [],
    condition = 'good',
    location = '',
    status = 'available',
    views = 0,
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id || uuidv4();
    this.sellerId = sellerId;
    this.title = title;
    this.description = description;
    this.sellerArgs = sellerArgs;
    this.price = parseFloat(price);
    this.category = category;
    this.images = images;
    this.condition = condition;
    this.location = location;
    this.status = status;
    this.views = views || 0;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      sellerId: this.sellerId,
      title: this.title,
      description: this.description,
      sellerArgs: this.sellerArgs,
      price: this.price,
      category: this.category,
      images: this.images,
      condition: this.condition,
      location: this.location,
      status: this.status,
      views: this.views,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Product;