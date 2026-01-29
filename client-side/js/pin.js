let currentPin = '';

function addPinDigit(digit) {
  if (currentPin.length < 4) {
    currentPin += digit;
    updatePinDisplay();
    
    // if (currentPin.length === 4) {
    //   // Auto-submit after 4 digits
    //   setTimeout(() => {
    //     initiatePayment();
    //   }, 300);
    // }
  }
}

function deletePinDigit() {
  if (currentPin.length > 0) {
    currentPin = currentPin.slice(0, -1);
    updatePinDisplay();
  }
}

// function updatePinDisplay() {
//   const dots = document.querySelectorAll('.pin-dot');
//   dots.forEach((dot, index) => {
//     if (index < currentPin.length) {
//       dot.classList.add('filled');
//     } else {
//       dot.classList.remove('filled');
//     }
//   });
// }
function updatePinDisplay() {
  const dots = document.querySelectorAll('.pin-dot');
  dots.forEach((dot, index) => {
    if (index < currentPin.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });

  const payBtn = document.getElementById('payBtn');
  if (payBtn) {
    payBtn.disabled = currentPin.length !== 4;
  }
}
function resetPin() {
  currentPin = '';
  updatePinDisplay();
}
document.addEventListener('keydown', (e) => {
  // Allow only numbers
  if (e.key >= '0' && e.key <= '9') {
    addPinDigit(e.key);
  }

  // Backspace support
  if (e.key === 'Backspace') {
    deletePinDigit();
  }
});