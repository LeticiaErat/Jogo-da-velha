let player1Name = "O";
let player2Name = "X";
let currentPlayer = "O";
let currentSymbol = "O";
let isGameActive = true;
let gameState = Array(9).fill(null);

const cells = document.querySelectorAll('[data-cell]');
const statusMessage = document.getElementById('status-message');
const resultMessage = document.getElementById('result-message');
const rankingList = document.getElementById('ranking-list');

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const playAgainButton = document.getElementById('play-again-button');

startButton.addEventListener('click', startGame);

function startGame() {
  const player1Input = document.getElementById('player1').value.trim();
  const player2Input = document.getElementById('player2').value.trim();

  player1Name = player1Input === "" ? "O" : player1Input;
  player2Name = player2Input === "" ? "X" : player2Input;

  currentPlayer = player1Name;
  currentSymbol = "O";

  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  statusMessage.textContent = `Vez de ${currentPlayer} (O - Verde)`;

  isGameActive = true;
  gameState = Array(9).fill(null);

  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.color = "black";
    cell.addEventListener('click', handleClick, { once: true });
  });

  saveGame();
}

function handleClick(e) {
  const cell = e.target;
  const cellIndex = Array.from(cells).indexOf(cell);

  if (gameState[cellIndex] === null && isGameActive) {
    gameState[cellIndex] = currentSymbol;

    if (currentSymbol === "O") {
      cell.textContent = "O";
      cell.style.color = "green";
    } else {
      cell.textContent = "X";
      cell.style.color = "red";
    }

    if (checkWin(currentSymbol)) {
      endGame(`${currentPlayer} venceu!`);
      updateRanking(currentPlayer);
    } else if (isDraw()) {
      endGame("Empate!");
      updateRanking(null, true); // Ambos os jogadores ganham pontos no empate
    } else {
      currentPlayer = currentPlayer === player1Name ? player2Name : player1Name;
      currentSymbol = currentSymbol === "O" ? "X" : "O";
      statusMessage.textContent = `Vez de ${currentPlayer} (${currentSymbol === "O" ? "O - Verde" : "X - Vermelho"})`;
    }

    saveGame();
  }
}

function checkWin(currentSymbol) {
  const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winCombinations.some(combination => {
    return combination.every(index => gameState[index] === currentSymbol);
  });
}

function isDraw() {
  return gameState.every(cell => cell !== null);
}

function endGame(message) {
  isGameActive = false;
  statusMessage.textContent = message;

  cells.forEach(cell => cell.removeEventListener('click', handleClick));

  gameScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  resultMessage.textContent = message;

  displayRanking();
  localStorage.removeItem('ticTacToeGame');
}

function updateRanking(winner, isDraw = false) {
  let ranking = JSON.parse(localStorage.getItem('ranking')) || {};

  if (isDraw) {
    ranking[player1Name] = (ranking[player1Name] || 0) + 1;
    ranking[player2Name] = (ranking[player2Name] || 0) + 1;
  } else {
    ranking[winner] = (ranking[winner] || 0) + 1;
  }

  localStorage.setItem('ranking', JSON.stringify(ranking));
}

function displayRanking() {
  let ranking = JSON.parse(localStorage.getItem('ranking')) || {};
  rankingList.innerHTML = "";

  const sortedRanking = Object.entries(ranking).sort((a, b) => b[1] - a[1]);

  sortedRanking.forEach(([player, score]) => {
    let li = document.createElement('li');
    li.textContent = `${player}: ${score} vitória(s)`;
    rankingList.appendChild(li);
  });
}

playAgainButton.addEventListener('click', () => {
  resetGame();
});

restartButton.addEventListener('click', () => {
  resetGame();
});

function resetGame() {
  resultScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  player1Name = "O";
  player2Name = "X";
  currentPlayer = "O";
  currentSymbol = "O";
  isGameActive = true;
  gameState = Array(9).fill(null);

  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.color = "black"; 
    cell.addEventListener('click', handleClick, { once: true });
  });

  statusMessage.textContent = `Vez de ${currentPlayer} (O - Verde)`;
}

function saveGame() {
  const gameData = {
    gameState,
    player1Name,
    player2Name,
    currentPlayer,
    currentSymbol,
    isGameActive
  };
  localStorage.setItem('ticTacToeGame', JSON.stringify(gameData));
}   
