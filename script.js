// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // Variables globales
    const loader = document.getElementById('loader');
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const backToTop = document.getElementById('backToTop');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // Masquer le loader après le chargement
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
            }, 300);
        }, 1000);
    });
    
    // Navigation sticky et scroll effects
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header sticky effect
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top button
        if (scrollTop > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
        
        // Animations on scroll
        animateOnScroll();
        
        lastScrollTop = scrollTop;
    });
    
    // Menu mobile toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
    
    // Fermer le menu mobile lors du clic sur un lien
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.replace('fa-times', 'fa-bars');
        });
    });
    
    // Smooth scrolling pour les liens d'ancrage
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation link
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + header.offsetHeight + 50;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Gallery filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentFilter = 'all'; // Variable pour maintenir l'état du filtre
    
    // Fonction pour appliquer le filtre
    function applyGalleryFilter(filterValue) {
        currentFilter = filterValue;
        
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (filterValue === 'all') {
                // Afficher tous les éléments
                item.style.display = 'block';
                item.classList.remove('hidden');
                item.classList.add('visible');
                item.setAttribute('data-filtered', 'show');
            } else {
                // Filtrer selon la catégorie
                if (itemCategory === filterValue) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                    item.classList.add('visible');
                    item.setAttribute('data-filtered', 'show');
                } else {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                    item.classList.remove('visible');
                    item.setAttribute('data-filtered', 'hide');
                }
            }
        });
    }
    
    // Fonction pour maintenir le filtre actuel
    function maintainCurrentFilter() {
        if (currentFilter !== 'all') {
            applyGalleryFilter(currentFilter);
        }
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            applyGalleryFilter(filterValue);
        });
    });
    
    // Maintenir le filtre toutes les 2 secondes pour éviter les interférences
    setInterval(maintainCurrentFilter, 2000);
    
    // Lightbox functionality
    window.openLightbox = function(imageSrc) {
        lightboxImg.src = imageSrc;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };
    
    window.closeLightbox = function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    // Close lightbox on click outside image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });
    
    // Back to top functionality
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Form handling
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!validateForm(data)) {
                return;
            }
            
            // Show success message
            showNotification('Votre demande de rendez-vous a été envoyée avec succès! Nous vous contacterons bientôt.', 'success');
            
            // Reset form
            this.reset();
            
            // In a real application, you would send this data to your server
            console.log('Form data:', data);
        });
    }
    
    // Form validation
    function validateForm(data) {
        const required = ['name', 'phone', 'email', 'service', 'date', 'time'];
        
        for (let field of required) {
            if (!data[field] || data[field].trim() === '') {
                showNotification(`Le champ ${getFieldLabel(field)} est requis.`, 'error');
                return false;
            }
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return false;
        }
        
        // Phone validation
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(data.phone)) {
            showNotification('Veuillez entrer un numéro de téléphone valide.', 'error');
            return false;
        }
        
        // Date validation (not in the past)
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('Veuillez choisir une date future.', 'error');
            return false;
        }
        
        return true;
    }
    
    function getFieldLabel(field) {
        const labels = {
            'name': 'Nom complet',
            'phone': 'Téléphone',
            'email': 'Email',
            'service': 'Service souhaité',
            'date': 'Date',
            'time': 'Heure'
        };
        return labels[field] || field;
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Add animation styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0;
                    margin-left: auto;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Animations on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in, .slide-left, .slide-right');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            // Ignorer les éléments de la galerie pour éviter les conflits
            if (element.classList.contains('gallery-item')) {
                return;
            }
            
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initialize animations
    function initializeAnimations() {
        // Add animation classes to elements
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.classList.add('fade-in');
            card.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Retirer les classes d'animation des éléments de galerie pour éviter les conflits
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            // Ne pas ajouter de classes d'animation aux éléments de galerie
            // item.classList.add('fade-in');
            // item.style.animationDelay = `${index * 0.05}s`;
        });
        
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach((item, index) => {
            item.classList.add(index % 2 === 0 ? 'slide-left' : 'slide-right');
        });
        
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach((card, index) => {
            card.classList.add('fade-in');
            card.style.animationDelay = `${index * 0.2}s`;
        });
    }
    
    // Testimonials slider (simple auto-rotation)
    function initializeTestimonialsSlider() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        if (testimonialCards.length <= 1) return;
        
        let currentIndex = 0;
        
        function showTestimonial(index) {
            testimonialCards.forEach((card, i) => {
                card.style.opacity = i === index ? '1' : '0.5';
                card.style.transform = i === index ? 'scale(1)' : 'scale(0.95)';
            });
        }
        
        function nextTestimonial() {
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            showTestimonial(currentIndex);
        }
        
        // Initialize
        showTestimonial(0);
        
        // Auto-rotate every 5 seconds
        setInterval(nextTestimonial, 5000);
    }
    
    // Parallax effect for hero section
    function initializeParallax() {
        const heroVideo = document.querySelector('.hero-video video');
        if (!heroVideo) return;
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (heroVideo) {
                heroVideo.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Fonction pour forcer la lecture vidéo sur mobile
    function initializeMobileVideo() {
        // Détecter si on est sur mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Initialiser la vidéo hero
            const heroVideo = document.querySelector('.hero-video video');
            if (heroVideo) {
                setupMobileVideo(heroVideo, true); // true pour hero (avec fallback touch)
            }
            
            // Initialiser les vidéos des services
            const serviceVideos = document.querySelectorAll('.service-video');
            serviceVideos.forEach(video => {
                setupMobileVideo(video, false); // false pour services (pas de fallback touch)
            });
        }
    }
    
    // Fonction pour configurer une vidéo spécifique pour mobile
    function setupMobileVideo(video, enableTouchFallback = false) {
        if (!video) return;
        
        // Forcer les attributs nécessaires pour iOS
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('muted', 'true');
        video.muted = true;
        
        // Tentative de lecture automatique après un court délai
        setTimeout(() => {
            video.play().catch(e => {
                console.log('Autoplay bloqué sur mobile pour une vidéo:', e);
                
                // Fallback touch uniquement pour la vidéo hero
                if (enableTouchFallback) {
                    document.addEventListener('touchstart', function playOnTouch() {
                        video.play().catch(e => console.log('Lecture vidéo échouée:', e));
                        document.removeEventListener('touchstart', playOnTouch);
                    }, { once: true });
                }
                
                // Pour les vidéos services, essayer de lire au survol/interaction avec la card
                if (!enableTouchFallback) {
                    const serviceCard = video.closest('.service-card');
                    if (serviceCard) {
                        serviceCard.addEventListener('touchstart', function() {
                            video.play().catch(e => console.log('Lecture vidéo service échouée:', e));
                        }, { once: true });
                    }
                }
            });
        }, 1000);
        
        // Réessayer la lecture quand la vidéo est prête
        video.addEventListener('loadeddata', function() {
            if (video.paused) {
                video.play().catch(e => console.log('Lecture vidéo échouée au loadeddata:', e));
            }
        });
        
        // S'assurer que la vidéo continue de jouer
        video.addEventListener('pause', function() {
            setTimeout(() => {
                if (video.paused) {
                    video.play().catch(e => console.log('Relance vidéo échouée:', e));
                }
            }, 100);
        });
        
        // Optimisation: forcer la lecture quand la vidéo devient visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && video.paused) {
                    video.play().catch(e => console.log('Lecture vidéo sur intersection échouée:', e));
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(video);
    }
    
    // Hover effects for service cards
    function initializeServiceCardEffects() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Initialize typing effect for hero title
    function initializeTypingEffect() {
        const titleMain = document.querySelector('.title-main');
        if (!titleMain) return;
        
        const text = titleMain.textContent;
        titleMain.textContent = '';
        titleMain.style.borderRight = '2px solid #E8B4B8';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                titleMain.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    titleMain.style.borderRight = 'none';
                }, 1000);
            }
        }
        
        // Start typing effect after loader disappears
        setTimeout(typeWriter, 2000);
    }
    
    // Date and time picker constraints
    function initializeDateTimePickers() {
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        
        if (dateInput) {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
            
            // Set maximum date to 3 months from now
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3);
            dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
        }
        
        if (timeInput) {
            // Set business hours (8:00 - 19:00)
            timeInput.setAttribute('min', '08:00');
            timeInput.setAttribute('max', '19:00');
            timeInput.setAttribute('step', '1800'); // 30 minute intervals
        }
    }
    
    // Phone number formatting
    function initializePhoneFormatting() {
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) return;
        
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Add country code if not present
            if (value.length > 0 && !value.startsWith('237')) {
                if (value.startsWith('6')) {
                    value = '237' + value;
                }
            }
            
            // Format the number
            if (value.length >= 3) {
                value = '+' + value.slice(0, 3) + ' ' + value.slice(3);
            }
            if (value.length >= 8) {
                value = value.slice(0, 8) + ' ' + value.slice(8);
            }
            if (value.length >= 12) {
                value = value.slice(0, 12) + ' ' + value.slice(12);
            }
            
            e.target.value = value;
        });
    }
    
    // Service card click to scroll to contact
    function initializeServiceCardClicks() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            const button = document.createElement('button');
            button.className = 'btn btn-primary';
            button.innerHTML = '<i class="fas fa-calendar-alt"></i> Réserver';
            button.style.marginTop = '20px';
            
            button.addEventListener('click', function() {
                // Scroll to contact section
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = contactSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Pre-fill service field
                    const serviceTitle = card.querySelector('.service-title').textContent;
                    const serviceSelect = document.getElementById('service');
                    if (serviceSelect) {
                        setTimeout(() => {
                            serviceSelect.focus();
                            // Try to match the service
                            for (let option of serviceSelect.options) {
                                if (option.text.toLowerCase().includes(serviceTitle.toLowerCase().split(' ')[0])) {
                                    serviceSelect.value = option.value;
                                    break;
                                }
                            }
                        }, 1000);
                    }
                }
            });
            
            card.querySelector('.service-content').appendChild(button);
        });
    }
    
    // Initialize gallery
    function initializeGallery() {
        // S'assurer que le bouton "Tout" est actif au démarrage
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
        
        // Appliquer le filtre initial
        if (typeof applyGalleryFilter === 'function') {
            applyGalleryFilter('all');
        } else {
            // Fallback si la fonction n'est pas encore définie
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                item.style.display = 'block';
                item.classList.remove('hidden');
                item.classList.add('visible');
                item.setAttribute('data-filtered', 'show');
            });
        }
    }

    // Initialize all features
    function initialize() {
        initializeAnimations();
        initializeTestimonialsSlider();
        initializeParallax();
        initializeServiceCardEffects();
        initializeTypingEffect();
        initializeDateTimePickers();
        initializePhoneFormatting();
        initializeServiceCardClicks();
        initializeGallery();
        initializeMobileVideo(); // Nouvelle fonction pour mobile
        
        // Initial animation check
        animateOnScroll();
        updateActiveNavLink();
    }
    
    // Start initialization
    initialize();
    
    // WhatsApp direct link with pre-filled message
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const message = encodeURIComponent('Bonjour B-SHONAILS, je souhaite prendre rendez-vous pour un service de beauté. Pouvez-vous me donner plus d\'informations sur vos disponibilités ?');
            const whatsappUrl = `https://wa.me/237651873816?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Keyboard navigation for gallery
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
            const currentSrc = lightboxImg.src;
            const currentIndex = galleryImages.findIndex(img => img.src === currentSrc);
            
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                lightboxImg.src = galleryImages[currentIndex - 1].src;
            } else if (e.key === 'ArrowRight' && currentIndex < galleryImages.length - 1) {
                lightboxImg.src = galleryImages[currentIndex + 1].src;
            }
        }
    });
    
    // Lazy loading for images
    function initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Call lazy loading if supported
    if (window.IntersectionObserver) {
        initializeLazyLoading();
    }
    
});

// Additional utility functions
function formatPhoneNumber(phoneNumber) {
    // Remove all non-digits
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a Cameroon number
    if (cleaned.startsWith('237')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
    
    return phoneNumber;
}

function isBusinessHours(date) {
    const hours = date.getHours();
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Monday to Saturday, 8 AM to 7 PM
    return (day >= 1 && day <= 6 && hours >= 8 && hours < 19) || 
           (day === 0 && hours >= 10 && hours < 17); // Sunday 10 AM to 5 PM
}

function generateAvailableTimeSlots(selectedDate) {
    const slots = [];
    const date = new Date(selectedDate);
    const day = date.getDay();
    
    let startHour, endHour;
    
    if (day === 0) { // Sunday
        startHour = 10;
        endHour = 17;
    } else { // Monday to Saturday
        startHour = 8;
        endHour = 19;
    }
    
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push(timeString);
        }
    }
    
    return slots;
} 