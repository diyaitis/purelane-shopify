/* Scroll-reveal for .pl-rv elements, shared by every Purelane section.
   Progressive enhancement: .pl-rv content is fully visible by default
   (see purelane-shared.css) so it is never hidden from crawlers or from
   users whose script fails to load. This only ARMS the hide-then-reveal
   animation once JS has actually run. */
(function () {
  var targets = document.querySelectorAll('.pl-rv');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return; // stay in the default fully-visible state, no animation needed
  }

  document.body.classList.add('pl-armed');

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('pl-in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );
  targets.forEach(function (el) { io.observe(el); });
})();
