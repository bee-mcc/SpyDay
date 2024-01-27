//AMELIA HAD ORIGINAL IDEA FOR I-SPY GAME W JO AND REX'S SHELF

// Graphics
let img;
let answerImage;
let loadingImage;
//TODO rename as image width and heigh (make sure this doesn't break anything)
const canvasWidth = 1260;
const canvasHeight = 700;
const loadingImageWidth = 355;
const loadingImageHeight = 261;
const smokeypicWidth = 320;
const smokeypicHeight = 400;

// Game MetaData
let startTime;

//Scrolling Data
let previousMouseX;
let previousMouseY;
let offsetX = 0;
let offsetY = 0;
let isScrolling = false;
let xScrollingIsEnabled = false;
let yScrollingIsEnabled = false;

// Game Rules Data
let isImageLoading = true;
let isAnswerLoading = true;
let gameStarted = false;
let isUserWinning = false;
//needs to be pixels within the photo, not pixels on canvas
let answer = [
  [964, 1030],
  [70, 123],
];
let mouseXWithinImage;
let mouseYWithinImage;

/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling the page.
 */
document.ontouchmove = function (event) {
  event.preventDefault();
};

function windowResized() {
  offsetX = 0;
  offsetY = 0;
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function preload() {
  loadingImage = loadImage('loading.gif');
}

function setup() {
  img = loadImage('pic.png', () => (isImageLoading = false));
  answerImage = loadImage('cat.png', () => (isAnswerLoading = false));

  loadingImage.delay(100);
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  const isLoading = isImageLoading || isAnswerLoading;

  if (isLoading || frameCount < 250) {
    image(
      loadingImage,
      window.innerWidth / 2 - loadingImageWidth / 2,
      window.innerHeight / 2 - loadingImageHeight / 2
    );
    frameCount++;
  } else {
    clear();

    if (gameStarted) {
      if (isUserWinning) {
        displayWinScreen();
      } else {
        displayImage();
      }
    } else {
      displayStartScreen();
    }
  }
}

function displayImage() {
  clear();
  background(220);
  img.resize(canvasWidth, canvasHeight);

  xScrollingIsEnabled = window.innerWidth < canvasWidth;
  yScrollingIsEnabled = window.innerHeight < canvasHeight;

  if (!xScrollingIsEnabled && !yScrollingIsEnabled) {
    const retVal = image(
      img,
      window.innerWidth / 2 - canvasWidth / 2,
      window.innerHeight / 2 - canvasHeight / 2
    );

    setMouseLocationWithinImage(false, false);
  } else if (!xScrollingIsEnabled && yScrollingIsEnabled) {
    image(
      img,
      window.innerWidth / 2 - canvasWidth / 2,
      0,
      canvasWidth,
      window.innerHeight,
      0,
      0 + offsetY,
      canvasWidth,
      window.innerHeight,
      CONTAIN
    );
    setMouseLocationWithinImage(false, true);
  } else if (xScrollingIsEnabled && !yScrollingIsEnabled) {
    image(
      img,
      0,
      window.innerHeight / 2 - canvasHeight / 2,
      window.innerWidth,
      canvasHeight,
      0 + offsetX,
      0,
      window.innerWidth,
      canvasHeight,
      CONTAIN
    );
    setMouseLocationWithinImage(true, false);
  } else {
    //TODO need to do something like this so I can prevent it from scrolling too far
    // const isXOffsetTooLarge = offsetX >= canvasWidth - offsetX;
    // const isYOffsetTooLarge = offsetY >= canvasHeigth - offsetY;
    image(
      img,
      0,
      0,
      window.innerWidth,
      window.innerHeight,
      0 + offsetX,
      0 + offsetY,
      window.innerWidth,
      window.innerHeight,
      CONTAIN
    );
    setMouseLocationWithinImage(true, true);
  }
}

//TODO this solution works for the base case of a window larger than our answer image - now it needs to work for the remaining 3 cases
// x scrolling enabled
// y scrolling enabled
// x and y scrolling enabled
// also add the text displaying where the mouse is within the image as a "debug mode"
// btw... will this work for mobile? we don't keep a persistant store of the "mouse location" since it's all touches...
function setMouseLocationWithinImage(
  isXScrollingEnabled,
  isYScollingEnabled
) {
  if (!isXScrollingEnabled && !isYScollingEnabled) {
    const leftBorder = window.innerWidth / 2 - canvasWidth / 2;
    const topBorder = window.innerHeight / 2 - canvasHeight / 2;

    if (mouseX > leftBorder) {
      mouseXWithinImage = mouseX - leftBorder;
    }
    if (mouseY > topBorder) {
      mouseYWithinImage = mouseY - topBorder;
    }
  } else if (isXScrollingEnabled && !isYScollingEnabled) {
    const topBorder = window.innerHeight / 2 - canvasHeight / 2;
    mouseXWithinImage = mouseX + offsetX;
    if (mouseY > topBorder) {
      mouseYWithinImage = mouseY - topBorder;
    }
  } else if (isYScollingEnabled && !isXScrollingEnabled) {
    const leftBorder = window.innerWidth / 2 - canvasWidth / 2;
    mouseYWithinImage = mouseY + offsetY;
    if (mouseX > leftBorder) {
      mouseXWithinImage = mouseX - topBorder;
    }
  } else {
    mouseXWithinImage = mouseX + offsetX;
    mouseYWithinImage = mouseY + offsetY;
  }

  text(`${mouseXWithinImage}, ${mouseYWithinImage}`, 15, 15);
}

function displayStartScreen() {
  clear();
  background(220);

  textSize(32);
  fill(255);
  stroke(0);
  strokeWeight(4);
  text(
    'This is Smokey Robinson',
    window.innerWidth < 450 ? 5 : 75,
    75
  );

  answerImage.resize(smokeypicWidth, smokeypicHeight);
  image(
    answerImage,
    window.innerWidth / 2 - smokeypicWidth / 2,
    window.innerHeight / 2 - smokeypicHeight / 2
  );

  text(
    'Find him and click to win!',
    window.innerWidth - 375,
    window.innerHeight - 75
  );

  const pulseSpeed = 0.05;
  const fontSize = 16 + 4 * sin(frameCount * pulseSpeed);

  textSize(fontSize);
  fill('black');
  noStroke();

  text(
    'Click anywhere to start your time',
    window.innerWidth / 2 - 125,
    window.innerHeight - 30
  );
}

function displayWinScreen() {
  clear();
  background(color(0, 100, 0)); // Darker green background
  textSize(48);
  fill(255);
  textAlign(CENTER, CENTER);
  text(
    '✨🎉YOU WON!!🎉✨',
    window.innerWidth / 2,
    window.innerHeight / 2
  );

  textSize(24);
  text('╰(⸝⸝⸝´꒳`⸝⸝⸝)╯', 60, 20);
  text(
    '╰(⸝⸝⸝´꒳`⸝⸝⸝)╯',
    window.innerWidth - 80,
    window.innerHeight - 40
  );
}

function touchStarted() {
  setMouseLocationWithinImage(
    xScrollingIsEnabled,
    yScrollingIsEnabled
  );
}

function touchMoved() {
  isScrolling = true;
  if (previousMouseX < mouseX ?? touches[0].x) {
    const isOffsetXTooSmall = offsetX < 1;
    offsetX = isOffsetXTooSmall ? offsetX : offsetX - 5;
  }
  if (previousMouseX > mouseX ?? touches[0].x) {
    const isOffsetXTooLarge =
      offsetX >= canvasWidth - window.innerWidth;
    offsetX = isOffsetXTooLarge ? offsetX : offsetX + 5;
  }
  if (previousMouseY < mouseY ?? touches[0].y) {
    const isOffsetYTooSmall = offsetY < 1;
    offsetY = isOffsetYTooSmall ? offsetY : offsetY - 5;
  }
  if (previousMouseY > mouseY ?? touches[0].y) {
    const isOffsetYTooLarge =
      offsetY >= canvasHeight - window.innerHeight;
    offsetY = isOffsetYTooLarge ? offsetY : offsetY + 5;
  }
  previousMouseX = mouseX ?? touches[0].x;
  previousMouseY = mouseY ?? touches[0].y;
}

function touchEnded() {
  if (isScrolling) {
    isScrolling = false;
    return;
  }
  const isLoading = isImageLoading || isAnswerLoading;
  if (frameCount >= 200 && !isLoading) {
    if (gameStarted) {
      checkAnswer();
    } else {
      startGame();
    }
  }
}

function checkAnswer() {
  const xCorrect =
    mouseXWithinImage > answer[0][0] &&
    mouseXWithinImage < answer[0][1];
  const yCorrect =
    mouseYWithinImage > answer[1][0] &&
    mouseYWithinImage < answer[1][1];
  const isCorrect = xCorrect && yCorrect;

  if (isCorrect) {
    const endTime = new Date();
    const seconds = (endTime.valueOf() - startTime.valueOf()) / 1000;
    isUserWinning = true;
  } else {
    alert("That's not the right answer...");
  }
}

function startGame() {
  gameStarted = true;
  startTime = new Date();
}
