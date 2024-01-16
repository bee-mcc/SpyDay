let img; // Declare variable 'img'.
let startTime;
let answer = [
  [310, 380],
  [275, 350],
];

function setup() {
  createCanvas(1080, 600);
  img = loadImage('pic.png'); // Load the image
  startTime = new Date();
}

function draw() {
  img.resize(1080, 600);

  // Displays the image at its actual size at point (0,0)
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
}

function mouseClicked() {
  const xCorrect = mouseX > answer[0][0] && mouseX < answer[0][1];
  const yCorrect = mouseY > answer[1][0] && mouseY < answer[1][1];
  const isCorrect = xCorrect && yCorrect;
  if (isCorrect) {
    const endTime = new Date();
    const seconds = (endTime.valueOf() - startTime.valueOf()) / 1000;
    alert(seconds);
  } else {
    alert('awww...');
  }
}
