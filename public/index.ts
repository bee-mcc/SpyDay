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
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    overlay.style.zIndex = '1';
  }

  adjustImagePosition();

  window.addEventListener('resize', adjustImagePosition);

  document.body.appendChild(overlay);
});
