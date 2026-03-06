/**
 * ReactMotion Project Page - Interactive Scripts
 * Browser support: Chrome, Firefox, Safari, Edge (modern versions)
 */

document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initSmoothScroll();
  initVideoCards();
  initScrollAnimations();
  initMobileNav();
});

// Navbar scroll effect
function initNavbar() {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  var anchors = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        if ('scrollBehavior' in document.documentElement.style) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          target.scrollIntoView(true);
        }
      }
    });
  }
}

// Video card interactions - play button overlay & card click
function initVideoCards() {
  var cards = document.querySelectorAll('.video-card');
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var video = card.querySelector('video');
    var playBtn = card.querySelector('.play-btn');
    var overlay = card.querySelector('.video-overlay');

    if (!video || !playBtn) continue;

    var playVideo = function() {
      if (video.paused) {
        video.play();
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      } else {
        video.pause();
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      }
    };

    // Toggle play on overlay click
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        e.stopPropagation();
        playVideo();
      });
    }

    // Click on video area (when playing) to pause
    video.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!video.paused) playVideo();
    });

    // Show overlay when video pauses
    video.addEventListener('pause', function() {
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      }
    });

    video.addEventListener('ended', function() {
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      }
    });

    // Hide overlay when playing
    video.addEventListener('play', function() {
      if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }
    });

    // Handle video load error - show placeholder
    video.addEventListener('error', function() {
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
  }
}

// Scroll-triggered animations (with IntersectionObserver fallback)
function initScrollAnimations() {
  var animateElements = document.querySelectorAll(
    '.video-card, .method-item, .abstract-card, .methodology-figure, .dataset-figure, .pipeline-step, .dataset-stats'
  );

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      for (var j = 0; j < entries.length; j++) {
        var entry = entries[j];
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    for (var i = 0; i < animateElements.length; i++) {
      var el = animateElements[i];
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    }
  } else {
    // Fallback: show all elements immediately
    for (var k = 0; k < animateElements.length; k++) {
      animateElements[k].style.opacity = '1';
      animateElements[k].style.transform = 'none';
    }
  }
}

// Add animation styles dynamically
var style = document.createElement('style');
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

  toggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    toggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  var links = navLinks.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function() {
      navLinks.classList.remove('active');
      toggle.classList.remove('active');
    });
  }
}
