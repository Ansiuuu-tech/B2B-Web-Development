/**
 * Maruti Trading Co. - Custom JavaScript
 * Add interactive features and micro-animations here.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal, .reveal-fade, .reveal-left, .reveal-right, .reveal-stagger');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, we don't need to track it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters view fully
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // 2. NAV BAR SCROLL ACTIVE STATE
  const nav = document.querySelector('nav');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Init on page load

  // 3. CUSTOM REACTIVE CURSOR
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorRing = document.getElementById('custom-cursor-ring');

  if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0; // Actual mouse position
    let ringX = 0, ringY = 0;   // Interpolated ring position
    let isMoving = false;

    // Linear interpolation function for smooth trailing
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isMoving) {
        // Enable cursor visual on first move
        document.body.classList.add('custom-cursor-enabled');
        ringX = mouseX;
        ringY = mouseY;
        isMoving = true;
      }

      // Position the dot instantly
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Animate the ring smoothly
    const animateRing = () => {
      if (isMoving) {
        ringX = lerp(ringX, mouseX, 0.15); // Adjust interpolation speed (lower = slower/smoother)
        ringY = lerp(ringY, mouseY, 0.15);
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      document.body.classList.remove('custom-cursor-enabled');
      isMoving = false;
    });

    // Handle cursor hover states on interactive items
    const hoverTargets = document.querySelectorAll('a, button, .cat-card, .review-card, .showcase-card, .btn-primary, .btn-ghost, .btn-dark, .btn-outline-dark, .tile-cell, iframe');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // 4. SPOTLIGHT GLOW EFFECT FOR CATEGORY CARDS
  const catCards = document.querySelectorAll('.cat-card, .showcase-card');
  catCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 5. 3D PARALLAX TILT EFFECT FOR CARDS (Desktop only to prevent issues on touch screens)
  const isTouchDevice = () => {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
  };

  if (!isTouchDevice()) {
    const tiltCards = document.querySelectorAll('.cat-card, .review-card, .showcase-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();

        // Calculate normalized mouse positions relative to center of the card
        const cardWidth = rect.width;
        const cardHeight = rect.height;
        const centerX = rect.left + cardWidth / 2;
        const centerY = rect.top + cardHeight / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Convert to rotation angles (max 10 degrees)
        const rotateY = (mouseX / (cardWidth / 2)) * 10;
        const rotateX = -(mouseY / (cardHeight / 2)) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.style.transition = 'transform 0.1s ease-out, border-color 0.25s, background 0.25s, box-shadow 0.25s';

      card.addEventListener('mouseleave', () => {
        // Reset transformation smoothly
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }
});
