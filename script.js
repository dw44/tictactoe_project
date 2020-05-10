const game = (function() {

    const _winningCombos = [ // all possible winning combinations in a game of TTT
        [1, 2, 3],
        [1, 4, 7],
        [1, 5, 9],
        [2, 5, 8],
        [3, 5, 7],
        [3, 6, 9],
        [4, 5, 6],
        [7, 8, 9]
    ];
    
    const _boardState = [null, null, null, null, null, null, null, null, null];

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

    function updateBoard(sign) {
        if (this.textContent.length !== 0) {
            alert('Full');
        } else {
            this.textContent = sign;
        }
    }

    board.forEach(cell => cell.addEventListener('click', updateBoard.bind(cell, 'O')));


    return {
        board,
    };

/* END OF MODULE */
})();
