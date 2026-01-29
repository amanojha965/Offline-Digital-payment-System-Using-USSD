let paymentData = {};

function setAmount(value) {
  const amountInput = document.getElementById('amount');
  const currentAmount = parseFloat(amountInput.value) || 0;
  const newAmount = currentAmount + value;
  
  if (newAmount <= 10000) {
    amountInput.value = newAmount;
  }
}

function proceedToPIN() {
  const receiver = document.getElementById('receiverNumber').value.trim();
  const amount = document.getElementById('amount').value.trim();

  if (!receiver || !amount) {
    alert('Please fill all fields');
    return;
  }

  if (receiver.length !== 10) {
    alert('Receiver number must be 10 digits');
    return;
  }

  const amountNum = parseFloat(amount);

  if (amountNum <= 0) {
    alert('Amount must be greater than 0');
    return;
  }

  if (amountNum > 10000) {
    alert('Maximum offline payment limit is ₹10,000');
    return;
  }

  // Store payment data
  paymentData = { receiver, amount };

  // Update summary
  document.getElementById('summaryReceiver').textContent = receiver;
  document.getElementById('summaryAmount').textContent = `₹${parseFloat(amount).toFixed(2)}`;

  // Show PIN step
  document.getElementById('step1').classList.remove('active');
  document.getElementById('step2').classList.add('active');
  
  resetPin();
}

function backToStep1() {
  document.getElementById('step2').classList.remove('active');
  document.getElementById('step1').classList.add('active');
  resetPin();
}

async function initiatePayment() {
  if (currentPin.length !== 4) {
    alert('Please enter 4-digit PIN');
    return;
  }

  const sender = localStorage.getItem('userMobile');
  
  if (!sender) {
    alert('Please login first');
    window.location.href = 'index.html';
    return;
  }

  try {
    showLoading(true, 'Initiating USSD payment...');
    
    const response = await api.pay(
      sender,
      paymentData.receiver,
      paymentData.amount,
      currentPin
    );

    if (response.success) {
      // Poll for status
      document.getElementById('loadingText').textContent = 'Processing via USSD...';
      pollTransactionStatus(response.transactionId);
    } else {
      showLoading(false);
      alert(response.message);
      resetPin();
    }
  } catch (error) {
    showLoading(false);
    alert('Payment failed. Please check if backend is running.');
    resetPin();
  }
}

async function pollTransactionStatus(transactionId) {
  const maxAttempts = 20;
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;
    
    try {
      const response = await api.getStatus(transactionId);
      
      if (response.success && response.transaction.status !== 'PENDING') {
        clearInterval(interval);
        showLoading(false);
        
        // Redirect to status page
        sessionStorage.setItem('transactionData', JSON.stringify(response.transaction));
        window.location.href = 'status.html';
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        showLoading(false);
        alert('Transaction timeout. Check status later.');
        window.location.href = 'home.html';
      }
    } catch (error) {
      clearInterval(interval);
      showLoading(false);
      alert('Error checking status');
      window.location.href = 'home.html';
    }
  }, 500);
}

function showLoading(show, text = 'Processing...') {
  const overlay = document.getElementById('loadingOverlay');
  const loadingText = document.getElementById('loadingText');
  
  if (loadingText) {
    loadingText.textContent = text;
  }
  
  if (show) {
    overlay.classList.add('active');
  } else {
    overlay.classList.remove('active');
  }
}