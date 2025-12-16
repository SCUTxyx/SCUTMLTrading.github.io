window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target) && dropdown && button) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
        if (button) {
            button.classList.remove('active');
        }
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// Simple forecast carousel (for Prediction Model section)
function setupForecastCarousel() {
    const carousel = document.querySelector('.forecast-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.forecast-slide');
    const prevBtn = carousel.querySelector('.forecast-prev');
    const nextBtn = carousel.querySelector('.forecast-next');

    if (slides.length === 0 || !prevBtn || !nextBtn) return;

    let current = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('is-active');
            } else {
                slide.classList.remove('is-active');
            }
        });
    }

    prevBtn.addEventListener('click', function() {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
    });

    nextBtn.addEventListener('click', function() {
        current = (current + 1) % slides.length;
        showSlide(current);
    });

    // Basic touch support for mobile (swipe left/right)
    let startX = null;
    carousel.addEventListener('touchstart', function(e) {
        if (e.touches && e.touches.length === 1) {
            startX = e.touches[0].clientX;
        }
    });

    carousel.addEventListener('touchend', function(e) {
        if (startX === null) return;
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        const threshold = 40; // px

        if (diff > threshold) {
            // swipe right -> previous
            current = (current - 1 + slides.length) % slides.length;
            showSlide(current);
        } else if (diff < -threshold) {
            // swipe left -> next
            current = (current + 1) % slides.length;
            showSlide(current);
        }
        startX = null;
    });

    // Initialize first slide
    showSlide(current);
}

// Factor carousel: build slidetrack of slides (each slide shows two PDFs) and enable sliding animation
function setupFactorCarousel() {
    const carousel = document.querySelector('.factor-carousel');
    if (!carousel) return;

    const prevBtn = carousel.querySelector('.factor-prev');
    const nextBtn = carousel.querySelector('.factor-next');
    const track = carousel.querySelector('.factor-track');

    if (!prevBtn || !nextBtn || !track) return;

    const files = [
      'price_vwap_diff_ic_timeseries.pdf',
      'price_vwap_diff_layered_return.pdf',
      'ma_5_ic_timeseries.pdf',
      'ma_5_layered_return.pdf',
      'ma_20_ic_timeseries.pdf',
      'ma_20_layered_return.pdf',
      'volatility_10_ic_timeseries.pdf',
      'volatility_10_layered_return.pdf',
      'volatility_20_ic_timeseries.pdf',
      'volatility_20_layered_return.pdf'
    ];

    // Build slides (each slide uses two files: left/right)
    const slides = [];
    for (let i = 0; i < files.length; i += 2) {
        const left = files[i];
        const right = files[i + 1];

        const slide = document.createElement('div');
        slide.className = 'factor-slide';

        const leftPanel = document.createElement('div');
        leftPanel.className = 'factor-panel';
        leftPanel.innerHTML = `<figure class="image"><object class="factor-pdf" data="static/images/alpha/factor_plots/${left}#view=FitH&toolbar=0" type="application/pdf" width="100%" height="520"></object><p class="has-text-centered is-size-6 factor-caption" style="margin-top:.5rem;">${left.replace('.pdf','')}</p></figure>`;
        slide.appendChild(leftPanel);

        const rightPanel = document.createElement('div');
        rightPanel.className = 'factor-panel';
        if (right) {
            rightPanel.innerHTML = `<figure class="image"><object class="factor-pdf" data="static/images/alpha/factor_plots/${right}#view=FitH&toolbar=0" type="application/pdf" width="100%" height="520"></object><p class="has-text-centered is-size-6 factor-caption" style="margin-top:.5rem;">${right.replace('.pdf','')}</p></figure>`;
        } else {
            rightPanel.innerHTML = `<div style="height:520px"></div>`;
        }
        slide.appendChild(rightPanel);

        track.appendChild(slide);
        slides.push(slide);
    }

    let current = 0;
    const total = slides.length;

    function update() {
        track.style.transform = `translateX(-${current * 100}%)`;
    }

    prevBtn.addEventListener('click', function() {
        current = (current - 1 + total) % total;
        update();
    });

    nextBtn.addEventListener('click', function() {
        current = (current + 1) % total;
        update();
    });

    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });

    // Touch swipe for the viewport
    const viewport = carousel.querySelector('.factor-viewport');
    let startX = null;
    viewport.addEventListener('touchstart', function(e) {
        if (e.touches && e.touches.length === 1) startX = e.touches[0].clientX;
    });
    viewport.addEventListener('touchend', function(e) {
        if (startX === null) return;
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        const threshold = 40;
        if (diff > threshold) prevBtn.click();
        if (diff < -threshold) nextBtn.click();
        startX = null;
    });

    // Initialize
    update();
}

function initPage() {
    var options = {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    // Initialize all div with carousel class (if plugin is available)
    if (typeof bulmaCarousel !== 'undefined') {
        bulmaCarousel.attach('.carousel', options);
    }

    if (typeof bulmaSlider !== 'undefined') {
        bulmaSlider.attach();
    }

    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

    // Setup custom forecast carousel
    setupForecastCarousel();

    // Setup factor carousel (two PDFs)
    setupFactorCarousel();
}

// Prefer jQuery ready if available; otherwise fall back to DOMContentLoaded
if (typeof window.jQuery !== 'undefined') {
    $(document).ready(initPage);
} else {
    document.addEventListener('DOMContentLoaded', initPage);
}
