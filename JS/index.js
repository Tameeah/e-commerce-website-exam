//reference the product container in HTML 
const featuredGrid = document.getElementById('featured-products-grid');

//API Endpoint for clothing items from DUmmyJSON 
const API_URL = "https://dummyjson.com/products/category/womens-dresses";

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

        //Take the first 4 products for the featured section
        const featuredItems = data.products.slice(0,4);

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

// call the function on the page load
document.addEventListener('DOMContentLoaded', loadFeaturedProducts);