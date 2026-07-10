const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(userData) {
    const { username, email, password, fullName, phone } = userData;

    // Vérifier si l'utilisateur existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error('Ce nom d\'utilisateur est déjà pris');
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const user = {
      id: require('uuid').v4(),
      username,
      email,
      password: hashedPassword,
      fullName,
      phone,
      isSeller: false,
      createdAt: new Date()
    };

    await this.userRepository.save(user);

    // Générer le token JWT
    const token = this.generateToken(user);

    return { user, token };
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        isSeller: user.isSeller || false
      },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    } catch (error) {
      return null;
    }
  }

  async becomeSeller(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    user.isSeller = true;
    await this.userRepository.update(user);

    return user;
  }
}

module.exports = AuthService;