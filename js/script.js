/**
 * ============================================================
 * TITIK.KOMA.DEV; — PRODUCTION SCRIPT
 * Full-Stack Web Developer Personal Portfolio
 * Muhammad Ibnu Hajar Alfadil Nurullah (Ibnu)
 * Pure Vanilla JavaScript — Zero Frameworks
 * ============================================================
 */

'use strict';

/* ──────────────────────────────────────────────────────────────
   INITIALIZATION
   ────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Preloader
  initPreloader();

  // 3. Subtle Magnetic Buttons
  initMagneticButtons();

  // 5. Navbar (scroll effect, mobile menu, active section spy)
  initNavbar();

  // 6. Smooth Scrolling for Internal Links
  initSmoothScroll();

  // 7. Scroll Reveal Animations (IntersectionObserver)
  initScrollReveal();

  // 8. Interactive 3D Developer ID Card
  initDeveloperIdCard();

  // 9. Contact Form Validation & Feedback
  initContactForm();

  // 10. System Notice Modal
  initSystemNoticeModal();

  // 11. Back to Top Button
  initBackToTop();

  // 12. Dynamic Copyright Year
  initDynamicYear();
});


/* ──────────────────────────────────────────────────────────────
   1. PRELOADER
   - Quick, non-blocking splash screen that fades out cleanly
   ────────────────────────────────────────────────────────────── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('is-hidden');
    }, 280);
  });

  // Fallback safety timeout in case window load is delayed
  setTimeout(() => {
    if (!preloader.classList.contains('is-hidden')) {
      preloader.classList.add('is-hidden');
    }
  }, 1200);
}


/* ──────────────────────────────────────────────────────────────
   2. SUBTLE MAGNETIC BUTTON EFFECT
   - Subtle, non-disruptive physical feel on primary actions
   ────────────────────────────────────────────────────────────── */
function initMagneticButtons() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const buttons = document.querySelectorAll('.btn--primary, .btn--secondary, .navbar__toggle');

  buttons.forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Subtle max pull of 4px
      const pullX = x * 0.12;
      const pullY = y * 0.12;
      btn.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
    });

    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        btn.style.transition = '';
      }, 300);
    });
  });
}


/* ──────────────────────────────────────────────────────────────
   4. NAVBAR
   - Scroll glassmorphism state
   - Mobile hamburger toggle with accessibility & body scroll lock
   - Active section tracking via IntersectionObserver
   ────────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.navbar__menu a');

  if (!navbar) return;

  // Scroll threshold
  const SCROLL_THRESHOLD = 40;
  function handleScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu open / close
  function openMenu() {
    if (navMenu) navMenu.classList.add('active');
    if (navToggle) {
      navToggle.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
    }
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) {
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = navMenu && navMenu.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
    navToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  }, { passive: true });

  // Active section indicator using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0 && navLinks.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-74px 0px -40% 0px',
      threshold: 0.2
    });

    sections.forEach((section) => observer.observe(section));
  }
}


/* ──────────────────────────────────────────────────────────────
   5. SMOOTH SCROLLING
   - Offsets fixed navbar height for accurate section alignment
   ────────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const navbarHeight = 74;
      const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    });
  });
}


/* ──────────────────────────────────────────────────────────────
   6. SCROLL REVEAL ANIMATIONS
   - Smooth staggered entrance for cards & sections
   ────────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  // If user prefers reduced motion, reveal instantly
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  });

  reveals.forEach((el) => observer.observe(el));
}


/* ──────────────────────────────────────────────────────────────
   7. INTERACTIVE 3D DEVELOPER ID CARD
   - Draggable with mouse & touch within interaction stage
   - 3D tilt tracking pointer coordinates
   - Click to flip 180 degrees (drag vs click threshold)
   - Dynamic pointer-following radial glow & specular highlight
   - Idle floating levitation animation
   - Prevents accidental mobile page scroll during drag
   - Respects prefers-reduced-motion
   ────────────────────────────────────────────────────────────── */
