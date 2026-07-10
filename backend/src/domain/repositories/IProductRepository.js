class IProductRepository {
  async save(product) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findBySeller(sellerId) {
    throw new Error('Method not implemented');
  }

  async findAll(filters = {}) {
    throw new Error('Method not implemented');
  }

  async update(product) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async incrementViews(id) {
    throw new Error('Method not implemented');
  }

  async updateStatus(id, status) {
    throw new Error('Method not implemented');
  }
}

module.exports = IProductRepository;