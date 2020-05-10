const game = (function() {

    const _playerOne = player('Axe', 'X');
    const _playerTwo = player('Leshrac', 'O');    
    let _current = _playerOne;

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
    
    // updated every turn
    const _boardState = [null, null, null, null, null, null, null, null, null];

    const _alternatePlayer = () => {
        if (_current.symbol === 'X') {
            _current = _playerTwo;
        } else {
            _current = _playerOne;
        }
    }

    const _checkResult = () => {
        _winningCombos.forEach(combo => {
            if (_boardState[combo[0]] === _boardState[combo[1]] && 
                _boardState[combo[1]] === _boardState[combo[2]] &&
                _boardState[combo[0]] !== null) {
                alert(`${_boardState[combo[0]]} WINS`);
                board.forEach(cell => cell.addEventListener('click', () => {}));
            }
        });
    }

    const board = [
        document.getElementById('cell-1'),
        document.getElementById('cell-2'),
        document.getElementById('cell-3'),
        document.getElementById('cell-4'),
        document.getElementById('cell-5'),
        document.getElementById('cell-6'),
        document.getElementById('cell-7'),
        document.getElementById('cell-8'),
        document.getElementById('cell-9')
    ];

    // symbol placeholder setup

    function turn() {
        if (this.textContent.length !== 0) {
            alert('Full');
        } else {
            this.textContent = _current.symbol;
        }
        _current.cells.push(Number(this.id[5]));
        _boardState[Number(this.id[5]) - 1] = _current.symbol;
        _checkResult();
        console.log(_boardState);
        _alternatePlayer(); // switch player
    }

    board.forEach(cell => cell.addEventListener('click', turn.bind(cell)));


    return {
        board,
    };

/* END OF MODULE */
})();


// Player Factory
function player (name, symbol) {
    const cells = [];
    return {
        name,
        symbol,
        cells
    };
}