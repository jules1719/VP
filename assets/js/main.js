// HydroSip – landing page interactions
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // Close the mobile menu after choosing a link
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  // FAQ: keep only one answer open at a time
  const items = document.querySelectorAll('.faq details');
  items.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
