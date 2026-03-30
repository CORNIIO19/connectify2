// Detecta qué sección está visible y colorea el link activo en ambos headers
function updateActiveLink() {
    // Obtener todas las secciones
    const sections = document.querySelectorAll('section[id]');
    
    // Obtener todos los links de navegación en ambos headers
    const navLinks = document.querySelectorAll(
        '.header_primario_menu a, .header_secundario_menu a'
    );

    // Encontrar la sección que está más visible en la pantalla
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY + 100; // Offset para mejor detección
        
        // Si el usuario está dentro de esta sección
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    // Si no hay sección detectada pero estamos al inicio, activar hero
    if (!currentSection && window.scrollY < sections[0].offsetTop) {
        currentSection = 'hero';
    }

    // Remover la clase activa de todos los links y agregarla al correspondiente
    navLinks.forEach(link => {
        link.classList.remove('active-section');
        
        // Obtener el href y comparar con la sección actual
        const href = link.getAttribute('href').substring(1); // Remover el #
        
        if (href === currentSection) {
            link.classList.add('active-section');
        }
    });
}

// Ejecutar en el evento scroll
window.addEventListener('scroll', updateActiveLink);

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', updateActiveLink);
