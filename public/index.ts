window.addEventListener('load', () => {
  const image = document.getElementById('smokey') as HTMLImageElement;

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
  }

  adjustImagePosition();

  window.addEventListener('resize', adjustImagePosition);
});
