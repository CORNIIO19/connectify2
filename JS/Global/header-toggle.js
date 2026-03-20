document.addEventListener('DOMContentLoaded', () => {
  const headerPrimario = document.querySelector('.header_primario');
  const headerSecundario = document.querySelector('.header_secundario');

  if (!headerPrimario || !headerSecundario) return;

  const secondarySections = new Set(['hero', 'presencia']);
  const sections = Array.from(document.querySelectorAll('main > section'));
  const footer = document.querySelector('body > footer');
  if (footer) sections.push(footer);

  const applyHeaderVisibility = (sectionId, sectionElement = null) => {
    const isFooter = sectionElement?.tagName === 'FOOTER';

    if (isFooter) {
      headerSecundario.classList.add('header-hidden');
      headerPrimario.classList.add('header-hidden');
      return;
    }

    const useSecondary = secondarySections.has(sectionId);

    headerSecundario.classList.toggle('header-hidden', !useSecondary);
    headerPrimario.classList.toggle('header-hidden', useSecondary);
  };

  const getNearestSectionId = () => {
    if (sections.length === 0) return '';

    const scrollY = window.scrollY;
    let nearestSection = sections[0];
    let nearestDistance = Math.abs(sections[0].offsetTop - scrollY);

    sections.forEach((section) => {
      const distance = Math.abs(section.offsetTop - scrollY);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestSection = section;
      }
    });

    return nearestSection || null;
  };

  window.addEventListener('connectify:sectionchange', (event) => {
    const currentId = event.detail?.id || '';
    const currentElement = event.detail?.element || null;
    applyHeaderVisibility(currentId, currentElement);
  });

  const initialSection = getNearestSectionId();
  applyHeaderVisibility(initialSection?.id || '', initialSection);
});
