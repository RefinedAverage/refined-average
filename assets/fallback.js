
(() => {
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (reducedMotion) return;

  if (!('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-ready');

  const elements = document.querySelectorAll(
    '.pillar, .method-step, .principles > div, ' +
    '.video-card, .statement-content, .section-heading'
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  elements.forEach(element => {
    observer.observe(element);
  });
})();
