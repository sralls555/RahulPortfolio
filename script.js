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
    const resultDiv = document.getElementById('result');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalBtnContent = submitBtn.innerHTML;
            
            // 1. Add loading state to button
            submitBtn.style.pointerEvents = 'none';
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitBtn.style.opacity = '0.8';
            resultDiv.style.color = "var(--text-muted)";
            resultDiv.style.marginTop = "1rem";
            resultDiv.innerHTML = "Please wait...";

            // 2. Gather form data
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // 3. Send AJAX request to Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                
                if (response.status == 200) {
                    // Success state
                    submitBtn.style.background = '#10b981'; 
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Message Sent!</span>';
                    submitBtn.style.opacity = '1';
                    resultDiv.style.color = "#10b981";
                    resultDiv.innerHTML = jsonResponse.message || "Message delivered successfully!";
                    
                    contactForm.reset();
                } else {
                    // Error state (Web3Forms API rejected it)
                    console.log(response);
                    submitBtn.style.background = '#ef4444'; // Red for error
                    submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Failed to Send</span>';
                    submitBtn.style.opacity = '1';
                    resultDiv.style.color = "#ef4444";
                    resultDiv.innerHTML = jsonResponse.message || "Something went wrong.";
                }
            })
            .catch(error => {
                // Network error state
                console.log(error);
                submitBtn.style.background = '#ef4444';
                submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Network Error</span>';
                submitBtn.style.opacity = '1';
                resultDiv.style.color = "#ef4444";
                resultDiv.innerHTML = "Failed to connect. Please try again.";
            })
            .finally(() => {
                // Reset form button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.style.background = ''; // Reverts to default CSS gradient
                    submitBtn.style.pointerEvents = 'auto';
                    resultDiv.innerHTML = "";
                }, 4000);
            });
        });
    }

    // ================== ASK ME ANYTHING CHAT ==================
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatDisplay = document.getElementById('chat-display');
    const chatChips = document.querySelectorAll('.chat-chip');

    const botResponses = {
        "What are your core skills?": "I specialize in REST APIs, payment gateways (UPI, 3DS, etc.), Developer Portals, docs-as-code, and creating high-quality cURL/JSON references.",
        "How can I contact you?": "You can reach out to me via email at 08sharma.ra@gmail.com, use the contact form below, or connect with me on LinkedIn!",
        "Tell me about your experience.": "I have 4+ years in SaaS and fintech. Most recently, I've been the Lead Technical Writer at Juspay Technologies handling multi-region integration guides.",
        "What is your favorite documentation tool?": "I'm a big fan of Docs-as-Code workflows using Markdown, Git, and static site generators! For heavy lifting, I also have experience with MadCap Flare.",
        "default": "That's a great question! I'm just a simple bot, but if you want detailed answers, try sending Rahul an email directly via the contact form below."
    };

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        let avatarHTML = sender === 'bot' 
            ? '<div class="bot-avatar"><i class="fas fa-robot"></i></div>' 
            : '<div class="user-avatar"><i class="fas fa-user"></i></div>';
            
        messageDiv.innerHTML = `
            ${avatarHTML}
            <div class="message-content">${text}</div>
        `;
        
        chatDisplay.appendChild(messageDiv);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    function handleChatRequest(question) {
        if (!question.trim()) return;
        
        // Add User Message
        addMessage(question, 'user');
        chatInput.value = '';
        
        // Simulate thinking delay
        setTimeout(() => {
            const answer = botResponses[question] || botResponses["default"];
            addMessage(answer, 'bot');
        }, 600);
    }

    // Handle form submit
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleChatRequest(chatInput.value);
        });
    }

    // Handle chips
    chatChips.forEach(chip => {
        chip.addEventListener('click', () => {
            handleChatRequest(chip.getAttribute('data-question'));
        });
    });

});
