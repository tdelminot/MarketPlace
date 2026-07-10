class ProductModel {
  constructor(data) {
    if (!data) {
      this.id = null;
      this.sellerId = null;
      this.seller = null;
      this.title = '';
      this.description = '';
      this.sellerArgs = '';
      this.price = 0;
      this.category = 'other';
      this.images = [];
      this.condition = 'good';
      this.location = '';
      this.status = 'active';
      this.views = 0;
      this.createdAt = null;
      this.updatedAt = null;
      return;
    }

    this.id = data.id || null;
    this.sellerId = data.sellerId || null;
    this.seller = data.seller || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.sellerArgs = data.sellerArgs || '';
    this.price = data.price || 0;
    this.category = data.category || 'other';
    this.images = this.parseImages(data.images);
    this.condition = data.condition || 'good';
    this.location = data.location || '';
    this.status = data.status || 'active';
    this.views = data.views || 0;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  parseImages(images) {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [images];
      }
    }
    return [];
  }

  get formattedPrice() {
    return `${this.price}€`;
  }

  get mainImage() {
    return this.images && this.images.length > 0 ? this.images[0] : null;
  }

  get conditionLabel() {
    const labels = {
      'new': 'Neuf',
      'like-new': 'Comme neuf',
      'good': 'Bon état',
      'fair': 'Correct',
      'used': 'Usagé',
      'damaged': 'Abîmé'
    };
    return labels[this.condition] || this.condition;
  }

  toJSON() {
    return {
      id: this.id,
      sellerId: this.sellerId,
      seller: this.seller,
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

  static fromJSON(json) {
    return new ProductModel(json);
  }
}

export default ProductModel;