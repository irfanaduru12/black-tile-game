const coverPage = document.getElementById("coverPage");
const countdownScreen = document.getElementById("countdownScreen");
const countdownDisplay = document.getElementById("countdownDisplay");
const gameScreen = document.getElementById("gameScreen");
const gameBoard = document.getElementById("gameBoard");

const hiScoreValue = document.getElementById("highScoreValue");
const scoreValue = document.getElementById("scoreValue");
const timeValue = document.getElementById("timeValue");

const pointBar = document.getElementById("pointBar");
const endOverlay = document.getElementById("endOverlay");
const resultText = document.getElementById("resultText");

const GRID_SIZE = 4;
const INITIAL_TIME = 10;

const INITIAL_POINTS = 10; 
const POINT_DECAY_MS = 100; 

let highScore = 0;
let score = 0;

let timeLeft = INITIAL_TIME;
let timerInterval = null;

let pointsNow = INITIAL_POINTS;
let pointInterval = null;

let blackPositions = [];
let active = false;

function loadHighScore() {
  const stored = localStorage.getItem("hiScore");
  highScore = stored ? parseInt(stored, 10) : 0;
  hiScoreValue.textContent = highScore;
}

function saveNewHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("hiScore", String(highScore));
    hiScoreValue.textContent = highScore;
    return true;
  }
  return false;
}

function showScreen(screenEl) {
  [coverPage, countdownScreen, gameScreen].forEach((el) =>
    el.classList.remove("active")
  );
  screenEl.classList.add("active");
}

function buildBoard() {
  gameBoard.innerHTML = "";
  blackPositions = [];

  const total = GRID_SIZE * GRID_SIZE;
  for (let i = 0; i < total; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.index = String(i);
    tile.addEventListener("click", onTileClick);
    gameBoard.appendChild(tile);
  }
}

function setTileBlack(pos) {
  const tile = gameBoard.children[pos];
  if (!tile) return;

  tile.classList.add("black", "newFade");
  tile.addEventListener(
    "animationend",
    () => {
      tile.classList.remove("newFade");
    },
    { once: true }
  );
}

function clearTileBlack(pos) {
  const tile = gameBoard.children[pos];
  if (!tile) return;
  tile.classList.remove("black", "newFade");
}

function randomFrom(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

function placeBlackTiles(count, exclude = []) {
  const total = GRID_SIZE * GRID_SIZE;

  const available = [];
  for (let i = 0; i < total; i++) {
    if (blackPositions.includes(i)) continue;
    if (exclude.includes(i)) continue;
    available.push(i);
  }

  for (let k = 0; k < count && available.length > 0; k++) {
    const choice = randomFrom(available);
    const idx = available.indexOf(choice);
    available.splice(idx, 1);

    blackPositions.push(choice);
    setTileBlack(choice);
  }
}

function updatePointBar() {
  const pct = (pointsNow / INITIAL_POINTS) * 100;
  pointBar.style.width = pct + "%";
}

function startPointDecay() {
  stopPointDecay();
  pointsNow = INITIAL_POINTS;
  updatePointBar();

  pointInterval = setInterval(() => {
    pointsNow = Math.max(0, pointsNow - 1);
    updatePointBar();
    if (pointsNow === 0) stopPointDecay();
  }, POINT_DECAY_MS);
}

function stopPointDecay() {
  if (pointInterval) clearInterval(pointInterval);
  pointInterval = null;
}

function startTimer() {
  stopTimer();
  timeLeft = INITIAL_TIME;
  timeValue.textContent = String(timeLeft);

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    timeValue.textContent = String(timeLeft);

    if (timeLeft <= 0) {
      stopTimer();
      stopPointDecay();
      endGame();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}

function showPointFloat(tile, pts) {
  const span = document.createElement("span");
  span.className = "pointText";
  span.textContent = "+" + pts;
  tile.appendChild(span);

  setTimeout(() => {
    if (span.parentNode) span.parentNode.removeChild(span);
  }, 1000);
}

function hitTileAnimation(tile) {
  tile.classList.add("hit");
  setTimeout(() => tile.classList.remove("hit"), 250);
}

function onTileClick(e) {
  if (!active) return;

  const tile = e.currentTarget;
  const idx = parseInt(tile.dataset.index, 10);

  if (!tile.classList.contains("black")) return;

  const oldBlackSnapshot = [...blackPositions];

  const pts = Math.max(0, pointsNow);
  score += pts;
  scoreValue.textContent = String(score);

  clearTileBlack(idx);
  blackPositions = blackPositions.filter((p) => p !== idx);

  hitTileAnimation(tile);
  showPointFloat(tile, pts);

  placeBlackTiles(1, oldBlackSnapshot);


  startPointDecay();
}

function startCountdown() {
  showScreen(countdownScreen);

  let c = 3;
  countdownDisplay.textContent = String(c);

  const intv = setInterval(() => {
    c -= 1;
    if (c > 0) {
      countdownDisplay.textContent = String(c);
    } else {
      clearInterval(intv);
      startGame();
    }
  }, 1000);
}

function startGame() {
  showScreen(gameScreen);

  endOverlay.classList.remove("show");
  resultText.textContent = "Time is up!";

  score = 0;
  scoreValue.textContent = "0";

  active = true;

  const msg = document.getElementById("gameMessage");
  msg.classList.remove("flash-message");
  void msg.offsetWidth;
  msg.classList.add("flash-message");

  buildBoard();
  placeBlackTiles(3); 
  startPointDecay();
  startTimer();
}

function endGame() {
  active = false;

  Array.from(gameBoard.children).forEach((tile) =>
    tile.removeEventListener("click", onTileClick)
  );

  const isNew = saveNewHighScore();
  endOverlay.classList.add("show");

  if (isNew) {
    resultText.textContent = "New\nHighscore!";
    const end = Date.now() + 3000;
    const confInt = setInterval(() => {
      confetti({ particleCount: 22, spread: 90, origin: { y: 0.6 } });
      if (Date.now() > end) {
        clearInterval(confInt);
        confetti.reset();
      }
    }, 200);
  } else {
    resultText.textContent = "Time is up!";
  }
}

loadHighScore();

coverPage.addEventListener("click", () => {
  coverPage.style.pointerEvents = "none";
  startCountdown();
});