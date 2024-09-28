// Variáveis globais
let player1Name = "O";
let player2Name = "X";
let currentPlayer = "O"; // Primeiro jogador (sempre O)
let currentSymbol = "O"; // Símbolo inicial (O)
let isGameActive = true;
let gameState = Array(9).fill(null); // Estado do tabuleiro

const cells = document.querySelectorAll('[data-cell]');
const statusMessage = document.getElementById('status-message');
const resultMessage = document.getElementById('result-message');
const rankingList = document.getElementById('ranking-list');

// Telas
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

// Botões
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const playAgainButton = document.getElementById('play-again-button');

// Inicialização do jogo
startButton.addEventListener('click', startGame);

// Função para iniciar o jogo
function startGame() {
    const player1Input = document.getElementById('player1').value.trim();
    const player2Input = document.getElementById('player2').value.trim();

    player1Name = player1Input === "" ? "O" : player1Input;
    player2Name = player2Input === "" ? "X" : player2Input;

    currentPlayer = player1Name;  // Jogador "O" começa
    currentSymbol = "O";  // O símbolo "O" joga primeiro

    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    statusMessage.textContent = `Vez de ${currentPlayer} (O - Verde)`;

    isGameActive = true;
    gameState = Array(9).fill(null); // Reinicia o estado do tabuleiro

    // Limpa o tabuleiro e habilita os eventos de clique
    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.color = "black"; // Define a cor do texto padrão
        cell.addEventListener('click', handleClick, { once: true });
    });

    saveGame();
}

// Função para lidar com o clique nas células
function handleClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (gameState[cellIndex] === null && isGameActive) {
        // Atualiza o estado do tabuleiro
        gameState[cellIndex] = currentSymbol;

        // Define a cor do texto baseado no símbolo atual
        cell.textContent = currentSymbol;
        cell.style.color = currentSymbol === "O" ? "green" : "red"; // Verde para O, vermelho para X

        // Verifica vitória ou empate
        if (checkWin(currentSymbol)) {
            endGame(`${currentPlayer} venceu!`);
            updateRanking(currentPlayer);
        } else if (isDraw()) {
            endGame("Empate!");
            updateRanking(null, true); // Ambos os jogadores ganham pontos no empate
        } else {
            // Alterna entre jogadores
            currentPlayer = currentPlayer === player1Name ? player2Name : player1Name;
            currentSymbol = currentSymbol === "O" ? "X" : "O";
            statusMessage.textContent = `Vez de ${currentPlayer} (${currentSymbol === "O" ? "O - Verde" : "X - Vermelho"})`;
        }

        saveGame();
    }
}

// Função para verificar se há uma vitória
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

// Função para verificar empate
function isDraw() {
    return gameState.every(cell => cell !== null);
}

// Função para finalizar o jogo
function endGame(message) {
    isGameActive = false;
    statusMessage.textContent = message;

    // Remove os eventos de clique
    cells.forEach(cell => cell.removeEventListener('click', handleClick));

    // Exibir a tela de resultado
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    resultMessage.textContent = message;

    displayRanking();
    localStorage.removeItem('ticTacToeGame'); // Limpa o estado salvo após o jogo acabar
}

// Função para atualizar o ranking no localStorage
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

// Exibir ranking na tela de resultado
function displayRanking() {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || {};
    rankingList.innerHTML = ""; // Limpa o ranking atual da interface

    // Ordenar o ranking por quantidade de vitórias (decrescente)
    const sortedRanking = Object.entries(ranking).sort((a, b) => b[1] - a[1]);

    // Atualizar o ranking na interface
    sortedRanking.forEach(([player, score]) => {
        let li = document.createElement('li');
        li.textContent = `${player}: ${score} vitória(s)`;
        rankingList.appendChild(li);
    });
}

// Função para reiniciar o jogo
playAgainButton.addEventListener('click', resetGame);
restartButton.addEventListener('click', resetGame);

// Função para redefinir o jogo
function resetGame() {
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');

    // Redefine todas as variáveis do jogo
    player1Name = "O";
    player2Name = "X";
    currentPlayer = "O";
    currentSymbol = "O";
    isGameActive = true;
    gameState = Array(9).fill(null); // Reinicia o estado do tabuleiro

    // Atualiza a tela inicial com os nomes dos jogadores
    document.getElementById('player1').value = "";
    document.getElementById('player2').value = "";
}

// Função para salvar o estado do jogo no localStorage
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
