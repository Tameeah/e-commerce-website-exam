// transition.js - Handles page-load opening and click-to-exit curtain animations
document.addEventListener('DOMContentLoaded', () => {
    // 1. PAGE LOAD: Open the curtains revealing the page
    const loadTl = gsap.timeline();
    loadTl.to(".curtain-left", { xPercent: -100, duration: 1, ease: "power3.inOut" }, 0)
          .to(".curtain-right", { xPercent: 100, duration: 1, ease: "power3.inOut" }, 0)
          .from(".content", { scale: 0.5, opacity: 0, ease: "back.out(1.7)" }, 0.5);

    // 2. PAGE NAVIGATION: Close curtains when clicking internal links
    const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"])');

    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const destination = link.getAttribute('href');
            
            if (!destination || destination.startsWith('#') || destination.startsWith('javascript')) return;

            e.preventDefault();

            const exitTl = gsap.timeline({
                onComplete: () => {
                    window.location.href = destination;
                }
            });

            exitTl.to(".curtain-left", { xPercent: 0, duration: 0.8, ease: "power3.inOut" }, 0)
                  .to(".curtain-right", { xPercent: 0, duration: 0.8, ease: "power3.inOut" }, 0);
        });
    });
});