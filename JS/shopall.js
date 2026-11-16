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
  if(productsToRender.length === 0){
    productsGrid.innerHTML = `<p class="empty-msg">No pieces found matching your criteria.</p>`;
    return;
  }

  productsGrid.innerHTML = productsToRender.map(item => {
    const priceInZar = Math.round(item.price * 18);

    return `
      <article class="shop-product-card" onclick="window.location.href='product.html?id=${item.id}'" style="cursor: pointer;">
        <div class="shop-img-wrap">
          <img src="${item.thumbnail}" alt="${item.title}" loading="lazy" />
        </div>
        <div class="shop-card-info">
          <h3 class="shop-item-title">${item.title}</h3>
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
});





