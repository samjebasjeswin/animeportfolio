'use client'

import { useEffect } from 'react'

export default function Home() {
    useEffect(() => {
        // Initialization functions migrated from script.js
        const initCursorGlow = () => {
            const cursorGlow = document.getElementById('cursorGlow')
            if (!cursorGlow) return
            let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0
            const onMouseMove = (e) => { mouseX = e.clientX; mouseY = e.clientY }
            document.addEventListener('mousemove', onMouseMove)
            const animate = () => {
                currentX += (mouseX - currentX) * 0.1
                currentY += (mouseY - currentY) * 0.1
                cursorGlow.style.left = currentX + 'px'
                cursorGlow.style.top = currentY + 'px'
                requestAnimationFrame(animate)
            }
            animate()
            return () => document.removeEventListener('mousemove', onMouseMove)
        }

        const initNavbar = () => {
            const navbar = document.getElementById('navbar')
            if (!navbar) return
            const onScroll = () => {
                if (window.pageYOffset > 50) navbar.classList.add('scrolled')
                else navbar.classList.remove('scrolled')
            }
            window.addEventListener('scroll', onScroll)
            return () => window.removeEventListener('scroll', onScroll)
        }

        const initMobileNav = () => {
            const navToggle = document.getElementById('navToggle')
            const navLinks = document.getElementById('navLinks')
            if (!navToggle || !navLinks) return
            const onToggle = () => {
                navToggle.classList.toggle('active')
                navLinks.classList.toggle('active')
                document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : ''
            }
            navToggle.addEventListener('click', onToggle)
            const links = navLinks.querySelectorAll('.nav-link')
            const onLinkClick = () => {
                navToggle.classList.remove('active')
                navLinks.classList.remove('active')
                document.body.style.overflow = ''
            }
            links.forEach(link => link.addEventListener('click', onLinkClick))
        }

        const initScrollReveal = () => {
            const revealElements = document.querySelectorAll(
                '.section-header, .focus-card, .about-content, .stat-card, ' +
                '.skill-category, .project-card, .timeline-item, .contact-content'
            )
            revealElements.forEach(el => el.classList.add('reveal'))
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active')
                        observer.unobserve(entry.target)
                    }
                })
            }, { threshold: 0.1 })
            revealElements.forEach(el => observer.observe(el))
        }

        const initCounterAnimation = () => {
            const counters = document.querySelectorAll('.stat-number')
            const animateCounter = (element, target) => {
                let current = 0
                const duration = 2000
                const stepTime = duration / target
                const timer = setInterval(() => {
                    current++
                    element.textContent = current
                    if (current >= target) {
                        clearInterval(timer)
                        element.textContent = target
                    }
                }, stepTime)
            }
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target
                        const target = parseInt(counter.dataset.count)
                        animateCounter(counter, target)
                        observer.unobserve(counter)
                    }
                })
            }, { threshold: 0.5 })
            counters.forEach(counter => observer.observe(counter))
        }

        const initSmoothScroll = () => {
            const anchors = document.querySelectorAll('a[href^="#"]')
            const onClick = (e) => {
                const targetId = e.currentTarget.getAttribute('href')
                if (targetId === '#') return
                e.preventDefault()
                const targetElement = document.querySelector(targetId)
                if (!targetElement) return
                const navbarHeight = document.getElementById('navbar').offsetHeight
                const targetPosition = targetElement.offsetTop - navbarHeight
                window.scrollTo({ top: targetPosition, behavior: 'smooth' })
            }
            anchors.forEach(anchor => anchor.addEventListener('click', onClick))
        }

        const initContactModal = () => {
            const contactBtns = document.querySelectorAll('.contact-trigger')
            const contactModal = document.getElementById('contactModal')
            const modalClose = document.getElementById('modalClose')
            const contactForm = document.getElementById('contactForm')
            if (!contactModal || !modalClose || !contactForm) return
            const openModal = (e) => {
                e.preventDefault()
                contactModal.classList.add('active')
                document.body.style.overflow = 'hidden'
            }
            const closeModal = () => {
                contactModal.classList.remove('active')
                document.body.style.overflow = ''
            }
            contactBtns.forEach(btn => btn.addEventListener('click', openModal))
            modalClose.addEventListener('click', closeModal)
            contactModal.addEventListener('click', (e) => { if (e.target === contactModal) closeModal() })

            const onEsc = (e) => { if (e.key === 'Escape' && contactModal.classList.contains('active')) closeModal() }
            document.addEventListener('keydown', onEsc)

            contactForm.addEventListener('submit', (e) => {
                e.preventDefault()
                const submitBtn = contactForm.querySelector('button[type="submit"]')
                const originalBtnContent = submitBtn.innerHTML
                submitBtn.disabled = true
                submitBtn.innerHTML = '<span>SENDING...</span>'
                const formDataObj = new FormData(contactForm)
                formDataObj.append('_captcha', 'false')
                fetch('https://formsubmit.co/ajax/jeswinsam287@gmail.com', {
                    method: 'POST',
                    body: formDataObj,
                    headers: { 'Accept': 'application/json' }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success === "true" || data.success === true) {
                            submitBtn.innerHTML = '<span>MESSAGE SENT!</span>'
                            submitBtn.style.background = '#00ff88'
                            setTimeout(() => {
                                contactForm.reset()
                                submitBtn.disabled = false
                                submitBtn.innerHTML = originalBtnContent
                                submitBtn.style.background = ''
                                closeModal()
                            }, 2000)
                        } else throw new Error(data.message || "Submission failed")
                    })
                    .catch(err => {
                        submitBtn.innerHTML = '<span>ERROR!</span>'
                        submitBtn.style.background = '#ff2d75'
                        alert("FORM ERROR: " + err.message)
                        setTimeout(() => {
                            submitBtn.disabled = false
                            submitBtn.innerHTML = originalBtnContent
                            submitBtn.style.background = ''
                        }, 3000)
                    })
            })
        }

        const initCertificates = () => {
            const modal = document.getElementById('certModal')
            const modalImg = document.getElementById('img01')
            const captionText = document.getElementById('caption')
            const cards = document.querySelectorAll('.cert-card')
            const closeBtn = document.querySelector('.cert-modal-close')
            if (!modal || !modalImg || !cards || !closeBtn) return
            const closeModal = () => {
                modal.style.display = "none"
                document.body.style.overflow = ''
            }
            cards.forEach(card => {
                card.addEventListener('click', () => {
                    modal.style.display = "block"
                    modalImg.src = card.getAttribute('data-full')
                    captionText.innerHTML = card.querySelector('.cert-title').textContent
                    document.body.style.overflow = 'hidden'
                })
            })
            closeBtn.addEventListener('click', closeModal)
            modal.addEventListener('click', (e) => { if (e.target === modal) closeModal() })
        }

        const initEffects = () => {
            // Magnetic & Tilt effects
            const btns = document.querySelectorAll('.btn-primary')
            btns.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect()
                    const x = (e.clientX - rect.left - rect.width / 2) * 0.1
                    const y = (e.clientY - rect.top - rect.height / 2) * 0.1
                    btn.style.transform = `translate(${x}px, ${y}px)`
                })
                btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0, 0)')
            })

            const cards = document.querySelectorAll('.project-card, .stat-card, .skill-category')
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const centerX = rect.width / 2
                    const centerY = rect.height / 2
                    const rotateX = (y - centerY) / 20
                    const rotateY = (centerX - x) / 20
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`
                })
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'
                })
            })
        }

        initCursorGlow()
        initNavbar()
        initMobileNav()
        initScrollReveal()
        initCounterAnimation()
        initSmoothScroll()
        initContactModal()
        initCertificates()
        initEffects()

    }, [])

    return (
        <>
            <div className="cursor-glow" id="cursorGlow"></div>

            {/* Navbar */}
            <nav className="navbar" id="navbar">
                <div className="nav-container">
                    <a href="#" className="nav-logo"><span className="logo-text">SAMJEBAS</span></a>
                    <ul className="nav-links" id="navLinks">
                        <li><a href="#home" className="nav-link active">Home</a></li>
                        <li><a href="#about" className="nav-link">About</a></li>
                        <li><a href="#skills" className="nav-link">Skills</a></li>
                        <li><a href="#projects" className="nav-link">Projects</a></li>
                        <li><a href="#experience" className="nav-link">Experience</a></li>
                        <li><a href="#contact" className="nav-link">Contact</a></li>
                    </ul>
                    <a href="javascript:void(0)" className="nav-cta contact-trigger">Let&apos;s Talk</a>
                    <button className="nav-toggle" id="navToggle" aria-label="Toggle menu">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero" id="home">
                <div className="hero-bg">
                    <div className="hero-orb hero-orb-1"></div>
                    <div className="hero-orb hero-orb-2"></div>
                    <div className="hero-orb hero-orb-3"></div>
                    <div className="grid-overlay"></div>
                </div>
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="badge-dot"></span>
                            <span>Available for freelance work</span>
                        </div>
                        <h1 className="hero-title">
                            <span className="title-name">SAMJEBAS JESWIN K</span>
                        </h1>
                        <p className="hero-role">WordPress & Full-stack Developer</p>
                        <p className="hero-description">
                            Crafting digital universes with <span className="highlight">Next.js</span>,
                            architecting backends with <span className="highlight">Python</span>,
                            and exploring <span className="highlight">AI & Computer Vision</span>.
                        </p>
                        <div className="hero-ctas">
                            <a href="javascript:void(0)" className="btn btn-primary contact-trigger">
                                <span>Hire Me</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                            <a href="#projects" className="btn btn-secondary"><span>View Projects</span></a>
                        </div>
                        <div className="hero-socials">
                            <a href="https://www.linkedin.com/in/samjebasjeswin-k-989b11350" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a href="javascript:void(0)" className="social-link contact-trigger" aria-label="Email">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </a>
                            <a href="tel:+918925091475" className="social-link" aria-label="Phone">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="avatar-container">
                            <div className="avatar-glow"></div>
                            <div className="avatar-ring"></div>
                            <div className="avatar-image">
                                <img src="/assets/profile.png" alt="Jeswin K - Developer Avatar" className="avatar-img" />
                            </div>
                            <div className="floating-badge badge-exp">
                                <span className="badge-number">1+</span>
                                <span className="badge-text">Years Exp</span>
                            </div>
                            <div className="floating-badge badge-projects">
                                <span className="badge-number">6+</span>
                                <span className="badge-text">Projects</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="scroll-indicator">
                    <span>Scroll to explore</span>
                    <div className="scroll-line"></div>
                </div>
            </section>

            {/* Focus Section */}
            <section className="focus-section" id="focus">
                <div className="container">
                    <div className="focus-card">
                        <div className="focus-grid">
                            <div className="focus-content">
                                <div className="focus-header">
                                    <span className="focus-label"><span className="pulse-dot"></span>Coding session</span>
                                    <span className="focus-tag">Current Focus</span>
                                </div>
                                <h2 className="focus-title">Next.js Development.</h2>
                                <p className="focus-quote">&quot;Currently deep in Next.js for my upcoming <span className="highlight">KRELSON - PIPES, FITTINGS & FLANGES platform</span>.&quot;</p>
                                <p className="focus-description">I&apos;m revolutionizing how we think about industrial B2B platforms by blending artificial intelligence with powerful full-stack architectures. Creating a seamless, high-performance e-commerce ecosystem that handles complex transactions with ease.</p>
                                <div className="focus-features">
                                    <div className="feature-item">
                                        <div className="feature-icon">AI</div>
                                        <span>Personalized Recommendations</span>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon">FS</div>
                                        <span>Next.js Full-stack E-com solution</span>
                                    </div>
                                </div>
                            </div>
                            <div className="focus-visual">
                                <div className="focus-img-container">
                                    <img src="/assets/laptop1.png" alt="Coding Session" className="focus-img" />
                                    <div className="focus-img-overlay"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section" id="about">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Samjebas</span>
                        <h2 className="section-title">THE<br /><span className="gradient-text">FULL-STACK MIND.</span></h2>
                    </div>
                    <div className="about-grid">
                        <div className="about-visual">
                            <div className="about-img-container">
                                <img src="/assets/profile.png" alt="Samjebas Profile" className="about-img" />
                                <div className="about-img-glow"></div>
                            </div>
                        </div>
                        <div className="about-content">
                            <div className="about-intro">
                                <span className="intro-label">Introduction</span>
                                <h3 className="intro-title">The<br /><span className="gradient-text">Digital Architect.</span></h3>
                                <p className="intro-subtitle">Building powerful websites with a clean design.</p>
                            </div>
                            <p className="about-text">I&apos;m a <span className="highlight">WordPress & Full-stack Developer</span> at <span className="highlight">SVR GLOBAL SOLUTIONS INDIA</span>. With a background in B.Tech CSE, I specialize in building high-performance systems and modern user experiences using Next.js.</p>
                        </div>
                        <div className="about-stats">
                            <div className="stat-card">
                                <span className="stat-label">Experience</span>
                                <div className="stat-value">
                                    <span className="stat-number" data-count="1">0</span>
                                    <span className="stat-plus">+</span>
                                </div>
                                <span className="stat-text">Year Experience</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Projects</span>
                                <div className="stat-value">
                                    <span className="stat-number" data-count="6">0</span>
                                    <span className="stat-plus">+</span>
                                </div>
                                <span className="stat-text">Deployed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section className="skills-section" id="skills">
                <div className="container">
                    <div className="section-header centered">
                        <span className="section-tag">Expertise</span>
                        <h2 className="section-title"><span className="gradient-text">Technical Stack.</span></h2>
                    </div>
                    <div className="skills-grid">
                        <div className="skill-category">
                            <h3 className="category-title">
                                <span className="category-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                </span>
                                Frontend
                            </h3>
                            <div className="skill-tags">
                                <span className="skill-tag">Next.js</span>
                                <span className="skill-tag">React.js</span>
                                <span className="skill-tag">HTML</span>
                                <span className="skill-tag">CSS</span>
                                <span className="skill-tag">Javascript</span>
                                <span className="skill-tag">TailwindCSS</span>
                            </div>
                        </div>
                        {/* Backend */}
                        <div className="skill-category">
                            <h3 className="category-title">
                                <span className="category-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
                                    </svg>
                                </span>
                                Backend
                            </h3>
                            <div className="skill-tags">
                                <span className="skill-tag">Python</span>
                                <span className="skill-tag">PHP</span>
                                <span className="skill-tag">MySQL</span>
                                <span className="skill-tag">PostgreSQL</span>
                                <span className="skill-tag">REST & GraphQL</span>
                            </div>
                        </div>
                        {/* AI & CV */}
                        <div className="skill-category">
                            <h3 className="category-title">
                                <span className="category-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    </svg>
                                </span>
                                AI & CV
                            </h3>
                            <div className="skill-tags">
                                <span className="skill-tag">OpenCV</span>
                                <span className="skill-tag">TensorFlow</span>
                                <span className="skill-tag">MediaPipe</span>
                                <span className="skill-tag">Tesseract</span>
                                <span className="skill-tag">Pandas</span>
                            </div>
                        </div>
                        {/* Tools */}
                        <div className="skill-category">
                            <h3 className="category-title">
                                <span className="category-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                    </svg>
                                </span>
                                Tools
                            </h3>
                            <div className="skill-tags">
                                <span className="skill-tag">Git</span>
                                <span className="skill-tag">GitHub</span>
                                <span className="skill-tag">VS Code</span>
                                <span className="skill-tag">Postman</span>
                                <span className="skill-tag">DevTools</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section className="projects-section" id="projects">
                <div className="container">
                    <div className="section-header centered">
                        <span className="section-tag">Showcase</span>
                        <h2 className="section-title"><span className="gradient-text">Project Highlights.</span></h2>
                    </div>
                    <div className="projects-grid">
                        <div className="project-card featured">
                            <div className="project-image">
                                <img src="/assets/pipe.png" alt="KRELSON - PIPES, FITTINGS & FLANGES" className="project-img" />
                                <div className="project-overlay"></div>
                            </div>
                            <div className="project-content">
                                <h3 className="project-title">KRELSON - PIPES, FITTINGS & FLANGES</h3>
                                <p className="project-description">A high-performance B2B platform supplying mission-critical components with precision specifications and bulk enquiry systems.</p>
                                <div className="project-tags"><span className="project-tag">Next.js</span><span className="project-tag">B2B</span><span className="project-tag">Industrial</span><span className="project-tag">E-commerce</span></div>
                                <a href="https://www.krelson.com/" target="_blank" rel="noopener noreferrer" className="project-link">Visit Project <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg></a>
                            </div>
                        </div>
                        {/* African Valve */}
                        <div className="project-card">
                            <div className="project-image">
                                <img src="/assets/african.png" alt="African Valve" className="project-img" />
                                <div className="project-overlay"></div>
                            </div>
                            <div className="project-content">
                                <h3 className="project-title">African Valve</h3>
                                <p className="project-description">Architected a high-performance industrial ecosystem. Integrated Next.js frontend with WordPress via GraphQL.</p>
                                <div className="project-tags"><span className="project-tag">Next.js</span><span className="project-tag">GraphQL</span><span className="project-tag">WordPress</span></div>
                                <a href="https://africanvalve.com" target="_blank" rel="noopener noreferrer" className="project-link">Visit Project <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg></a>
                            </div>
                        </div>
                        {/* Speciality Valve */}
                        <div className="project-card">
                            <div className="project-image">
                                <img src="/assets/specialityvalve.png" alt="Speciality Valve" className="project-img" />
                                <div className="project-overlay"></div>
                            </div>
                            <div className="project-content">
                                <h3 className="project-title">Speciality Valve</h3>
                                <p className="project-description">Engineered complex backend logic and custom UI components using PHP and CSS for a major industrial manufacturer.</p>
                                <div className="project-tags"><span className="project-tag">PHP</span><span className="project-tag">CSS</span><span className="project-tag">WordPress</span></div>
                                <a href="#" className="project-link">Visit Project <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg></a>
                            </div>
                        </div>
                        {/* UAE Valve */}
                        <div className="project-card">
                            <div className="project-image">
                                <img src="/assets/uae.png" alt="UAE Valve" className="project-img" />
                                <div className="project-overlay"></div>
                            </div>
                            <div className="project-content">
                                <h3 className="project-title">UAE Valve</h3>
                                <p className="project-description">Developed a mission-critical regional platform optimized for performance and high-ranking search visibility.</p>
                                <div className="project-tags"><span className="project-tag">WordPress</span><span className="project-tag">SEO</span><span className="project-tag">Performance</span></div>
                                <a href="#" className="project-link">Visit Project <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg></a>
                            </div>
                        </div>
                        {/* ANPR */}
                        <div className="project-card">
                            <div className="project-image">
                                <div className="project-placeholder"><span>ANPR</span></div>
                                <div className="project-overlay"></div>
                            </div>
                            <div className="project-content">
                                <h3 className="project-title">ANPR Traffic Intelligence</h3>
                                <p className="project-description">An advanced license plate recognition system utilizing Computer Vision and Tesseract for real-time data retrieval.</p>
                                <div className="project-tags"><span className="project-tag">Python</span><span className="project-tag">OpenCV</span><span className="project-tag">Tesseract</span><span className="project-tag">Pandas</span></div>
                            </div>
                        </div>
                        {/* Gesture AI */}
                        <div className="project-card">
                            <div className="project-image">
                                <div className="project-placeholder"><span>Gesture AI</span></div>
                                <div className="project-overlay"></div>
                            </div>
                            <div className="project-content">
                                <h3 className="project-title">Autonomous Signal Gesture Recognition</h3>
                                <p className="project-description">A deep learning-powered gesture recognition system for autonomous vehicle interaction using TensorFlow.</p>
                                <div className="project-tags"><span className="project-tag">TensorFlow</span><span className="project-tag">MediaPipe</span><span className="project-tag">AI</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="experience-section" id="experience">
                <div className="container">
                    <div className="section-header centered">
                        <span className="section-tag">Journey</span>
                        <h2 className="section-title"><span className="gradient-text">Experience.</span></h2>
                    </div>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-marker"><div className="marker-dot"></div><div className="marker-line"></div></div>
                            <div className="timeline-content">
                                <span className="timeline-date">OCT 2025 - PRESENT</span>
                                <h3 className="timeline-title">WordPress & Full-stack Developer</h3>
                                <span className="timeline-company">SVR GLOBAL SOLUTIONS INDIA</span>
                                <p className="timeline-description">Began as a Developer Trainee in October 2025 and transitioned to Full-time status in January 2026. Delivering full-stack solutions with Next.js, GraphQL, MySQL, and REST APIs for industrial-grade platforms.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker"><div className="marker-dot"></div><div className="marker-line"></div></div>
                            <div className="timeline-content">
                                <span className="timeline-date">JAN 2025 - MAR 2025</span>
                                <h3 className="timeline-title">Software Engineer Intern</h3>
                                <span className="timeline-company">WORKCOHOL | CHENNAI</span>
                                <p className="timeline-description">Contributed to real-world projects using Python, Django, MySQL, and React.js. Focused on creating RESTful APIs, database integration, and performance optimization within an agile team environment.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker"><div className="marker-dot"></div></div>
                            <div className="timeline-content">
                                <span className="timeline-date">JUNE 2022 - JULY 2022</span>
                                <h3 className="timeline-title">Web Development Intern</h3>
                                <span className="timeline-company">LIVE STREAM TECHNOLOGIES | COIMBATORE</span>
                                <p className="timeline-description">Gained hands-on experience in web development using HTML, CSS, Python, and MySQL. Developed responsive pages and worked on Python-based backend development, including REST APIs and user authentication.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Certificates Section */}
            <section className="certificates-section" id="certificates">
                <div className="container">
                    <div className="section-header centered">
                        <span className="section-tag">Achievements</span>
                        <h2 className="section-title"><span className="gradient-text">Certifications.</span></h2>
                    </div>
                    <div className="certificates-grid">
                        <CertCard full="/assets/certificate/workcohol.png" title="Software Engineer Internship" issuer="WORKCOHOL" />
                        <CertCard full="/assets/certificate/intern1.png" title="Web Development Internship" issuer="LIVE STREAM TECHNOLOGIES" />
                        <CertCard full="/assets/certificate/Ethical hacking.png" title="Ethical Hacking" issuer="Meithiran Learning Community" />
                        <CertCard full="/assets/certificate/cyber.png" title="Cyber Security" issuer="Coursera" />
                        <CertCard full="/assets/certificate/cloud.png" title="Cloud Computing" issuer="NPTEL" />
                        <CertCard full="/assets/certificate/busines intelligence.png" title="Business Intelligence" issuer="Tableau" />
                        <CertCard full="/assets/certificate/ieee.png" title="IEEE Conference Participation" issuer="IEEE" />
                        <CertCard full="/assets/certificate/ethical ehe.png" title="Certified Ethical Hacker" issuer="EC-Council Alternative" />
                    </div>
                </div>
            </section>

            {/* Certificate Image Modal */}
            <div id="certModal" className="cert-modal">
                <span className="cert-modal-close">&times;</span>
                <img className="cert-modal-content" id="img01" alt="Certificate Preview" />
                <div id="caption"></div>
            </div>

            {/* Contact Section */}
            <section className="contact-section" id="contact">
                <div className="container">
                    <div className="contact-wrapper">
                        <div className="contact-content">
                            <span className="section-tag">Connect</span>
                            <h2 className="contact-title">Start a <span className="gradient-text">Project.</span></h2>
                            <p className="contact-subtitle">Let&apos;s build something that shakes the industry.</p>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <span className="contact-label">Email</span>
                                    <a href="mailto:jeswinsam287@gmail.com" className="contact-value">jeswinsam287@gmail.com</a>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-label">Phone</span>
                                    <a href="tel:+918925091475" className="contact-value">+91 8925091475</a>
                                </div>
                            </div>
                            <a href="javascript:void(0)" className="btn btn-primary btn-large contactBtn contact-trigger" id="contactBtn">
                                <span>CONTACT ME NOW</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Modal */}
            <div className="modal-overlay" id="contactModal">
                <div className="modal-container">
                    <button className="modal-close" id="modalClose" aria-label="Close modal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">LET&apos;S TALK.</h2>
                            <p className="modal-subtitle">Tell me about your vision.</p>
                        </div>
                        <form className="contact-form" id="contactForm">
                            <div className="form-group"><label htmlFor="name">Name</label><input type="text" id="name" name="name" placeholder="Enter your name" required /></div>
                            <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" name="email" placeholder="Enter your email" required /></div>
                            <div className="form-group"><label htmlFor="message">Message</label><textarea id="message" name="message" rows="4" placeholder="Tell me about your project..." required></textarea></div>
                            <button type="submit" className="btn btn-primary btn-full">
                                <span>SUBMIT</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <p className="footer-text">© 2026 <span className="highlight">SAMJEBAS</span>. Engineered with Passion.</p>
                        <div className="footer-socials">
                            <a href="https://github.com/samjebas" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            </a>
                            <a href="https://www.linkedin.com/in/samjebasjeswin-k-989b11350" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

function CertCard({ full, title, issuer }) {
    return (
        <div className="cert-card" data-full={full}>
            <div className="cert-image">
                <img src={full} alt={title} />
                <div className="cert-overlay">
                    <span className="cert-view-btn">View Certificate</span>
                </div>
            </div>
            <div className="cert-info">
                <h4 className="cert-title">{title}</h4>
                <p className="cert-issuer">{issuer}</p>
            </div>
        </div>
    )
}
