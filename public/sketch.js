let img; // Declare variable 'img'.
let answerImage;
let startTime;
let gameStarted = false;
let answer = [
  [310, 380],
  [275, 350],
];

function setup() {
  createCanvas(1080, 600);
  img = loadImage('pic.png'); // Load the image

  answerImage = loadImage('answer.png');
}

function draw() {
  if (gameStarted) {
    // Displays the image at its actual size at point (0,0)
    img.resize(1080, 600);
    image(img, 0, 0);

    // Get the mouse coordinates relative to the image
    let mouseXOnImage = mouseX;
    let mouseYOnImage = mouseY;

    // Display the cursor position on the image
    fill(255);
    noStroke();
    ellipse(mouseXOnImage, mouseYOnImage, 10, 10);

    // Display the cursor position below the image
    fill(255);
    text(
      `Cursor Position: (${mouseXOnImage}, ${mouseYOnImage})`,
      10,
      height - 10
    );
  } else {
    image(answerImage, 0, 0);

    text(
      `Find this image hidden somewhere within the image. Click to start your time`,
      0,
      150
    );
  }
}

function touchEnded() {
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
  }
}
