// Graphics
let img;
let answerImage;
let loadingImage;
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

// Game Rules Data
let isImageLoading = true;
let isAnswerLoading = true;
let gameStarted = false;
let isUserWinning = false;
//needs to be pixels within the photo, not pixels on canvas
let answer = [
  [830, 870],
  [72, 102],
];

/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling the page.
 */
document.ontouchmove = function (event) {
  event.preventDefault();
};

function windowResized() {
  offsetX = 0;
  offsetY = 0;
  resizeCanvas(windowWidth, windowHeight);
}

function preload() {
  loadingImage = loadImage('loading.gif');
}

function setup() {
  img = loadImage('pic.png', () => (isImageLoading = false));
  answerImage = loadImage('cat.png', () => (isAnswerLoading = false));

  loadingImage.delay(100);
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  const isLoading = isImageLoading || isAnswerLoading;

  if (isLoading || frameCount < 250) {
    image(
      loadingImage,
      windowWidth / 2 - loadingImageWidth / 2,
      windowHeight / 2 - loadingImageHeight / 2
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
  //TODO: should also deal with the case of the just the width being too small or just the height being too small
  if (windowWidth > canvasWidth && windowHeight > canvasHeight) {
    image(
      img,
      windowWidth / 2 - canvasWidth / 2,
      windowHeight / 2 - canvasHeight / 2
    );
  } else if (
    windowWidth > canvasWidth &&
    windowHeight <= canvasHeight
  ) {
    image(
      img,
      windowWidth / 2 - canvasWidth / 2,
      0,
      canvasWidth,
      windowHeight,
      0,
      0 + offsetY,
      canvasWidth,
      windowHeight,
      CONTAIN
    );
  } else if (
    windowWidth <= canvasWidth &&
    windowHeight > canvasHeight
  ) {
    image(
      img,
      0,
      windowHeight / 2 - canvasHeight / 2,
      windowWidth,
      canvasHeight,
      0 + offsetX,
      0,
      windowWidth,
      canvasHeight,
      CONTAIN
    );
  } else {
    //TODO need to do something like this so I can prevent it from scrolling too far
    // const isXOffsetTooLarge = offsetX >= canvasWidth - offsetX;
    // const isYOffsetTooLarge = offsetY >= canvasHeigth - offsetY;
    image(
      img,
      0,
      0,
      windowWidth,
      windowHeight,
      0 + offsetX,
      0 + offsetY,
      windowWidth,
      windowHeight,
      CONTAIN
    );
  }
}

function displayStartScreen() {
  clear();
  background(220);

  textSize(32);
  fill(255);
  stroke(0);
  strokeWeight(4);
  text('This is Smokey Robinson', windowWidth < 450 ? 5 : 75, 75);

  answerImage.resize(smokeypicWidth, smokeypicHeight);
  image(
    answerImage,
    windowWidth / 2 - smokeypicWidth / 2,
    windowHeight / 2 - smokeypicHeight / 2
  );

  text(
    'Find him and click to win!',
    windowWidth - 375,
    windowHeight - 75
  );

  const pulseSpeed = 0.05;
  const fontSize = 16 + 4 * sin(frameCount * pulseSpeed);

  textSize(fontSize);
  fill('black');
  noStroke();

  text(
    'Click anywhere to start your time',
    windowWidth / 2 - 125,
    windowHeight - 30
  );
}

function displayWinScreen() {
  clear();
  background(color(0, 100, 0)); // Darker green background
  textSize(48);
  fill(255);
  textAlign(CENTER, CENTER);
  text('✨🎉YOU WON!!🎉✨', windowWidth / 2, windowHeight / 2);

  textSize(24);
  text('╰(⸝⸝⸝´꒳`⸝⸝⸝)╯', 60, 20);
  text('╰(⸝⸝⸝´꒳`⸝⸝⸝)╯', windowWidth - 80, windowHeight - 40);
}

function touchMoved() {
  isScrolling = true;
  if (previousMouseX < mouseX ?? touches[0].x) {
    const isOffsetXTooSmall = offsetX < 1;
    offsetX = isOffsetXTooSmall ? offsetX : offsetX - 5;
  }
  if (previousMouseX > mouseX ?? touches[0].x) {
    const isOffsetXTooLarge = offsetX >= canvasWidth - windowWidth;
    offsetX = isOffsetXTooLarge ? offsetX : offsetX + 5;
  }
  if (previousMouseY < mouseY ?? touches[0].y) {
    const isOffsetYTooSmall = offsetY < 1;
    offsetY = isOffsetYTooSmall ? offsetY : offsetY - 5;
  }
  if (previousMouseY > mouseY ?? touches[0].y) {
    const isOffsetYTooLarge = offsetY >= canvasHeight - windowHeight;
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
  if (frameCount >= 200) {
    if (gameStarted) {
      checkAnswer();
    } else {
      startGame();
    }
  }
}

function checkAnswer() {
  const xCorrect = mouseX > answer[0][0] && mouseX < answer[0][1];
  const yCorrect = mouseY > answer[1][0] && mouseY < answer[1][1];
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
