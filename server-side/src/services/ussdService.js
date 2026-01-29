// Simulate USSD processing
class USSDService {
  async processPayment(ussdString, transactionId) {
    // Simulate telecom delay
    await this.simulateDelay(1000);

    // Parse USSD string
    const parts = ussdString.match(/\*99\*1\*(\d+)\*(\d+)\*(\d+)#/);
    
    if (!parts) {
      return {
        success: false,
        message: 'Invalid USSD format'
      };
    }

    const [, receiver, amount, pin] = parts;

    // Validate USSD parameters
    if (parseInt(amount) > 10000) {
      return {
        success: false,
        message: 'Amount exceeds offline limit'
      };
    }

    if (pin.length !== 4) {
      return {
        success: false,
        message: 'Invalid PIN format'
      };
    }

    // Simulate USSD gateway response
    return {
      success: true,
      message: 'USSD request processed',
      transactionId,
      ussdSessionId: `USSD${Date.now()}`
    };
  }

  simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  formatUSSDString(receiver, amount, pin) {
    return `*99*1*${receiver}*${amount}*${pin}#`;
  }
}

module.exports = new USSDService();