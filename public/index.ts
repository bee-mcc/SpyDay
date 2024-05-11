window.addEventListener('DOMContentLoaded', (event) => {
  const image = document.getElementById('smokey') as HTMLImageElement;
  const canvas = document.querySelector('.canvas') as HTMLDivElement;

  function adjustImageSize() {
    const isDesktop = window.innerWidth > 768; // Assuming desktop width starts from 768px
    const isLargerThanImage =
      window.innerWidth > image.width ||
      window.innerHeight > image.height;

    if (isDesktop) {
      if (isLargerThanImage) {
        canvas.style.width = `${image.width}px`;
        canvas.style.height = `${image.height}px`;
        canvas.style.overflow = 'visible';
        canvas.style.display = 'flex';
        canvas.style.justifyContent = 'center';
        canvas.style.alignItems = 'center';
      } else {
        const widthRatio = window.innerWidth / image.width;
        const heightRatio = window.innerHeight / image.height;
        const minRatio = Math.min(widthRatio, heightRatio);

        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        canvas.style.overflow = 'hidden';
        canvas.style.display = 'flex';
        canvas.style.justifyContent = 'center';
        canvas.style.alignItems = 'center';

        const offsetX = (image.width - window.innerWidth) / 2;
        const offsetY = (image.height - window.innerHeight) / 2;
        image.style.left = `-${offsetX}px`;
        image.style.top = `-${offsetY}px`;
      }
    } else {
      canvas.style.width = `${image.width}px`;
      canvas.style.height = `${image.height}px`;
      canvas.style.overflow = 'visible';
      canvas.style.display = 'flex';
      canvas.style.justifyContent = 'center';
      canvas.style.alignItems = 'center';
    }
  }

  adjustImageSize();

  window.addEventListener('resize', adjustImageSize);
});
