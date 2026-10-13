'use strict';
const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
function syncThemeLabel() {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  themeButton?.setAttribute('aria-label', `Switch to ${next} theme`);
  themeButton?.setAttribute('title', `Switch to ${next} theme`);
}
syncThemeLabel();
themeButton?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('aarav-theme', root.dataset.theme); } catch (_) {}
  syncThemeLabel();
});
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-category]')];
filters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => { card.hidden = selected !== 'all' && card.dataset.category !== selected; });
  const count = cards.filter(card => !card.hidden).length;
  document.getElementById('filter-status').textContent = `Showing ${count} project${count === 1 ? '' : 's'}`;
}));
const copyButton = document.querySelector('.copy-email');
copyButton?.addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(copyButton.dataset.email);
    status.textContent = 'Email copied.';
  } catch (_) {
    status.textContent = 'Select and copy the email address above.';
  }
});
document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });
