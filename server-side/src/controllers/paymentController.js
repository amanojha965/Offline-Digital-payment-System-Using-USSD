const TransactionModel = require('../models/transactionModel');
const UserModel = require('../models/userModel');
const ussdService = require('../services/ussdService');
const bankService = require('../services/bankService');

class PaymentController {
  async initiatePayment(req, res) {
    try {
      const { sender, receiver, amount, pin } = req.body;
      const { sessionid } = req.headers;

      // Session validation
      if (!sessionid) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      const session = UserModel.getSession(sessionid);
      if (!session) {
        return res.status(401).json({
          success: false,
          message: 'Invalid session'
        });
      }

      // Validation
      if (!sender || !receiver || !amount || !pin) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const senderUser = UserModel.findByMobile(sender);
      const receiverUser = UserModel.findByMobile(receiver);

      if (!senderUser) {
        return res.status(404).json({
          success: false,
          message: 'Sender account not found'
        });
      }

      if (!receiverUser) {
        return res.status(404).json({
          success: false,
          message: 'Receiver account not found'
        });
      }

      if (!UserModel.verifyPin(sender, pin)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid PIN'
        });
      }

      const amountNum = parseFloat(amount);

      if (amountNum <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0'
        });
      }

      if (amountNum > 10000) {
        return res.status(400).json({
          success: false,
          message: 'Maximum offline payment limit is ₹10,000'
        });
      }

      if (parseFloat(senderUser.balance) < amountNum) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance'
        });
      }

      // Create transaction
      const transaction = TransactionModel.create(sender, receiver, amount, pin);

      // Process payment in background
      this.processPayment(transaction);

      res.json({
        success: true,
        transactionId: transaction.transactionId,
        message: 'Payment initiated via USSD'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  async processPayment(transaction) {
    // Simulate USSD processing
    const ussdResult = await ussdService.processPayment(
      transaction.ussdString,
      transaction.transactionId
    );

    if (ussdResult.success) {
      // Simulate bank processing
      const bankResult = await bankService.processTransaction(transaction);

      if (bankResult.success) {
        // Update balances
        const senderUser = UserModel.findByMobile(transaction.sender);
        const receiverUser = UserModel.findByMobile(transaction.receiver);

        const newSenderBalance = parseFloat(senderUser.balance) - transaction.amount;
        const newReceiverBalance = parseFloat(receiverUser.balance) + transaction.amount;

        UserModel.updateBalance(transaction.sender, newSenderBalance.toString());
        UserModel.updateBalance(transaction.receiver, newReceiverBalance.toString());

        TransactionModel.updateStatus(
          transaction.transactionId,
          'SUCCESS',
          `Payment of ₹${transaction.amount} sent successfully`,
          bankResult.bankRefNo
        );
      } else {
        TransactionModel.updateStatus(
          transaction.transactionId,
          'FAILED',
          bankResult.message
        );
      }
    } else {
      TransactionModel.updateStatus(
        transaction.transactionId,
        'FAILED',
        ussdResult.message
      );
    }
  }

  async getStatus(req, res) {
    try {
      const { transactionId } = req.params;
      const transaction = TransactionModel.getById(transactionId);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        transaction
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  async getTransactions(req, res) {
    try {
      const { mobile } = req.query;
      
      if (!mobile) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number required'
        });
      }

      const transactions = TransactionModel.getByMobile(mobile);

      res.json({
        success: true,
        transactions
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
}

module.exports = new PaymentController();