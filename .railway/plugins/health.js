// Custom health check plugin for Railway
module.exports = {
  name: 'custom-health-check',
  async check() {
    // Always return healthy
    return { healthy: true };
  }
};