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
const baseTextSize = window.innerWidth < 450 ? 16 : 32;

// Game MetaData
let startTime;
let seconds;
let leaderboardData;
let frameWhenUserStarted;
let hasPlayedInThisSession = false;
let playerID;

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

// ============
// ============
//Setup code
// ============
// ============

//prevents the mobile browser from processing some default
// touch events, like swiping left for "back" or scrolling the page.
document.ontouchmove = function (event) {
  event.preventDefault();
};

// ============
// ============
//p5 functions
// ============
// ============
function preload() {
  loadingImage = loadImage('loading.gif');
}

function setup() {
  playerID = new Date().valueOf();
  img = loadImage('pic.png', () => (isImageLoading = false));
  answerImage = loadImage('cat.png', () => (isAnswerLoading = false));

  loadingImage.delay(100);
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  const isLoading = isImageLoading || isAnswerLoading;

  if (shouldShowLoadingScreen(isLoading)) {
    displayLoadingScreen();
  } else {
    clear();

    if (hasUserPlayedToday() && !hasPlayedInThisSession) {
      displayPlayAgainTomorrow();
    } else if (gameStarted) {
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

// ============
// ============
//HELPER METHODS - variable getters/readers
// ============
// ============
function shouldShowLoadingScreen(isLoading) {
  return isLoading || frameCount < 250;
}

function hasUserPlayedToday() {
  const storedDataString = localStorage.getItem('savedTime');

  if (storedDataString) {
    const storedData = JSON.parse(storedDataString);

    const currentDate = new Date();

    return (
      storedData.date === currentDate.getDate() &&
      storedData.month === currentDate.getMonth() &&
      storedData.year === currentDate.getFullYear()
    );
  }

  return false;
}

// ============
// ============
//HELPER METHODS - variable setters
// ============
// ============
function startGame() {
  gameStarted = true;
  startTime = new Date();
}

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

function saveUserPlayedToSessionStorage() {
  const currentDate = new Date();
  const storedData = {
    date: currentDate.getDate(),
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  };

  localStorage.setItem('savedTime', JSON.stringify(storedData));
}

// ============
// ============
//HELPER METHODS - network
// ============
// ============

async function insertData(time, playerName) {
  const url =
    'https://spy-day-da28768a781b.herokuapp.com/leaderboard'; // Replace with your server URL

  const data = { time, playerName, playerID };

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

// ============
// ============
//SCREENS
// ============
// ============
function displayPlayAgainTomorrow() {
  // Rainbow colors
  const colors = [
    '#FF0000',
    '#FF7F00',
    '#FFFF00',
    '#00FF00',
    '#0000FF',
    '#4B0082',
    '#8B00FF',
  ];

  for (let i = 0; i < width; i++) {
    const inter = map(i, 0, width, 0, 1);
    const c = lerpColor(
      color(colors[0]),
      color(colors[colors.length - 1]),
      inter
    );
    stroke(c);
    line(i, 0, i, height);
  }

  textAlign(CENTER, CENTER);
  fill(255);

  const xScrollingEnabled = window.innerWidth < canvasWidth;
  if (xScrollingEnabled) {
    textSize(baseTextSize - 2);
    text('Come back tomorrow', width / 2, height / 2);
    text('to play again!', width / 2, height / 2 + 30);
  } else {
    textSize(baseTextSize);
    text('Come back tomorrow to play again!', width / 2, height / 2);
  }
}

function displayLoadingScreen() {
  image(
    loadingImage,
    window.innerWidth / 2 - loadingImageWidth / 2,
    window.innerHeight / 2 - loadingImageHeight / 2
  );

  strokeWeight(1);
  textSize(baseTextSize);
  text(
    'is loading...',
    window.innerWidth / 2 - 50,
    window.innerHeight / 2 + 190
  );
}

function displayLeaderBoard() {
  //start loop again after win screen
  clear();
  background(color(0, 100, 0)); // Darker green background
  fill(255);
  textFont('PressStart2P');

  const playerScoreIndex = findPlayerIndex();
  const playerScore = leaderboardData[playerScoreIndex];
  text(
    `YOUR SCORE: Place #${playerScoreIndex + 1} Time: ${
      playerScore.time
    }, name: ${playerScore.playerName} `,
    window.innerWidth / 2,
    45
  );

  text('👾👾👾👾 HIGH SCORES 👾👾👾👾', window.innerWidth / 2, 100);

  for (let i = 0; i < 10; i++) {
    const score = leaderboardData[i];
    try {
      text(
        `${i + 1}. Time: ${score.time}, name: ${score.playerName} `,
        window.innerWidth / 2,
        50 + 75 * (i + 1)
      );
    } catch {
      text(
        `Fewer than 10 players have played today!`,
        window.innerWidth / 2,
        25 + 75 * (i + 1)
      );
      i = 10;
    }
  }
}

function findPlayerIndex() {
  for (let i = 0; i < leaderboardData.length; i++) {
    if (leaderboardData[i].playerID === playerID) {
      return i;
    }
  }
  return -1; // Player not found in the leaderboard
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
      textSize(baseTextSize - 2);
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

function displayStartScreen() {
  clear();
  background(220);

  textSize(baseTextSize + 4);
  fill(255);
  stroke(0);
  strokeWeight(4);
  text(
    'This is Smokey Robinson',
    window.innerWidth < 450 ? 25 : 75,
    200
  );

  answerImage.resize(smokeypicWidth, smokeypicHeight);
  image(
    answerImage,
    window.innerWidth / 2 - smokeypicWidth / 2,
    window.innerHeight / 2 - smokeypicHeight / 2
  );

  text(
    'Find him and click to win!',
    //window.innerWidth < 450 ? 25 : 75
    window.innerWidth < 450
      ? window.innerWidth - 250
      : window.innerWidth - 450,
    window.innerHeight - 150
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
  saveUserPlayedToSessionStorage();
  hasPlayedInThisSession = true;
  clear();
  background(color(0, 100, 0)); // Darker green background
  // fill(255);

  noLoop();

  const myInput = createInput();
  const myButton = createButton('Go to leaderboard');
  myButton.elt.addEventListener('click', async function (event) {
    event.preventDefault();

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
    textSize(baseTextSize + 4);
    text('✨🎉YOU WON!!🎉✨', window.innerWidth / 2, 175);

    textSize(baseTextSize - 4);
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
    textSize(baseTextSize + 1);

    text('✨🎉YOU WON!!🎉✨', window.innerWidth / 2, 175);
    textSize(baseTextSize + 4);
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

  textSize(baseTextSize - 2);
  text('╰(⸝⸝⸝´꒳`⸝⸝⸝)╯', 80, 40);
  text(
    '╰(⸝⸝⸝´꒳`⸝⸝⸝)╯',
    window.innerWidth - 80,
    window.innerHeight - 40
  );
}

// ============
// ============
//Answer logic
// ============
// ============
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

// ============
// ============
//p5 event listeners
// ============
// ============
function windowResized() {
  offsetX = 0;
  offsetY = 0;
  resizeCanvas(window.innerWidth, window.innerHeight);
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
  if (frameCount >= 200 && !isLoading && !hasUserPlayedToday()) {
    if (gameStarted) {
      checkAnswer();
    } else {
      startGame();
    }
  }
  if (hasUserPlayedToday()) {
    return true;
  } else {
    return false;
  }
}
