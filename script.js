/* ============================================
   ANIMATIONS & PARTICLES
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initCursorGlow();
    initNavbar();
    initMobileNav();
    initScrollReveal();
    initCounterAnimation();
    initSmoothScroll();
    initActiveNavLink();
    initContactModal();
    initCertificates();
});

// ============================================
// CONTACT MODAL LOGIC
// ============================================
function initContactModal() {
    const contactBtns = document.querySelectorAll('.contact-trigger');
    const contactModal = document.getElementById('contactModal');
    const modalClose = document.getElementById('modalClose');
    const contactForm = document.getElementById('contactForm');

    if (contactBtns.length === 0 || !contactModal || !modalClose || !contactForm) return;

    // Open modal
    contactBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    const closeModal = () => {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);

    // Close on outside click
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Show success state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnContent = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>SENDING...</span>';

        // SEND TO FORMSUBMIT (Direct to jeswinsam287@gmail.com)
        const formDataObj = new FormData(contactForm);
        formDataObj.append('_captcha', 'false'); // Disable captcha for AJAX

        fetch('https://formsubmit.co/ajax/jeswinsam287@gmail.com', {
            method: 'POST',
            body: formDataObj,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(data => {
                // FormSubmit returns {success: "true", message: "..."}
                if (data.success === "true" || data.success === true) {
                    submitBtn.innerHTML = '<span>MESSAGE SENT!</span>';
                    submitBtn.style.background = '#00ff88';
                    submitBtn.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.4)';

                    // Reset form and close modal after delay
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnContent;
                        submitBtn.style.background = '';
                        submitBtn.style.boxShadow = '';
                        closeModal();
                    }, 2000);
                } else {
                    // Throw the actual message from FormSubmit (e.g. "Check your email to activate")
                    throw new Error(data.message || "Submission failed");
                }
            })
            .catch(error => {
                submitBtn.innerHTML = '<span>ERROR!</span>';
                submitBtn.style.background = '#ff2d75';
                console.error('Submission Error:', error);

                // Show the EXACT error message to the user
                alert("FORM ERROR: " + error.message);

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.style.background = '';
                }, 3000);
            });
    });
}

// ============================================
// CERTIFICATES MODAL
// ============================================
function initCertificates() {
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('img01');
    const captionText = document.getElementById('caption');
    const cards = document.querySelectorAll('.cert-card');
    const closeBtn = document.querySelector('.cert-modal-close');

    if (!modal || !modalImg || !cards || !closeBtn) return;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const fullImgPath = card.getAttribute('data-full');
            const title = card.querySelector('.cert-title').textContent;

            modal.style.display = "block";
            modalImg.src = fullImgPath;
            captionText.innerHTML = title;
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === "block") {
            closeModal();
        }
    });
}

// ============================================
// CURSOR GLOW EFFECT
// ============================================
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');

    if (!cursorGlow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Smooth follow effect
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        cursorGlow.style.left = currentX + 'px';
        cursorGlow.style.top = currentY + 'px';

        requestAnimationFrame(animate);
    }

    animate();
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');

    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// MOBILE NAVIGATION
// ============================================
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .focus-card, .about-content, .stat-card, ' +
        '.skill-category, .project-card, .timeline-item, .contact-content'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const stepTime = duration / target;

    const timer = setInterval(() => {
        current++;
        element.textContent = current;

        if (current >= target) {
            clearInterval(timer);
            element.textContent = target;
        }
    }, stepTime);
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ============================================
// ACTIVE NAV LINK
// ============================================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const navbarHeight = document.getElementById('navbar').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop &&
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// PARALLAX EFFECT FOR ORBS
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.hero-orb');

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.1;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ============================================
// TYPING EFFECT (Optional enhancement)
// ============================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ============================================
// TILT EFFECT FOR CARDS
// ============================================
document.querySelectorAll('.project-card, .stat-card, .skill-category').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

console.log('✨ SAMJEBAS Portfolio Loaded Successfully');
