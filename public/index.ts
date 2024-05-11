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
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
      } else {
        const widthRatio = window.innerWidth / image.width;
        const heightRatio = window.innerHeight / image.height;
        const minRatio = Math.min(widthRatio, heightRatio);

        canvas.style.width = `${image.width * minRatio}px`;
        canvas.style.height = `${image.height * minRatio}px`;

        const offsetX =
          (window.innerWidth - image.width * minRatio) / 2;
        const offsetY =
          (window.innerHeight - image.height * minRatio) / 2;
        image.style.left = `${offsetX}px`;
        image.style.top = `${offsetY}px`;
      }
    } else {
      canvas.style.width = `${image.width}px`;
      canvas.style.height = `${image.height}px`;
    }
  }

  adjustImageSize();

  window.addEventListener('resize', adjustImageSize);
});
