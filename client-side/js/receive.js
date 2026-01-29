window.addEventListener('DOMContentLoaded', async () => {
  const sessionId = localStorage.getItem('sessionId');
  
  if (!sessionId) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await api.getProfile();
    
    if (response.success) {
      document.getElementById('yourNumber').textContent = response.user.mobile;
    } else {
      window.location.href = 'index.html';
    }
  } catch (error) {
    alert('Error loading profile');
    window.location.href = 'index.html';
  }
});

async function checkIncoming() {
  const mobile = localStorage.getItem('userMobile');

  if (!mobile) {
    alert('Please login first');
    window.location.href = 'index.html';
    return;
  }

  try {
    showLoading(true);
    
    const response = await api.getTransactions(mobile);
    
    showLoading(false);

    if (response.success) {
      const incomingPayments = response.transactions.filter(
        txn => txn.receiver === mobile && txn.status === 'SUCCESS'
      );

      if (incomingPayments.length === 0) {
        alert('No incoming payments found');
      } else {
        displayIncomingPayments(incomingPayments);
      }
    }
  } catch (error) {
    showLoading(false);
    alert('Error checking payments');
  }
}

function displayIncomingPayments(payments) {
  const total = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  
  const html = `
    <div class="status-icon">📥</div>
    <div class="status-message status-success">Incoming Payments</div>
    <div class="status-detail-row" style="background: var(--gray-100); padding: 16px; border-radius: 8px; margin: 16px 0;">
      <span class="status-detail-label">Total Received:</span>
      <span class="status-detail-value" style="color: var(--success); font-size: 18px;">₹${total.toFixed(2)}</span>
    </div>
    <div class="status-details">
      ${payments.map(payment => `
        <div class="status-detail-row">
          <span class="status-detail-label">From:</span>
          <span class="status-detail-value">${payment.sender}</span>
        </div>
        <div class="status-detail-row">
          <span class="status-detail-label">Amount:</span>
          <span class="status-detail-value" style="color: var(--success);">₹${payment.amount}</span>
        </div>
        <div class="status-detail-row">
          <span class="status-detail-label">ID:</span>
          <span class="status-detail-value" style="font-size: 12px;">${payment.transactionId}</span>
        </div>
        ${payments.indexOf(payment) < payments.length - 1 ? '<hr style="margin: 16px 0; border: none; border-top: 1px solid var(--gray-200);">' : ''}
      `).join('')}
    </div>
    <a href="home.html" class="btn btn-primary btn-full" style="margin-top: 20px;">
      Back to Home
    </a>
  `;

  // Navigate to status page
  sessionStorage.setItem('incomingPaymentsHTML', html);
  window.location.href = 'status.html';
}

function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  if (show) {
    overlay.classList.add('active');
  } else {
    overlay.classList.remove('active');
  }
}