const GetSellerStatsUseCase = require('../../application/useCases/GetSellerStatsUseCase');

class StatsController {
  constructor(productRepository, userRepository) {
    this.statsUseCase = new GetSellerStatsUseCase(productRepository, userRepository);
  }

  async getSellerStats(req, res) {
    try {
      const { userId } = req.params;
      
      // Vérifier que l'utilisateur demande ses propres stats
      if (req.user.id !== userId) {
        return res.status(403).json({ 
          success: false, 
          error: 'Vous ne pouvez voir que vos propres statistiques' 
        });
      }

      const stats = await this.statsUseCase.execute(userId);
      
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = StatsController;