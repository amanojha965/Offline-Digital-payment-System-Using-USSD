const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  // Auth APIs
  async signup(name, mobile, pin) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, mobile, pin })
    });
    return await response.json();
  },

  async verifyOTP(mobile, otp) {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mobile, otp })
    });
    return await response.json();
  },

  async login(mobile, pin) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mobile, pin })
    });
    return await response.json();
  },

  async getProfile() {
    const sessionId = localStorage.getItem('sessionId');
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'sessionId': sessionId
      }
    });
    return await response.json();
  },

  async logout() {
    const sessionId = localStorage.getItem('sessionId');
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'sessionId': sessionId
      }
    });
    return await response.json();
  },

  // Payment APIs
  async pay(sender, receiver, amount, pin) {
    const sessionId = localStorage.getItem('sessionId');
    const response = await fetch(`${API_BASE_URL}/payment/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sessionId': sessionId
      },
      body: JSON.stringify({ sender, receiver, amount, pin })
    });
    return await response.json();
  },

  async getStatus(transactionId) {
    const response = await fetch(`${API_BASE_URL}/payment/status/${transactionId}`);
    return await response.json();
  },

  async getTransactions(mobile) {
    const response = await fetch(`${API_BASE_URL}/payment/transactions?mobile=${mobile}`);
    return await response.json();
  }
};