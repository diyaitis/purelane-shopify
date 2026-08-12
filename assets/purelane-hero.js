/* Purelane hero product-stage rotator: click a dot, show that slide.
   Auto-advances every 5s, pauses on hover/focus, and respects
   prefers-reduced-motion. Progressive enhancement: with no JS, the
   first slide (already marked .pl-on in the markup) stays visible. */
(function () {
  document.querySelectorAll('[data-section-type="purelane-hero"]').forEach(function (section) {
    var stage = section.querySelector('.pl-hstage');
    var dotsWrap = section.querySelector('.pl-hdots');
    if (!stage || !dotsWrap) return;

    var slides = Array.prototype.slice.call(stage.querySelectorAll('.pl-hslide'));
    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('button'));
    if (slides.length < 2) return;

    var current = 0;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function show(index) {
      current = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('pl-on', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('pl-on', i === index);
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        resetTimer();
      });
    });

    var timer;
    function resetTimer() {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(function () {
        show((current + 1) % slides.length);
      }, 5000);
    }
    resetTimer();

    section.addEventListener('mouseenter', function () { clearInterval(timer); });
    section.addEventListener('mouseleave', resetTimer);
    section.addEventListener('focusin', function () { clearInterval(timer); });
    section.addEventListener('focusout', resetTimer);
  });
})();
