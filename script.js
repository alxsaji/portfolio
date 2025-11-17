// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navLinks.classList.add('mobile-menu');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const href = link.getAttribute('href');
                
                // For anchor links, handle smooth scroll
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    // Close menu after scroll
                    setTimeout(() => {
                        menuToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                        navLinks.classList.remove('mobile-menu');
                        body.classList.remove('menu-open');
                        body.style.overflow = '';
                    }, 300);
                } else {
                    // For regular links, close menu and let browser navigate
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    navLinks.classList.remove('mobile-menu');
                    body.classList.remove('menu-open');
                    body.style.overflow = '';
                    // Don't prevent default - let browser handle navigation
                }
            }, true);
        });

        // Close menu when clicking on backdrop (outside menu)
        document.addEventListener('click', (e) => {
            if (body.classList.contains('menu-open')) {
                const isClickOnMenu = navLinks.contains(e.target);
                const isClickOnToggle = menuToggle.contains(e.target);
                const isClickOnLink = navLinks.querySelector('a') && 
                    Array.from(navLinks.querySelectorAll('a')).some(link => 
                        link === e.target || link.contains(e.target)
                    );
                const isClickOnFilterBtn = e.target.closest('.filter-btn');
                
                // Only close if clicking outside menu and toggle (and not on filter buttons)
                if (!isClickOnMenu && !isClickOnToggle && !isClickOnLink && !isClickOnFilterBtn) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    navLinks.classList.remove('mobile-menu');
                    body.classList.remove('menu-open');
                    body.style.overflow = '';
                }
            }
        }, true); // Use capture phase
    }
});

// Project Filter Functionality
(function() {
    'use strict';
    
    function initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        if (!filterButtons.length || !projectCards.length) {
            console.warn('Project filters: No filter buttons or project cards found');
            return;
        }

        // Filter function
        function filterProjects(filterValue) {
            let visibleCount = 0;
            
            // First, hide all cards
            projectCards.forEach(card => {
                card.classList.add('hidden');
                card.style.display = 'none';
            });
            
            // Then show matching cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Show all projects
                if (filterValue === 'all') {
                    card.classList.remove('hidden');
                    card.style.display = '';
                    visibleCount++;
                } 
                // Show only matching category
                else if (category === filterValue) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                    visibleCount++;
                }
            });

            // Animate visible cards
            requestAnimationFrame(() => {
                const visibleCards = Array.from(projectCards).filter(card => !card.classList.contains('hidden'));
                visibleCards.forEach((card, index) => {
                    // Reset styles for animation
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    // Animate in with stagger
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            });
        }

        // Add click handlers to filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');

                // Get filter value and apply
                const filter = this.getAttribute('data-filter');
                console.log('Filter button clicked:', filter);
                if (filter) {
                    filterProjects(filter);
                } else {
                    console.warn('No data-filter attribute found on button');
                }
            }, false); // Use bubble phase, not capture
        });

        // Ensure "All Projects" is active by default
        const allButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === 'all');
        if (allButton && !allButton.classList.contains('active')) {
            allButton.classList.add('active');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectFilters);
    } else {
        // DOM already loaded
        initProjectFilters();
    }
})();

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Skip animation if element is hidden (being filtered)
            if (entry.target.classList.contains('hidden')) {
                return;
            }
            
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

            setTimeout(() => {
                // Double-check it's still visible before animating
                if (!entry.target.classList.contains('hidden')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }, 100);

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all project cards and sections
document.addEventListener('DOMContentLoaded', () => {
    // Only observe section titles and subtitles, not project cards (they're handled by filter)
    const elements = document.querySelectorAll('.section-title, .section-subtitle');
    elements.forEach(el => observer.observe(el));
});

// Navbar background on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (currentScroll > 50) {
        navbar.style.boxShadow = isDark 
            ? '0 4px 24px rgba(0, 0, 0, 0.4)' 
            : '0 4px 24px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.06)';
    }

    lastScroll = currentScroll;
});

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    // Update toggle button state
    updateThemeIcon(currentTheme);
    
    // Theme toggle event
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Update navbar shadow on theme change
            const navbar = document.querySelector('.navbar');
            const scrollY = window.pageYOffset;
            if (scrollY > 50) {
                navbar.style.boxShadow = newTheme === 'dark' 
                    ? '0 4px 24px rgba(0, 0, 0, 0.4)' 
                    : '0 4px 24px rgba(0, 0, 0, 0.08)';
            }
        });
    }
    
    function updateThemeIcon(theme) {
        // Icon animation is handled by CSS
        // This function can be used for additional logic if needed
    }
});

