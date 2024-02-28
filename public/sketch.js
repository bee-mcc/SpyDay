function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  const myInput = createInput();
  const onInput = function () {
    let userInput = this.value();

    if (userInput.length > 3) {
      this.value(userInput.slice(0, 3));
    } else {
      this.value(userInput);
    }
  };

  myInput.input(onInput);
  myInput.position(window.innerWidth / 2 - 75, 520);
}
