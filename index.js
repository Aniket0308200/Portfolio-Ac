document.addEventListener('DOMContentLoaded', () => {

    // ==================================================
    // 1. TYPING ANIMATION FOR HERO SECTION
    // ==================================================
    const typingText = document.querySelector('.typing-text');
    // You can add more roles here to cycle through them
    const words = ["WEB DEVELOPER", "FRONT-END DEVELOPER", "WORDPRESS EXPERT"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const currentChar = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);

        typingText.textContent = currentChar;

        if (!isDeleting && charIndex < currentWord.length) {
            // Typing forward
            charIndex++;
            setTimeout(type, 150);
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            charIndex--;
            setTimeout(type, 100);
        } else {
            // Word is finished typing or deleting, so switch mode
            isDeleting = !isDeleting;
            if (!isDeleting) {
                // Move to the next word
                wordIndex = (wordIndex + 1) % words.length;
            }
            // Pause before starting next action
            setTimeout(type, 1200);
        }
    }

    // Only start the typing animation if the element exists on the page
    if (typingText) {
        type();
    }

    // ==================================================
    // 2. ACTIVE NAVIGATION LINK ON SCROLL
    // ==================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 60) {
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
    // 3. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
    // ==================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // ==================================================
    // 4. PROJECT FILTERING LOGIC
    // ==================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectGrid = document.querySelector('.project-grid');

    // Only run this code if filter buttons exist on the page
    if (filterButtons.length > 0 && projectGrid) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Set the active class on the clicked button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;

                // Animate the grid out
                projectGrid.style.opacity = 0;
                projectGrid.style.transform = 'scale(0.98)';

                setTimeout(() => {
                    // Filter the cards
                    projectCards.forEach(card => {
                        const category = card.dataset.category;
                        if (filter === 'all' || category === filter) {
                            card.style.display = 'flex'; // Use 'flex' or 'block' as per your card's CSS
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    // Animate the grid back in
                    projectGrid.style.opacity = 1;
                    projectGrid.style.transform = 'scale(1)';
                }, 300); // This duration should match your CSS transition time
            });
        });

        // ==================================================
    // 5. CONTACT FORM SUBMISSION LOGIC
    // ==================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    async function handleSubmit(event) {
        event.preventDefault(); // Page ko reload hone se roko
        const data = new FormData(event.target);
        
        // Button ko disable karke "Sending..." dikhao
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
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
                // Success message
                formStatus.textContent = "Thank you! Your message has been sent.";
                formStatus.style.color = "lightgreen";
                contactForm.reset(); // Form ko khali kar do
            } else {
                // Agar server se error aaye
                const responseData = await response.json();
                if (Object.hasOwn(responseData, 'errors')) {
                    formStatus.textContent = responseData["errors"].map(error => error["message"]).join(", ");
                } else {
                    formStatus.textContent = "Oops! There was a problem submitting your form.";
                }
                formStatus.style.color = "red";
            }
        } catch (error) {
            // Agar network ya koi aur error ho
            formStatus.textContent = "Oops! There was a problem submitting your form.";
            formStatus.style.color = "red";
        } finally {
            // Button ko wapas normal kar do
            submitButton.disabled = false;
            submitButton.innerHTML = 'SEND MESSAGE <i class="fa-solid fa-arrow-right"></i>';
            // 5 second baad status message hata do
            setTimeout(() => {
                formStatus.textContent = "";
            }, 5000);
        }
    }

    // Sirf tabhi code chalao jab contact form page par ho
    if (contactForm) {
        contactForm.addEventListener("submit", handleSubmit);
    }
    }

});