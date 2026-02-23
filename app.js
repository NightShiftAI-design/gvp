/* ============================================
   GVP — app.js v3
   ============================================ */

// ---- Year ----
document.querySelectorAll('#year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ---- Obfuscated email injection ----
// Email is never in the HTML — assembled here at runtime only
(function () {
  const el = document.getElementById('js-email-link');
  if (!el) return;
  const u = 'shiv.06';
  const d = 'hotmail.co.uk';
  const s = 'Project Inquiry \u2014 GVP';
  const b = 'Hey Ghanshyam, I\u2019m reaching out about [project/opportunity]. Here\u2019s my context: ';
  el.href = 'mailto:' + u + '@' + d
    + '?subject=' + encodeURIComponent(s)
    + '&body=' + encodeURIComponent(b);
})();

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
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-in');
        }, delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-in'));
}

// ---- Toast ----
const toast = document.getElementById('toast');
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ---- Sticky nav border on scroll ----
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
