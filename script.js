// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Enhanced scroll effect for navigation and hero content
window.addEventListener('scroll', function () {
    const nav = document.querySelector('nav');
    const scrollPosition = window.scrollY;

    // Nav background effect
    nav.style.background = scrollPosition > 50
        ? 'rgba(3, 5, 8, 0.98)'
        : 'rgba(3, 5, 8, 0.95)';

    // Parallax effect for hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
        heroContent.style.opacity = 1 - (scrollPosition * 0.002);
    }
});

// Ripple effect on tags
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('mouseover', function (e) {
        this.style.transform = 'translateY(-5px) rotate(2deg)';

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1000);
    });

    tag.addEventListener('mouseout', function () {
        this.style.transform = 'translateY(0) rotate(0)';
    });
});

// Pills initial state (hidden)
document.querySelectorAll('.skill-pill, .tech-pill, .hobby-item').forEach(pill => {
    pill.style.opacity = '0';
    pill.style.transform = 'translateY(20px)';
    pill.style.transition = 'all 0.4s ease-out';
});

// About Section Animations (Title + Cards + Pills)
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('section-title')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }

            if (entry.target.classList.contains('about-card')) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';

                    // ✅ Show pills inside the card
                    const pills = entry.target.querySelectorAll('.skill-pill, .tech-pill, .hobby-item');
                    pills.forEach((pill, index) => {
                        pill.style.opacity = '1';
                        pill.style.transform = 'translateY(0)';
                        pill.style.transitionDelay = `${index * 0.05}s`;
                    });

                }, delay * 1000);
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe section-title and about-cards
document.addEventListener('DOMContentLoaded', () => {
    const sectionTitle = document.querySelector('.section-title');
    const aboutCards = document.querySelectorAll('.about-card');

    if (sectionTitle) observer.observe(sectionTitle);
    aboutCards.forEach(card => observer.observe(card));
});

// Timeline animation
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach(item => {
    const timelineObserver = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                timelineObserver.unobserve(entry.target);
            }
        },
        { threshold: 0.5 }
    );

    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.5s ease-out';
    timelineObserver.observe(item);
});

// Mobile optimization
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
        document.body.style.setProperty('--animate-duration', '0.3s');

        const interactiveElements = document.querySelectorAll('.about-card, .skill-pill, .tech-pill, .hobby-item');
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            }, { passive: true });

            element.addEventListener('touchend', () => {
                element.style.transform = '';
            }, { passive: true });
        });
    }
});