function initDeveloperIdCard() {
  const card = document.getElementById('idCard');
  const cardInner = document.getElementById('idCardInner');
  const stage = document.getElementById('idCardStage');

  if (!card || !cardInner || !stage) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let isDragging = false;
  let isFlipped = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let originX = 0;
  let originY = 0;
  let totalDragDistance = 0;
  const CLICK_THRESHOLD = 6; // px to distinguish click from drag

  let tiltX = 0;
  let tiltY = 0;
  let isHovered = false;

  // Clamping translation strictly within the stage container
  function clampTranslation(tx, ty) {
    const stageRect = stage.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    // Max allowable offset from center
    const maxBoundX = Math.max(20, (stageRect.width - cardRect.width) / 2 + 30);
    const maxBoundY = Math.max(20, (stageRect.height - cardRect.height) / 2 + 30);

    return {
      x: Math.max(-maxBoundX, Math.min(maxBoundX, tx)),
      y: Math.max(-maxBoundY, Math.min(maxBoundY, ty))
    };
  }

  // Toggle 180° Flip
  function toggleFlip() {
    isFlipped = !isFlipped;
    tiltX = 0;
    tiltY = 0;

    cardInner.style.transition = prefersReducedMotion 
      ? 'none' 
      : 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';

    const baseRotY = isFlipped ? 180 : 0;
    cardInner.style.transform = `rotateY(${baseRotY}deg) rotateX(0deg)`;
  }

  // Pointer Down (Mouse & Touch)
  function handlePointerDown(e) {
    // Left click or touch only
    if (e.button !== undefined && e.button !== 0) return;

    isDragging = true;
    totalDragDistance = 0;
    startX = e.clientX;
    startY = e.clientY;
    originX = currentX;
    originY = currentY;

    card.classList.add('is-dragging');
    card.classList.remove('is-floating');

    try {
      card.setPointerCapture(e.pointerId);
    } catch (_) {}

    card.style.transition = 'none';
    cardInner.style.transition = 'transform 0.12s ease-out';
  }

  // Pointer Move (Mouse & Touch)
  function handlePointerMove(e) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Dynamic glow coordinates (0% to 100%)
    const glowX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const glowY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    card.style.setProperty('--glow-x', `${glowX}%`);
    card.style.setProperty('--glow-y', `${glowY}%`);

    if (isDragging) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      totalDragDistance = Math.hypot(deltaX, deltaY);

      const targetX = originX + deltaX;
      const targetY = originY + deltaY;

      const clamped = clampTranslation(targetX, targetY);
      currentX = clamped.x;
      currentY = clamped.y;

      card.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      // Dynamic drag inertia tilt
      const dragTiltX = Math.max(-8, Math.min(8, -deltaY * 0.1));
      const dragTiltY = Math.max(-8, Math.min(8, deltaX * 0.1));

      const baseRotY = isFlipped ? 180 : 0;
      const finalY = isFlipped ? baseRotY - dragTiltY : baseRotY + dragTiltY;
      const finalX = isFlipped ? -dragTiltX : dragTiltX;

      if (!prefersReducedMotion) {
        cardInner.style.transform = `rotateY(${finalY}deg) rotateX(${finalX}deg)`;
      }
    } else {
      // 3D Pointer-following Tilt on Hover
      isHovered = true;
      card.classList.remove('is-floating');

      if (!prefersReducedMotion) {
        const maxTilt = 12;
        const normX = (e.clientX - centerX) / (rect.width / 2);
        const normY = (e.clientY - centerY) / (rect.height / 2);

        tiltY = Math.max(-maxTilt, Math.min(maxTilt, normX * maxTilt));
        tiltX = Math.max(-maxTilt, Math.min(maxTilt, -normY * maxTilt));

        const baseRotY = isFlipped ? 180 : 0;
        const finalY = isFlipped ? baseRotY - tiltY : baseRotY + tiltY;
        const finalX = isFlipped ? -tiltX : tiltX;

        cardInner.style.transform = `rotateY(${finalY}deg) rotateX(${finalX}deg)`;
      }
    }
  }

  // Pointer Up / End
  function handlePointerUp(e) {
    if (!isDragging) return;

    isDragging = false;
    card.classList.remove('is-dragging');

    try {
      card.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // Check click vs drag threshold
    if (totalDragDistance < CLICK_THRESHOLD) {
      toggleFlip();
    } else {
      // Return smoothly or keep in bound
      tiltX = 0;
      tiltY = 0;
      card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
      cardInner.style.transition = prefersReducedMotion 
        ? 'none' 
        : 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';

      const baseRotY = isFlipped ? 180 : 0;
      cardInner.style.transform = `rotateY(${baseRotY}deg) rotateX(0deg)`;

      // If near origin, re-enable floating
      if (Math.hypot(currentX, currentY) < 15 && !isHovered && !prefersReducedMotion) {
        card.classList.add('is-floating');
      }
    }
  }

  // Pointer Leave
  function handlePointerLeave() {
    if (isDragging) return;

    isHovered = false;
    tiltX = 0;
    tiltY = 0;

    cardInner.style.transition = prefersReducedMotion 
      ? 'none' 
      : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    const baseRotY = isFlipped ? 180 : 0;
    cardInner.style.transform = `rotateY(${baseRotY}deg) rotateX(0deg)`;

    if (!prefersReducedMotion) {
      card.classList.add('is-floating');
    }
  }

  // Attach Pointer Events
  card.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', handlePointerUp);
  card.addEventListener('pointerleave', handlePointerLeave);

  // Keyboard Accessibility: Space or Enter flips card
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  });

  // Start with floating animation if motion allowed
  if (!prefersReducedMotion) {
    card.classList.add('is-floating');
  }
}


