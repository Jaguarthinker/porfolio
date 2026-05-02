const TOTAL = 6;
const titles = ['Introduction', 'About', 'Skills', 'Education', 'Projects', 'Contact'];
let current = 0;
let isAnimating = false;

/* ── CUSTOM CURSOR ── */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .cdot, .pcat').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.width = '20px'; cur.style.height = '20px';
    ring.style.width = '60px'; ring.style.height = '60px';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.width = '12px'; cur.style.height = '12px';
    ring.style.width = '36px'; ring.style.height = '36px';
  });
});

/* ── NAVIGATION ── */
function goTo(n) {
  if (n === current || isAnimating || n < 0 || n >= TOTAL) return;
  isAnimating = true;

  const from = document.getElementById('page-' + current);
  const to   = document.getElementById('page-' + n);

  from.classList.add('exit');
  from.classList.remove('active');

  setTimeout(() => {
    from.classList.remove('exit');
    to.classList.add('active');
    isAnimating = false;
  }, 800);

  current = n;

  // progress
  document.getElementById('progressBar').style.width = ((n + 1) / TOTAL * 100) + '%';

  // counter
  document.getElementById('counterNum').textContent =
    String(n + 1).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0');

  // dots
  document.querySelectorAll('.cdot').forEach((d, i) => {
    d.classList.toggle('active', i === n);
  });

  // label
  document.getElementById('pageTitle').textContent = titles[n];

  // hint
  document.getElementById('hint').classList.toggle('hidden', n === TOTAL - 1);

  // WA button
  document.getElementById('waBtn').classList.toggle('show', n === TOTAL - 1);
}

/* ── CLICK ADVANCE ── */
document.getElementById('pagesContainer').addEventListener('click', e => {
  if (e.target.closest('a, button, .cdot, .pcat, .project-link')) return;
  goTo(current + 1);
});

/* ── KEYBOARD ── */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(current + 1);
  if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  goTo(current - 1);
});

/* ── WHEEL ── */
let wheelLock = false;
document.addEventListener('wheel', e => {
  if (wheelLock) return;
  wheelLock = true;
  goTo(current + (e.deltaY > 0 ? 1 : -1));
  setTimeout(() => wheelLock = false, 1000);
});

/* ── TOUCH ── */
let touchY = 0;
document.addEventListener('touchstart', e => touchY = e.touches[0].clientY);
document.addEventListener('touchend', e => {
  const diff = touchY - e.changedTouches[0].clientY;
  if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
});