// Hero Background Water-like Parallax Effect
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const heroIllustrations = document.querySelector('.hero-background-illustrations');
    const heroWaterBackground = document.getElementById('heroWaterBackground');
    
    // Function to check if dark theme is active
    const getIsDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (!hero || !heroIllustrations) return;
    
    const shapes = heroIllustrations.querySelectorAll('.illustration-shape');
    const charts = heroIllustrations.querySelectorAll('.illustration-chart');
    const allElements = [...shapes, ...charts];
    
    // Different speed multipliers for each element (creates depth effect)
    const speedMultipliers = {
        'shape-1': 0.15,
        'shape-2': 0.12,
        'shape-3': 0.18,
        'shape-4': 0.10,
        'shape-5': 0.14,
        'shape-6': 0.16,
        'chart-1': 0.20,
        'chart-2': 0.22,
        'chart-3': 0.19
    };
    
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let animationFrame = null;
    
    // Smooth interpolation function
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Update element positions
    function updateParallax() {
        // Smooth interpolation for water-like effect
        currentX = lerp(currentX, targetX, 0.05);
        currentY = lerp(currentY, targetY, 0.05);
        
        allElements.forEach((element, index) => {
            const className = element.className.split(' ').find(cls => 
                cls.startsWith('shape-') || cls.startsWith('chart-')
            );
            
            if (!className) return;
            
            const speed = speedMultipliers[className] || 0.15;
            const moveX = currentX * speed;
            const moveY = currentY * speed;
            
            // Apply transform while preserving existing animation
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        if (isHovering || Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
            animationFrame = requestAnimationFrame(updateParallax);
        } else {
            // Reset to original position smoothly
            allElements.forEach(element => {
                element.style.transform = 'translate(0, 0)';
            });
        }
    }
    
    // Update water background gradient
    function updateWaterBackground(x, y) {
        if (!heroWaterBackground) return;
        
        const rect = hero.getBoundingClientRect();
        const percentX = ((x - rect.left) / rect.width) * 100;
        const percentY = ((y - rect.top) / rect.height) * 100;
        
        // Create dynamic gradient that follows mouse
        const gradientSize = 40; // Size of the gradient circle
        const isDark = getIsDark();
        const opacity1 = isDark ? 0.15 : 0.10;
        const opacity2 = isDark ? 0.10 : 0.07;
        const opacity3 = isDark ? 0.08 : 0.05;
        
        const gradient = `radial-gradient(
            circle ${gradientSize}% at ${percentX}% ${percentY}%,
            rgba(102, 126, 234, ${opacity1}) 0%,
            rgba(118, 75, 162, ${opacity2}) 30%,
            rgba(102, 126, 234, ${opacity3}) 60%,
            transparent 100%
        )`;
        
        heroWaterBackground.style.background = gradient;
    }
    
    // Mouse move handler
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from center (normalized to -1 to 1)
        mouseX = (e.clientX - centerX) / (rect.width / 2);
        mouseY = (e.clientY - centerY) / (rect.height / 2);
        
        // Clamp values to prevent extreme movements
        mouseX = Math.max(-1, Math.min(1, mouseX));
        mouseY = Math.max(-1, Math.min(1, mouseY));
        
        targetX = mouseX * 30; // Max movement in pixels
        targetY = mouseY * 30;
        
        // Update water background
        updateWaterBackground(e.clientX, e.clientY);
        
        if (!isHovering) {
            isHovering = true;
            updateParallax();
        }
    });
    
    // Mouse leave handler - smoothly return to center
    hero.addEventListener('mouseleave', () => {
        isHovering = false;
        targetX = 0;
        targetY = 0;
        
        // Reset water background to center
        if (heroWaterBackground) {
            const rect = hero.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            updateWaterBackground(centerX, centerY);
        }
        
        // Continue animation until elements return to center
        const returnToCenter = () => {
            currentX = lerp(currentX, 0, 0.08);
            currentY = lerp(currentY, 0, 0.08);
            
            allElements.forEach((element, index) => {
                const className = element.className.split(' ').find(cls => 
                    cls.startsWith('shape-') || cls.startsWith('chart-')
                );
                
                if (!className) return;
                
                const speed = speedMultipliers[className] || 0.15;
                const moveX = currentX * speed;
                const moveY = currentY * speed;
                
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            if (Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
                requestAnimationFrame(returnToCenter);
            } else {
                allElements.forEach(element => {
                    element.style.transform = 'translate(0, 0)';
                });
            }
        };
        
        returnToCenter();
    });
    
    // Touch support for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;
    
    hero.addEventListener('touchmove', (e) => {
        if (e.touches.length === 0) return;
        
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const touch = e.touches[0];
        mouseX = (touch.clientX - centerX) / (rect.width / 2);
        mouseY = (touch.clientY - centerY) / (rect.height / 2);
        
        mouseX = Math.max(-1, Math.min(1, mouseX));
        mouseY = Math.max(-1, Math.min(1, mouseY));
        
        targetX = mouseX * 20; // Smaller movement for touch
        targetY = mouseY * 20;
        
        // Update water background for touch
        updateWaterBackground(touch.clientX, touch.clientY);
        
        if (!isHovering) {
            isHovering = true;
            updateParallax();
        }
    });
    
    hero.addEventListener('touchend', () => {
        isHovering = false;
        targetX = 0;
        targetY = 0;
        
        // Reset water background to center
        if (heroWaterBackground) {
            const rect = hero.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            updateWaterBackground(centerX, centerY);
        }
    });
    
    // Update theme detection when theme changes
    const themeObserver = new MutationObserver(() => {
        // Theme changed, update water background to center
        if (heroWaterBackground) {
            const rect = hero.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            updateWaterBackground(centerX, centerY);
        }
    });
    
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});

