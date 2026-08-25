/* =====================================================
   NOIRÉ — Custom Cursor
===================================================== */

(function () {
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouch) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.innerHTML = '<span></span>';
  document.body.appendChild(cursor);
  const label = cursor.querySelector('span');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function loop() {
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  function setState(state, text) {
    cursor.classList.remove('is-view', 'is-drag', 'is-open', 'is-link');
    if (state) cursor.classList.add(state);
    label.textContent = text || '';
  }

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-cursor]');
    if (!target) {
      setState(null, '');
      return;
    }
    const type = target.dataset.cursor;
    if (type === 'view') setState('is-view', 'View');
    else if (type === 'drag') setState('is-drag', 'Drag');
    else if (type === 'open') setState('is-open', 'Open');
    else if (type === 'link') setState('is-link', '');
    else setState(null, '');
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('[data-cursor]') && !e.relatedTarget?.closest?.('[data-cursor]')) {
      setState(null, '');
    }
  });

  document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));
})();
