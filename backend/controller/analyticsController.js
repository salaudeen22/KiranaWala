const analyticsService = require("../service/analyticsService");

class OrderController {
  static async getOrderAnalytics(req, res) {
    try {
      const analytics = await analyticsService.getOrderAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = OrderController;