// Hero Name Mouse Reactivity
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const heroNameGradient = document.querySelector('.hero-name-gradient');
    const heroNameMain = document.querySelector('.hero-name-main');
    
    if (!hero || !heroNameGradient) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Smooth interpolation
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Update name transform
    function updateNameTransform() {
        // Calculate tilt based on mouse position (subtle 3D effect)
        const tiltX = currentY * 5; // Max 5 degrees
        const tiltY = currentX * -5; // Max -5 degrees (inverted for natural feel)
        
        // Calculate scale based on distance from center (subtle zoom)
        const distance = Math.sqrt(currentX * currentX + currentY * currentY);
        const scale = 1 + (distance * 0.02); // Max 2% scale increase
        
        // Apply 3D transform
        heroNameGradient.style.transform = `
            perspective(1000px) 
            rotateX(${tiltX}deg) 
            rotateY(${tiltY}deg) 
            scale(${scale})
        `;
        
        // Add subtle glow effect that follows mouse
        const glowIntensity = Math.min(distance * 0.3, 0.5);
        heroNameGradient.style.filter = `
            drop-shadow(0 0 ${10 + glowIntensity * 20}px rgba(102, 126, 234, ${0.3 + glowIntensity * 0.2}))
        `;
        
        // Continue animation
        requestAnimationFrame(updateNameTransform);
    }
    
    // Start animation loop
    updateNameTransform();
    
    // Mouse move handler
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate normalized position (-1 to 1)
        mouseX = (e.clientX - centerX) / (rect.width / 2);
        mouseY = (e.clientY - centerY) / (rect.height / 2);
        
        // Clamp values
        mouseX = Math.max(-1, Math.min(1, mouseX));
        mouseY = Math.max(-1, Math.min(1, mouseY));
    });
    
    // Mouse leave handler - smoothly return to center
    hero.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
    });
    
    // Smooth interpolation loop
    function smoothUpdate() {
        currentX = lerp(currentX, mouseX, 0.1);
        currentY = lerp(currentY, mouseY, 0.1);
        requestAnimationFrame(smoothUpdate);
    }
    
    smoothUpdate();
    
    // Touch support for mobile
    hero.addEventListener('touchmove', (e) => {
        if (e.touches.length === 0) return;
        
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const touch = e.touches[0];
        mouseX = (touch.clientX - centerX) / (rect.width / 2);
        mouseY = (touch.clientY - centerY) / (rect.height / 2);
        
        mouseX = Math.max(-1, Math.min(1, mouseX));
        mouseY = Math.max(-1, Math.min(1, mouseY));
    });
    
    hero.addEventListener('touchend', () => {
        mouseX = 0;
        mouseY = 0;
    });
});
