/**
 * ReactMotion Project Page - Interactive Scripts
 * Browser support: Chrome, Firefox, Safari, Edge (modern versions)
 */

document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initSmoothScroll();
  initVideoGallery();
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

// Interactive video gallery - main player + thumbnail strip + speaker audio
function initVideoGallery() {
  var mainVideo    = document.getElementById('mainVideo');
  var mainLabel    = document.getElementById('mainVideoLabel');
  var mainPlayBtn  = document.getElementById('mainPlayBtn');
  var mainPlayIcon = document.getElementById('mainPlayIcon');
  var thumbs       = document.querySelectorAll('.video-thumb');

  // Speaker panel elements
  var speakerAudio    = document.getElementById('speakerAudio');
  var speakerText     = document.getElementById('speakerText');
  var audioPlayBtn    = document.getElementById('audioPlayBtn');
  var audioPlayIcon   = document.getElementById('audioPlayIcon');
  var audioMuteBtn    = document.getElementById('audioMuteBtn');
  var audioMuteIcon   = document.getElementById('audioMuteIcon');
  var audioProgressFill = document.getElementById('audioProgressFill');
  var audioProgressBar  = document.getElementById('audioProgressBar');
  var audioTime         = document.getElementById('audioTime');

  if (!mainVideo) return;

  var iconPlay  = '<path d="M8 5v14l11-7z"/>';
  var iconPause = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  var iconMuted = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
  var iconSound = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>';

  var isMuted = false;

  // ── Helpers ──────────────────────────────────────────────
  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function updateVideoPlayIcon() {
    if (mainPlayIcon) mainPlayIcon.innerHTML = mainVideo.paused ? iconPlay : iconPause;
  }

  function updateAudioPlayIcon() {
    if (audioPlayIcon) audioPlayIcon.innerHTML = (speakerAudio && speakerAudio.paused) ? iconPlay : iconPause;
  }

  function updateMuteIcon() {
    if (!audioMuteIcon) return;
    audioMuteIcon.innerHTML = isMuted ? iconMuted : iconSound;
    if (audioMuteBtn) audioMuteBtn.classList.toggle('muted', isMuted);
  }

  // ── Audio progress ───────────────────────────────────────
  if (speakerAudio) {
    speakerAudio.addEventListener('timeupdate', function() {
      if (!speakerAudio.duration) return;
      var pct = (speakerAudio.currentTime / speakerAudio.duration) * 100;
      if (audioProgressFill) audioProgressFill.style.width = pct + '%';
      if (audioTime) audioTime.textContent = formatTime(speakerAudio.currentTime);
    });

    speakerAudio.addEventListener('ended', function() {
      if (audioProgressFill) audioProgressFill.style.width = '0%';
      if (audioTime) audioTime.textContent = '0:00';
      updateAudioPlayIcon();
    });

    speakerAudio.addEventListener('play', updateAudioPlayIcon);
    speakerAudio.addEventListener('pause', updateAudioPlayIcon);

    // Click on progress bar to seek
    if (audioProgressBar) {
      audioProgressBar.addEventListener('click', function(e) {
        if (!speakerAudio.duration) return;
        var rect = audioProgressBar.getBoundingClientRect();
        var ratio = (e.clientX - rect.left) / rect.width;
        speakerAudio.currentTime = ratio * speakerAudio.duration;
      });
    }
  }

  // ── Audio play/pause button ──────────────────────────────
  if (audioPlayBtn && speakerAudio) {
    audioPlayBtn.addEventListener('click', function() {
      if (speakerAudio.paused) {
        speakerAudio.play().catch(function() {});
      } else {
        speakerAudio.pause();
      }
    });
  }

  // ── Mute button ──────────────────────────────────────────
  if (audioMuteBtn && speakerAudio) {
    audioMuteBtn.addEventListener('click', function() {
      isMuted = !isMuted;
      speakerAudio.muted = isMuted;
      updateMuteIcon();
    });
  }

  // ── Main video play/pause ────────────────────────────────
  mainVideo.play().catch(function() {});
  updateVideoPlayIcon();
  mainVideo.addEventListener('play', updateVideoPlayIcon);
  mainVideo.addEventListener('pause', updateVideoPlayIcon);

  if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      mainVideo.paused ? mainVideo.play() : mainVideo.pause();
    });
  }
  mainVideo.addEventListener('click', function() {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
  });

  // ── Auto-play speaker audio on load ─────────────────────
  function playAudioAutomatic() {
    if (!speakerAudio) return;
    speakerAudio.currentTime = 0;
    speakerAudio.muted = isMuted;
    speakerAudio.play().catch(function() {});
    updateAudioPlayIcon();
  }

  // Try autoplay; if blocked (no user gesture yet), it will play on first thumb click
  playAudioAutomatic();

  // ── Thumbnail strip ──────────────────────────────────────
  for (var i = 0; i < thumbs.length; i++) {
    (function(thumb) {
      var thumbVideo = thumb.querySelector('video');

      thumb.addEventListener('mouseenter', function() {
        if (thumbVideo && !thumb.classList.contains('active')) {
          thumbVideo.currentTime = 0;
          thumbVideo.play().catch(function() {});
        }
      });

      thumb.addEventListener('mouseleave', function() {
        if (thumbVideo && !thumb.classList.contains('active')) {
          thumbVideo.pause();
          thumbVideo.currentTime = 0;
        }
      });

      thumb.addEventListener('click', function() {
        var src          = thumb.getAttribute('data-src');
        var label        = thumb.getAttribute('data-label');
        var audioSrc     = thumb.getAttribute('data-audio');
        var transcription = thumb.getAttribute('data-transcription');

        // Deactivate all thumbs & stop previews
        for (var j = 0; j < thumbs.length; j++) {
          var tv = thumbs[j].querySelector('video');
          if (tv) { tv.pause(); tv.currentTime = 0; }
          thumbs[j].classList.remove('active');
        }
        thumb.classList.add('active');

        // Update main video
        mainVideo.src = src;
        mainVideo.load();
        mainVideo.play().catch(function() {});
        if (mainLabel) mainLabel.textContent = label;

        // Update speaker panel
        if (speakerText) speakerText.textContent = transcription || '';
        if (speakerAudio && audioSrc) {
          speakerAudio.src = audioSrc;
          speakerAudio.load();
          playAudioAutomatic();
        }
        if (audioProgressFill) audioProgressFill.style.width = '0%';
        if (audioTime) audioTime.textContent = '0:00';
      });
    })(thumbs[i]);
  }
}

// Scroll-triggered animations (with IntersectionObserver fallback)
function initScrollAnimations() {
  var animateElements = document.querySelectorAll(
    '.youtube-embed, .video-gallery, .method-item, .abstract-card, .methodology-figure, .dataset-figure, .pipeline-step, .dataset-stats'
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
