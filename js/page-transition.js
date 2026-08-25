/* =====================================================
   NOIRÉ — Page Transitions
===================================================== */

(function () {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On load: overlay starts covering the page, then exits upward to reveal content.
  gsap.set(overlay, { y: '0%' });

  window.addEventListener('DOMContentLoaded', () => {
    if (reduced) {
      gsap.set(overlay, { y: '-101%' });
      return;
    }
    gsap.to(overlay, { y: '-101%', duration: 0.7, ease: 'power4.inOut', delay: 0.05 });
  });

  function isInternalLink(link) {
    if (!link) return false;
    if (link.target === '_blank') return false;
    if (link.hasAttribute('download')) return false;
    if (link.dataset.noTransition !== undefined) return false;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    try {
      const url = new URL(href, window.location.href);
      return url.origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!isInternalLink(link)) return;
    const href = link.getAttribute('href');

    e.preventDefault();
    if (reduced) {
      window.location.href = href;
      return;
    }

    if (window.NOIRE && window.NOIRE.closeMenu) window.NOIRE.closeMenu();

    gsap.timeline()
      .to(overlay, { y: '0%', duration: 0.55, ease: 'power4.inOut' })
      .call(() => {
        window.location.href = href;
      });
  });
})();
