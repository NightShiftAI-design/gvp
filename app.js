/* ============================================
   GVP — app.js v2
   All original functionality preserved.
   ============================================ */

// ---- Year ----
document.querySelectorAll('#year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

// ---- Reveal on scroll ----
const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-right]');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Slight stagger for siblings
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-in');
        }, delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    io.observe(el);
  });
} else {
  // Fallback: show everything
  revealEls.forEach(el => el.classList.add('is-in'));
}

// ---- Copy template button ----
const toast = document.getElementById('toast');

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

document.querySelectorAll('.js-copy').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    if (!text) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => showToast('Template copied to clipboard'))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  });
});

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try {
    document.execCommand('copy');
    showToast('Template copied to clipboard');
  } catch {
    showToast('Could not copy — please copy manually');
  }
  document.body.removeChild(ta);
}

// ---- Sticky nav shadow on scroll ----
const navbar = document.getElementById('navbar');
if (navbar) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.style.borderBottomColor = window.scrollY > 10
          ? 'rgba(245,240,232,0.1)'
          : '';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ---- Active nav link highlight (index only) ----
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
  const sections = ['work', 'services', 'about', 'contact'];
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
}
