// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 2000);
});

// ── CUSTOM CURSOR (dot only) ──
const dot = document.getElementById('cursorDot');
let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

// ── SCROLL ──
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('scrollProgress').style.width = pct + '%';
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
});

// ── HAMBURGER ──
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileNav');
ham.addEventListener('click', () => {
  ham.classList.toggle('active');
  mob.classList.toggle('open');
});
function closeMobile() {
  ham.classList.remove('active');
  mob.classList.remove('open');
}

// ── TYPEWRITER ──
const phrases = ['Frontend Developer', 'UI/UX Designer', 'Python Developer', 'AI Enthusiast'];
let pi = 0, ci = 0, del = false;
const tel = document.getElementById('typeText');

function type() {
  const cur = phrases[pi];
  if (!del) {
    tel.textContent = cur.slice(0, ci++);
    if (ci > cur.length) { del = true; setTimeout(type, 1400); return; }
  } else {
    tel.textContent = cur.slice(0, ci--);
    if (ci < 0) { del = false; pi = (pi + 1) % phrases.length; ci = 0; setTimeout(type, 300); return; }
  }
  setTimeout(type, del ? 60 : 90);
}
type();

// ── SCROLL REVEAL ──
const io = new IntersectionObserver(
  entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
  { threshold: 0.08 }
);
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ── CERTIFICATE MODAL ──
// imgPath = 7th argument, e.g. 'certificates/ai-foundation.jpg'
function openCert(title, issuer, year, cat, iconClass, org, imgPath) {
  document.getElementById('modalTitle').textContent  = title;
  document.getElementById('modalIssuer').textContent = issuer;
  document.getElementById('modalYear').textContent   = year;
  document.getElementById('modalCat').textContent    = cat;
  // Render FA icon in badge
  const badge = document.getElementById('modalBadge');
  const prefix = iconClass.startsWith('fab') ? 'fab' : 'fas';
  const cls = iconClass.replace('fab ','').replace('fas ','');
  badge.innerHTML = '<i class="' + prefix + ' ' + cls + '" style="color:#22d3ee;font-size:1.5rem"></i>';

  // Set the certificate image
  const imgEl = document.getElementById('modalCertImg');
  imgEl.src = imgPath;
  imgEl.alt = title;

  document.getElementById('certModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal(e, force) {
  if (force || e.target === document.getElementById('certModal')) {
    document.getElementById('certModal').classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCertModal(null, true);
});

// ── STATS COUNTER ANIMATION ──
function animateCounter(el, target, decimals = 0) {
  const duration = 1800;
  const start = performance.now();
  const startVal = 0;
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out expo
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = startVal + (target - startVal) * eased;
    el.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
  }
  requestAnimationFrame(update);
}

// Trigger counters when stats bar becomes visible
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const statsIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.stat-number[data-target]').forEach(el => {
          const target = parseFloat(el.dataset.target);
          const decimals = el.dataset.target.includes('.') ? 2 : 0;
          animateCounter(el, target, decimals);
        });
        statsIO.disconnect();
      }
    });
  }, { threshold: 0.4 });
  statsIO.observe(statsBar);
}

// ── ACTIVE NAV HIGHLIGHT ON SCROLL ──
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function setActiveNav() {
  let current = '';
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) {
      a.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav(); // run on load too

// ── TECH STACK FILTER ──
const tsFilters = document.querySelectorAll('.ts-filter');
const tsCards   = document.querySelectorAll('.ts-card');

tsFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    // Active state on button
    tsFilters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    tsCards.forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
        // Re-trigger entrance animation
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'tsCardIn 0.35s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});