document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Header Logic ---
    const header = document.getElementById('site-header');
    // We consider scrolling past the hero section or 200px as the trigger
    const scrollTriggerThreshold = 200; 

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollTriggerThreshold) {
            if (!header.classList.contains('is-sticky')) {
                document.body.style.paddingTop = `${header.offsetHeight}px`;
                header.classList.add('is-sticky');
            }
        } else {
            if (header.classList.contains('is-sticky')) {
                document.body.style.paddingTop = '0px';
                header.classList.remove('is-sticky');
            }
        }
    });

    // --- 2. Image Carousel & Zoom Logic ---
    const mainImage = document.getElementById('main-product-image');
    const zoomWrapper = document.getElementById('image-zoom-wrapper');
    const thumbnails = document.querySelectorAll('.thumbnail:not(.placeholder-thumb)');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    
    // Images array
    const images = Array.from(thumbnails).map(thumb => thumb.src);

    // Update Carousel Image
    function updateImage(index) {
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;
        
        currentIndex = index;
        
        // Update main image source with a slight fade effect
        mainImage.style.opacity = 0;
        setTimeout(() => {
            mainImage.src = images[currentIndex];
            mainImage.style.opacity = 1;
        }, 150);
        
        // Update thumbnails active state
        thumbnails.forEach((thumb, i) => {
            if (i === currentIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // Thumbnail click
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            updateImage(index);
        });
    });

    // Prev/Next buttons
    prevBtn.addEventListener('click', () => {
        updateImage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        updateImage(currentIndex + 1);
    });

    // --- Zoom Preview on Hover ---
    
    const zoomPreviewWindow = document.getElementById('zoom-preview-window');

    zoomWrapper.addEventListener('mouseenter', () => {
        // Only enable zoom on larger screens
        if(window.innerWidth > 992) {
            zoomPreviewWindow.style.display = 'block';
            zoomPreviewWindow.style.backgroundImage = `url(${mainImage.src})`;
            // Zoom factor (e.g., 2.5x)
            const zoomFactor = 2.5; 
            zoomPreviewWindow.style.backgroundSize = `${mainImage.width * zoomFactor}px ${mainImage.height * zoomFactor}px`;
        }
    });

    zoomWrapper.addEventListener('mouseleave', () => {
        zoomPreviewWindow.style.display = 'none';
    });

    zoomWrapper.addEventListener('mousemove', (e) => {
        if(window.innerWidth <= 992) return;

        const rect = zoomWrapper.getBoundingClientRect();
        
        // Calculate mouse position relative to the image wrapper
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate percentage (0 to 1)
        const xPercent = Math.max(0, Math.min(1, x / rect.width));
        const yPercent = Math.max(0, Math.min(1, y / rect.height));

        // Update background position based on percentage
        zoomPreviewWindow.style.backgroundPosition = `${xPercent * 100}% ${yPercent * 100}%`;
    });

    // --- 3. FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                const answer = faq.querySelector('.faq-answer');
                const icon = faq.querySelector('.toggle-icon');
                if (answer) answer.style.display = 'none';
                if (icon) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                const icon = item.querySelector('.toggle-icon');
                if (answer) answer.style.display = 'block';
                if (icon) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            }
        });
    });

    // --- 4. Applications Carousel Logic ---
    const appsTrack = document.querySelector('.apps-track');
    const appPrevBtn = document.querySelector('.prev-app');
    const appNextBtn = document.querySelector('.next-app');
    const appCard = document.querySelector('.app-card');
    
    if (appsTrack && appPrevBtn && appNextBtn && appCard) {
        let appCurrentIndex = 0;
        
        const updateAppCarousel = () => {
            // Calculate how much to slide based on the width of a card + gap
            const cardWidth = appCard.getBoundingClientRect().width;
            const gap = 24; // 24px gap defined in CSS
            const slideAmount = cardWidth + gap;
            
            // The maximum index depends on screen size and number of items
            // But for a simple implementation, we can just slide index by index
            // and prevent scrolling past the end.
            
            appsTrack.style.transform = `translateX(-${appCurrentIndex * slideAmount}px)`;
        };

        appPrevBtn.addEventListener('click', () => {
            if (appCurrentIndex > 0) {
                appCurrentIndex--;
                updateAppCarousel();
            }
        });

        appNextBtn.addEventListener('click', () => {
            // Ideally we'd calculate max index based on visible cards,
            // but for this demo with 4 cards, index up to 1 (if 3 visible) or 2 (if 2 visible)
            // A simple max cap:
            const totalCards = document.querySelectorAll('.app-card').length;
            const visibleCards = window.innerWidth > 992 ? 4 : (window.innerWidth > 768 ? 2 : 1);
            const maxIndex = Math.max(0, totalCards - visibleCards);
            
            if (appCurrentIndex < maxIndex) {
                appCurrentIndex++;
                updateAppCarousel();
            }
        });
        
        // Update on resize to fix position
        window.addEventListener('resize', () => {
            appCurrentIndex = 0;
            updateAppCarousel();
        });
    }

    // --- 5. Manufacturing Process Tabs Logic ---
    const processTabs = document.querySelectorAll('.process-tab');
    const processContents = document.querySelectorAll('.process-tab-content');

    processTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            processTabs.forEach(t => t.classList.remove('active'));
            processContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Show corresponding content
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // --- 6. Modal Popups Logic ---
    const modalDatasheet = document.getElementById('modal-datasheet');
    const modalQuote = document.getElementById('modal-quote');
    
    const btnDownloadDatasheet = document.getElementById('btn-download-datasheet');
    const btnRequestQuoteFeatures = document.getElementById('btn-request-quote-features');
    const btnGetQuoteHero = document.getElementById('btn-get-quote-hero');
    
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    // Open Datasheet Modal
    if (btnDownloadDatasheet) {
        btnDownloadDatasheet.addEventListener('click', () => {
            modalDatasheet.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    }

    // Open Quote Modal
    const openQuoteModal = () => {
        modalQuote.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    if (btnRequestQuoteFeatures) {
        btnRequestQuoteFeatures.addEventListener('click', openQuoteModal);
    }
    if (btnGetQuoteHero) {
        btnGetQuoteHero.addEventListener('click', openQuoteModal);
    }

    // Close Modals
    const closeModals = () => {
        modalOverlays.forEach(modal => modal.classList.remove('active'));
        document.body.style.overflow = 'auto';
    };

    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Close when clicking outside the container
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModals();
            }
        });
    });

});
