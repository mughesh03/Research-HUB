const toggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

if (toggle && mobileNav) {
  toggle.addEventListener('click', () => {
    const open = mobileNav.style.display === 'flex';
    mobileNav.style.display = open ? 'none' : 'flex';
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id) || document.querySelector(`[id="${id}"]`) || document.querySelector(`[name="${id}"]`);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (mobileNav) mobileNav.style.display = 'none';
    }
  });
});

const form = document.querySelector('.cta-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value || '';
    alert(`Thanks! We’ll follow up at ${email}.`);
    form.reset();
  });
}

const loginBtn = document.getElementById('google-login');
const logoutBtn = document.getElementById('logout');
const accountBadge = document.getElementById('account-badge');

async function refreshAuth() {
  try {
    const res = await fetch('/api/me', { credentials: 'include' });
    if (!res.ok) throw new Error('unauth');
    const me = await res.json();
    if (me && me.email) {
      if (accountBadge) accountBadge.textContent = me.email;
      if (loginBtn) loginBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    } else {
      if (accountBadge) accountBadge.textContent = '';
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  } catch (e) {
    if (accountBadge) accountBadge.textContent = '';
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}
refreshAuth();

if (logoutBtn) {
  logoutBtn.addEventListener('click', async e => {
    e.preventDefault();
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    refreshAuth();
  });
}