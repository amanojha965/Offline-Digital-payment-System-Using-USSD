function showHistory() {
    const historyModal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');
    
    historyModal.classList.remove('hidden');

    // Fetch all transactions from API (similar to loadRecentTransactions)
    api.getTransactions(document.getElementById('userMobile').textContent)
        .then(response => {
            if (response.success && response.transactions.length > 0) {
                const html = response.transactions.map(txn => {
                    const isSent = txn.sender === document.getElementById('userMobile').textContent;
                    const statusIcon = txn.status === 'SUCCESS' ? '✅' : txn.status === 'FAILED' ? '❌' : '⏳';
                    const txnTime = formatDateTime(txn.timestamp || txn.date);

                    return `
                        <div class="transaction-item ${txn.status.toLowerCase()}">
                            <div class="txn-left">
                                <span class="txn-type">${isSent ? '📤 Sent' : '📥 Received'}</span>
                                <span class="txn-party">${isSent ? txn.receiver : txn.sender}</span>
                            </div>
                            <div class="txn-right">
                                <span class="txn-amount ${isSent ? 'debit' : 'credit'}">
                                    ${isSent ? '-' : '+'}₹${txn.amount}
                                </span>
                                <span class="txn-time">${txnTime}</span>
                            </div>
                        </div>
                    `;
                }).join('');

                historyList.innerHTML = html;
            } else {
                historyList.innerHTML = '<p class="no-transactions">No transactions yet</p>';
            }
        })
        .catch(err => {
            console.error(err);
            historyList.innerHTML = '<p class="no-transactions">Error loading transactions</p>';
        });
}

function closeHistory() {
    document.getElementById('historyModal').classList.add('hidden');
}