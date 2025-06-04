/* ================================
   Portfolio Website - Main JavaScript
   Jack Gewirz Professional Portfolio
   ================================ */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen immediately
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Hide loading screen after a short delay to show the animation
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Remove from DOM after CSS transition completes
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 500);
        }, 1000); // Show loading for 1 second, then hide
    }
    
    // Core functionality
    initNavigation();
    initThemeToggle();
    initSmoothScrolling();
    initFormHandling();
    
    // Visual effects and animations
    initScrollAnimations();
    initSkillBars(); // Enhanced skill animations
    initCounterAnimations();
    initParticleEffect();
    
    // Enhanced features
    initLoadingStates();
    initEnhancedFeatures();
    
    // Performance optimizations
    const debouncedResize = debounce(() => {
        // Recalculate animations on resize
        window.dispatchEvent(new Event('scroll'));
    }, 250);
    
    window.addEventListener('resize', debouncedResize);
    
    // Trigger initial scroll event for already visible elements
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
    
    console.log('Enhanced Portfolio initialized successfully! 🚀');
});

/* ================================
   Navigation & Mobile Menu
   ================================ */

function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

/* ================================
   Theme Toggle (Dark/Light Mode)
   ================================ */

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
}

/* ================================
   Scroll Animations & Intersection Observer
   ================================ */

function initScrollAnimations() {
    // Options for the intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };
    
    // Callback function for intersection observer
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for timeline items
                if (entry.target.classList.contains('timeline-content')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                
                // Special handling for skill bars
                if (entry.target.closest('.skill-category')) {
                    animateSkillBars(entry.target.closest('.skill-category'));
                }
                
                // Special handling for metric cards
                if (entry.target.classList.contains('metric-card')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                    entry.target.classList.add('scale-in');
                }
            }
        });
    };
    
    // Create intersection observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll([
        '.timeline-content',
        '.metric-card',
        '.skill-category',
        '.tech-item',
        '.contact-item'
    ].join(','));
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/* ================================
   Particle Effect for Hero Background
   ================================ */

function initParticleEffect() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const opacity = Math.random() * 0.6 + 0.2;
        const duration = Math.random() * 20 + 10;
        
        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = opacity;
        particle.style.animationDuration = `${duration}s`;
        
        // Random color
        const colors = ['#667eea', '#764ba2', '#63b3ed'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);
        particles.push(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                createParticle();
            }
        }, duration * 1000);
    }
    
    // Responsive particle count
    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            // Reduce particles on mobile
            particles.forEach((particle, index) => {
                if (index > 20 && particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            });
        }
    });
}

/* ================================
   Counter Animations for Stats
   ================================ */

function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

/* ================================
   Skill Bar Animations - Enhanced
   ================================ */

function initSkillBars() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateSkillBars(entry.target);
            }
        });
    }, observerOptions);
    
    skillCategories.forEach(category => {
        skillObserver.observe(category);
    });
}

function animateSkillBars(skillCategory) {
    const skillItems = skillCategory.querySelectorAll('.skill-item');
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    const percentageElements = skillCategory.querySelectorAll('.skill-percentage');
    
    // Add animate class to category first
    setTimeout(() => {
        skillCategory.classList.add('animate');
    }, 100);
    
    // Animate each skill item with staggered timing
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
        }, (index * 200) + 300);
    });
    
    // Animate skill bars with proper percentage and visual effects
    skillBars.forEach((bar, index) => {
        const progress = parseInt(bar.dataset.progress);
        const percentageElement = percentageElements[index];
        
        setTimeout(() => {
            // Start the progress bar animation
            bar.style.width = `${progress}%`;
            bar.classList.add('animating');
            
            // Add skill level visual indicators
            if (progress >= 95) {
                bar.classList.add('skill-expert');
                bar.style.background = 'linear-gradient(90deg, #667eea, #764ba2)';
            } else if (progress >= 85) {
                bar.classList.add('skill-advanced');
                bar.style.background = 'linear-gradient(90deg, #4facfe, #00f2fe)';
            } else if (progress >= 70) {
                bar.classList.add('skill-intermediate');
                bar.style.background = 'linear-gradient(90deg, #43e97b, #38f9d7)';
            }
            
            // Animate the percentage counter
            if (percentageElement) {
                animatePercentage(percentageElement, progress);
            }
            
            // Add pulse effect for high percentages
            if (progress >= 90) {
                setTimeout(() => {
                    bar.classList.add('pulse-glow');
                }, 1000);
            }
            
        }, (index * 250) + 600); // Staggered animation timing
    });
    
    // Animate tech items if they exist in this category
    const techItems = skillCategory.querySelectorAll('.tech-item');
    if (techItems.length > 0) {
        techItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
                item.classList.add('animate');
            }, (index * 100) + 800);
        });
    }
}

