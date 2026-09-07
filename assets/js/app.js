/**
 * NARAGRO - Application Controller
 * Default Language: English (en), Turkish (tr) available
 * Bootstrap 5, AOS, GLightbox
 */

let currentLang = localStorage.getItem('naragro_lang') || 'en';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Language
  setLanguage(currentLang);
  setupLanguageSwitcher();

  // 2. AOS Animations
  if (window.AOS) {
    window.AOS.init({
      duration: 700,
      once: true,
      offset: 80,
      easing: 'ease-in-out'
    });
  }

  // 3. GLightbox
  if (window.GLightbox) {
    window.GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true
    });
  }

  // 4. Scroll Effects
  setupScrollEffects();

  // 5. Animated Counters
  setupAnimatedCounters();

  // 6. Navigation
  setupNavigation();

  // 7. Vegoils Product Showcase Controls
  setupVegoilsSlider();

  // 8. Contact Form
  setupRfqForm();

  // 9. Ultra-Pro Splash Screen
  setupSplashScreen();
});

/**
 * Set language across all data-i18n elements
 */
function setLanguage(lang) {
  if (typeof translations === 'undefined' || !translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('naragro_lang', lang);
  document.documentElement.lang = lang;

  // Update text bindings
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  // Update placeholder bindings
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (translations[lang][key]) {
      el.setAttribute('placeholder', translations[lang][key]);
    }
  });

  // Update active state in switcher
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const target = btn.getAttribute('data-lang');
    if (target === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Refresh AOS
  if (window.AOS) window.AOS.refresh();
}

function setupLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.getAttribute('data-lang'));
    });
  });
}

/**
 * Scroll Progress Bar, Header Scroll, Back to Top
 */
function setupScrollEffects() {
  const progressBar = document.getElementById('scrollProgressBar');
  const header = document.getElementById('mainHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    if (header) {
      if (winScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (winScroll > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * Animated Number Counters
 */
function setupAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        let count = 0;
        const duration = 1800;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(count);
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/**
 * Navigation: close offcanvas on link click, smooth scroll
 */
function setupNavigation() {
  // Close offcanvas on nav link click
  const offcanvasEl = document.getElementById('offcanvasNav');
  if (offcanvasEl) {
    const offcanvasLinks = offcanvasEl.querySelectorAll('a[href^="#"]');
    offcanvasLinks.forEach(link => {
      link.addEventListener('click', () => {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (bsOffcanvas) bsOffcanvas.hide();
      });
    });
  }

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Contact Form -> mailto
 */
function setupRfqForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const company = document.getElementById('cf_company').value;
    const name = document.getElementById('cf_name').value;
    const email = document.getElementById('cf_email').value;
    const phone = document.getElementById('cf_phone').value;
    const categoryEl = document.getElementById('cf_category');
    const category = categoryEl ? categoryEl.value : 'Commodity Brokerage';
    const detailsEl = document.getElementById('cf_details');
    const details = detailsEl ? detailsEl.value.trim() : '';

    const subject = encodeURIComponent('Trade Inquiry: ' + (category || 'Commodity') + ' - ' + company);
    let bodyText = 
      'NARAGRO COMMERCIAL TRADE DESK INQUIRY\n' +
      '===========================================\n' +
      'Company Name:   ' + company + '\n' +
      'Contact Person: ' + name + '\n' +
      'Business Email: ' + email + '\n' +
      'Phone / WA:     ' + phone + '\n';
    
    if (category && category !== 'Commodity Brokerage') {
      bodyText += 'Commodity Area: ' + category + '\n';
    }
    if (details) {
      bodyText += 'Details / Specs:\n' + details + '\n';
    }
    bodyText += '\nSent via Naragro Trade Portal (naragro.com.tr)';

    const body = encodeURIComponent(bodyText);
    window.location.href = 'mailto:yca@naragro.com.tr?subject=' + subject + '&body=' + body;

    const sentFeedback = document.getElementById('formSentFeedback');
    if (sentFeedback) {
      sentFeedback.classList.remove('d-none');
      setTimeout(() => {
        sentFeedback.classList.add('d-none');
      }, 5000);
    }
  });
}

/**
 * Synchronize Vegoils Featured Slider with Oil Selector Pills
 */
function setupVegoilsSlider() {
  const sliderEl = document.getElementById('vegoilsFeaturedSlider');
  const pills = document.querySelectorAll('.oil-pill-btn');
  if (sliderEl && pills.length) {
    sliderEl.addEventListener('slide.bs.carousel', (e) => {
      pills.forEach((pill, idx) => {
        if (idx === e.to) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
    });

    pills.forEach((pill, idx) => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  // Support direct navigation to services tab from anywhere
  document.querySelectorAll('a[href="#services"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const servicesTabBtn = document.getElementById('services-tab');
      if (servicesTabBtn) {
        const bsTab = bootstrap.Tab.getOrCreateInstance(servicesTabBtn);
        bsTab.show();
      }
      const targetEl = document.getElementById('products-services');
      if (targetEl) {
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Minimalist Executive Brand Curtain (Quiet Luxury)
 */
function setupSplashScreen() {
  const curtain = document.getElementById('splashScreen');
  if (!curtain) return;

  let isDismissed = false;

  function dismissCurtain() {
    if (isDismissed) return;
    isDismissed = true;

    curtain.classList.add('curtain-lift');
    document.body.classList.remove('curtain-locked');

    setTimeout(() => {
      curtain.style.display = 'none';
      if (window.AOS) window.AOS.refresh();
    }, 850);
  }

  // Smooth editorial reveal after 1.25s
  const timer = setTimeout(dismissCurtain, 1250);

  // Click anywhere immediately lifts curtain
  curtain.addEventListener('click', () => {
    clearTimeout(timer);
    dismissCurtain();
  });

  // Keyboard shortcut (Escape, Space, Enter)
  window.addEventListener('keydown', (e) => {
    if (!isDismissed && (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter')) {
      clearTimeout(timer);
      dismissCurtain();
    }
  });
}




