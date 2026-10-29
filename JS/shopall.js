//DOM Elements
const productsGrid = document.getElementById('shop-products-grid');
const categoryTabs = document.querySelectorAll('.cat-tab');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');
const searchToggleBtn = document.getElementById('search-toggle-btn');

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
      <article class="shop-product-card">
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
sortSelect.addEventListener('change',(e) => {
  let sortedArray = [...currentProducts];
  const sortValue = e.target.value;

  if(sortValue === 'low-high') {
    sortedArray.sort((a,b) => (a.price * 18) - (b.price * 18));
  } else if (sortValue === 'high-low') {
    sortedArray.sort((a, b) => (b.price * 18) - (a.price * 18));
  }

  renderProducts(sortedArray);
});

//5. search bar

let searchOpen = false;
searchToggleBtn.addEventListener('click', () =>{
  searchOpen = !searchOpen;
  if (searchOpen) {
    gsap.to(searchInput, { width: "200px", opacity: 1, duration: 0.3, ease: "power2.out" });
    searchInput.focus();
  } else {
    gsap.to(searchInput, { width: "0px", opacity: 0, duration: 0.3, ease: "power2.in" });
  }
});

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = currentProducts.filter(item => 
    item.title.toLowerCase().includes(searchTerm)
  );
  renderProducts(filtered);
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts('all');
});



