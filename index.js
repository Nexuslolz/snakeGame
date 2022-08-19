///// variables
let cnvs = document.querySelector(".cnvs");
let ctx = cnvs.getContext("2d");
let width = cnvs.width
let height = cnvs.height

//////game field
let blockSize = 10;
let blockWidth = width / blockSize;
let blockHeight = height / blockSize;

let drawBorder = function () {
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};

//////score
let score = 0;
let drawScore = function () {
  ctx.clearRect(0, 0, width, height);
  ctx.textBaseline = "top";
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.font = "17px Comic Sans MS";
  ctx.fillText("Счет: " + score, blockSize + 5, blockSize + 5);
};

///////box
let Block = function (col, row) {
  this.col = col;
  this.row = row;
};

////// figures
let colors = [
  "SpringGreen",
  "Teal",
  "DarkTurquoise",
  "RoyalBlue",
  "Salmon",
];
let colorIndex = {};
Block.prototype.drawSquare = function () {
  let x = this.col * blockSize;
  let y = this.row * blockSize;
  ctx.fillRect(x, y, blockSize, blockSize);
};
Block.prototype.drawCircle = function (color) {
  let centerX = this.col * blockSize + blockSize / 2;
  let centerY = this.row * blockSize + blockSize / 2;
  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize / 2, true);
};
let circle = function (centerX, centerY, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
  if (fillCircle) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

//////check
Block.prototype.equal = function (otherBlock) {
  return this.col === otherBlock.col && this.row === otherBlock.row;
};

/////snake
let Snake = function () {
  this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
  this.direction = "right";
  this.nextDirection = "right";
};
Snake.prototype.draw = function (color) {
  ctx.fillStyle = color;
  for (i = 0; i < this.segments.length; i++) {
    this.segments[i].drawSquare();
  }
};
Snake.prototype.checkCollision = function (head) {
  let leftCollusion = head.col === 0;
  let topCollusion = head.row === 0;
  let rightCollusion = head.col === blockWidth - 1;
  let bottomCollusion = head.row === blockHeight - 1;
  let wallCollusion =
    leftCollusion || rightCollusion || topCollusion || bottomCollusion;
  let selfCollusion = false;
  for (i = 0; i < this.segments.length; i++) {
    if (head.equal(this.segments[i])) {
      selfCollusion = true;
    }
  }
  return wallCollusion || selfCollusion;
};
Snake.prototype.move = function () {
  let head = this.segments[0];
  let newHead;
  this.direction = this.nextDirection;
  if (this.direction === "right") {
    newHead = new Block(head.col + 1, head.row);
  } else if (this.direction === "down") {
    newHead = new Block(head.col, head.row + 1);
  } else if (this.direction === "left") {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.direction === "up") {
    newHead = new Block(head.col, head.row - 1);
  }
  if (this.checkCollision(newHead)) {
    gameOver();
    return;
  }
  this.segments.unshift(newHead);
  if (newHead.equal(apple.position)) {
    score++;
    if (animationTime > 30) {
      animationTime -= 4;
    }
    apple.move();
  } else {
    this.segments.pop();
  }
};

//////// directions
let directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};
let refreshers = {
  13: "refresh",
};



///// mobile controls

cnvs.addEventListener('touchstart', handleTouchStart, false)
cnvs.addEventListener('touchmove', handleTouchMove, false)

let x1 = null
let y1 = null

function handleTouchStart(event) {
  const touchStart = event.touches[0];

  x1 = touchStart.clientX;
  y1 = touchStart.clientY;
}

function handleTouchMove(event) {
  if (!x1 || !y1) {
    return false
  }
  const touchMove = event.touches[0]

  x2 = touchMove.clientX
  y2 = touchMove.clientY

  let xDiff = x2 - x1
  let yDiff = y2 - y1

  let newDirection

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (x2 > x1) {
      newDirection = "right"
    } else {
      newDirection = "left"
    }
  } else {
    if (y2 > y1) {
      newDirection = "down"
    } else {
      newDirection = "up"
    }
  }
  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
}

Snake.prototype.setDirection = function (newDirection) {
  if (this.direction === "up" && newDirection === "down") {
    return;
  } else if (this.direction === "down" && newDirection === "up") {
    return;
  } else if (this.direction === "left" && newDirection === "right") {
    return;
  } else if (this.direction === "right" && newDirection === "left") {
    return;
  }
  this.nextDirection = newDirection;
};

///////apple
let Apple = function () {
  this.position = new Block(10, 10);
};
Apple.prototype.draw = function () {
  this.position.drawCircle("LimeGreen");
};
Apple.prototype.move = function () {
  let randomCol = Math.floor(Math.random() * (blockWidth - 2) + 1);
  let randomRow = Math.floor(Math.random() * (blockHeight - 2) + 1);
  this.position = new Block(randomCol, randomRow);
  for (i = 0; i < snake.segments.length; i++) {
    if (this.position.equal(snake.segments[i])) {
      apple.move();
    }
  }
};

let snake = new Snake();
let apple = new Apple();

///////chouse color
let clickColor = "blue";
let chooseColor = function () {
  $(".color-1").click(function () {
    clickColor = "SpringGreen";
    snake.draw(clickColor);
  });
  $(".color-2").click(function () {
    clickColor = "Teal";
    snake.draw(clickColor);
  });
  $(".color-3").click(function () {
    clickColor = "DarkTurquoise";
    snake.draw(clickColor);
  });
  $(".color-4").click(function () {
    clickColor = "RoyalBlue";
    snake.draw(clickColor);
  });
  $(".color-5").click(function () {
    clickColor = "Salmon";
    snake.draw(clickColor);
  });
};

let finalDraw = function () {
  drawScore();
  snake.move();
  apple.draw();
  drawBorder();
};
finalDraw();
let gameLoop = function () {
  if (
    clickColor === "SpringGreen" ||
    clickColor === "Teal" ||
    clickColor === "DarkTurquoise" ||
    clickColor === "RoyalBlue" ||
    clickColor === "Salmon"
  ) {
    finalDraw();
    snake.draw(clickColor);
  } else {
    snake.draw(clickColor);
    chooseColor();
  }
};
gameLoop();

//////////start game
let animationTime = 150;
let gameStart = function () {
  drawScore();
  snake.move();
  apple.draw();
  drawBorder();
  snake.draw(clickColor);
  let intervalId = setTimeout(gameStart, animationTime);
};
$(".btn__menu-start").click(function () {
  gameStart();
});
$(".btn__menu-pause").click(function () {
  alert("ПАУЗА");
});
let pauseArr = { 80: "pause" };
$("body").keydown(function (event) {
  let pause = pauseArr[event.keyCode];
  if (pause === "pause") {
    alert("ПАУЗА");
  }
});

///////game over
let gameOver = function () {
  drawScore();
  apple.draw();
  snake.draw(clickColor);
  drawBorder();
  ctx.font = "55px Courier";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Конец игры!", width / 2, height / 2);
  $("body").keydown(function (event) {
    let refresh = refreshers[event.keyCode];
    if (refresh === "refresh") {
      location.reload();
    }
  });
  clearTimeout(intervalId);
};
$("body").keydown(function (event) {
  let newDirection = directions[event.keyCode];
  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
});
$(".refresh__btn").click(function () {
  location.reload();
});