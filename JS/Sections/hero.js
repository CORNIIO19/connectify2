export function initHeroAnimations() {
  const rotatingWords = Array.from(document.querySelectorAll('.hero-title--rotating .rotating-word'));
  if (!rotatingWords.length) return;

  let rotatingIndex = 0;
  const rotationDelay = 2600;

  function cycleRotatingWords() {
    if (rotatingWords.length <= 1) return;

    const currentWord = rotatingWords[rotatingIndex];
    const nextIndex = (rotatingIndex + 1) % rotatingWords.length;
    const nextWord = rotatingWords[nextIndex];

    currentWord.classList.remove('enter');
    currentWord.classList.add('leave');

    nextWord.classList.remove('leave');
    nextWord.classList.add('active', 'enter');

    setTimeout(() => {
      currentWord.classList.remove('active', 'leave');
    }, 550);

    rotatingIndex = nextIndex;
  }

  rotatingWords[0].classList.add('active', 'enter');
  if (rotatingWords.length > 1) {
    setInterval(cycleRotatingWords, rotationDelay);
  }
}