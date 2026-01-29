class Validators {
  validateMobile(mobile) {
    return /^\d{10}$/.test(mobile);
  }

  validatePIN(pin) {
    return /^\d{4}$/.test(pin);
  }

  validateAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 10000;
  }

  validateOTP(otp) {
    return /^\d{6}$/.test(otp);
  }

  sanitizeInput(input) {
    return input.trim().replace(/[^\d]/g, '');
  }
}

module.exports = new Validators();