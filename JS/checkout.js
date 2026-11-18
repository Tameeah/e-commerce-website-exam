document.addEventListener('DOMContentLoaded', () => {
    renderCheckoutSummary ();
});

function renderCheckoutSummary() {
    const summaryContainer = document.getElementById('checkout-summary-container');
    if (!summaryContainer) return;

    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('thats_t_cart')) || [];
    } catch (e) {
        cart = [];
    }

    if (cart.length === 0) {
        summaryContainer.innerHTML = `
            <p style="text-align:center; color:#666; padding: 20px 0;">Your cart is empty.</p>
            <div class="summary-totals">
                <div class="summary-row total-row">
                    <span>Total</span>
                    <span>ZAR R 0,00</span>
                </div>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    const itemsHTML = cart.map(item => {
        const itemTotal = item.price * (item.quantity || 1);
        subtotal += itemTotal;

        return `
            <div class="summary-item">
                <div class="summary-item-img-wrap">
                    <img src="${item.image || '../Assets/images/Logo.png'}" alt="${item.title}" />
                </div>
                <span class="summary-item-badge">${item.quantity || 1}</span>
                <div class="summary-item-details">
                    <span class="summary-item-title">${item.title}</span>
                    <span class="summary-item-size">Size: ${item.size || 'S'}</span>
                </div>
                <span class="summary-item-price">R ${itemTotal.toLocaleString()}</span>
            </div>
        `;
    }).join('');

    summaryContainer.innerHTML = `
        <div class="summary-items-list">
            ${itemsHTML}
        </div>
        <div class="summary-totals">
            <div class="summary-row">
                <span>Subtotal</span>
                <span>R ${subtotal.toLocaleString()},00</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span style="color: #666; font-size: 0.85rem;">Calculated at next step</span>
            </div>
            <div class="summary-row total-row">
                <span>Total</span>
                <span>ZAR R ${subtotal.toLocaleString()},00</span>
            </div>
        </div>
    `;
}