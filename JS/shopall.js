//DOM Elements
const productsGrid = document.getElementById('shop-products-grid');
const categoryTabs = document.querySelectorAll('.cat-tab');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');
const searchToggleBtn = document.getElementById('search-toggle-btn');
const filterToggleBtn = document.getElementById('filter-toggle-btn');
const filterDropdownMenu = document.getElementById('filter-dropdown-menu');
const filterOptions = document.querySelectorAll('.filter-option');

let currentProducts = []; // fetch products for filtering 

//Dummy JSON category endpoints
const categoryEndpoints = {
  all: "https://dummyjson.com/products/category/womens-dresses",
  tops: "https://dummyjson.com/products/category/tops",
  skirts: "https://dummyjson.com/products/category/womens-dresses", 
  dresses: "https://dummyjson.com/products/category/womens-dresses"
};


//1. fecth products by category
async function fetchProducts(category = 'all') {
  productsGrid.innerHTML = `<div class="loading-state">Loading Pieces...</div>`;

  const endpoint = categoryEndpoints[category] || categoryEndpoints.all;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to fecth products");

    const data = await response.json();
    currentProducts = data.products || [];

    renderProducts(currentProducts);
  } catch (error) {
    console.error("Error loading shop data:", error);
    productsGrid.innerHTML = `<p class="error-msg">Unable to load right now. Please check your network.</p>`;
  }
}

//2. Render the producs to the grid
function renderProducts(productsToRender) {
  if(!productsGrid) return;
  if(productsToRender.length === 0){
    productsGrid.innerHTML = `<p class="empty-msg">No pieces found matching your criteria.</p>`;
    return;
  }

  productsGrid.innerHTML = productsToRender.map(item => {
    const priceInZar = Math.round(item.price * 18);

    const titleCharsHtml = [...item.title].map(char => `<span class="title-char">${char === ' ' ? '&nbsp;' : char}</span>`).join('');

    return `
      <article class="shop-product-card" onclick="window.location.href='product.html?id=${item.id}'" style="cursor: pointer;">
        <div class="shop-img-wrap">
          <img src="${item.thumbnail}" alt="${item.title}" loading="lazy" />
        </div>
        <div class="shop-card-info">
        <div class="shop-title-wrap">
            <h3 class="shop-item-title">${titleCharsHtml}</h3>
            <span class="product-underline"></span>
          </div>
          <p class="shop-item-price">R${priceInZar}</p>
        </div>
      </article>
    `;
  }).join('');
}

// Helper function for search filtering
function filterProductsBySearch(query) {
  const searchTerm = query.toLowerCase();
  const filtered = currentProducts.filter(item => 
    item.title.toLowerCase().includes(searchTerm)
  );
  renderProducts(filtered);
}

// 3. Category Tab 
categoryTabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    categoryTabs.forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');

    const selectedCategory = e.target.getAttribute('data-category');
    fetchProducts(selectedCategory);
  });
});

//4. filter
if (filterToggleBtn && filterDropdownMenu) {
  filterToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    filterDropdownMenu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-dropdown-container')) {
      filterDropdownMenu.classList.remove('active');
    }
  });

  filterOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      const sortValue = e.target.getAttribute('data-sort');
      sortSelect.value = sortValue;
      filterDropdownMenu.classList.remove('active');

      // Trigger sorting logic
      let sortedArray = [...currentProducts];
      if (sortValue === 'low-high') {
        sortedArray.sort((a, b) => (a.price * 18) - (b.price * 18));
      } else if (sortValue === 'high-low') {
        sortedArray.sort((a, b) => (b.price * 18) - (a.price * 18));
      }
      renderProducts(sortedArray);
    });
  });
}

// 5. Global Navigation & Search Bar Interactions on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  // Initial fetch for shop page products
  fetchProducts('all');
  initGooeyCategoryBlob();

  // Search bar Toggle & Navigation Logic (Matching index.js)
  if (searchToggleBtn && searchInput) {
    searchToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      searchInput.classList.toggle('active');
      if (searchInput.classList.contains('active')) {
        searchInput.focus();
      } else {
        searchInput.value = '';
        renderProducts(currentProducts); // Reset grid when closed
      }
    });

    // Close search input when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        searchInput.classList.remove('active');
      }
    });

    // Trigger search on enter key or live input
    searchInput.addEventListener('input', (e) => {
      filterProductsBySearch(e.target.value);
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          filterProductsBySearch(query);
        }
      }
    });
  }

  //initialize GSAP motion system
    initGSAPMotion();
});

//gooey blob for category abrs
function initGooeyCategoryBlob() {
  const controlsBar = document.querySelector('.shop-controls-bar');
  if(!controlsBar) return;

  const tabs = controlsBar.querySelectorAll('.cat-tab');
  if(tabs.length === 0) return;

  let blob = controlsBar.querySelector('.blob');
  if(!blob) {
    blob = document.createElement('div');
    blob.className = 'blob';
    controlsBar.appendChild(blob);
  }

  function moveBlob(target) {
    const barRect = controlsBar.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const relativeLeft = targetRect.left - barRect.left;

    gsap.to(blob, {
      left: relativeLeft,
      width: targetRect.width,
      duration: 0.4,
      ease: "power2.out"
    });
  }

  const activeTab = controlsBar.querySelector('.cat-tab.active') || tabs[0];

  requestAnimationFrame(() => {
    const initialRect = activeTab.getBoundingClientRect();
    gsap.set(blob, {
      left: initialRect.left - barRect.left,
      width: initialRect.width
    });
  });

  tabs.forEach(tab => {
    tab.addEventListener('mouseenter', () => {
        moveBlob(tab);
    });
  });

  controlsBar.addEventListener('mouseleave', () => {
    const currentActive = controlsBar.querySelector('.cat-tab.active') || tabs[0];
     moveBlob(currentActive);
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      moveBlob(tab);
    });
  });
}

//GSAP 
function initGSAPMotion() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  //scroll trigger motion - pendulum swing effect 
    const allHeadings = document.querySelectorAll('.page-main-heading, .section-heading');

    allHeadings.forEach((heading) => {
      if (heading.dataset.animated) return;
      heading.dataset.animated = "true";

        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const textNodes = [];
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

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
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
                trigger: heading,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    //hover product animations
    if (productsGrid) {
        productsGrid.addEventListener('mouseenter', (e) => {
            const card = e.target.closest('.shop-product-card');
            if (!card) return;

            const underline = card.querySelector('.product-underline');
            const titleChars = card.querySelectorAll('.title-char');

            if (underline) {
                gsap.killTweensOf(underline);
                gsap.to(underline, {
                    scaleX: 1,
                    duration: 0.5,
                    ease: "power3.out",
                    transformOrigin: "left center"
                });
            }

            if (titleChars.length > 0) {
                gsap.to(titleChars, {
                    y: -2,
                    duration: 0.3,
                    stagger: 0.015,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        }, true);

        productsGrid.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.shop-product-card');
            if (!card) return;

            const underline = card.querySelector('.product-underline');
            const titleChars = card.querySelectorAll('.title-char');

            if (underline) {
                gsap.killTweensOf(underline);
                gsap.to(underline, {
                    scaleX: 0,
                    duration: 0.4,
                    ease: "power3.in",
                    transformOrigin: "right center"
                });
            }

            if (titleChars.length > 0) {
                gsap.to(titleChars, {
                   y: 0, 
                    duration: 0.3,
                    stagger: 0.01,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        }, true);
    }

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
}





