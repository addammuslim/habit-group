/* =====================================================
   NOIRÉ — Animation System
   Reusable GSAP animation functions
===================================================== */

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Splits text into wrapped lines (via <br> aware spans) ready for reveal.
 * Expects the element's children to already be individual line elements
 * (e.g. multiple <span class="reveal-line-el"> inside a wrapper), OR will
 * treat direct text as a single line.
 */
function prepareLines(el) {
  const lines = el.querySelectorAll('[data-line]');
  if (lines.length) {
    lines.forEach((line) => {
      if (!line.parentElement.classList.contains('reveal-wrap')) {
        const wrap = document.createElement('span');
        wrap.className = 'reveal-wrap';
        line.parentNode.insertBefore(wrap, line);
        wrap.appendChild(line);
      }
      line.classList.add('reveal-line');
    });
    return Array.from(lines);
  }
  return [];
}

/**
 * revealText — animates lines upward with staggered opacity/translate.
 * @param {string|Element} target
 * @param {object} opts { trigger, start, stagger, delay, duration }
 */
function revealText(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const lines = prepareLines(el);
  if (!lines.length) return;

  gsap.set(lines, { yPercent: 110, opacity: 0 });

  const tween = gsap.to(lines, {
    yPercent: 0,
    opacity: 1,
    duration: opts.duration || 1.1,
    ease: 'expo.out',
    stagger: opts.stagger ?? 0.09,
    delay: opts.delay || 0,
    scrollTrigger: opts.trigger
      ? {
          trigger: opts.trigger || el,
          start: opts.start || 'top 85%',
          once: true,
        }
      : undefined,
  });
  return tween;
}

/**
 * revealImage — clip-path reveal + subtle scale settle.
 */
function revealImage(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const img = el.tagName === 'IMG' ? el : el.querySelector('img');

  gsap.set(el, { clipPath: 'inset(100% 0 0 0)' });
  if (img) gsap.set(img, { scale: 1.12 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: opts.trigger || el,
      start: opts.start || 'top 80%',
      once: true,
    },
  });
  tl.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power4.out', delay: opts.delay || 0 });
  if (img) tl.to(img, { scale: 1, duration: 1.6, ease: 'power3.out' }, '<0.1');
  return tl;
}

/**
 * fadeUp — simple opacity + y fade, scroll-triggered.
 */
function fadeUp(target, opts = {}) {
  const els = typeof target === 'string' ? document.querySelectorAll(target) : [target];
  els.forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: opts.y ?? 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: opts.duration || 1,
        ease: 'power3.out',
        delay: (opts.stagger || 0) * i,
        scrollTrigger: {
          trigger: el,
          start: opts.start || 'top 88%',
          once: true,
        },
      }
    );
  });
}

/**
 * parallaxImage — moves element on Y as page scrolls past it.
 */
function parallaxImage(target, opts = {}) {
  if (REDUCED_MOTION) return;
  const els = typeof target === 'string' ? document.querySelectorAll(target) : [target];
  els.forEach((el) => {
    gsap.to(el, {
      yPercent: opts.amount ?? -12,
      ease: 'none',
      scrollTrigger: {
        trigger: opts.trigger || el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/**
 * horizontalScroll — pins a section and translates an inner track
 * horizontally as the user scrolls vertically. Desktop only.
 */
function horizontalScroll(sectionSel, trackSel, opts = {}) {
  const section = document.querySelector(sectionSel);
  const track = document.querySelector(trackSel);
  if (!section || !track) return;
  if (window.innerWidth < 768) return; // mobile uses native swipe

  const getDistance = () => track.scrollWidth - window.innerWidth;

  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${getDistance()}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    animation: gsap.to(track, {
      x: () => -getDistance(),
      ease: 'none',
    }),
  });
  return st;
}

/**
 * counterAnimation — animates a number from 0 to target.
 */
function counterAnimation(target, opts = {}) {
  const els = typeof target === 'string' ? document.querySelectorAll(target) : [target];
  els.forEach((el) => {
    const end = parseFloat(el.dataset.count || '0');
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const counter = { val: 0 };
    gsap.to(counter, {
      val: end,
      duration: opts.duration || 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate: () => {
        el.textContent = counter.val.toFixed(decimals) + suffix;
      },
    });
  });
}

/**
 * magneticButton — desktop-only magnetic hover pull toward cursor.
 */
function magneticButton(target, opts = {}) {
  if (window.matchMedia('(hover: none)').matches) return;
  const els = typeof target === 'string' ? document.querySelectorAll(target) : [target];
  const strength = opts.strength ?? 0.35;

  els.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: relX * strength,
        y: relY * strength,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

window.NOIRE = window.NOIRE || {};
Object.assign(window.NOIRE, {
  revealText,
  revealImage,
  fadeUp,
  parallaxImage,
  horizontalScroll,
  counterAnimation,
  magneticButton,
  REDUCED_MOTION,
});
