document.addEventListener('DOMContentLoaded', () => {

    // ================== CUSTOM CURSOR ==================
    const cursor = document.getElementById('cursor-glow');
    
    // Only enable custom cursor if not on a touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hover effects for interactive elements
        const iterables = document.querySelectorAll('a, button, .glass-panel, .skill-chip');
        iterables.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ================== NAVBAR SCROLL EFFECT ==================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ================== MOBILE MENU TOGGLE ==================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // ================== SCROLL REVEAL ANIMATION ==================
    function reveal() {
        var reveals = document.querySelectorAll(".reveal");
        
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 100;
            
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }
    window.addEventListener("scroll", reveal);
    
    // Trigger once on load
    reveal();

    // ================== SMOOTH SCROLLING ==================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ================== CONTACT FORM HANDLING ==================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalBtnContent = submitBtn.innerHTML;
            
            // 1. Get user inputs
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // 2. Add loading state to button
            submitBtn.style.pointerEvents = 'none';
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitBtn.style.opacity = '0.8';
            
            // 3. Simulate network request (timeout)
            setTimeout(() => {
                // 4. Show success state
                submitBtn.style.background = '#10b981'; // Green color for success
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Message Sent!</span>';
                submitBtn.style.opacity = '1';
                
                // 5. Open fallback email client (optional)
                // We use a short timeout so the user sees the success state before losing window focus
                setTimeout(() => {
                    const mailtoLink = `mailto:08sharma.ra@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + "\n\nReply to: " + email)}`;
                    window.location.href = mailtoLink;
                    
                    // 6. Reset form
                    contactForm.reset();
                    
                    // Reset button after a delay
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnContent;
                        submitBtn.style.background = ''; // Reverts to default gradient
                        submitBtn.style.pointerEvents = 'auto';
                    }, 3000);
                }, 800);
                
            }, 1500); // 1.5 second simulated loading time
        });
    }

});
