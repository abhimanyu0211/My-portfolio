/* =========================================================
   script.js — all interactions for Abhimanyu's portfolio
   Written in plain vanilla JS, commented so it's easy to follow.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Footer year (auto-updating) ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ---------- 2. Navbar background on scroll ---------- */
  const nav = document.getElementById('nav');
  function handleNavScroll() {
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll);


  /* ---------- 3. Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu whenever a link inside it is clicked
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });


  /* ---------- 4. Smooth scrolling for in-page links ---------- */
  // (html { scroll-behavior: smooth } already handles most of this,
  // but we also account for the fixed navbar height with an offset.)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  });


  /* ---------- 5. Active nav link on scroll (Intersection Observer) ---------- */
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );
  sections.forEach((section) => navObserver.observe(section));


  /* ---------- 6. Scroll-reveal animation (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));


  /* ---------- 7. Hero typing animation ---------- */
  const typingText = document.getElementById('typingText');
  const phrases = [
    'Web Developer in Progress',
    'JavaScript Learner',
    'BCA Student',
    'Future Full-Stack Developer'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      typingText.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1400); // pause at full phrase
        return;
      }
    } else {
      charIndex--;
      typingText.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 35 : 65;
    setTimeout(typeLoop, speed);
  }

  if (typingText) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      typingText.textContent = phrases[0];
    } else {
      typeLoop();
    }
  }


  /* ---------- 8. "Currently Learning" progress bar animates once visible ---------- */
  const progressFill = document.getElementById('progressFill');
  if (progressFill) {
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            progressFill.classList.add('animate');
            progressObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    progressObserver.observe(progressFill);
  }


  /* ---------- 9. Back-to-top button ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------- 10. Contact form validation (front-end only) ---------- */
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formSuccess = document.getElementById('formSuccess');

  function setError(input, errorEl, message) {
    input.classList.toggle('invalid', Boolean(message));
    errorEl.textContent = message || '';
  }

  function validateForm() {
    let isValid = true;

    // Name: required, at least 2 characters
    if (nameInput.value.trim().length < 2) {
      setError(nameInput, document.getElementById('nameError'), 'Please enter your name.');
      isValid = false;
    } else {
      setError(nameInput, document.getElementById('nameError'), '');
    }

    // Email: required, basic pattern check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      setError(emailInput, document.getElementById('emailError'), 'Please enter a valid email.');
      isValid = false;
    } else {
      setError(emailInput, document.getElementById('emailError'), '');
    }

    // Message: required, at least 10 characters
    if (messageInput.value.trim().length < 10) {
      setError(messageInput, document.getElementById('messageError'), 'Message should be at least 10 characters.');
      isValid = false;
    } else {
      setError(messageInput, document.getElementById('messageError'), '');
    }

    return isValid;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formSuccess.textContent = '';

      if (validateForm()) {
        // No backend is connected yet — this simply confirms the form works.
        formSuccess.textContent = "Thanks! This form isn't connected to a backend yet, but validation works.";
        form.reset();
      }
    });

    // Clear individual field errors as the user types
    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) validateForm();
      });
    });
  }

});
