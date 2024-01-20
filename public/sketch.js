// Graphics
let img;
let answerImage;
let loadingImage;
const canvasWidth = 1080;
const canvasHeight = 600;
const loadingImageWidth = 355;
const loadingImageHeight = 261;
const smokeypicWidth = 320;
const smokeypicHeight = 400;

// Game MetaData
let startTime;

// Game Rules Data
let isImageLoading = true;
let isAnswerLoading = true;
let gameStarted = false;
let isUserWinning = false;
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

function preload() {
  loadingImage = loadImage('loading.gif');
}

function setup() {
  img = loadImage('pic.png', () => (isImageLoading = false));
  answerImage = loadImage('cat.png', () => (isAnswerLoading = false));

  loadingImage.delay(100);
  createCanvas(canvasWidth, canvasHeight);
}

function draw() {
  while (deviceOrientation === 'portrait') {
    text(
      'please turn your phone to landscape mode',
      canvasWidth / 2,
      canvasHeight / 2
    );
  }
  const isLoading = isImageLoading || isAnswerLoading;

  if (isLoading || frameCount < 250) {
    image(
      loadingImage,
      canvasWidth / 2 - loadingImageWidth / 2,
      canvasHeight / 2 - loadingImageHeight / 2
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
  image(img, 0, 0);

  const mouseXOnImage = mouseX;
  const mouseYOnImage = mouseY;

  textSize(16);
  fill(255);
  noStroke();
  text(
    `Cursor Position: (${mouseXOnImage}, ${mouseYOnImage})`,
    10,
    height - 10
  );
}

function displayStartScreen() {
  clear();
  background(220);

  textSize(32);
  fill(255);
  stroke(0);
  strokeWeight(4);
  text('This is Smokey Robinson', 75, 75);

  answerImage.resize(smokeypicWidth, smokeypicHeight);
  image(
    answerImage,
    canvasWidth / 2 - smokeypicWidth / 2,
    canvasHeight / 2 - smokeypicHeight / 2
  );

  text(
    'Find him and click to win!',
    canvasWidth - 375,
    canvasHeight - 75
  );

  const pulseSpeed = 0.05;
  const fontSize = 16 + 4 * sin(frameCount * pulseSpeed);

  textSize(fontSize);
  fill('black');
  noStroke();

  text(
    'Click anywhere to start your time',
    canvasWidth / 2 - 125,
    canvasHeight - 30
  );
}

function displayWinScreen() {
  clear();
  background(color(0, 100, 0)); // Darker green background
  textSize(48);
  fill(255);
  textAlign(CENTER, CENTER);
  text('✨🎉YOU WON!!🎉✨', canvasWidth / 2, canvasHeight / 2);

  // ASCII art symbols at the top left and bottom right corners
  textSize(24);
  text('╰(⸝⸝⸝´꒳`⸝⸝⸝)╯', 60, 20);
  text('╰(⸝⸝⸝´꒳`⸝⸝⸝)╯', canvasWidth - 80, canvasHeight - 40);
}

function touchEnded() {
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
