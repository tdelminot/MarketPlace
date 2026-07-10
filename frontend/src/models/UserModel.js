class UserModel {
  constructor(data) {
    if (!data) {
      this.id = null;
      this.username = null;
      this.email = null;
      this.fullName = null;
      this.phone = null;
      this.isSeller = false;
      this.createdAt = null;
      this.token = null;
      return;
    }

    this.id = data.id || null;
    this.username = data.username || data.email || null;
    this.email = data.email || null;
    this.fullName = data.fullName || data.name || null;
    this.phone = data.phone || null;
    this.isSeller = data.isSeller || data.role === 'seller' || false;
    this.createdAt = data.createdAt || null;
    this.token = data.token || null;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      phone: this.phone,
      isSeller: this.isSeller,
      createdAt: this.createdAt,
      token: this.token
    };
  }

  static fromJSON(json) {
    return new UserModel(json);
  }
}

export default UserModel;