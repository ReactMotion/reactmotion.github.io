/**
 * ReactMotion Project Page - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSmoothScroll();
  initVideoCards();
  initScrollAnimations();
  initMobileNav();
});

// Navbar scroll effect
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Video card interactions - play button overlay
function initVideoCards() {
  document.querySelectorAll('.video-card').forEach(card => {
    const video = card.querySelector('video');
    const playBtn = card.querySelector('.play-btn');
    const overlay = card.querySelector('.video-overlay');

    if (!video || !playBtn) return;

    // Toggle play on overlay click
    overlay?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }
    });

    // Show overlay when video pauses
    video.addEventListener('pause', () => {
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      }
    });

    video.addEventListener('ended', () => {
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      }
    });

    // Hide overlay when playing
    video.addEventListener('play', () => {
      if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }
    });

    // Handle video load error - show placeholder
    video.addEventListener('error', () => {
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.background = 'linear-gradient(135deg, rgba(113, 212, 241, 0.15), rgba(242, 196, 113, 0.15))';
        overlay.innerHTML = `
          <div class="video-placeholder-inner">
            <span class="placeholder-icon">▶</span>
            <span>Video placeholder</span>
            <small>Add your video to videos/ folder</small>
          </div>
        `;
      }
    });
  });
}

// Scroll-triggered animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    '.video-card, .method-item, .abstract-card, .methodology-figure, .dataset-figure, .pipeline-step, .dataset-stats'
  );
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  .video-placeholder-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted, #6b6b8a);
    font-size: 0.9rem;
  }
  .video-placeholder-inner .placeholder-icon {
    font-size: 2.5rem;
    color: var(--cyan, #71d4f1);
    opacity: 0.7;
  }
  .video-placeholder-inner small {
    font-size: 0.75rem;
    opacity: 0.8;
  }
`;
document.head.appendChild(style);

// Mobile navigation toggle
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.classList.remove('active');
    });
  });
}
