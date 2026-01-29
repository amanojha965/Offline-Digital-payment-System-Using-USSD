class TransactionModel {
  constructor() {
    this.transactions = new Map();
    this.transactionCounter = 1000;
  }

  create(sender, receiver, amount, pin) {
    const transactionId = `TXN${Date.now()}${this.transactionCounter++}`;
    const transaction = {
      transactionId,
      sender,
      receiver,
      amount: parseFloat(amount),
      pin,
      status: 'PENDING',
      timestamp: new Date().toISOString(),
      ussdString: `*99*1*${receiver}*${amount}*${pin}#`,
      message: ''
    };
    
    this.transactions.set(transactionId, transaction);
    return transaction;
  }

  updateStatus(transactionId, status, message = '', bankRefNo = '') {
    const txn = this.transactions.get(transactionId);
    if (txn) {
      txn.status = status;
      txn.message = message;
      txn.bankRefNo = bankRefNo;
      txn.completedAt = new Date().toISOString();
    }
    return txn;
  }

  getById(transactionId) {
    return this.transactions.get(transactionId);
  }

  getByMobile(mobile) {
    return Array.from(this.transactions.values())
      .filter(txn => txn.sender === mobile || txn.receiver === mobile)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getAll() {
    return Array.from(this.transactions.values());
  }
}

module.exports = new TransactionModel();