const UserModel = require('../models/userModel');

class AuthController {
  async signup(req, res) {
    try {
      const { mobile, pin, name } = req.body;

      if (!mobile || !pin || !name) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      if (mobile.length !== 10) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number must be 10 digits'
        });
      }

      if (pin.length !== 4) {
        return res.status(400).json({
          success: false,
          message: 'PIN must be 4 digits'
        });
      }

      const existing = UserModel.findByMobile(mobile);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number already registered'
        });
      }

      const user = UserModel.createUser(mobile, pin, name);

      res.json({
        success: true,
        message: 'Account created successfully',
        user: {
          mobile: user.mobile,
          name: user.name
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  async verifyOTP(req, res) {
    try {
      const { mobile, otp } = req.body;

      // Mock OTP verification - accept any 6-digit OTP
      if (!otp || otp.length !== 6) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP'
        });
      }

      res.json({
        success: true,
        message: 'OTP verified successfully'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  async login(req, res) {
    try {
      const { mobile, pin } = req.body;

      if (!mobile || !pin) {
        return res.status(400).json({
          success: false,
          message: 'Mobile and PIN are required'
        });
      }

      const user = UserModel.findByMobile(mobile);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid mobile number or PIN'
        });
      }

      if (!UserModel.verifyPin(mobile, pin)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid mobile number or PIN'
        });
      }

      const sessionId = UserModel.createSession(mobile);

      res.json({
        success: true,
        message: 'Login successful',
        sessionId,
        user: {
          mobile: user.mobile,
          name: user.name,
          balance: user.balance
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  async getProfile(req, res) {
    try {
      const { sessionid } = req.headers;

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

      const user = UserModel.findByMobile(session.mobile);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: {
          mobile: user.mobile,
          name: user.name,
          balance: user.balance
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  async logout(req, res) {
    try {
      const { sessionid } = req.headers;

      if (sessionid) {
        UserModel.deleteSession(sessionid);
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
//
};


module.exports = new AuthController();