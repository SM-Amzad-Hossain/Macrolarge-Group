document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Slow down hero video
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.playbackRate = 0.5;
    }

    // Sticky Header
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(event.target) && !hamburger.contains(event.target)) {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        }
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's the stats container, trigger the number counter
                if (entry.target.id === 'stats-container') {
                    animateNumbers();
                    observer.unobserve(entry.target); // Only animate once
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right, #stats-container').forEach(el => {
        observer.observe(el);
    });

    // Number Counter Animation
    function animateNumbers() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // The lower the slower

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                
                // Lower inc to slow and higher to fast
                const inc = target / speed;

                if (count < target) {
                    // Add inc to count and output in counter
                    counter.innerText = Math.ceil(count + inc);
                    // Call function every ms
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation check
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value;

        if(firstName && lastName && phone && email && service && message) {
            // Simulate sending data
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                formMessage.textContent = "Thank you! Your enquiry has been sent successfully. We will be in touch shortly.";
                formMessage.className = "form-message success";
                contactForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }, 1500);
        }
        });
    }

    // Testimonial Carousel Autoplay & Clockwise Pagination
    const testimonialGrid = document.querySelector('.testimonial-grid');
    const paginationContainer = document.querySelector('.carousel-pagination');

    if (testimonialGrid && paginationContainer) {
        const cards = testimonialGrid.querySelectorAll('.testimonial-card');
        const slideDuration = 4000; // 4 seconds per slide
        let activeIndex = 0;
        let startTime = null;
        let paused = false;
        let lastTimestamp = performance.now();

        // Create dots
        cards.forEach((card, index) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                activeIndex = index;
                const scrollTarget = card.offsetLeft - testimonialGrid.offsetLeft;
                testimonialGrid.scrollTo({ left: scrollTarget, behavior: 'smooth' });
                resetAnimation();
            });
            
            paginationContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.carousel-dot');

        const updateDots = () => {
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                    dot.style.removeProperty('--fill');
                }
            });
        };

        const resetAnimation = () => {
            startTime = null;
            updateDots();
        };

        const animatePagination = (timestamp) => {
            if (!startTime) startTime = timestamp;
            
            if (!paused) {
                const elapsed = timestamp - startTime;

                if (elapsed >= slideDuration) {
                    activeIndex = (activeIndex + 1) % cards.length;
                    const scrollTarget = cards[activeIndex].offsetLeft - testimonialGrid.offsetLeft;
                    testimonialGrid.scrollTo({ left: scrollTarget, behavior: 'smooth' });
                    resetAnimation();
                }
            } else if (startTime) {
                // Shift start time while paused to prevent jumping when unpaused
                startTime += (timestamp - lastTimestamp);
            }
            
            lastTimestamp = timestamp;
            requestAnimationFrame(animatePagination);
        };

        const startAutoplay = () => paused = false;
        const stopAutoplay = () => paused = true;

        requestAnimationFrame(animatePagination);

        testimonialGrid.addEventListener('mouseenter', stopAutoplay);
        testimonialGrid.addEventListener('mouseleave', startAutoplay);
        testimonialGrid.addEventListener('touchstart', stopAutoplay);
        testimonialGrid.addEventListener('touchend', startAutoplay);

        // Sync active dot if user manually scrolls
        testimonialGrid.addEventListener('scroll', () => {
            const scrollCenter = testimonialGrid.scrollLeft + (testimonialGrid.clientWidth / 2);
            let closestIndex = 0;
            let minDistance = Infinity;

            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft - testimonialGrid.offsetLeft + (card.clientWidth / 2);
                const distance = Math.abs(cardCenter - scrollCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            if (closestIndex !== activeIndex && !paused) {
                activeIndex = closestIndex;
                resetAnimation();
            }
        });
    }
});
