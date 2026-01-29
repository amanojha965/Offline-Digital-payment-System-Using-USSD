window.addEventListener('DOMContentLoaded', () => {
  const transactionData = sessionStorage.getItem('transactionData');
  const incomingPaymentsHTML = sessionStorage.getItem('incomingPaymentsHTML');

  if (incomingPaymentsHTML) {
    document.getElementById('statusContent').innerHTML = incomingPaymentsHTML;
    sessionStorage.removeItem('incomingPaymentsHTML');
  } else if (transactionData) {
    const transaction = JSON.parse(transactionData);
    displayStatus(transaction);
    sessionStorage.removeItem('transactionData');
  } else {
    window.location.href = 'home.html';
  }
});

function displayStatus(transaction) {
  const statusContent = document.getElementById('statusContent');
  
  const isSuccess = transaction.status === 'SUCCESS';
  const statusClass = isSuccess ? 'status-success' : 'status-failed';
  const icon = isSuccess ? '✅' : '❌';
  const message = transaction.message || (isSuccess ? 'Payment Successful' : 'Payment Failed');

  const html = `
    <div class="status-icon ${statusClass}">${icon}</div>
    <div class="status-message ${statusClass}">${message}</div>
    
    <div class="status-details">
      <div class="status-detail-row">
        <span class="status-detail-label">Transaction ID</span>
        <span class="status-detail-value" style="font-size: 12px;">${transaction.transactionId}</span>
      </div>
      <div class="status-detail-row">
        <span class="status-detail-label">From</span>
        <span class="status-detail-value">${transaction.sender}</span>
      </div>
      <div class="status-detail-row">
        <span class="status-detail-label">To</span>
        <span class="status-detail-value">${transaction.receiver}</span>
      </div>
      <div class="status-detail-row">
        <span class="status-detail-label">Amount</span>
        <span class="status-detail-value" style="font-size: 18px; color: ${isSuccess ? 'var(--success)' : 'var(--danger)'};">₹${transaction.amount}</span>
      </div>
      <div class="status-detail-row">
        <span class="status-detail-label">Status</span>
        <span class="status-detail-value ${statusClass}">${transaction.status}</span>
      </div>
      ${transaction.bankRefNo ? `
      <div class="status-detail-row">
        <span class="status-detail-label">Bank Ref No</span>
        <span class="status-detail-value">${transaction.bankRefNo}</span>
      </div>
      ` : ''}
      <div class="status-detail-row">
        <span class="status-detail-label">USSD Code</span>
        <span class="status-detail-value" style="font-size: 12px;">${transaction.ussdString}</span>
      </div>
    </div>

    <a href="home.html" class="btn btn-primary btn-full" style="margin-top: 20px;">
      Back to Home
    </a>
  `;

  statusContent.innerHTML = html;
}