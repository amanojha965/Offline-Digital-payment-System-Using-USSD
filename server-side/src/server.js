const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Offline Payment System Backend      ║
║   Server: http://localhost:${PORT}      ║
║   Status: ✅ Running                   ║
╚════════════════════════════════════════╝

Demo Accounts:
--------------
Account 1: 9876543210 | PIN: 1234 | Balance: ₹5,00,000
Account 2: 9999999999 | PIN: 1234 | Balance: ₹2,50,000

API Endpoints:
--------------
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/verify-otp
GET    /api/auth/profile
POST   /api/auth/logout
POST   /api/payment/pay
GET    /api/payment/status/:transactionId
GET    /api/payment/transactions?mobile=XXXXXXXXXX
GET    /health

Ready for payments! 🚀
  `);
});