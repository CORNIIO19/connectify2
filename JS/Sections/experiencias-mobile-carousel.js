document.addEventListener('DOMContentLoaded', () => {
  const experiencesSection = document.querySelector('#experiencias');
  const track = experiencesSection?.querySelector('.parent');
  if (!experiencesSection || !track) return;

  const baseSlides = Array.from(track.children);
  if (baseSlides.length <= 1) return;

  const mobileBreakpoint = 768;
  const intervalMs = 3200;
  const baseCount = baseSlides.length;
  let currentIndex = 1;
  let autoplayId = null;
  let viewport = null;
  let hasClones = false;

  const isMobile = () => window.innerWidth <= mobileBreakpoint;

  const ensureViewport = () => {
    if (viewport || !track.parentElement) return;
    viewport = document.createElement('div');
    viewport.className = 'experiencias-carousel-viewport';
    track.parentElement.insertBefore(viewport, track);
    viewport.appendChild(track);
  };

  const removeViewport = () => {
    if (!viewport || !viewport.parentElement) {
      viewport = null;
      return;
    }

    viewport.parentElement.insertBefore(track, viewport);
    viewport.remove();
    viewport = null;
  };

  const setupInfiniteSlides = () => {
    if (hasClones) return;

    const firstClone = baseSlides[0].cloneNode(true);
    const lastClone = baseSlides[baseCount - 1].cloneNode(true);
    firstClone.classList.add('is-carousel-clone');
    lastClone.classList.add('is-carousel-clone');

    track.insertBefore(lastClone, track.firstChild);
    track.appendChild(firstClone);
    hasClones = true;
  };

  const cleanupInfiniteSlides = () => {
    if (!hasClones) return;
    track.querySelectorAll('.is-carousel-clone').forEach((node) => node.remove());
    hasClones = false;
  };

  const setIndex = (index, animate = true) => {
    if (!animate) {
      track.style.transition = 'none';
    }

    track.style.transform = `translateX(-${index * 100}%)`;

    if (!animate) {
      void track.offsetWidth;
      track.style.transition = '';
    }
  };

  const applyTransform = () => {
    setIndex(currentIndex, true);
  };

  const handleLoopEdges = () => {
    if (!hasClones) return;

    if (currentIndex === 0) {
      currentIndex = baseCount;
      setIndex(currentIndex, false);
      return;
    }

    if (currentIndex === baseCount + 1) {
      currentIndex = 1;
      setIndex(currentIndex, false);
    }
  };

  const startAutoplay = () => {
    if (autoplayId !== null || !isMobile()) return;

    autoplayId = window.setInterval(() => {
      currentIndex += 1;
      applyTransform();
    }, intervalMs);
  };

  const stopAutoplay = () => {
    if (autoplayId === null) return;
    window.clearInterval(autoplayId);
    autoplayId = null;
  };

  const enableMobileCarousel = () => {
    ensureViewport();
    setupInfiniteSlides();
    track.classList.add('experiencias-carousel');
    currentIndex = 1;
    setIndex(currentIndex, false);
    startAutoplay();
  };

  const disableMobileCarousel = () => {
    stopAutoplay();
    track.classList.remove('experiencias-carousel');
    cleanupInfiniteSlides();
    track.style.transition = '';
    track.style.transform = '';
    currentIndex = 1;
    removeViewport();
  };

  const syncMode = () => {
    if (isMobile()) {
      enableMobileCarousel();
      return;
    }
    disableMobileCarousel();
  };

  experiencesSection.addEventListener('mouseenter', stopAutoplay);
  experiencesSection.addEventListener('mouseleave', startAutoplay);
  experiencesSection.addEventListener('touchstart', stopAutoplay, { passive: true });
  experiencesSection.addEventListener('touchend', startAutoplay, { passive: true });
  experiencesSection.addEventListener('touchcancel', startAutoplay, { passive: true });
  track.addEventListener('transitionend', handleLoopEdges);

  window.addEventListener('resize', syncMode);
  syncMode();
});
