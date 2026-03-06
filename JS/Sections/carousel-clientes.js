document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel__clientes');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel__clientes-track');
  const prevButton = carousel.querySelector('.carousel-button.prev');
  const nextButton = carousel.querySelector('.carousel-button.next');
  if (!track || !prevButton || !nextButton) return;

  const slides = Array.from(track.children);
  if (slides.length === 0) return;

  let currentIndex = 0;

  const updateCarousel = () => {
    const offset = currentIndex * 100;
    track.style.transform = `translateX(-${offset}%)`;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
  };

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex += 1;
      updateCarousel();
    }
  });

  updateCarousel();
});
