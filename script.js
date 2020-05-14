"use strict";

/* ===================================================================================== */
                                /* GAME BOARD OBJECT */
/* ===================================================================================== */
const gameBoard = (function() {
      
  const board = [
      document.getElementById('cell-0'),
      document.getElementById('cell-1'),
      document.getElementById('cell-2'),
      document.getElementById('cell-3'),
      document.getElementById('cell-4'),
      document.getElementById('cell-5'),
      document.getElementById('cell-6'),
      document.getElementById('cell-7'),
      document.getElementById('cell-8')        
  ];

  const updateBoard = (marker, location) => {
      board[location].textContent = marker;
  }

  const clearBoard = () => {
    board.forEach(cell => {
      cell.textContent = '';
    });
  }

  return {
      board,
      updateBoard,
      clearBoard
  };

})();

/* ===================================================================================== */
                                /* PLAYER OBJECT */
/* ===================================================================================== */

const playerFactory = function (name, marker, type='human') {
  let _score = 0;
  const increaseScore = () => ++_score;
  const resetScore = () => _score = 0;
  const getScore = () => _score;

  return {
      name, 
      marker,
      type,
      increaseScore,
      resetScore,
      getScore
  };
}

/* ===================================================================================== */
                                    /* GAME LOGIC */
/* ===================================================================================== */

const game = (function() {

  const initBtn = document.getElementById('submit-players');
  const playerTypes = document.getElementById('player-type');
  const modal = document.getElementById('modal');
  const initForm = document.getElementById('new-game');
  const winnerDisplay = document.getElementById('show-winner');
  const roundWinner = document.getElementById('winner-name');
  const newRoundBtn = document.getElementById('soft-reset');
  const hardResetBtn = document.getElementById('reset');
  const playerOneTitle = document.getElementById('player-1-title');
  const playerTwoTitle = document.getElementById('player-2-title');
  const playerOneScore = document.getElementById('player-1-score');
  const playerTwoScore = document.getElementById('player-2-score');

  const boardState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const winningCombos = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
  ]; // All possible winning combinations

  let playerOne;
  let playerTwo;    
  let activePlayer;
  
  initBtn.addEventListener('click', initializePlayers);
  newRoundBtn.addEventListener('click', newRound);
  hardResetBtn.addEventListener('click', hardReset);
  gameBoard.board.forEach(cell => cell.addEventListener('click', turn));

  const createPlayers = function(ai = false) { // Tested - Working
    if (ai === true) {
      playerOne = playerFactory(document.getElementById('p1-name').value || 'Axe', 'X');
      playerTwo = playerFactory(document.getElementById('p2-name').value || 'Computer', 'O', 'computer');
    } else {
      playerOne = playerFactory(document.getElementById('p1-name').value || 'Axe', 'X');
      playerTwo = playerFactory(document.getElementById('p2-name').value || 'Leshrac', 'O');
    }
  }

  const clearState = () => {
    for (let i = 0; i < 9; ++i) {
      boardState[i] = i;
    }
  }

  function initializePlayers() { // Tested - Working
    if (playerTypes.value === 'computer') createPlayers(true);
    else createPlayers();
    // Initializing early game variables
    activePlayer = playerOne;
    playerOneTitle.textContent = playerOne.name;
    playerTwoTitle.textContent = playerTwo.name;    
    initForm.style.display = 'none';
    modal.style.display = 'none';
  }

  function newRound() { // Tested - Working
    clearState();
    gameBoard.clearBoard();
    activePlayer = playerOne;
    modal.style.display = 'none';
    winnerDisplay.style.display = 'none';
  }

  function hardReset() {
    clearState();
    gameBoard.clearBoard();
    playerOne = undefined;
    playerOneTitle.textContent = 'Axe';
    playerOneScore.textContent = '0';
    playerTwo = undefined;
    playerTwoTitle.textContent = 'Leshrac';
    playerTwoScore.textContent = '0';    
    winnerDisplay.style.display = 'none';
    initForm.style.display = 'flex';
  }

  const togglePlayer = function() { // Tested - Working
    activePlayer = (activePlayer.marker === playerOne.marker) ? playerTwo : playerOne;
  }

  const win = function(board, marker) { // Tested - Working
    for (const combo of winningCombos) {
      if (combo.every(index => board[index] === marker)) return true;
    }
    return false;
  }

  const draw = function(board) { // Tested - Working
    return board.filter(n => n !== 'X' && n !== 'O').length === 0 &&
          !win(board, 'X') &&
          !win(board, 'O');
  }

  const gameOver = function() { // Tested - Working
    return win(boardState, 'X') || win(boardState, 'O') || draw(boardState);
  }

  const endGameHandler = function() {
    if (win(boardState, 'X')) {
      playerOne.increaseScore();
      playerOneScore.textContent = playerOne.getScore();
      var result = `${playerOne.name} Wins`;
    }
    else if (win(boardState, 'O')) {
      playerTwo.increaseScore();
      playerTwoScore.textContent = playerTwo.getScore();
      var result = `${playerTwo.name} Wins`;
    }
    else if (draw(boardState)) {
      var result = "It's a Tie";
    }
    modal.style.display = 'flex';
    winnerDisplay.style.display = 'flex';
    roundWinner.textContent = result;
  }

  function turn() {
    const targetCell = Number(this.id[5]);
    if (typeof(boardState[targetCell]) === 'number' ) {
      boardState[targetCell] = activePlayer.marker;
      this.textContent = activePlayer.marker;
      console.log(boardState);
      if (gameOver()) endGameHandler();
      togglePlayer();
    }
  }




























})();