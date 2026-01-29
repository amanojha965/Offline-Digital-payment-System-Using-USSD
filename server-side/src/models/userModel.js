// In-memory user database
class UserModel {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    
    // Add demo users
    this.createUser('9876543210', '1234', 'Demo User', '500000');
    this.createUser('9999999999', '1234', 'Test Receiver', '250000');
  }

  createUser(mobile, pin, name, balance = '100000') {
    const user = {
      mobile,
      pin,
      name,
      balance,
      createdAt: new Date().toISOString()
    };
    this.users.set(mobile, user);
    return user;
  }

  findByMobile(mobile) {
    return this.users.get(mobile);
  }

  verifyPin(mobile, pin) {
    const user = this.users.get(mobile);
    return user && user.pin === pin;
  }

  updateBalance(mobile, newBalance) {
    const user = this.users.get(mobile);
    if (user) {
      user.balance = newBalance;
    }
    return user;
  }

  createSession(mobile) {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.sessions.set(sessionId, {
      mobile,
      createdAt: Date.now()
    });
    return sessionId;
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  deleteSession(sessionId) {
    this.sessions.delete(sessionId);
  }

  getAllUsers() {
    return Array.from(this.users.values()).map(u => ({
      mobile: u.mobile,
      name: u.name,
      balance: u.balance
    }));
  }
}

module.exports = new UserModel();