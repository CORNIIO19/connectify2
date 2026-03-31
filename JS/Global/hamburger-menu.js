document.addEventListener('DOMContentLoaded', () => {
  const mobileBreakpoint = 1025;

  const headerConfigs = [
    {
      header: document.querySelector('.header_primario'),
      button: document.querySelector('.header_primario .header_menu_toggle'),
      menu: document.querySelector('.header_primario_menu'),
      links: document.querySelectorAll('.header_primario_menu a'),
    },
    {
      header: document.querySelector('.header_secundario'),
      button: document.querySelector('.header_secundario .header_menu_toggle'),
      menu: document.querySelector('.header_secundario_menu'),
      links: document.querySelectorAll('.header_secundario_menu a'),
    },
  ].filter((config) => config.header && config.button && config.menu);

  if (headerConfigs.length === 0) return;

  const isMobileViewport = () => window.innerWidth <= mobileBreakpoint;

  const syncBodyState = () => {
    const hasOpenMenu = headerConfigs.some((config) => config.header.classList.contains('menu-open'));
    document.body.classList.toggle('menu-open', hasOpenMenu);
  };

  const closeMenu = (config) => {
    config.header.classList.remove('menu-open');
    config.button.setAttribute('aria-expanded', 'false');
  };

  const closeAllMenus = (exceptHeader = null) => {
    headerConfigs.forEach((config) => {
      if (exceptHeader && config.header === exceptHeader) return;
      closeMenu(config);
    });
    syncBodyState();
  };

  headerConfigs.forEach((config) => {
    config.button.addEventListener('click', () => {
      if (!isMobileViewport()) return;

      const willOpen = !config.header.classList.contains('menu-open');
      closeAllMenus(config.header);

      config.header.classList.toggle('menu-open', willOpen);
      config.button.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      syncBodyState();
    });

    config.links.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu(config);
        syncBodyState();
      });
    });
  });

  document.addEventListener('click', (event) => {
    const clickedInsideAnyHeader = headerConfigs.some((config) => config.header.contains(event.target));
    if (!clickedInsideAnyHeader) {
      closeAllMenus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllMenus();
    }
  });

  window.addEventListener('resize', () => {
    if (!isMobileViewport()) {
      closeAllMenus();
    }
  });

  window.addEventListener('connectify:sectionchange', () => {
    closeAllMenus();
  });
});
