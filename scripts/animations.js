/* ================================
   Advanced Animations & Visual Effects
   Jack Gewirz Portfolio Website
   ================================ */

// Initialize advanced animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initParallaxEffects();
    initAdvancedScrollAnimations();
    initTypingAnimation();
    initFloatingElements();
    initGlowEffects();
    initCursorFollower();
    initTextRevealAnimations();
});

/* ================================
   Parallax Scrolling Effects
   ================================ */

function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll([
        '.hero-background',
        '.particles-container',
        '.gradient-overlay'
    ].join(','));
    
    if (window.innerWidth > 768) { // Only on desktop
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                if (element.classList.contains('hero-background')) {
                    element.style.transform = `translateY(${rate * 0.3}px)`;
                } else if (element.classList.contains('particles-container')) {
                    element.style.transform = `translateY(${rate * 0.2}px)`;
                } else if (element.classList.contains('gradient-overlay')) {
                    element.style.transform = `translateY(${rate * 0.1}px)`;
                }
            });
        }, 16));
    }
}

/* ================================
   Advanced Scroll Animations
   ================================ */

function initAdvancedScrollAnimations() {
    // Staggered animations for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    entry.target.style.animationDelay = `${index * 0.2}s`;
                }, index * 100);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => timelineObserver.observe(item));
    
    // Metric cards wave animation
    const metricCards = document.querySelectorAll('.metric-card');
    
    const metricsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            metricCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.opacity = '1';
                }, index * 150);
            });
            metricsObserver.disconnect();
        }
    }, { threshold: 0.3 });
    
    if (metricCards.length > 0) {
        // Initially hide cards
        metricCards.forEach(card => {
            card.style.transform = 'translateY(30px) scale(0.9)';
            card.style.opacity = '0';
            card.style.transition = 'all 0.6s ease';
        });
        
        metricsObserver.observe(metricCards[0].closest('.poker-metrics'));
    }
}

/* ================================
   Typing Animation for Hero
   ================================ */

function initTypingAnimation() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;
    
    const text = tagline.textContent;
    const words = text.split(' • ');
    
    tagline.innerHTML = '';
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentWord = '';
    
    function typeEffect() {
        if (wordIndex === words.length) {
            // Animation complete, show full text
            tagline.innerHTML = text;
            return;
        }
        
        const fullWord = words[wordIndex];
        
        if (isDeleting) {
            currentWord = fullWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentWord = fullWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // Build display text with current word and remaining words faded
        let displayText = '';
        for (let i = 0; i < words.length; i++) {
            if (i < wordIndex) {
                displayText += words[i] + ' • ';
            } else if (i === wordIndex) {
                displayText += currentWord;
                if (!isDeleting && charIndex === fullWord.length) {
                    displayText += '<span class="typing-cursor">|</span>';
                }
            } else {
                displayText += ' • <span style="opacity: 0.3">' + words[i] + '</span>';
            }
        }
        
        tagline.innerHTML = displayText;
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === fullWord.length) {
            typeSpeed = 1000; // Pause at end of word
            isDeleting = false;
            wordIndex++;
            charIndex = 0;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex++;
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start animation after a delay
    setTimeout(typeEffect, 1000);
}

/* ================================
   Floating Elements Animation
   ================================ */

function initFloatingElements() {
    // Add floating animation to tech items
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach((item, index) => {
        const delay = index * 0.5;
        const duration = 3 + (index % 3);
        
        item.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
    });
    
    // Add floating animation to contact icons
    const contactIcons = document.querySelectorAll('.contact-icon');
    
    contactIcons.forEach((icon, index) => {
        const delay = index * 0.7;
        const duration = 2.5 + (index % 2);
        
        icon.style.animation = `floatSlow ${duration}s ease-in-out ${delay}s infinite alternate`;
    });
    
    // Add CSS for floating animations if not already present
    if (!document.querySelector('#floating-animations-css')) {
        const floatingCSS = `
            @keyframes floatSlow {
                0% { transform: translateY(0px); }
                100% { transform: translateY(-8px); }
            }
            
            @keyframes float {
                0% { transform: translateY(0px) rotate(0deg); }
                100% { transform: translateY(-12px) rotate(1deg); }
            }
        `;
        
        const style = document.createElement('style');
        style.id = 'floating-animations-css';
        style.textContent = floatingCSS;
        document.head.appendChild(style);
    }
}

/* ================================
   Glow Effects on Hover
   ================================ */

function initGlowEffects() {
    const glowElements = document.querySelectorAll([
        '.btn-primary',
        '.metric-card',
        '.skill-category',
        '.contact-item'
    ].join(','));
    
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', addGlowEffect);
        element.addEventListener('mouseleave', removeGlowEffect);
    });
    
    function addGlowEffect(e) {
        const element = e.target.closest('[class*="btn-primary"], [class*="metric-card"], [class*="skill-category"], [class*="contact-item"]');
        if (!element) return;
        
        if (element.classList.contains('btn-primary')) {
            element.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.6), 0 0 0 1px rgba(102, 126, 234, 0.3)';
        } else {
            element.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)';
        }
        
        element.style.transition = 'all 0.3s ease';
    }
    
    function removeGlowEffect(e) {
        const element = e.target.closest('[class*="btn-primary"], [class*="metric-card"], [class*="skill-category"], [class*="contact-item"]');
        if (!element) return;
        
        element.style.boxShadow = '';
    }
}