/* ──────────────────────────────────────────────────────────────
   8. CONTACT FORM VALIDATION & FEEDBACK
   - Pure client-side validation
   - Helpful, polite feedback notice with no fake backend claims
   ────────────────────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedbackEl = document.getElementById('formFeedback');

  if (!form) return;

  const fields = {
    name: {
      input: document.getElementById('formName'),
      error: document.getElementById('nameError'),
      validate: (val) => val.trim().length >= 3,
      msg: 'Nama lengkap wajib diisi minimal 3 karakter.'
    },
    email: {
      input: document.getElementById('formEmail'),
      error: document.getElementById('emailError'),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim()),
      msg: 'Format alamat email tidak valid (contoh: nama@domain.com).'
    },
    subject: {
      input: document.getElementById('formSubject'),
      error: document.getElementById('subjectError'),
      validate: (val) => val.trim().length >= 3,
      msg: 'Subjek diskusi wajib diisi minimal 3 karakter.'
    },
    message: {
      input: document.getElementById('formMessage'),
      error: document.getElementById('messageError'),
      validate: (val) => val.trim().length >= 10,
      msg: 'Pesan wajib diisi minimal 10 karakter agar kebutuhan proyek jelas.'
    }
  };

  function validateField(key) {
    const field = fields[key];
    if (!field || !field.input) return true;

    const isValid = field.validate(field.input.value);
    if (!isValid) {
      field.input.classList.add('is-invalid');
      if (field.error) {
        field.error.textContent = field.msg;
        field.error.classList.add('is-visible');
      }
      return false;
    } else {
      field.input.classList.remove('is-invalid');
      if (field.error) {
        field.error.textContent = '';
        field.error.classList.remove('is-visible');
      }
      return true;
    }
  }

  // Clear error on input
  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    if (field && field.input) {
      field.input.addEventListener('input', () => {
        field.input.classList.remove('is-invalid');
        if (field.error) {
          field.error.textContent = '';
          field.error.classList.remove('is-visible');
        }
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    Object.keys(fields).forEach((key) => {
      const ok = validateField(key);
      if (!ok) allValid = false;
    });

    if (allValid) {
      const senderName = fields.name.input.value.trim();
      const senderEmail = fields.email.input.value.trim();

      if (feedbackEl) {
        feedbackEl.innerHTML = `
          <strong>Terima kasih, ${senderName}!</strong><br>
          Pesan Anda telah berhasil dicatat. Karena portofolio ini adalah website statis tanpa server backend langsung, Anda juga disarankan menghubungi Ibnu secara langsung melalui WhatsApp atau Email resmi untuk respon cepat.
        `;
        feedbackEl.className = 'form__feedback is-success';
        feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
    }
  });
}


/* ──────────────────────────────────────────────────────────────
   9. SYSTEM NOTICE MODAL
   - Explains internal government system access restrictions
   ────────────────────────────────────────────────────────────── */
function initSystemNoticeModal() {
  const modal = document.getElementById('systemNoticeModal');
  const triggerBtn = document.getElementById('btnProjectNotice');
  const closeBtn = document.getElementById('modalCloseBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');
  const overlay = document.getElementById('modalOverlay');
  const contactBtn = document.getElementById('modalContactBtn');

  if (!modal || !triggerBtn) return;

  function openModal() {
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    triggerBtn.focus();
  }

  triggerBtn.addEventListener('click', openModal);

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
  if (contactBtn) contactBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}


/* ──────────────────────────────────────────────────────────────
   10. BACK TO TOP BUTTON
   - Appears after scroll depth of 400px
   ────────────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  function toggleBackToTop() {
    if (window.scrollY > 400) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


/* ──────────────────────────────────────────────────────────────
   11. DYNAMIC CURRENT YEAR
   ────────────────────────────────────────────────────────────── */
function initDynamicYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
