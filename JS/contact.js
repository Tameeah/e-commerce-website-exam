document.addEventListener('DOMContentLoaded', () => {
    // 1. Global Navigation & Search Bar Interaction (Shared across all pages)
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchInput = document.getElementById('global-search-input');

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

        // Close search bar when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchInput.classList.remove('active');
            }
        });

        // Trigger search redirection on Enter key press
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
    
    initGSAPMotion();
});

//GSAP start
function initGSAPMotion() {
    if (typeof gsap === 'undefined') return;

    if(typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    //scroll trigger motion - pendulum swing effect 
    const allHeadings = document.querySelectorAll('.contact-heading');

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
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    //fade-in effect for social media links
    const contactLinks = document.querySelectorAll('.contact-link-item');
    if (contactLinks.length > 0) {
        gsap.from(contactLinks, {
            scrollTrigger: {
                trigger: ".contact-left-col",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            duration: 1,
            y: 30,
            opacity: 0,
            ease: "power2.out"
        });
    }
    
    // Cascade animation for images in intro section
    const galleryImages = document.querySelectorAll('.gallery-scroll-img'); 
    if (galleryImages.length > 0) {
        gsap.from(galleryImages, {
            scrollTrigger: {
                trigger: ".contact-right-scroll-col",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            duration: 1.2,
            y: 60,
            opacity: 0,
            stagger: 0.2,
            ease: "power3.out"
        });
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

