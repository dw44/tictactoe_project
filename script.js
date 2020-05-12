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

    return {
        board,
        updateBoard,
    };

})();

/* ===================================================================================== */
/* GAME LOGIC */

const game = (function() {

    const winningCombos = [ // all possible winning combinations in a game of TTT
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 4, 6],
        [2, 5, 8],
        [3, 4, 5],
        [6, 7, 8]
    ];

    const boardState = [null, null, null, null, null, null, null, null, null];
    const softResetButton = document.getElementById('soft-reset');
    const hardResetButton = document.getElementById('reset');
    const playerOne = playerFactory('Player 1', 'X');
    const playerTwo = playerFactory('Player 2', 'O');

    let win = false;
    let activePlayer = playerOne;

    gameBoard.board.forEach(cell => cell.addEventListener('click', turn));
    softResetButton.addEventListener('click', resetGame);
    hardResetButton.addEventListener('click', hardReset);

    function cleanBoard() {
        for (let i = 0; i < 9; ++i) {
            boardState[i] = null;
            gameBoard.board[i].textContent = '';
            activePlayer = playerOne;
        } 
    }
        
    function resetGame() {
        win = false;
        cleanBoard();
        enableGrid();
        toggleDisabled(softResetButton, hardResetButton);
    }

    function togglePlayer() { // switch players
        activePlayer = (activePlayer.marker === playerTwo.marker) ? playerOne : playerTwo;
    }

    function toggleDisabled(...args) {
        args.forEach(arg => arg.disabled = !arg.disabled);
    }

    function endGame() {
        winningCombos.forEach(combo => {
            if (boardState[combo[0]] === boardState[combo[1]] && 
                boardState[combo[1]] === boardState[combo[2]] &&
                boardState[combo[0]] !== null) {
                    const winner = (activePlayer.marker === playerOne.marker) ? playerTwo : playerOne;
                    win = true;
                    winner.increaseScore();
                    document.getElementById('player-1-score').textContent = playerOne.getScore();
                    document.getElementById('player-2-score').textContent = playerTwo.getScore();
                    alert(`${winner.name} wins!!!`);
                    disableGrid();
                    toggleDisabled(softResetButton, hardResetButton, ...gameBoard.board);
                }
        });
        if (boardState.every(marker => marker !== null) && !win) {
            alert('Match Drawn!!!');
            disableGrid();
            toggleDisabled(softResetButton, hardResetButton);
        }
    }

    function turn() {
        const target = Number(this.id[5]);
        if (boardState[target] === null) {
            boardState[target] = activePlayer.marker;
            this.textContent = activePlayer.marker;
            setTimeout(endGame, 100); // call before togglePlayer or wrong player will be declared winner
            togglePlayer();
        }        
    }

    function hardReset() {
        win = false;
        playerOne.resetScore();
        playerTwo.resetScore();
        document.getElementById('player-1-score').textContent = playerOne.getScore();
        document.getElementById('player-2-score').textContent = playerTwo.getScore();
        resetGame();
    }    

    function disableGrid() {
        gameBoard.board.forEach(cell => cell.removeEventListener('click', turn));
    }

    function enableGrid() {
        gameBoard.board.forEach(cell => cell.addEventListener('click', turn));
    }
})();

/* ===================================================================================== */
/* PLAYER */

function playerFactory(name, marker, type='human') {
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