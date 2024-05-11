window.addEventListener('load', () => {
  const image = document.getElementById('smokey') as HTMLImageElement;
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  function adjustImagePosition() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const imageWidth = image.width;
    const imageHeight = image.height;

    const offsetX = (windowWidth - imageWidth) / 2;
    const offsetY = (windowHeight - imageHeight) / 2;

    image.style.position = 'fixed';
    image.style.left = `${offsetX}px`;
    image.style.top = `${offsetY}px`;

    document.body.style.margin = '0';
    document.body.style.padding = '0';

    overlay.style.position = 'fixed';
    overlay.style.left = `0px`;
    overlay.style.top = `0px`;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundImage =
      'radial-gradient(circle closest-side, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)';
    overlay.style.zIndex = '1';
  }

  adjustImagePosition();

  window.addEventListener('resize', adjustImagePosition);

  function revealImage(event: MouseEvent | TouchEvent) {
    const diameter = 40;
    const x = event.clientX;
    const y = event.clientY;

    const canvasRect = overlay.getBoundingClientRect();
    const gradientX =
      ((x - canvasRect.left) / canvasRect.width) * 100;
    const gradientY =
      ((y - canvasRect.top) / canvasRect.height) * 100;

    overlay.style.backgroundImage = `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) ${
      diameter / 2
    }%, rgba(0, 0, 0, 1) 100%)`;
  }

  window.addEventListener('mousemove', revealImage);
  window.addEventListener('touchmove', revealImage);

  document.body.appendChild(overlay);
});
