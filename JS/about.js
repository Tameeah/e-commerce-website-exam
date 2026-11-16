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
    initGSAPMotion();
});

//GSAP for About Page 
function initGSAPMotion() {
    if (typeof gsap === 'undefined')return;
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    //scroll trigger motion - pendulum swing effect 
    const allHeadings = document.querySelectorAll('.brand-title, .owner-subtitle, .hero-brand-word, .backstory-main-heading');

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
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });

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

    // Cascade animation for images in intro section
    //section 1 images
    const sec1Images = document.querySelectorAll('.about-section-1 img'); 
    if (sec1Images.length > 0) {
        gsap.from(sec1Images, {
            scrollTrigger: {
                trigger: ".about-section-1",
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 60,
            scale: 0.9,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    //section 3 images
    const sec3CollageImages = document.querySelectorAll('.collage-container img');
    if (sec3CollageImages.length > 0) {
        gsap.from(sec3CollageImages, {
            scrollTrigger: {
                trigger: ".about-section-3",
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            stagger: 0.15,
            duration: 1,
            ease: "power2.out"
        });
    }

    const storyRows = document.querySelectorAll('.story-row');
    if (storyRows.length > 0) {
        gsap.from(storyRows, {
            scrollTrigger: {
                trigger: ".about-section-3",
                start: "top 70%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            x: 60,
            stagger: 0.2,
            duration: 1.1,
            ease: "power2.out"
        });
    }

    //section 2 - fade in 
    const section2 = document.querySelector('.about-section-2');
    if(section2) {
        gsap.from(section2, {
            scrollTrigger: {
                trigger: section2,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            scale: 0.95,
            duration: 1.3,
            ease: "power2.out"
        });
    }

    //fade-in effect for P tags
    const allParagraphs = document.querySelectorAll('p');
    if (allParagraphs.length > 0) {
        allParagraphs.forEach(el => {
            gsap.from(el, {
                opacity: 0,
                y: 30,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }
 }