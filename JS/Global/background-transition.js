document.addEventListener('DOMContentLoaded', () => {
  const layerA = document.querySelector('.bg-a');
  const layerB = document.querySelector('.bg-b');

  if (!layerA || !layerB) return;

  const body = document.body;

  const themes = {
    hero: "url('./Assets/FondoHero.png')",
    nosotros: "linear-gradient(180deg, #f7f9fc 0%, #eef3f9 55%, #e6edf6 100%)",
    experiencias: "linear-gradient(180deg, #f8fbff 0%, #f0f4fa 55%, #e8edf5 100%)",
    servicios: "linear-gradient(180deg, #f5f9ff 0%, #edf3fb 55%, #e4ebf5 100%)",
    presencia: "linear-gradient(180deg, #13171f 0%, #0f1016 60%, #090a0e 100%)",
    contacto: "linear-gradient(180deg, #f9fbff 0%, #f2f6fc 55%, #e9eff8 100%)",
    footer: "linear-gradient(180deg, #0e1016 0%, #08090d 100%)"
  };

  const sectionModes = {
    hero: 'theme-dark',
    nosotros: 'theme-light',
    experiencias: 'theme-light',
    servicios: 'theme-light',
    presencia: 'theme-dark',
    contacto: 'theme-light',
    footer: 'theme-dark'
  };

  let visibleLayer = layerA;
  let hiddenLayer = layerB;
  let currentThemeKey = '';

  const swapLayers = () => {
    hiddenLayer.classList.add('is-visible');
    visibleLayer.classList.remove('is-visible');

    const temp = visibleLayer;
    visibleLayer = hiddenLayer;
    hiddenLayer = temp;
  };

  const setTheme = (sectionId = '') => {
    const key = sectionId || 'hero';
    if (key === currentThemeKey) return;

    currentThemeKey = key;
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(sectionModes[key] || 'theme-dark');
    hiddenLayer.style.backgroundImage = themes[key] || themes.hero;
    swapLayers();
  };

  const findInitialSectionId = () => {
    const sections = Array.from(document.querySelectorAll('main > section'));
    const footer = document.querySelector('body > footer');
    if (footer) sections.push(footer);
    if (sections.length === 0) return 'hero';

    const scrollY = window.scrollY;
    let nearest = sections[0];
    let nearestDistance = Math.abs(sections[0].offsetTop - scrollY);

    sections.forEach((section) => {
      const distance = Math.abs(section.offsetTop - scrollY);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = section;
      }
    });

    return nearest.tagName === 'FOOTER' ? 'footer' : nearest.id;
  };

  setTheme(findInitialSectionId());

  window.addEventListener('connectify:sectionchange', (event) => {
    const element = event.detail?.element || null;
    const id = event.detail?.id || '';

    if (element?.tagName === 'FOOTER') {
      setTheme('footer');
      return;
    }

    setTheme(id);
  });
});