/* ================================
   Custom Cursor Follower
   ================================ */

function initCursorFollower() {
    // Only on desktop devices
    if (window.innerWidth < 1024 || 'ontouchstart' in window) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div>';
    
    document.body.appendChild(cursor);
    
    const cursorCSS = `
        .custom-cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        }
        
        .cursor-dot {
            width: 8px;
            height: 8px;
            background: #667eea;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.2s ease;
        }
        
        .custom-cursor.hover .cursor-dot {
            width: 40px;
            height: 40px;
            background: rgba(102, 126, 234, 0.2);
            border: 2px solid #667eea;
        }
        
        .custom-cursor.click .cursor-dot {
            width: 12px;
            height: 12px;
            background: #764ba2;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = cursorCSS;
    document.head.appendChild(style);
    
    // Mouse movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
    });
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .metric-card, .timeline-content');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    // Click effects
    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
}

/* ================================
   Text Reveal Animations
   ================================ */

function initTextRevealAnimations() {
    const revealTexts = document.querySelectorAll([
        '.section-title',
        '.timeline-title',
        '.category-title'
    ].join(','));
    
    revealTexts.forEach(text => {
        // Wrap each word in a span
        const words = text.textContent.split(' ');
        text.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
        
        // Wrap each character in a span
        const wordSpans = text.querySelectorAll('.word');
        wordSpans.forEach(word => {
            const chars = word.textContent.split('');
            word.innerHTML = chars.map(char => `<span class="char">${char}</span>`).join('');
        });
    });
    
    // Add CSS for text reveal
    const textRevealCSS = `
        .word {
            display: inline-block;
            margin-right: 0.3em;
        }
        
        .char {
            display: inline-block;
            opacity: 0;
            transform: translateY(30px) rotateX(90deg);
            transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .char.animate {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = textRevealCSS;
    document.head.appendChild(style);
    
    // Observe for animations
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chars = entry.target.querySelectorAll('.char');
                chars.forEach((char, index) => {
                    setTimeout(() => {
                        char.classList.add('animate');
                    }, index * 50);
                });
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    revealTexts.forEach(text => textObserver.observe(text));
}

/* ================================
   Performance Optimized Particle System
   ================================ */

class AdvancedParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = window.innerWidth < 768 ? 30 : 60;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupCanvas();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupCanvas() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        this.resizeCanvas();
        this.container.appendChild(this.canvas);
    }
    
    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                color: ['#667eea', '#764ba2', '#63b3ed'][Math.floor(Math.random() * 3)]
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        this.resizeCanvas();
        this.particleCount = window.innerWidth < 768 ? 30 : 60;
        this.createParticles();
    }
}

// Initialize advanced particle system
document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer && window.innerWidth > 768) {
        new AdvancedParticleSystem(particlesContainer);
    }
});

/* ================================
   Magnetic Effect for Interactive Elements
   ================================ */

function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.btn-primary, .metric-card');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

// Initialize magnetic effect on load
window.addEventListener('load', initMagneticEffect);

/* ================================
   Scroll Progress Indicator
   ================================ */

function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    
    const progressCSS = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            z-index: 9999;
            transition: width 0.1s ease;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = progressCSS;
    document.head.appendChild(style);
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    }, 10));
}

// Initialize scroll progress
initScrollProgress();

/* ================================
   Utility Functions
   ================================ */

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
} 