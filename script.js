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

// Observe section-title, about-cards, and project-cards
document.addEventListener('DOMContentLoaded', () => {
    const sectionTitles = document.querySelectorAll('.section-title');
    const aboutCards = document.querySelectorAll('.about-card');
    const projectCards = document.querySelectorAll('.project-card');

    sectionTitles.forEach(title => observer.observe(title));
    aboutCards.forEach(card => observer.observe(card));
    projectCards.forEach(card => observer.observe(card));

    // Add hover effect for project cards on mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
        projectCards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'translateY(-5px)';
            }, { passive: true });

            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            }, { passive: true });
        });
    }
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

// Project filtering functionality
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Filter projects
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact form with EmailJS
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show sending state
        const button = this.querySelector('.submit-btn');
        const originalButtonHTML = button.innerHTML;
        button.innerHTML = '<span class="btn-text">Sending...</span><span class="btn-icon">✉️</span>';
        button.disabled = true;

        // Clear previous status
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';
        formStatus.textContent = '';

        // Get form data
        const name = document.getElementById('user_name').value;
        const email = document.getElementById('user_email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Use SMTP.js as a fallback if EmailJS fails
        try {
            // First try with EmailJS
            emailjs.send('service_rnc4hzj', 'template_rnc4hzj', {
                from_name: name,
                reply_to: email,
                subject: subject,
                message: message
            })
            .then(function() {
                console.log('SUCCESS!');

                // Show success message
                formStatus.textContent = 'Your message has been sent successfully!';
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';

                // Reset form
                contactForm.reset();

                // Redirect to thanks page after a short delay
                setTimeout(() => {
                    window.location.href = 'thanks.html';
                }, 2000);

            }, function(error) {
                console.log('EmailJS failed, trying SMTP.js...', error);

                // Fallback to SMTP.js
                Email.send({
                    SecureToken: "8b5f5a78-9d6f-4455-b9c8-2d643143b8fb",
                    To: 'rudra21172145@gmail.com',
                    From: "portfolio@contact.com",
                    Subject: subject + " (from " + name + ")",
                    Body: "Name: " + name + "<br>Email: " + email + "<br>Message: " + message
                }).then(function(message) {
                    console.log("SMTP.js success: " + message);

                    // Show success message
                    formStatus.textContent = 'Your message has been sent successfully!';
                    formStatus.className = 'form-status success';
                    formStatus.style.display = 'block';

                    // Reset form
                    contactForm.reset();

                    // Redirect to thanks page after a short delay
                    setTimeout(() => {
                        window.location.href = 'thanks.html';
                    }, 2000);
                });
            });
        } catch (e) {
            console.log('Error in email sending:', e);

            // Show error message
            formStatus.textContent = 'Oops! Something went wrong. Please try again later.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';

            // Reset button
            button.innerHTML = originalButtonHTML;
            button.disabled = false;
        }
    });

    // Add focus animations to form fields
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

// Mobile optimization and initialization
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

    // Observe contact section elements
    const contactElements = document.querySelectorAll('.contact-form-container, .contact-info, .contact-gif-container');
    contactElements.forEach(element => observer.observe(element));

    // Initialize project filters and contact form
    setupProjectFilters();
    setupContactForm();
});
