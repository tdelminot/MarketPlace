const RegisterUserUseCase = require('../../application/useCases/RegisterUserUseCase');
const LoginUserUseCase = require('../../application/useCases/LoginUserUseCase');

class AuthController {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.registerUseCase = new RegisterUserUseCase(userRepository);
    this.loginUseCase = new LoginUserUseCase(userRepository);
  }

  async register(req, res) {
    try {
      const { email, password, fullName, phone } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email et mot de passe requis' 
        });
      }

      const user = await this.registerUseCase.execute({ email, password, fullName, phone });
      
      // Générer un token pour une connexion automatique
      const loginResult = await this.loginUseCase.execute(email, password);
      
      res.status(201).json({
        success: true,
        user: loginResult.user,
        token: loginResult.token
      });
    } catch (error) {
      console.error('❌ Erreur register:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email et mot de passe requis' 
        });
      }

      const result = await this.loginUseCase.execute(email, password);
      
      res.json({
        success: true,
        user: result.user,
        token: result.token
      });
    } catch (error) {
      console.error('❌ Erreur login:', error);
      res.status(401).json({ success: false, error: error.message });
    }
  }

  async becomeSeller(req, res) {
    try {
      const { userId } = req.params;
      
      // Vérifier que l'utilisateur fait la demande pour lui-même
      if (req.user.id !== userId) {
        return res.status(403).json({ 
          success: false, 
          error: 'Vous ne pouvez modifier que votre propre compte' 
        });
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
      }

      // Mettre à jour le rôle
      user.role = 'seller';
      user.isSeller = true;
      await this.userRepository.update(user);

      res.json({
        success: true,
        message: 'Vous êtes maintenant vendeur !',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName || user.name,
          role: user.role,
          isSeller: true
        }
      });
    } catch (error) {
      console.error('❌ Erreur becomeSeller:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = AuthController;