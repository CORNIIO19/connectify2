document.addEventListener('DOMContentLoaded', () => {
  if (typeof Lenis === 'undefined') return;

  const sections = Array.from(document.querySelectorAll('main > section'));
  const footer = document.querySelector('body > footer');
  if (footer) sections.push(footer);
  if (sections.length === 0) return;

  const lenis = new Lenis({
    duration: .05,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1
  });

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  let activeIndex = 0;
  let isTransitioning = false;
  let lastEmittedIndex = -1;

  const emitSectionChange = () => {
    if (activeIndex === lastEmittedIndex) return;
    lastEmittedIndex = activeIndex;

    const currentSection = sections[activeIndex];
    if (!currentSection) return;

    window.dispatchEvent(new CustomEvent('connectify:sectionchange', {
      detail: {
        index: activeIndex,
        id: currentSection.id || '',
        element: currentSection
      }
    }));
  };

  const updateActiveIndex = () => {
    const scrollY = window.scrollY;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    sections.forEach((section, index) => {
      const distance = Math.abs(section.offsetTop - scrollY);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    activeIndex = nearestIndex;
    emitSectionChange();
  };

  const goToIndex = (index, options = {}) => {
    const targetIndex = clamp(index, 0, sections.length - 1);
    const force = options.force === true;

    if (!force && (isTransitioning || targetIndex === activeIndex)) return;

    isTransitioning = true;
    activeIndex = targetIndex;
    emitSectionChange();

    lenis.scrollTo(sections[targetIndex], {
      duration: 1,
      lock: true,
      onComplete: () => {
        isTransitioning = false;
        activeIndex = targetIndex;
        emitSectionChange();
      }
    });
  };

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  window.addEventListener('wheel', (event) => {
    const delta = event.deltaY;
    if (Math.abs(delta) < 8) return;

    event.preventDefault();

    if (isTransitioning) return;

    if (delta > 0) {
      goToIndex(activeIndex + 1);
    } else {
      goToIndex(activeIndex - 1);
    }
  }, { passive: false });

  window.addEventListener('keydown', (event) => {
    const tagName = event.target?.tagName;
    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || event.target?.isContentEditable) return;

    const key = event.key;
    const goNext = key === 'ArrowDown' || key === 'PageDown' || key === ' ';
    const goPrev = key === 'ArrowUp' || key === 'PageUp';

    if (!goNext && !goPrev) return;

    event.preventDefault();

    if (isTransitioning) return;

    goToIndex(goNext ? activeIndex + 1 : activeIndex - 1);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const targetIndex = sections.indexOf(target);

      if (targetIndex >= 0) {
        goToIndex(targetIndex, { force: true });
      } else {
        lenis.scrollTo(target, { duration: 1 });
      }
    });
  });

  updateActiveIndex();
  window.addEventListener('resize', updateActiveIndex);
});
