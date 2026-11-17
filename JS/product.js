const detailContainer = document.getElementById('product-detail-container');

// 1. Get product ID from URL parameters 
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id') || '1';

// 2. Fetch single product from API 
async function fetchProductDetails() {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product details');

        const product = await response.json();
        renderProductDetails(product);

    } catch (error) {
        console.error("Error loading product:", error);
        detailContainer.innerHTML = `<p class="error-message">Failed to load product details. Please try again later.</p>`;
    }
}

// 3. Render product details 
function renderProductDetails(product) {
    // Fixed: Calculated priceInZar so it exists before being used below!
    const priceInZar = Math.round(product.price * 18);

    // Use product images array
    const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

    detailContainer.innerHTML = `
    <div class="product-detail-grid">
      <!-- Left: Image Gallery & Arrows -->
      <div class="gallery-section">
        <button class="gallery-arrow prev-arrow" aria-label="Previous image">&#10094;</button>
        
        <div class="gallery-inner-container" style="width: 100%;">
          <div class="gallery-main-wrap">
            <img id="active-gallery-img" src="${images[0]}" alt="${product.title}" />
          </div>
          <div class="gallery-dots" id="gallery-dots">
            ${images.map((_, i) => `<span class="gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('')}
          </div>
        </div>

        <button class="gallery-arrow next-arrow" aria-label="Next image">&#10095;</button>
      </div>

      <!-- Right: Info, Size Selector & Bag Button -->
      <div class="product-info-section">
        <h1 class="prod-detail-title">${product.title}</h1>
        <p class="prod-detail-price">R${priceInZar}</p>
        <p class="prod-detail-desc">
          ${product.description}<br><br>
          <strong>Fabric:</strong> Premium blend / Hand-selected textile.<br>
          <strong>Care:</strong> Gentle cold wash or dry clean recommended.
        </p>

        <!-- Size Selection (S, M, L) -->
        <div class="size-selector-wrap">
          <span class="size-label">select size:</span>
          <div class="size-buttons" id="size-buttons">
            <button class="size-btn active" data-size="S">S</button>
            <button class="size-btn" data-size="M">M</button>
            <button class="size-btn" data-size="L">L</button>
          </div>
        </div>

        <!-- Add to Bag Button -->
        <button class="btn add-to-bag-btn" id="add-to-bag-btn">add to bag</button>
      </div>
    </div>
  `;

  // Initialize Gallery Slider Logic
  initGallerySlider(images);

  // Initialize Size Selector Logic
  initSizeSelector();

  //button- wipe 
  initButtonWipe();
}

// 4. Image gallery slider 
function initGallerySlider(images) {
    let currentIndex = 0;
    const activeImg = document.getElementById('active-gallery-img');
    const galleryWrap = document.querySelector('.gallery-main-wrap');
    const dots = document.querySelectorAll('.gallery-dot');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');

    function updateImage(index) {
        currentIndex = index;
        activeImg.style.opacity = 0;
        setTimeout(() => {
            activeImg.src = images[currentIndex];
            activeImg.style.opacity = 1;
        }, 150);

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIdx = (currentIndex + 1) % images.length;
            updateImage(newIdx);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prevIdx = (currentIndex - 1 + images.length) % images.length;
            updateImage(prevIdx);
        });
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => updateImage(idx));
    });

    //touch swipe for mobile device
    if (galleryWrap && images.length > 1) {
        let touchStartX = 0;
        let touchEndX = 0;

        galleryWrap.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        galleryWrap.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 40; // Minimum swipe distance in px

            if (touchStartX - touchEndX > swipeThreshold) {
                // Swiped Left -> Next Image
                const nextIdx = (currentIndex + 1) % images.length;
                updateImage(nextIdx);
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swiped Right -> Previous Image
                const prevIdx = (currentIndex - 1 + images.length) % images.length;
                updateImage(prevIdx);
            }
        }, { passive: true });
    }
}

// 5. Size Selection State Logic
function initSizeSelector() {
  const sizeButtons = document.querySelectorAll('.size-btn');
  let selectedSize = 'S';

  sizeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      sizeButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      selectedSize = e.target.getAttribute('data-size');
    });
  });

  // Add to Bag Button Interaction & Cart icon
  const bagBtn = document.getElementById('add-to-bag-btn');
  if (bagBtn) {
    bagBtn.addEventListener('click', () => {
      const productTitle = document.querySelector('.prod-detail-title')?.textContent || 'Piece';
      const priceText = document.querySelector('.prod-detail-price')?.textContent || 'R0';
      const priceNumeric = parseInt(priceText.replace(/[^0-9]/g, '')) || 250;
      const activeImgSrc = document.getElementById('active-gallery-img')?.src || '';

      // Construct the cart item object
      const cartItem = {
        id: productId,
        title: productTitle,
        price: priceNumeric,
        size: selectedSize,
        image: activeImgSrc
      };

      // Call global addToCart function (defined in transition.js)
      if (typeof addToCart === 'function') {
        addToCart(cartItem);
      }

      // Button feedback animation
      bagBtn.textContent = `added (${selectedSize}) ✓`;
      bagBtn.style.backgroundColor = '#333';
      setTimeout(() => {
        bagBtn.textContent = 'add to bag';
        bagBtn.style.backgroundColor = '';
      }, 2000);
    });
  }
}

//GSAP 
function initGSAPMotion() {
    if (typeof gsap === 'undefined') return;

    //line under Navigation links
    const navItemsWithUnderline = document.querySelectorAll('.shop-link, .nav-link-underline');

    navItemsWithUnderline.forEach(item => {
        const navUnderline = item.querySelector('.nav-underline');
        if(!navUnderline) return;

        item.addEventListener('mouseenter', () => {
            gsap.to(navUnderline, {
                scaleX: 1,
                duration: 0.5,
                ease: "power3.out",
                transformOrigin: "left center"
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(navUnderline, {
                scaleX: 0,
                duration: 0.4,
                ease: "power3.in",
                transformOrigin: "right center"
            });
        });
    });

    initButtonWipe();
  }

//wipe motion for buttons
function initButtonWipe() {
  if (typeof gsap === 'undefined') return;


  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    if (btn.dataset.wiped) return;
    btn.dataset.wiped = "true";
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    let wipe = btn.querySelector('.btn-wipe');
    if (!wipe) {
        wipe = document.createElement('span');
        wipe.className = 'btn-wipe';
        wipe.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--color-yellow-hover);
          z-index: -1;
          transform: scaleX(0);
          transform-origin: left center;
          border-radius: inherit;
          pointer-events: none;
        `;
        btn.prepend(wipe);
        }

        btn.addEventListener('mouseenter', () => {
            gsap.killTweensOf(wipe);
            gsap.killTweensOf(btn);

            gsap.to(wipe, {
                scaleX: 1,
                duration: 0.45,
                ease: "power3.out",
                transformOrigin: "left center"
            });
            gsap.to(btn, {
                color: "#0D0000",
                duration: 0.25,
                delay: 0.1
            })
        });

        btn.addEventListener('mouseleave', () => {

            gsap.killTweensOf(wipe);
            gsap.killTweensOf(btn);

            gsap.to(wipe, {
                scaleX: 0,
                duration: 0.45,
                ease: "power3.inOut",
                transformOrigin: "right center",
                onComplete: () => {
                    gsap.set(wipe, { transformOrigin: "left center" });
                }
            });
            gsap.to(btn, {
                color: "",
                duration: 0.25
            });
        });
    });
  }

// Initial Call on Load
document.addEventListener('DOMContentLoaded', () => {
  fetchProductDetails();
  initGSAPMotion();
});



