//AMELIA HAD ORIGINAL IDEA FOR I-SPY GAME W JO AND REX'S SHELF

//TODO: do something like this to collect the user's name (3 letters only) and
// pop their name up in the back liek that + show them where they stand on the leaderboard
// https://p5js.org/examples/dom-input-and-button.html

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
let seconds;
let leaderboardData;
let frameWhenUserStarted;

//Scrolling Data
let previousMouseX;
let previousMouseY;
let offsetX = canvasWidth / 2 - 275;
let offsetY = canvasHeight / 2 - 275;
let isScrolling = false;
let xScrollingIsEnabled = false;
let yScrollingIsEnabled = false;

// Game Rules Data
let isImageLoading = true;
let isAnswerLoading = true;
let gameStarted = false;
let isUserWinning = false;
let isShowingLeaderBoard = false;
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

    textSize(32);
    text(
      'is loading...',
      window.innerWidth / 2 - 60,
      window.innerHeight / 2 + 190
    );
  } else {
    clear();

    if (gameStarted) {
      if (isUserWinning && !isShowingLeaderBoard) {
        displayWinScreen();
      } else if (!isShowingLeaderBoard) {
        displayImage();
      } else if (isShowingLeaderBoard) {
        displayLeaderBoard();
      }
    } else {
      displayStartScreen();
    }
  }
}

function displayLeaderBoard() {
  //start loop again after win screen
  clear();
  background(color(0, 100, 0)); // Darker green background
  fill(255);

  for (let i = 0; i < 11; i++) {
    const score = leaderboardData[i];
    text('👾👾👾👾 HIGH SCORES 👾👾👾👾', window.innerWidth / 2, 35);
    text(
      `${i + 1}. Time: ${score.time}, name: ${score.playerName} `,
      window.innerWidth / 2,
      75 * (i + 1)
    );
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

  if (xScrollingIsEnabled) {
    frameWhenUserStarted = frameWhenUserStarted ?? frameCount;
    if (frameCount < frameWhenUserStarted + 180) {
      textAlign(CENTER, CENTER);
      textSize(32);
      fill(255);
      stroke(0);
      strokeWeight(4);
      text(
        '←Scroll left and right→',
        window.innerWidth / 2,
        window.innerHeight / 2
      );
    }
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

  //text(`${mouseXWithinImage}, ${mouseYWithinImage}`, 15, 15);
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
  fill(255);

  noLoop();

  const myInput = createInput();
  const myButton = createButton('Go to leaderboard');

  myButton.mousePressed(async () => {
    await insertData(seconds, myInput.value());

    isShowingLeaderBoard = true;
    myInput.remove();
    myButton.remove();
    loop();
  });

  const onInput = function () {
    let userInput = this.value();

    if (userInput.length > 3) {
      this.value(userInput.slice(0, 3));
    } else {
      this.value(userInput);
    }
  };

  myInput.input(onInput);
  textAlign(CENTER, CENTER);

  if (xScrollingIsEnabled) {
    textSize(30);
    text('✨🎉YOU WON!!🎉✨', window.innerWidth / 2, 175);

    textSize(14);
    text(
      `🕠It took you ${seconds} seconds to find Smokey!`,
      window.innerWidth / 2,
      225
    );
    text(
      `Nice work :^) Come back tomorrow to try get a lower time!⏱️`,
      window.innerWidth / 2,
      250
    );
  } else {
    // stroke(255);
    // line(
    //   window.innerWidth / 2,
    //   0,
    //   window.innerWidth / 2,
    //   window.innerHeight
    // );
    textSize(40);

    text('✨🎉YOU WON!!🎉✨', window.innerWidth / 2, 175);
    textSize(32);
    text(
      `🕠It took you ${seconds} seconds to find Smokey :^) Come back tomorrow to try get a lower time!⏱️`,
      window.innerWidth / 2,
      225
    );
  }
  text(`Choose your name (3 letters)`, window.innerWidth / 2, 450);
  text(
    `and click to see your spot on the SpyDay Daily leaderboard`,
    window.innerWidth / 2,
    495
  );
  myInput.position(window.innerWidth / 2 - 75, 520);
  myButton.position(window.innerWidth / 2 - 55, 570);

  textSize(24);
  text('╰(⸝⸝⸝´꒳`⸝⸝⸝)╯', 80, 40);
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
    offsetX = isOffsetXTooSmall ? offsetX : offsetX - 10;
  }
  if (previousMouseX > mouseX ?? touches[0].x) {
    const isOffsetXTooLarge =
      offsetX >= canvasWidth - window.innerWidth;
    offsetX = isOffsetXTooLarge ? offsetX : offsetX + 10;
  }
  if (previousMouseY < mouseY ?? touches[0].y) {
    const isOffsetYTooSmall = offsetY < 1;
    offsetY = isOffsetYTooSmall ? offsetY : offsetY - 10;
  }
  if (previousMouseY > mouseY ?? touches[0].y) {
    const isOffsetYTooLarge =
      offsetY >= canvasHeight - window.innerHeight;
    offsetY = isOffsetYTooLarge ? offsetY : offsetY + 10;
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
    seconds = (endTime.valueOf() - startTime.valueOf()) / 1000;

    isUserWinning = true;
  } else if (!isUserWinning) {
    alert("That's not the right answer...");
  }
}

function startGame() {
  gameStarted = true;
  startTime = new Date();
}

async function insertData(time, playerName) {
  const url =
    'https://spy-day-da28768a781b.herokuapp.com/leaderboard'; // Replace with your server URL

  const data = { time, playerName };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    leaderboardData = result;
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}
