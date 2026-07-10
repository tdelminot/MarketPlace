const User = require('../../domain/entities/User');

class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData) {
    const { email, password, fullName, phone } = userData;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Créer l'utilisateur avec la classe User
    const user = new User({
      email,
      password,
      fullName,
      phone,
      role: 'user'
    });

    // Hasher le mot de passe
    await user.hashPassword();

    // Sauvegarder
    await this.userRepository.save(user);

    // Retourner l'utilisateur sans le mot de passe
    return user.toJSON();
  }
}

module.exports = RegisterUserUseCase;