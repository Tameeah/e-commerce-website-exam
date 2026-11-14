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

    //initialize GSAP motion system
    initGSAPMotion();

    if (featuredGrid) {
        loadFeaturedProducts()
    }
});

//GSAP
function initGSAPMotion() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    //Cursor driven movement
    const heroSection = document.querySelector('.hero-section');
    const heroBow = document.querySelector('.hero-bow');

    if (heroSection && heroBow) {
        const xTo = gsap.quickTo(heroBow, "x", { duration: 0.7, ease: "power3.out" });
        const yTo = gsap.quickTo(heroBow, "y", { duration: 0.7, ease: "power3.out" });
        const rotateTo = gsap.quickTo(heroBow, "rotation", { duration: 0.8, ease: "power3.out" });

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const normX = (e.clientX - rect.left) / rect.width - 0.5;
            const normY = (e.clientY - rect.top) / rect.height - 0.5;

            xTo(normX * 60);
            yTo(normY * 50);
            rotateTo(normX * 16);
        });

        heroSection.addEventListener('mouseleave', () => {
            xTo(0);
            yTo(0);
            rotateTo(0);
        });

    }

    //scroll trigger motion - pendulum swing effect 
    const allHeadings = document.querySelectorAll('.hero-title, .section-heading, .intro-heading');

    allHeadings.forEach((heading) => {
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
            duration: 1,
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
    if (featuredGrid) {
        featuredGrid.addEventListener('mouseenter', (e) => {
            const card = e.target.closest('.product-card');
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

        featuredGrid.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.product-card');
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
                    color: "#FFFFFF", 
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

    //wipe motion for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
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

            const splitTitleHtml = item.title.split(' ').map(word => {
                const chars = [...word].map(char => `<span class="title-char" style="display:inline-block;">${char}</span>`).join('');
                return `<span style="display:inline-block; white-space:nowrap; margin-right: 0.25em;">${chars}</span>`;
            }).join('');

            return `
                <article class="product-card" onclick="window.location.href='product.html?id=${item.id}'" style="cursor: pointer;">
                    <div class="product-image-wrap">
                        <img src="${item.thumbnail}" alt="${item.title}" class="product-image">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title" style="position: relative; display: inline-block;">
                            ${splitTitleHtml}
                            <span class ="product-underline"></span>
                        </h3>
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

