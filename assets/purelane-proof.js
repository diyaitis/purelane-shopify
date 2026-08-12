/* Purelane proof rotator: purely decorative (aria-hidden), so this only
   auto-advances on a timer - no manual controls needed. Respects
   prefers-reduced-motion; with no JS, the first image (already marked
   .pl-on) stays visible. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('[data-section-type="purelane-proof"]').forEach(function (section) {
    var frame = section.querySelector('.pl-frame');
    var capB = section.querySelector('.pl-cap b');
    var capSpan = section.querySelector('.pl-cap span');
    var dotsWrap = section.querySelector('.pl-dots');
    if (!frame) return;

    var images = Array.prototype.slice.call(frame.querySelectorAll('img'));
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.querySelectorAll('i')) : [];
    if (images.length < 2) return;

    var current = 0;
    setInterval(function () {
      current = (current + 1) % images.length;
      images.forEach(function (img, i) { img.classList.toggle('pl-on', i === current); });
      dots.forEach(function (dot, i) { dot.classList.toggle('pl-on', i === current); });
      var active = images[current];
      if (capB) capB.textContent = active.getAttribute('data-name') || '';
      if (capSpan) capSpan.textContent = active.getAttribute('data-note') || '';
    }, 3200);
  });
})();
