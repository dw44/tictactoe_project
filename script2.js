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

    const _winningCombos = [ // all possible winning combinations in a game of TTT
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 4, 6],
        [2, 5, 8],
        [3, 4, 5],
        [6, 7, 8]
    ];

    const _boardState = [null, null, null, null, null, null, null, null, null];

    const _resetGame = () => {
        for (let i = 0; i < 9; ++i) {
            _boardState[i] = null;
            gameBoard.board[i].textContent = '';
            _activePlayer = playerOne;
        }
    }

    const playerOne = playerFactory('Player 1', 'X');
    const playerTwo = playerFactory('Player 2', 'O');
    let _activePlayer = playerOne;




    const _togglePlayer = () => { // switch players
        _activePlayer = (_activePlayer.marker === playerTwo.marker) ? playerOne : playerTwo;
    }




    const _winCondition = () => {
        _winningCombos.forEach(combo => {
            if (_boardState[combo[0]] === _boardState[combo[1]] && 
                _boardState[combo[1]] === _boardState[combo[2]] &&
                _boardState[combo[0]] !== null) {
                    const winner = (_activePlayer.marker === playerOne.marker) ? playerTwo : playerOne;
                    winner.increaseScore();
                    document.getElementById('player-1-score').textContent = playerOne.getScore();
                    document.getElementById('player-2-score').textContent = playerTwo.getScore();
                    alert(`${winner.name} wins!!!`);
                    _resetGame();
                }
        });
    }




    function turn() {
        const target = Number(this.id[5]);
        if (_boardState[target] === null) {
            _boardState[target] = _activePlayer.marker;
            this.textContent = _activePlayer.marker;
            setTimeout(_winCondition, 100); // call before togglePlayer or wrong player will be declared winner
            _togglePlayer();
        }        
    }

    gameBoard.board.forEach(cell => cell.addEventListener('click', turn));

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