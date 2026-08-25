/* =====================================================
   NOIRÉ — Main
   Site bootstrap: loader, hero sequence, generic reveals
===================================================== */

(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  function runLoader(onDone) {
    const loader = document.getElementById('loader');
    if (!loader) return onDone();

    if (reduced) {
      loader.style.display = 'none';
      return onDone();
    }

    const fill = loader.querySelector('.loader-bar-fill');
    const count = loader.querySelector('.loader-count');
    const counter = { val: 0 };

    gsap.to(counter, {
      val: 100,
      duration: 0.95,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(counter.val);
        if (count) count.textContent = String(v).padStart(2, '0') + '%';
        if (fill) fill.style.width = v + '%';
      },
      onComplete: () => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.6,
          ease: 'power4.inOut',
          delay: 0.05,
          onComplete: () => {
            loader.style.display = 'none';
            onDone();
          },
        });
      },
    });
  }

  /* ---------- Hero sequence (home only) ---------- */
  function playHero() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const img = hero.querySelector('.hero-media img, .hero-media video');
    const overlay = hero.querySelector('.hero-overlay');
    const label = hero.querySelector('.hero-label');
    const heroLines = hero.querySelectorAll('.hero-title [data-line]');
    const bl = hero.querySelector('.hero-bl');
    const br = hero.querySelector('.hero-br');
    const nav = document.querySelector('.nav-bar');

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    if (img) tl.fromTo(img, { scale: 1.16 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0);
    if (overlay) tl.fromTo(overlay, { opacity: 0.9 }, { opacity: 1, duration: 1.2 }, 0);
    if (nav) tl.fromTo(nav, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.8 }, 0.2);
    if (label) tl.fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9 }, 0.3);

    if (heroLines.length) {
      tl.fromTo(
        heroLines,
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'expo.out' },
        0.45
      );
    }
    if (bl) tl.fromTo(bl, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 }, 1.05);
    if (br) tl.fromTo(br, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 }, 1.1);
  }

  /* ---------- Generic page-level fade for elements without bespoke handling ---------- */
  function initGenericReveals() {
    if (window.NOIRE && window.NOIRE.fadeUp) {
      document.querySelectorAll('[data-fade]').forEach((el) => {
        window.NOIRE.fadeUp(el, { y: 24 });
      });
    }
    if (window.NOIRE && window.NOIRE.revealText) {
      document.querySelectorAll('[data-reveal-text]').forEach((el) => {
        window.NOIRE.revealText(el);
      });
    }
    if (window.NOIRE && window.NOIRE.revealImage) {
      document.querySelectorAll('[data-reveal-image]').forEach((el) => {
        window.NOIRE.revealImage(el);
      });
    }
    if (window.NOIRE && window.NOIRE.counterAnimation) {
      window.NOIRE.counterAnimation('[data-count]');
    }
    if (window.NOIRE && window.NOIRE.magneticButton) {
      window.NOIRE.magneticButton('[data-magnetic]');
    }
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    ScrollTrigger.refresh();
    runLoader(() => {
      playHero();
      initGenericReveals();
      ScrollTrigger.refresh();
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
