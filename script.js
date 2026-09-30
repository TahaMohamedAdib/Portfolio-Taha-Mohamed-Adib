const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const menuLinks = mobileMenu.querySelectorAll('a');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.classList.toggle('is-open', open);
  mobileMenu.inert = !open;
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
menuLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 50px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

const progress = document.querySelector('.reading-progress');
const header = document.querySelector('.site-header');
let ticking = false;
function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${available > 0 ? window.scrollY / available : 0})`;
  header.classList.toggle('is-scrolled', window.scrollY > 32);
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateProgress);
    ticking = true;
  }
}, { passive: true });
updateProgress();

document.getElementById('year').textContent = new Date().getFullYear();

let caseOpener = null;
document.querySelectorAll('[data-case]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const dialog = document.getElementById(trigger.dataset.case);
    if (!dialog) return;
    caseOpener = trigger;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});

document.querySelectorAll('.case-dialog').forEach(dialog => {
  dialog.querySelector('[data-close-case]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    caseOpener?.focus();
    caseOpener = null;
  });
});
