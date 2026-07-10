const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class LoginUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, password) {
    // Trouver l'utilisateur
    const userData = await this.userRepository.findByEmail(email);
    if (!userData) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe avec bcrypt directement
    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Créer un objet utilisateur pour le token
    const user = {
      id: userData.id,
      email: userData.email,
      fullName: userData.fullName || userData.name,
      role: userData.role || 'user',
      isSeller: userData.role === 'seller'
    };

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        isSeller: user.isSeller
      },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );

    return {
      user,
      token
    };
  }
}

module.exports = LoginUserUseCase;