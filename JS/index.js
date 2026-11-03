//reference the product container in HTML 
const featuredGrid = document.getElementById('featured-products-grid');

//API Endpoint for clothing items from DUmmyJSON 
const API_URL = "https://dummyjson.com/products/category/womens-dresses?limit=12";

//Global Nav bar interactions 
document.addEventListener('DOMContentLoaded', () => {
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchInput = document.getElementById('global-search-input');

    //Search bar Toogle
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

        //close search input
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchInput.classList.remove('active');
            }
        });

        //trigger search on enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    if (featuredGrid) {
        loadFeaturedProducts();
    }
});

//function to fetch and display products
async function loadFeaturedProducts() {
    // 1. Loading State 
    featuredGrid.innerHTML = `
        <div class="skeleton-card">Loading Piece...</div>
        <div class="skeleton-card">Loading Piece...</div>
        <div class="skeleton-card">Loading Piece...</div>
        <div class="skeleton-card">Loading Piece...</div>
    `;

    try {
        const response = await fetch(API_URL);

        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        //Take the first 8 products for the featured section
        const featuredItems = data.products.slice(0,10);

        //2. Empty STate
        if (featuredItems.length === 0) {
            featuredGrid.innerHTML = `<p>No featured products available at the moment.</p>`;
            return;
        }

        //3. Success State - Display the products
        featuredGrid.innerHTML = featuredItems.map(item => {
            // price formatting 
            const priceInZar = Math.round(item.price * 18);

            return `
                <article class="product-card">
                    <div class="product-image-wrap">
                        <img src="${item.thumbnail}" alt="${item.title}" class="product-image">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${item.title}</h3>
                        <p class="product-price">R${priceInZar}</p>
                    </div>
                </article>
            `;
        }).join('');

        //pagination dots based on scroll position
        setupScrollPagination();

        } catch (error) {
            //4. Error State - Display an error message
            console.error("API Fetch Error:", error);
            featuredGrid.innerHTML = `
                <div class="error-message">
                    <p>Sorry, we couldn't load the featured products at this time. Please try again later.</p>
                </div>
            `; 
        }     
    }

//function to update scroll pagniation dots
function setupScrollPagination() {
    const scrollWrapper = document.getElementById('featured-scroll-wrapper');
    const dotsContainer = document.getElementById('pagination-dots');

    if (!scrollWrapper || !dotsContainer) return;

    const cards = scrollWrapper.querySelectorAll('.product-card');
    if(cards.length === 0) return; 

    const totalDots = Math.min(cards.length,4);
    dotsContainer.innerHTML = ''

    for (let i=0; i < totalDots; i++) {
        const dot = document.createElement('span');
        dot.className = `dot ${i === 0 ? `active` : ''}`;
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.dot');

    scrollWrapper.addEventListener('scroll', () => {
        const scrollPercentage = scrollWrapper.scrollLeft / (scrollWrapper.scrollWidth - scrollWrapper.clientWidth);
        const activeIndex = Math.min(Math.floor(scrollPercentage * totalDots), totalDots - 1);

        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                    dot.classList.add('active');
            } else {
                 dot.classList.remove('active');
            }
        });
    });        
}

