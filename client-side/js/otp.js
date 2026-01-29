// Display mobile number
window.addEventListener('DOMContentLoaded', () => {
  const mobile = localStorage.getItem('signupMobile');
  if (!mobile) {
    window.location.href = 'signup.html';
    return;
  }
  
  document.getElementById('mobileDisplay').textContent = mobile;
});

// OTP Input Logic
const otpBoxes = document.querySelectorAll('.otp-box');

otpBoxes.forEach((box, index) => {
  box.addEventListener('input', (e) => {
    if (e.target.value.length === 1 && index < otpBoxes.length - 1) {
      otpBoxes[index + 1].focus();
    }
  });

  box.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      otpBoxes[index - 1].focus();
    }
  });
});

// OTP Form Handler
document.getElementById('otpForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const otp = Array.from(otpBoxes).map(box => box.value).join('');
  
  if (otp.length !== 6) {
    alert('Please enter complete OTP');
    return;
  }

  const mobile = localStorage.getItem('signupMobile');

  try {
    showLoading(true);
    const response = await api.verifyOTP(mobile, otp);
    showLoading(false);

    if (response.success) {
      localStorage.removeItem('signupMobile');
      alert('Account created successfully! Please login.');
      window.location.href = 'index.html';
    } else {
      alert(response.message);
    }
  } catch (error) {
    showLoading(false);
    alert('OTP verification failed');
  }
});

function resendOTP() {
  alert('OTP resent! (Demo: Use any 6-digit code)');
}

function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  if (show) {
    overlay.classList.add('active');
  } else {
    overlay.classList.remove('active');
  }
}