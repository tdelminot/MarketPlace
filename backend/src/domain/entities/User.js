const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
  constructor({
    id = null,
    email,
    password,
    fullName = null,
    name = null,
    phone = null,
    role = 'user',
    isSeller = false,
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id || uuidv4();
    this.email = email;
    this.password = password;
    this.fullName = fullName || name;
    this.name = this.fullName;
    this.phone = phone;
    this.role = isSeller ? 'seller' : role;
    this.isSeller = isSeller || this.role === 'seller';
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      name: this.name,
      phone: this.phone,
      role: this.role,
      isSeller: this.isSeller,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;