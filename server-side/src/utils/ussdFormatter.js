class USSDFormatter {
  formatPaymentUSSD(receiver, amount, pin) {
    return `*99*1*${receiver}*${amount}*${pin}#`;
  }

  parseUSSD(ussdString) {
    const match = ussdString.match(/\*99\*1\*(\d+)\*(\d+)\*(\d+)#/);
    
    if (!match) {
      return null;
    }

    return {
      receiver: match[1],
      amount: match[2],
      pin: match[3]
    };
  }

  formatUSSDMenu() {
    return `
*99# - Main Menu
*99*1# - Send Money
*99*2# - Check Balance
*99*3# - Mini Statement
*99*4# - My Profile
    `.trim();
  }
}

module.exports = new USSDFormatter();