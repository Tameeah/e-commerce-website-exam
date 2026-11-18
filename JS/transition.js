// transition.js - Handles page-load opening and click-to-exit curtain animations
window.addEventListener('pageshow', (event) => {
    const curtainLeft = document.querySelector(".curtain-left");
    const curtainRight = document.querySelector(".curtain-right");

    if (event.persisted) {
        gsap.set(".curtain-left", { xPercent: -100});
        gsap.set(".curtain-right", { xPercent: 100});
    }

    const loadTl = gsap.timeline();
    loadTl.to(".curtain-left", { xPercent: -100, duration: 1, ease: "power3.inOut" }, 0)
           .to(".curtain-right", { xPercent: 100, duration: 1, ease: "power3.inOut" }, 0)
           .from(".content", { scale: 0.5, opacity: 0, ease: "back.out(1.7)" }, 0.5);

    // 2. PAGE NAVIGATION: Close curtains when clicking internal links
    const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"])');

    internalLinks.forEach(link => {
        link.removeEventListener('click', link._transitionHandler);
        link._transitionHandler = (e) => {
            const destination = link.getAttribute('href');
            
            if (!destination || destination.startsWith('#') || destination.startsWith('javascript')) return;

            e.preventDefault();

            const exitTl = gsap.timeline({
                onComplete: () => {
                    window.location.href = destination;
                }
            });

            exitTl.to(".curtain-left", { xPercent: 0, duration: 0.8, ease: "power3.inOut" }, 0)
                  .to(".curtain-right", { xPercent: 0, duration: 0.8, ease: "power3.inOut" }, 0);
        };

        link.addEventListener('click', link._transitionHandler);
    });
});

//dropdown menu search 
document.addEventListener('DOMContentLoaded', () => {
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchInput = document.getElementById('global-search-input');
    const searchDropdown = document.getElementById('search-dropdown-results');

    if (!searchToggleBtn || !searchInput || !searchDropdown) {
        console.warn("Search elements not found on this page.");
        return;
    }

    // Toggle search bar input expansion
    searchToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        searchInput.classList.toggle('active');
        
        if (searchInput.classList.contains('active')) {
            // Small timeout to allow CSS width expansion before focusing
            setTimeout(() => {
                searchInput.focus();
            }, 50);
        } else {
            searchDropdown.classList.remove('active');
            searchInput.value = '';
        }
    });

    searchInput.addEventListener('focus', () => {
        searchInput.classList.add('active');
    });

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        clearTimeout(searchTimeout);

        if (query.length === 0) {
            searchDropdown.innerHTML = '';
            searchDropdown.classList.remove('active');
            return;
        }

        searchTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query + ' women')}`);
                const data = await response.json();
                let products = data.products || [];

                products = products.filter(p => 
                    p.category.includes('women') || 
                    p.category.includes('tops') || 
                    p.category.includes('dress') ||
                    p.title.toLowerCase().includes('top') ||
                    p.title.toLowerCase().includes('dress') ||
                    p.title.toLowerCase().includes('polo') ||
                    p.title.toLowerCase().includes('shirt')
                );

                if (products.length === 0) {
                    searchDropdown.innerHTML = `<p style="font-size:0.85rem; text-align:center; padding:10px; color:#666;">No pieces found</p>`;
                    searchDropdown.classList.add('active');
                    return;
                }

                // Render matching products into the dropdown
                searchDropdown.innerHTML = products.slice(0, 4).map(product => {
                    const priceInZar = Math.round(product.price * 18);
                    const thumb = product.thumbnail || (product.images && product.images[0]) || '';

                    return `
                        <a href="product.html?id=${product.id}" class="search-result-item">
                            <img src="${thumb}" alt="${product.title}" class="search-result-img" />
                            <div class="search-result-info">
                                <span class="search-result-title">${product.title}</span>
                                <span class="search-result-price">R ${priceInZar}</span>
                            </div>
                        </a>
                    `;
                }).join('');

                searchDropdown.classList.add('active');

            } catch (err) {
                console.error("Search error:", err);
            }
        }, 300); // 300ms debounce
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const container = document.getElementById('search-container');
        if (container && !container.contains(e.target)) {
            searchDropdown.classList.remove('active');
            searchInput.classList.remove('active');
        }
    });
});

//cursor dashed line
document.addEventListener('DOMContentLoaded', () => {
    let lastX = 0;
    let lastY = 0;
    const distanceThreshold = 30;

    window.addEventListener('mousemove', (e) => {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if(distance > distanceThreshold) {

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
                onComplete: () => {
                    dash.remove();
                }
            });
        }
    });
});

// mobile response navigation page
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('mobile-menu-btn');
    const navOverlay = document.getElementById('mobile-nav-overlay');
    const closeBtn = document.getElementById('mobile-nav-close-btn');

    if(hamburgerBtn && navOverlay) {
        hamburgerBtn.addEventListener('click', () => {
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if(closeBtn && navOverlay) {
        closeBtn.addEventListener('click', () => {
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    const navLinks = document.querySelectorAll('.mobile-nav-link');
     navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});

// Side Cart/ Bag 

//get items - initialize empty state
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('thats_t_cart')) || [];
    } catch (e) {
        return[];
    }
}

function saveCart(cart) {
    localStorage.setItem('thats_t_cart', JSON.stringify(cart));
    updateCartUI();
}

// add item to cart 
function addToCart(newItem) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === newItem.id && item.size === newItem.size);

    if(existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
        newItem.quantity = 1;
        cart.push(newItem);
    }

    saveCart(cart);
    openCart();
}

//remove item from cart
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

//open cart controls
function openCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');

    if(!drawer || !overlay) return;

    overlay.classList.add('active');
    drawer.classList.add('active');    
}


// close cart controls 
function closeCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');

    if(!drawer || !overlay) return;

    drawer.classList.remove('active');
    overlay.classList.remove('active');
}

//render cart content and icon update
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

    // 2. Render Body (Empty vs Populated)
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty-state">
                <p>girl it's empty!<br>let's add some pieces</p>
            </div>
        `;
        // Move the shop all button into the footer so it's pinned at the bottom
        cartFooter.style.display = 'block';
        cartFooter.innerHTML = `
            <a href="shop.html" class="cart-shop-btn">shop all</a>
        `;
    } else {
        cartFooter.style.display = 'block';
        
        // Calculate subtotal in ZAR (R)
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
            <a href="checkout.html" class="cart-checkout-btn" style="text-align: center; text-decoration: none; display: block;">checkout</a>
        `;
    }
}

// Event Listeners on Page Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    // Toggle Cart Drawer on Bag Icon Click
    const bagToggleBtn = document.getElementById('bag-toggle-btn');
    const closeBtn = document.getElementById('cart-close-btn');
    const overlay = document.getElementById('cart-overlay');

    if (bagToggleBtn) {
        bagToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeCart);
    }

    if (overlay) {
        overlay.addEventListener('click', closeCart);
    }
});
