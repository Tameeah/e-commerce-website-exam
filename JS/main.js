//Global JS file for same functions across all pages


// transition.js - Handles page-load opening and click-to-exit curtain animations
document.addEventListener('DOMContentLoaded', () => {
    // 1. PAGE LOAD CURTAINS
    const loadTl = gsap.timeline();
    loadTl.to(".curtain-left", { xPercent: -100, duration: 1, ease: "power3.inOut" }, 0)
         .to(".curtain-right", { xPercent: 100, duration: 1, ease: "power3.inOut" }, 0)
         .from(".content", { scale: 0.5, opacity: 0, ease: "back.out(1.7)" }, 0.5);

    // 2. PAGE NAVIGATION CURTAINS
    const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"])');
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const destination = link.getAttribute('href');
            if (!destination || destination.startsWith('#') || destination.startsWith('javascript')) return;

            e.preventDefault();
            const exitTl = gsap.timeline({
                onComplete: () => { window.location.href = destination; }
            });
            exitTl.to(".curtain-left", { xPercent: 0, duration: 0.8, ease: "power3.inOut" }, 0)
                  .to(".curtain-right", { xPercent: 0, duration: 0.8, ease: "power3.inOut" }, 0);
        });
    });

    // 3. GLOBAL SEARCH BAR TOGGLE
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchInput = document.getElementById('search-input') || document.getElementById('global-search-input');

    if (searchToggleBtn && searchInput) {
        searchToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchInput.classList.toggle('active');
            if (searchInput.classList.contains('active')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchInput.classList.remove('active');
            }
        });
    }

    // 4. INITIALIZE CART & ATTACH LISTENERS
    updateCartUI();
    const bagToggleBtn = document.getElementById('bag-toggle-btn');
    const closeBtn = document.getElementById('cart-close-btn');
    const overlay = document.getElementById('cart-overlay');

    if (bagToggleBtn) {
        bagToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);

    // 5. GLOBAL GSAP HEADING SCROLL-TRIGGER ANIMATIONS
    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        const headings = document.querySelectorAll('.section-heading, .page-main-heading, .reveal-heading');
        headings.forEach((heading) => {
            if (heading.dataset.animated) return;
            heading.dataset.animated = "true";

            const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT, null, false);
            let node;
            const textNodes = [];
            while (node = walker.nextNode()) textNodes.push(node);

            textNodes.forEach(textNode => {
                const fragment = document.createDocumentFragment();
                const words = textNode.nodeValue.split(/(\s+)/);

                words.forEach(word => {
                    if (/^\s+$/.test(word)) {
                        fragment.appendChild(document.createTextNode(word));
                    } else {
                        const wordSpan = document.createElement('span');
                        wordSpan.style.display = 'inline-block';
                        wordSpan.style.whiteSpace = 'nowrap';
                        
                        [...word].forEach(char => {
                            const charSpan = document.createElement('span');
                            charSpan.className = 'split-char';
                            charSpan.style.display = 'inline-block';
                            charSpan.textContent = char;
                            wordSpan.appendChild(charSpan);
                        });
                        fragment.appendChild(wordSpan);
                    }
                });
                textNode.parentNode.replaceChild(fragment, textNode);
            });

            const chars = heading.querySelectorAll('.split-char');
            gsap.from(chars, {
                rotation: 90,
                transformOrigin: "top center",
                opacity: 0,
                duration: 1.8,
                stagger: 0.05,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: heading,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }
});

// --- CURSOR DASHED LINE TRAIL ---
document.addEventListener('DOMContentLoaded', () => {
    let lastX = 0;
    let lastY = 0;
    const distanceThreshold = 30;

    window.addEventListener('mousemove', (e) => {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > distanceThreshold) {
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            lastX = e.clientX;
            lastY = e.clientY;

            const dash = document.createElement('div');
            dash.className = 'cursor-dash';
            dash.style.left = `${e.clientX}px`;
            dash.style.top = `${e.clientY}px`;
            dash.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            document.body.appendChild(dash);

            gsap.to(dash, {
                scale: 0.5,
                opacity: 0,
                duration: 0.6,
                ease: "power1.out",
                onComplete: () => { dash.remove(); }
            });
        }
    });
});

// --- SIDE CART LOGIC & MANAGEMENT ---
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('thats_t_cart')) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('thats_t_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(newItem) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === newItem.id && item.size === newItem.size);

    if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
        newItem.quantity = 1;
        cart.push(newItem);
    }

    saveCart(cart);
    openCart();
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function openCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
        drawer.classList.add('active');
        overlay.classList.add('active');
    }
}

function closeCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function updateCartUI() {
    const cart = getCart();
    const cartBody = document.getElementById('cart-body');
    const cartFooter = document.getElementById('cart-footer');
    const badge = document.getElementById('bag-badge');

    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (badge) {
        badge.textContent = totalCount;
        if (totalCount > 0) {
            badge.classList.add('visible');
        } else {
            badge.classList.remove('visible');
        }
    }

    if (!cartBody || !cartFooter) return;

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty-state">
                <p>girl it's empty!<br>let's add some pieces</p>
            </div>
        `;
        cartFooter.style.display = 'block';
        cartFooter.innerHTML = `<a href="shop.html" class="cart-shop-btn">shop all</a>`;
    } else {
        cartFooter.style.display = 'block';
        const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

        cartBody.innerHTML = `
            <div class="cart-item-list">
                ${cart.map((item, index) => `
                    <div class="cart-item">
                        <div class="cart-item-img-wrap">
                            <img src="${item.image}" alt="${item.title}" />
                        </div>
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.title}</h4>
                            <p class="cart-item-price">R${item.price}</p>
                            <p class="cart-item-size">size: ${item.size} ${item.quantity > 1 ? `(x${item.quantity})` : ''}</p>
                        </div>
                        <button class="cart-item-remove" onclick="removeFromCart(${index})" aria-label="Remove item">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        cartFooter.innerHTML = `
            <div class="cart-subtotal-row">
                <span>Subtotal:</span>
                <span>R${subtotal}</span>
            </div>
            <button class="cart-checkout-btn" onclick="alert('Proceeding to checkout...')">checkout</button>
        `;
    }
}