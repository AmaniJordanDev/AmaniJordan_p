// Amani Jordan — script.js

// ── Custom Cursor
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');

if (cursor && trail) {
  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateTrail() {
    trail.style.left = mx + 'px';
    trail.style.top = my + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
}

// ── Navbar scroll behavior
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav state
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ── Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

// ── Scroll Reveal
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');

      // Animate skill bars when they come into view
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.classList.add('animated');
      });
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Also observe skill cards specifically for bar animation
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => bar.classList.add('animated'), 300);
      });
    }
  });
}, { threshold: 0.3 });

skillCards.forEach(card => skillObserver.observe(card));

// ── Hero role cycling
const roles = [
  'Freelance Developer',
  'Frontend Coder',
  'Digital Creator',
  'Content Creator',
  'UI/UX Thinker',
  'Brand Builder'
];

const roleEl = document.getElementById('roleCycle');
if (roleEl) {
  let roleIndex = 0;

  function cycleRole() {
    roleEl.style.opacity = '0';
    roleEl.style.transform = 'translateY(8px)';

    setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleEl.textContent = roles[roleIndex];
      roleEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      roleEl.style.opacity = '1';
      roleEl.style.transform = 'translateY(0)';
    }, 320);
  }

  roleEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  setInterval(cycleRole, 2600);
}

// ── Hero canvas particle grid
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, dots = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const cols = Math.ceil(W / 60);
    const rows = Math.ceil(H / 60);
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        dots.push({
          x: c * 60,
          y: r * 60,
          ox: c * 60,
          oy: r * 60,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.2 + 0.3
        });
      }
    }
  }

  function drawDots() {
    ctx.clearRect(0, 0, W, H);

    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;

      if (Math.abs(d.x - d.ox) > 20) d.vx *= -1;
      if (Math.abs(d.y - d.oy) > 20) d.vy *= -1;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139,92,246,0.4)';
      ctx.fill();
    });

    // Draw faint lines between close dots
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 70) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 70)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawDots);
  }

  window.addEventListener('resize', resize);
  resize();
  drawDots();
}

// ── Contact form
const form = document.getElementById('contactForm');
const successEl = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) return;

    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitText.textContent = 'Send Message';
      form.reset();
      if (successEl) {
        successEl.classList.add('visible');
        setTimeout(() => successEl.classList.remove('visible'), 5000);
      }
    }, 1400);
  });
}

// ── Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
