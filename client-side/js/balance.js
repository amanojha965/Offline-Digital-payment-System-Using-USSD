let hideTimer = null;

function checkBalance() {
    const confirmCheck = confirm("Check balance via USSD?");
    if (!confirmCheck) return;

    showLoading(true);

    setTimeout(() => {
        showLoading(false);

        const balance = document.getElementById("balanceAmount");
        const hidden = document.getElementById("hiddenBalance");
        const hideBtn = document.getElementById("hideBalanceBtn");

        // Show balance
        balance.classList.remove("hidden");
        hidden.classList.add("hidden");
        hideBtn.classList.remove("hidden");

        alert("Balance fetched successfully via USSD");

        // Clear old timer if any
        if (hideTimer) clearTimeout(hideTimer);

        // Auto-hide after 10 seconds
        hideTimer = setTimeout(() => {
            hideBalance();
        }, 10000);

    }, 2000);
}

function hideBalance() {
    const balance = document.getElementById("balanceAmount");
    const hidden = document.getElementById("hiddenBalance");
    const hideBtn = document.getElementById("hideBalanceBtn");

    balance.classList.add("hidden");
    hidden.classList.remove("hidden");
    hideBtn.classList.add("hidden");

    // Clear timer
    if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
}   