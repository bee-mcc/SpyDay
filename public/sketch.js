//Graphics
let img; // Declare variable 'img'.
let answerImage;
let loadingImage;
const canvasWidth = 1080;
const canvasHeight = 600;

const smokeypicWidth = 320;
const smokeypicHeight = 400;

//Game MetaData
let startTime;
let frame = 0;

//Game Rules Data
let isImageLoading = true;
let isAnswerLoading = true;
let gameStarted = false;
let answer = [
  [830, 870],
  [72, 102],
];

function setup() {
  loadingImage = createImg(
    'loading.gif',
    'the loading screen for the game spy day'
  );
  loadingImage.position(canvasWidth / 2, canvasHeight / 2);
  img = loadImage('pic.png', () => (isImageLoading = false)); // Load the image
  answerImage = loadImage('cat.png', () => (isAnswerLoading = false));
  createCanvas(canvasWidth, canvasHeight);
  noLoop(); //If using noLoop() in setup(), it should be the last line inside the block.
}

function draw() {
  const isLoading = isImageLoading || isAnswerLoading;

  if (isLoading || frame < 200) {
    frame = frame + 1;
    loop();
  } else {
    loadingImage.remove();
    // noLoop();
    if (gameStarted) {
      // Displays the image at its actual size at point (0,0)
      img.resize(1080, 600);
      image(img, 0, 0);

      // Get the mouse coordinates relative to the image
      let mouseXOnImage = mouseX;
      let mouseYOnImage = mouseY;

      // Display the cursor position on the image
      textSize(16);
      fill(255);
      noStroke();
      // ellipse(mouseXOnImage, mouseYOnImage, 10, 10);

      // Display the cursor position below the image
      fill(255);
      text(
        `Cursor Position: (${mouseXOnImage}, ${mouseYOnImage})`,
        10,
        height - 10
      );
      loop();
    } else {
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
        'click anywhere to start your time',
        canvasWidth / 2 - 125,
        canvasHeight - 30
      );
      loop();
    }
  }
}

function touchEnded() {
  const isLoading = isImageLoading || isAnswerLoading;
  console.log('touch ended 1');
  if (frame >= 200) {
    console.log('touch ended');
    if (gameStarted) {
      const xCorrect = mouseX > answer[0][0] && mouseX < answer[0][1];
      const yCorrect = mouseY > answer[1][0] && mouseY < answer[1][1];
      const isCorrect = xCorrect && yCorrect;
      if (isCorrect) {
        const endTime = new Date();
        const seconds =
          (endTime.valueOf() - startTime.valueOf()) / 1000;
        alert(`You found the answer in ${seconds} seconds`);
      } else {
        alert("That's not the right answer...");
      }
    } else {
      gameStarted = true;
      startTime = new Date();
      redraw();
    }
  }
}
