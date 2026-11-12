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

    //GSAP start
    if (typeof gsap !== 'undefined') {
        gsap.from(".contact-heading", {
            duration: 1,
            x: -40,
            opacity: 0,
            ease: "power2.out"
        });

        gsap.from(".contact-links-item", {
            duration: 0.8,
            x: -30,
            opacitiy: 0,
            stagger: 0.15,
            ease: "power2.out",
            delay: 0.2
        });

        gsap.from("gallery-scroll-img", {
            duration: 1,
            y: 40,
            opacity: 0,
            stagger: 0.2,
            ease: "power2.out",
            delay: 0.3
        });
    }
});