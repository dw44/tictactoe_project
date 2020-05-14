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

  const updateBoard = (marker, location) => { // Tested - Working
      board[location].textContent = marker;
  }
 
  const clearBoard = () => { // Tested - Working
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
  const increaseScore = () => ++_score; // Tested - Working
  const resetScore = () => _score = 0; // Tested - Working
  const getScore = () => _score; // Tested - Working

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

  const createPlayers = function(stupid = false, ai = false) { // Tested - Working
    if (stupid === false && ai) {
      playerOne = playerFactory(document.getElementById('p1-name').value || 'Axe', 'X');
      playerTwo = playerFactory(document.getElementById('p2-name').value || 'Computer', 'O', 'computer');
    }
    else if (stupid && ai) {
      playerOne = playerFactory(document.getElementById('p1-name').value || 'Axe', 'X');
      playerTwo = playerFactory(document.getElementById('p2-name').value || 'Computer', 'O', 'stupidComputer');
    } else {
      playerOne = playerFactory(document.getElementById('p1-name').value || 'Axe', 'X');
      playerTwo = playerFactory(document.getElementById('p2-name').value || 'Leshrac', 'O');
    }
  }

  const clearState = () => { // Tested - Working
    for (let i = 0; i < 9; ++i) {
      boardState[i] = i;
    }
  }

  function initializePlayers() { // Tested - Working
    if (playerTypes.value === 'computer') createPlayers(false, true);
    else if (playerTypes.value === 'stupid-computer') createPlayers(true, true);
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

  function hardReset() { // Tested - Working
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
    // return true if board is full and neither player has won
    return board.filter(n => n !== 'X' && n !== 'O').length === 0 &&
          !win(board, 'X') &&
          !win(board, 'O');
  }

  const gameOver = function() { // Tested - Working
    return win(boardState, 'X') || win(boardState, 'O') || draw(boardState);
  }

  const endGameHandler = function() { // Tested - Working
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

  function turn() { // Tested - Working
    const targetCell = Number(this.id[5]);
    if (typeof(boardState[targetCell]) === 'number' ) {
      boardState[targetCell] = activePlayer.marker;
      this.textContent = activePlayer.marker;
      aiTurn(); // testing
      if (gameOver()) endGameHandler();
      togglePlayer();
      if (activePlayer.type === 'computer' || activePlayer.type === 'stupidComputer' && !gameOver()) {
        gameBoard.board[aiTurn()].click();  
      }
    }
  }

  function aiTurn() { // Tested - Working
    if (playerTwo.type === 'computer') {
      return minimax([...boardState], playerTwo.marker).index;
    } 
    if (playerTwo.type === 'stupidComputer') {
      const open = [...boardState].filter(cell => cell !== 'X' && cell !== 'O');
      return open[Math.floor(Math.random() * open.length)];
    }
    
  }

  function minimax(board, marker) { // Tested - Working
    const openSpots = board.filter(cell => cell !== 'X' && cell !== 'O');

    if (win(board, playerOne.marker)) {
      return {score: -10};
    }
    else if (win(board, playerTwo.marker)) {
      return {score: 10};
    }
    else if (board.every(spot => spot === 'X' || spot === 'O')) {
      return {score: 0};
    }  
    const moves = [];

    for (let i = 0; i < openSpots.length; ++i) {
      const move = {};
      move.index = board[openSpots[i]];
      
      board[openSpots[i]] = marker;
  
      if (marker === playerTwo.marker) {
        const result = minimax(board, playerOne.marker);
        move.score = result.score;
      } else {
        const result = minimax(board, playerTwo.marker);
        move.score = result.score;
      }
  
      board[openSpots[i]] = move.index;
      moves.push(move);
    }
  
    let bestMove;

    if (marker === playerTwo.marker) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; ++i) {
        if(moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; ++i) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }
})();