function animatePercentage(element, targetValue) {
    if (!element) return;
    
    const duration = 1800; // Increased duration for smoother animation
    const startValue = 0;
    const increment = targetValue / (duration / 16);
    let currentValue = startValue;
    
    // Reset the element first
    element.textContent = '0%';
    
    const timer = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= targetValue) {
            element.textContent = targetValue + '%';
            element.classList.add('final-value');
            clearInterval(timer);
            
            // Add completion effect
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
            
        } else {
            element.textContent = Math.floor(currentValue) + '%';
        }
    }, 16);
}

/* ================================
   Form Handling
   ================================ */

function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Add input validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidation);
        });
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formDataObj = Object.fromEntries(formData);
        
        // Validate form
        if (!validateForm(contactForm)) {
            showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        }, 2000);
    }
    
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateInput({ target: input })) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        const type = input.type;
        
        // Remove existing validation classes
        input.classList.remove('valid', 'invalid');
        
        let isValid = true;
        
        // Required field validation
        if (input.hasAttribute('required') && !value) {
            isValid = false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }
        
        // Add validation class
        input.classList.add(isValid ? 'valid' : 'invalid');
        
        return isValid;
    }
    
    function clearValidation(e) {
        const input = e.target;
        input.classList.remove('valid', 'invalid');
    }
}

/* ================================
   Smooth Scrolling
   ================================ */

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ================================
   Loading States & Performance
   ================================ */

function initLoadingStates() {
    // Show page content after load
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Initialize lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    });
    
    // Performance monitoring
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
            });
        });
        
        perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }
}

/* ================================
   Utility Functions
   ================================ */

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: var(--border-radius);
        color: var(--text-primary);
        z-index: var(--z-tooltip);
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        box-shadow: var(--glass-shadow);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Type-specific styling
    if (type === 'success') {
        notification.style.borderColor = 'var(--success)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--error)';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        margin-left: auto;
    `;
    
    function closeNotification() {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeNotification);
    
    // Auto-close after 5 seconds
    setTimeout(closeNotification, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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

// Performance optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    // Any scroll-based animations or effects
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Console welcome message
console.log(`
🎯 Jack Gewirz Portfolio Website
💼 Elite Poker Professional • Marketing Strategist • AI Innovation Specialist
🚀 Built with modern web technologies
📧 Contact: jack.gewirz@example.com
`);

// Loading Screen Management - FIXED VERSION
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);
    }
}

// Enhanced Features Initialization
function initEnhancedFeatures() {
    // Initialize tech item tooltips
    initTechTooltips();
    
    // Initialize enhanced skill animations
    initEnhancedSkillAnimations();
    
    // Initialize hero animations
    initHeroAnimations();
    
    // Initialize enhanced button effects
    initButtonEffects();
}

function initTechTooltips() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        const tooltip = item.querySelector('.tech-tooltip');
        if (!tooltip) return;
        
        item.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        item.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateX(-50%) translateY(-8px)';
        });
    });
}

function initEnhancedSkillAnimations() {
    // Set initial state for tech items
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease-out';
    });
}

function initHeroAnimations() {
    // Initialize any additional hero animations that need JavaScript
    const heroStats = document.querySelectorAll('.stat-item');
    
    heroStats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(30px)';
        stat.style.transition = 'all 0.8s ease-out';
        
        setTimeout(() => {
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0)';
        }, 3500 + (index * 200)); // Start after text animations
    });
}

function initButtonEffects() {
    const enhancedButtons = document.querySelectorAll('.btn-enhanced');
    
    enhancedButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                // Reset ripple
                ripple.style.width = '0';
                ripple.style.height = '0';
                
                // Trigger ripple effect
                setTimeout(() => {
                    ripple.style.width = '200px';
                    ripple.style.height = '200px';
                }, 10);
                
                // Reset after animation
                setTimeout(() => {
                    ripple.style.width = '0';
                    ripple.style.height = '0';
                }, 300);
            }
        });
    });
} 