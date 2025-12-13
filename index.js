document.addEventListener('DOMContentLoaded', () => {

    // ==================================================
    // 1. NAVIGATION & MENU LOGIC
    // ==================================================
    const menuIcon = document.querySelector('.menu-icon');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
            menuIcon.classList.toggle('active');
            // Icon animation
            setTimeout(() => {
                if (menuIcon.classList.contains('active')) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                } else {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }, 300);
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                menuIcon.classList.remove('active');
                setTimeout(() => {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }, 300);
            }
        });
    });

    // ==================================================
    // 2. TYPING ANIMATION
    // ==================================================
    const typingText = document.querySelector('.typing-text');
    const words = ["WEB DEVELOPER", "FRONT-END DEVELOPER", "WORDPRESS EXPERT"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const currentChar = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);

        typingText.textContent = currentChar;

        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(type, 150);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, 100);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(type, 1200);
        }
    }

    if (typingText) {
        type();
    }

    // ==================================================
    // 3. ACTIVE NAVIGATION LINK ON SCROLL
    // ==================================================
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // ==================================================
    // 4. SMOOTH SCROLLING
    // ==================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && document.querySelector(targetId)) {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================================================
    // 5. PROJECT FILTERING LOGIC (UPDATED & FIXED)
    // ==================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectGrid = document.querySelector('.project-grid');

    if (filterButtons.length > 0 && projectGrid) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                projectGrid.style.opacity = '0';
                projectGrid.style.transform = 'scale(0.95)';
                projectGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                setTimeout(() => {
                    projectCards.forEach(card => {
                        const cardCategory = card.getAttribute('data-category');

                        if (filterValue === 'all' || cardCategory === filterValue) {
                            card.style.display = 'flex';
                            requestAnimationFrame(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            });
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    projectGrid.style.opacity = '1';
                    projectGrid.style.transform = 'scale(1)';

                }, 300);
            });
        });
    }

    // ==================================================
    // 6. CONTACT FORM SUBMISSION
    // ==================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const submitButton = contactForm.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        const originalBtnText = submitButton.innerHTML;
        submitButton.innerHTML = "SENDING...";

        try {
            const response = await fetch(event.target.action, {
                method: contactForm.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = "Thank you! Your message has been sent.";
                formStatus.style.color = "#4ade80";
                contactForm.reset();
            } else {
                const responseData = await response.json();
                if (Object.hasOwn(responseData, 'errors')) {
                    formStatus.textContent = responseData["errors"].map(error => error["message"]).join(", ");
                } else {
                    formStatus.textContent = "Oops! There was a problem submitting your form.";
                }
                formStatus.style.color = "#f87171";
            }
        } catch (error) {
            formStatus.textContent = "Oops! There was a problem submitting your form.";
            formStatus.style.color = "#f87171";
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalBtnText;
            setTimeout(() => {
                formStatus.textContent = "";
            }, 5000);
        }
    }

    if (contactForm) {
        contactForm.addEventListener("submit", handleSubmit);
    }

});