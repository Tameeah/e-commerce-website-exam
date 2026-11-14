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

//cursor dashed line
document.addEventListener('DOMContentLoaded', () => {
    let lastX = 0;
    let lastY = 0;
    const distanceThreshold = 30;

    window.addEventListener('mousemove', (e) => {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if(distance > distanceThreshold) {

            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            lastX = e.clientX;
            lastY = e.clientY;

            const dash = document.createElement('div');
            dash.className = 'cursor-dash';
            dash.style.left = `${e.clientX}px`;
            dash.style.top = `${e.clientY}px`;
            dash.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            document.body.appendChild(dash);

            gsap.to(dash, {
                scale: 0.5,
                opacity: 0,
                duration: 0.6,
                ease: "power1.out",
                onComplete: () => {
                    dash.remove();
                }
            });
        }
    });
});