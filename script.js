/* ============================================
   SCRIPT.JS — Portfolio Logic
   Achintya K J · AI/ML Engineer & Security Researcher
   ============================================ */

(function () {
    'use strict';

    // ============================================
    // 1. PRELOADER
    // ============================================
    const Preloader = {
        el: document.getElementById('preloader'),
        lines: [
            document.getElementById('preloaderLine1'),
            document.getElementById('preloaderLine2'),
            document.getElementById('preloaderLine3'),
        ],

        init() {
            if (sessionStorage.getItem('portfolio_loaded')) {
                this.el.remove();
                document.body.style.overflow = '';
                return;
            }

            document.body.style.overflow = 'hidden';
            this.runSequence();
        },

        runSequence() {
            const delays = [200, 700, 1200];

            this.lines.forEach((line, i) => {
                setTimeout(() => {
                    line.classList.add('show');
                }, delays[i]);
            });

            setTimeout(() => {
                this.el.classList.add('fade-out');
                document.body.style.overflow = '';
                sessionStorage.setItem('portfolio_loaded', 'true');

                setTimeout(() => {
                    this.el.remove();
                }, 600);
            }, 1800);
        },
    };

    // ============================================
    // 2. CUSTOM CURSOR
    // ============================================
    const CustomCursor = {
        dot: document.getElementById('cursorDot'),
        ring: document.getElementById('cursorRing'),
        mouseX: 0,
        mouseY: 0,
        ringX: 0,
        ringY: 0,

        init() {
            if (window.matchMedia('(max-width: 768px)').matches) return;
            if ('ontouchstart' in window) return;

            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.dot.style.left = e.clientX + 'px';
                this.dot.style.top = e.clientY + 'px';
            });

            this.animateRing();

            // Enlarge on interactive elements
            const interactiveEls = document.querySelectorAll('a, button, .skill-card, .project-card, .contact-card, .filter-btn, .btn');
            interactiveEls.forEach((el) => {
                el.addEventListener('mouseenter', () => this.ring.classList.add('hover'));
                el.addEventListener('mouseleave', () => this.ring.classList.remove('hover'));
            });
        },

        animateRing() {
            this.ringX += (this.mouseX - this.ringX) * 0.15;
            this.ringY += (this.mouseY - this.ringY) * 0.15;
            this.ring.style.left = this.ringX + 'px';
            this.ring.style.top = this.ringY + 'px';
            requestAnimationFrame(() => this.animateRing());
        },
    };

    // ============================================
    // 3. NAVBAR
    // ============================================
    const Navbar = {
        navbar: document.getElementById('navbar'),
        hamburger: document.getElementById('hamburger'),
        navLinks: document.getElementById('navLinks'),
        links: document.querySelectorAll('.nav-link'),
        sections: [],

        init() {
            // Collect sections
            this.links.forEach((link) => {
                const sectionId = link.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                if (section) this.sections.push({ id: sectionId, el: section, link: link });
            });

            // Hamburger toggle
            this.hamburger.addEventListener('click', () => {
                this.hamburger.classList.toggle('active');
                this.navLinks.classList.toggle('open');
            });

            // Close mobile nav on link click
            this.links.forEach((link) => {
                link.addEventListener('click', () => {
                    this.hamburger.classList.remove('active');
                    this.navLinks.classList.remove('open');
                });
            });

            // Close mobile nav on resume btn click
            const resumeBtn = document.querySelector('.nav-resume-btn');
            if (resumeBtn) {
                resumeBtn.addEventListener('click', () => {
                    this.hamburger.classList.remove('active');
                    this.navLinks.classList.remove('open');
                });
            }

            // Scroll spy with IntersectionObserver
            this.setupScrollSpy();

            // Smooth scroll for all anchor links
            document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        },

        setupScrollSpy() {
            const observerOptions = {
                root: null,
                rootMargin: '-40% 0px -60% 0px',
                threshold: 0,
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.links.forEach((l) => l.classList.remove('active'));
                        const activeLink = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
                        if (activeLink) activeLink.classList.add('active');
                    }
                });
            }, observerOptions);

            this.sections.forEach((s) => observer.observe(s.el));
        },
    };

    // ============================================
    // 4. HERO — Typewriter + Role Cycler + Particles
    // ============================================
    const Hero = {
        greetingEl: document.getElementById('heroGreeting'),
        roleEl: document.getElementById('heroRole'),
        nameEl: document.getElementById('heroNameText'),
        nameParent: null,
        canvas: document.getElementById('heroCanvas'),
        ctx: null,
        particles: [],
        greetingText: '> Hello, I\'m',
        roles: ['AI/ML Engineer', 'Security Researcher', 'Deep Learning Specialist', 'RL Enthusiast'],
        names: ['ACHINTYA K J', 'CIATEL ARLANTA'],
        currentRole: 0,
        currentName: 0,

        init() {
            this.nameParent = this.nameEl ? this.nameEl.closest('.hero-name') : null;
            this.typeGreeting();
            this.startRoleCycler();
            this.startNameCycler();
            this.initCanvas();
        },

        typeGreeting() {
            let i = 0;
            const interval = setInterval(() => {
                if (i <= this.greetingText.length) {
                    this.greetingEl.textContent = this.greetingText.substring(0, i);
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 60);
        },

        startRoleCycler() {
            setInterval(() => {
                this.roleEl.classList.add('fade');
                setTimeout(() => {
                    this.currentRole = (this.currentRole + 1) % this.roles.length;
                    this.roleEl.textContent = this.roles[this.currentRole];
                    this.roleEl.classList.remove('fade');
                }, 400);
            }, 3000);
        },

        // --- Name typewriter cycler ---
        startNameCycler() {
            if (!this.nameEl) return;
            this.typeName(this.names[this.currentName], () => {
                // After typing, hold, then erase, then cycle
                setTimeout(() => {
                    this.eraseName(() => {
                        this.currentName = (this.currentName + 1) % this.names.length;
                        setTimeout(() => {
                            this.typeName(this.names[this.currentName], () => {
                                // Repeat the cycle
                                setTimeout(() => {
                                    this.eraseName(() => {
                                        this.currentName = (this.currentName + 1) % this.names.length;
                                        // Recurse
                                        setTimeout(() => this.startNameCycler(), 200);
                                    });
                                }, 3000);
                            });
                        }, 200);
                    });
                }, 3000);
            });
        },

        typeName(name, callback) {
            let i = 0;
            const speed = 80;
            const interval = setInterval(() => {
                if (i <= name.length) {
                    const text = name.substring(0, i);
                    this.nameEl.textContent = text;
                    if (this.nameParent) this.nameParent.setAttribute('data-text', text);
                    i++;
                } else {
                    clearInterval(interval);
                    if (callback) callback();
                }
            }, speed);
        },

        eraseName(callback) {
            const current = this.nameEl.textContent;
            let i = current.length;
            const speed = 40;
            const interval = setInterval(() => {
                if (i >= 0) {
                    const text = current.substring(0, i);
                    this.nameEl.textContent = text;
                    if (this.nameParent) this.nameParent.setAttribute('data-text', text);
                    i--;
                } else {
                    clearInterval(interval);
                    if (callback) callback();
                }
            }, speed);
        },

        initCanvas() {
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
            this.createParticles();
            this.animateParticles();
        },

        resizeCanvas() {
            this.canvas.width = this.canvas.parentElement.offsetWidth;
            this.canvas.height = this.canvas.parentElement.offsetHeight;
        },

        createParticles() {
            const count = Math.min(80, Math.floor(this.canvas.width * this.canvas.height / 12000));
            this.particles = [];
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 0.5,
                });
            }
        },

        animateParticles() {
            const ctx = this.ctx;
            const w = this.canvas.width;
            const h = this.canvas.height;

            ctx.clearRect(0, 0, w, h);

            // Update & draw particles
            this.particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
                ctx.fill();
            });

            // Draw lines between nearby particles
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(() => this.animateParticles());
        },
    };

    // ============================================
    // 5. SCROLL REVEAL (IntersectionObserver)
    // ============================================
    const ScrollReveal = {
        init() {
            const reveals = document.querySelectorAll('.reveal');

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px',
                }
            );

            reveals.forEach((el) => observer.observe(el));
        },
    };

    // ============================================
    // 6. SKILLS FILTER
    // ============================================
    const SkillsFilter = {
        filterBtns: document.querySelectorAll('.filter-btn'),
        cards: document.querySelectorAll('.skill-card'),

        init() {
            this.filterBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    // Update active button
                    this.filterBtns.forEach((b) => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filter = btn.getAttribute('data-filter');
                    this.filterCards(filter);
                });
            });
        },

        filterCards(category) {
            this.cards.forEach((card) => {
                const cardCategory = card.getAttribute('data-category');

                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                    // Trigger reflow for transition
                    void card.offsetHeight;
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        },
    };

    // ============================================
    // 7. TERMINAL CARD — Blinking Cursor
    // ============================================
    const TerminalCard = {
        cursor: document.getElementById('terminalCursor'),

        init() {
            // The blinking cursor is handled via CSS animation
            // This module exists for extensibility (e.g., typing effect)
            if (!this.cursor) return;
        },
    };

    // ============================================
    // 8. EDUCATION — CGPA Bar Animation
    // ============================================
    const Education = {
        init() {
            const cgpaFills = document.querySelectorAll('.cgpa-fill');

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate');
                        }
                    });
                },
                { threshold: 0.5 }
            );

            cgpaFills.forEach((fill) => observer.observe(fill));
        },
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        Preloader.init();
        CustomCursor.init();
        Navbar.init();
        Hero.init();
        ScrollReveal.init();
        SkillsFilter.init();
        TerminalCard.init();
        Education.init();
    });
})();
