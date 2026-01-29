// Login Form Handler
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const mobile = document.getElementById('mobile').value.trim();
    const pin = document.getElementById('pin').value.trim();

    if (!mobile || !pin) {
      alert('Please fill all fields');
      return;
    }

    if (mobile.length !== 10) {
      alert('Mobile number must be 10 digits');
      return;
    }

    if (pin.length !== 4) {
      alert('PIN must be 4 digits');
      return;
    }

    try {
      showLoading(true);
      const response = await api.login(mobile, pin);
      showLoading(false);

      if (response.success) {
        localStorage.setItem('sessionId', response.sessionId);
        localStorage.setItem('userMobile', response.user.mobile);
        window.location.href = 'home.html';
      } else {
        alert(response.message);
      }
    } catch (error) {
      showLoading(false);
      alert('Login failed. Please check if backend is running.');
    }
  });
}

// Signup Form Handler
if (document.getElementById('signupForm')) {
  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const pin = document.getElementById('pin').value.trim();
    const confirmPin = document.getElementById('confirmPin').value.trim();

    if (!name || !mobile || !pin || !confirmPin) {
      alert('Please fill all fields');
      return;
    }

    if (mobile.length !== 10) {
      alert('Mobile number must be 10 digits');
      return;
    }

    if (pin.length !== 4) {
      alert('PIN must be 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      alert('PINs do not match');
      return;
    }

    try {
      showLoading(true);
      const response = await api.signup(name, mobile, pin);
      showLoading(false);

      if (response.success) {
        localStorage.setItem('signupMobile', mobile);
        window.location.href = 'otp.html';
      } else {
        alert(response.message);
      }
    } catch (error) {
      showLoading(false);
      alert('Signup failed. Please check if backend is running.');
    }
  });
}

// Logout Function
async function logout() {
  if (confirm('Are you sure you want to logout?')) {
    try {
      await api.logout();
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userMobile');
      window.location.href = 'index.html';
    } catch (error) {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userMobile');
      window.location.href = 'index.html';
    }
  }
}

function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    if (show) {
      overlay.classList.add('active');
    } else {
      overlay.classList.remove('active');
    }
  }
}