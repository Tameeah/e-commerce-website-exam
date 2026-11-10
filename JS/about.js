document.addEventListener('DOMContentLoaded', () => {
    //gloabl navigation 
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchInput = document.getElementById('global-search-input');

    if(searchToggleBtn && searchInput) {
        searchToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchInput.classList.toggle('active');
            if(searchInput.classList.contains('active')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
            }
        });

        document.addEventListener('click', (e) => {
            if(!e.target.closest('.search-container')) {
                searchInput.classList.remove('active');
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }


//GSAP for About Page 
    if (typeof gsap !== 'undefined') {

        //section 1 
        gsap.from(".sec1-left", {
            duration: 1,
            x: -60,
            opacity: 0,
            ease: "power2.out"
        });

        gsap.from(".sec1-right", {
            duration: 1,
            x: 60,
            opacity: 0,
            ease: "power2.out",
            delay: 0.2
        });

        //section 2
        gsap.from(".about-section-2", {
            duration: 1.2,
            scale: 0.95,
            opacity: 0,
            ease: "power2.out",
            delay: 0.4
        });

        //section 3
        gsap.from(".collage-img", {
            duration: 0.8,
            y: 40,
            opacity: 0,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".about-section-3",
                start: "top 80%"
            }
        });

        gsap.from(".story-row", {
            duration: 0.9,
            x: 50,
            opacity: 0,
            stagger: 0.2,
            ease: "power2.out"
        });
    }
});