class BankService {
  async processTransaction(transaction) {
    // Simulate bank processing delay
    await this.simulateDelay(800);

    // Simulate 95% success rate
    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      return {
        success: true,
        message: 'Transaction approved by bank',
        bankRefNo: `BANK${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        timestamp: new Date().toISOString()
      };
    } else {
      const errors = [
        'Bank server timeout',
        'Insufficient funds',
        'Transaction declined',
        'Technical error at bank'
      ];
      
      return {
        success: false,
        message: errors[Math.floor(Math.random() * errors.length)]
      };
    }
  }

  simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new BankService();