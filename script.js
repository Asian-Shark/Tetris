document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const scoreDisplay = document.getElementById('score');
  const linesDisplay = document.getElementById('lines');
  const levelDisplay = document.getElementById('level');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const tutorialModal = document.getElementById('tutorialModal');
  const closeTutorialBtn = document.getElementById('closeTutorial');
  const mobileControls = document.querySelector('.mobile-controls');
  const width = 10;
  let squares = [];
  let score = Number(localStorage.getItem("tetrisScore")) || 0;
  let lines = 0;
  let level = 1;
  let timerId;

  scoreDisplay.innerText = score;
  linesDisplay.innerText = lines;
  levelDisplay.innerText = level;

  for (let i = 0; i < 200; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
    squares.push(square);
  }

  for (let i = 0; i < 10; i++) {
    const square = document.createElement('div');
    square.classList.add('taken');
    grid.appendChild(square);
    squares.push(square);
  }

  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ];

  const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;
  let random = Math.floor(Math.random() * tetrominoes.length);
  let current = tetrominoes[random][currentRotation];

  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
    });
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
    });
  }

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      random = Math.floor(Math.random() * tetrominoes.length);
      currentRotation = 0;
      current = tetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      addScore();
    }
  }

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1;
    }
    draw();
  }

  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === tetrominoes[random].length) currentRotation = 0;
    current = tetrominoes[random][currentRotation];
    draw();
  }

  function control(e) {
    if (e.keyCode === 37) moveLeft();
    else if (e.keyCode === 39) moveRight();
    else if (e.keyCode === 40) moveDown();
    else if (e.keyCode === 38) rotate();
  }
  document.addEventListener('keydown', control);

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push(i + j);
      }
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        lines++;
        scoreDisplay.innerText = `Score: ${score}`;
        linesDisplay.innerText = `Lines: ${lines}`;
        levelDisplay.innerText = `Level: ${Math.floor(score / 50) + 1}`;
        localStorage.setItem("tetrisScore", score);

        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
        });

        const removed = squares.splice(i, width);
        squares = removed.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }

  function startGame() {
    timerId = setInterval(moveDown, 1000 - (Math.floor(score / 50) * 100));
  }

  function gameOver() {
    clearInterval(timerId);
    alert('Game Over!');
  }

  startGame();

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
  });

  closeTutorialBtn.addEventListener('click', () => {
    tutorialModal.style.display = 'none';
  });

  // Mobile controls
  document.getElementById('moveLeftBtn').addEventListener('click', moveLeft);
  document.getElementById('moveRightBtn').addEventListener('click', moveRight);
  document.getElementById('rotateBtn').addEventListener('click', rotate);
  document.getElementById('moveDownBtn').addEventListener('click', moveDown);
});
