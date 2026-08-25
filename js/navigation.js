/* =====================================================
   NOIRÉ — Navigation
===================================================== */

(function () {
  const navBar = document.querySelector('.nav-bar');
  const menuBtn = document.querySelector('.nav-menu-btn');
  const fullMenu = document.getElementById('full-menu');
  const menuItems = fullMenu ? fullMenu.querySelectorAll('.menu-item') : [];
  const menuBgs = fullMenu ? fullMenu.querySelectorAll('.menu-bg') : [];
  let isOpen = false;
  let isAnimating = false;

  /* Navbar shrink on scroll */
  function onScroll() {
    if (!navBar) return;
    if (window.scrollY > 40) navBar.classList.add('scrolled');
    else navBar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu image preview on hover (desktop) */
  menuItems.forEach((item) => {
    const bgKey = item.dataset.bg;
    item.addEventListener('mouseenter', () => {
      menuBgs.forEach((bg) => bg.classList.toggle('active', bg.dataset.bg === bgKey));
    });
  });

  function openMenu() {
    if (isAnimating || isOpen) return;
    isAnimating = true;
    isOpen = true;
    document.body.classList.add('menu-open');
    fullMenu.style.visibility = 'visible';

    const tl = gsap.timeline({ onComplete: () => (isAnimating = false) });
    tl.set(fullMenu, { clipPath: 'inset(0 0 100% 0)' });
    tl.to(fullMenu, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'power4.inOut' });
    tl.fromTo(
      menuItems,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06 },
      '-=0.35'
    );
  }

  function closeMenu() {
    if (isAnimating || !isOpen) return;
    isAnimating = true;
    isOpen = false;
    document.body.classList.remove('menu-open');

    const tl = gsap.timeline({
      onComplete: () => {
        fullMenu.style.visibility = 'hidden';
        isAnimating = false;
      },
    });
    tl.to(menuItems, { yPercent: -110, opacity: 0, duration: 0.5, ease: 'power3.in', stagger: 0.03 });
    tl.to(fullMenu, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'power4.inOut' }, '-=0.2');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      isOpen ? closeMenu() : openMenu();
    });
  }

  const closeBtn = document.querySelector('.menu-close');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  /* Close menu when a menu link is clicked (transition takes over) */
  menuItems.forEach((item) => {
    const link = item.querySelector('a');
    if (link) link.addEventListener('click', () => {
      isOpen = false;
      document.body.classList.remove('menu-open');
    });
  });

  window.NOIRE = window.NOIRE || {};
  window.NOIRE.closeMenu = closeMenu;
})();
