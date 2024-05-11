window.addEventListener('load', function () {
    var image = document.getElementById('smokey');
    var overlay = document.createElement('div');
    overlay.classList.add('overlay');
    function adjustImagePosition() {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var imageWidth = image.width;
        var imageHeight = image.height;
        var offsetX = (windowWidth - imageWidth) / 2;
        var offsetY = (windowHeight - imageHeight) / 2;
        image.style.position = 'fixed';
        image.style.left = "".concat(offsetX, "px");
        image.style.top = "".concat(offsetY, "px");
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        overlay.style.position = 'fixed';
        overlay.style.left = "0px";
        overlay.style.top = "0px";
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundImage =
            'radial-gradient(circle closest-side, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)';
        overlay.style.zIndex = '1';
    }
    adjustImagePosition();
    window.addEventListener('resize', adjustImagePosition);
    function revealImage(event) {
        var diameter = 40;
        var x = event.clientX;
        var y = event.clientY;
        var canvasRect = overlay.getBoundingClientRect();
        var gradientX = ((x - canvasRect.left) / canvasRect.width) * 100;
        var gradientY = ((y - canvasRect.top) / canvasRect.height) * 100;
        overlay.style.backgroundImage = "radial-gradient(circle at ".concat(gradientX, "% ").concat(gradientY, "%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) ").concat(diameter / 2, "%, rgba(0, 0, 0, 1) 100%)");
    }
    window.addEventListener('mousemove', revealImage);
    document.body.appendChild(overlay);
});
