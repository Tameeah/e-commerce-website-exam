const detailContainer = document.getElementById('product-detail-container');

//1. get product ID from URL parameters 
const urlParms = new URLSearchParams(window.location.search);
const productId = urlParms.get('id') || '1';

//2. fetch single product from API 
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

//3. render product details 
function renderProductDetails(product) {

    //use product images array
    const images = product.images && product.images.length> 0? product.images: [product.thumbnail];

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
        <button class="add-to-bag-btn" id="add-to-bag-btn">add to bag</button>
      </div>
    </div>
  `;
  // Initialize Gallery Slider Logic
  initGallerySlider(images);

  // Initialize Size Selector Logic
  initSizeSelector();
}

//4. image gallery slider 
function initGallerySlider(images) {
    let currentIndex = 0;
    const activeImg = document.getElementById('active-gallery-img');
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

    nextBtn.addEventListener('click', () => {
        const newIdx = (currentIndex + 1) % images.length;
        updateImage(nextIdx);
    });

    prevBtn.addEventListener('click', () => {
        const prevIdx = (currentIndex - 1 + images.length) % images.length;
        updateImage(prevIdx);
    });

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => updateImage(idx));
    });
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

  // Add to Bag Button Interaction
  const bagBtn = document.getElementById('add-to-bag-btn');
  bagBtn.addEventListener('click', () => {
    bagBtn.textContent = `added (${selectedSize}) ✓`;
    bagBtn.style.backgroundColor = '#333';
    setTimeout(() => {
      bagBtn.textContent = 'add to bag';
      bagBtn.style.backgroundColor = '';
    }, 2000);
  });
}

// Initial Call on Load
document.addEventListener('DOMContentLoaded', fetchProductDetails);



