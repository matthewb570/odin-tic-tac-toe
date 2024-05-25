function createPlayer(playerName, playerIcon) {
    let numWins = 0;

    const getNumWins = () => numWins;
    const incrementNumWins = () => numWins++;

    return { playerName, playerIcon, getNumWins, incrementNumWins };
}

function createGameBoard() {
    const NUM_ROWS_ON_BOARD = 3;
    const NUM_COLUMNS_ON_BOARD = 3;

    const TIE_INDICATOR = "tie";

    let gameBoard;
    let markCounter;

    const addMark = (squareRow, squareColumn, playerIcon) => {    
        if (squareRow >= 0 && squareRow < NUM_ROWS_ON_BOARD &&
            squareColumn >= 0 && squareColumn < NUM_COLUMNS_ON_BOARD) {
            if (gameBoard[squareRow][squareColumn] === null) {
                gameBoard[squareRow][squareColumn] = playerIcon;
                markCounter++;
            }
        }
    }

    const initializeGameBoard = () => {
        gameBoard = Array(NUM_ROWS_ON_BOARD);
        
        for (let row = 0; row < NUM_ROWS_ON_BOARD; row++) {
            gameBoard[row] = Array(NUM_COLUMNS_ON_BOARD);
            for (let col = 0; col < NUM_COLUMNS_ON_BOARD; col++) {
                gameBoard[row][col] = null;
            }
        }

        markCounter = 0;
    }

    const printGameBoard = () => { // TODO: Remove this
        console.log("" + gameBoard[0][0] + gameBoard[0][1] + gameBoard[0][2] + "\n" +
            gameBoard[1][0] + gameBoard[1][1] + gameBoard[1][2] + "\n" + 
            gameBoard[2][0] + gameBoard[2][1] + gameBoard[2][2] + "\n"
        );
    }

    const checkForWinner = () => {
        let winner = checkForHorizontalWinner();
        if (winner !== "") {
            return winner;
        }

        winner = checkForVerticalWinner();
        if (winner !== "") {
            return winner;
        }

        winner = checkForDiagonalWinner();
        if (winner !== "") {
            return winner;
        }

        if (isGameBoardFull()) {
            return TIE_INDICATOR;
        }

        return "";
    }

    const checkForHorizontalWinner = () => {
        let winner = "";

        let row = 0;

        while (winner === "" && row < NUM_ROWS_ON_BOARD) {
            let initialIcon = gameBoard[row][0];

            if (initialIcon !== null) {
                for (let col = 1; col < NUM_COLUMNS_ON_BOARD; col++) {
                    if (gameBoard[row][col] !== initialIcon) {
                        break;
                    } else if (col === NUM_COLUMNS_ON_BOARD - 1) {
                        winner = initialIcon;
                    }
                }
            }

            row++;
        }

        return winner;
    }

    const checkForVerticalWinner = () => {
        let winner = "";

        let col = 0 ;

        while (winner === "" && col < NUM_COLUMNS_ON_BOARD) {
            let initialIcon = gameBoard[0][col];

            if (initialIcon !== null) {
                for (let row = 1; row < NUM_ROWS_ON_BOARD; row++) {
                    if (gameBoard[row][col] !== initialIcon) {
                        break;
                    } else if (row === NUM_ROWS_ON_BOARD - 1) {
                        winner = initialIcon;
                    }
                }
            }

            col++;
        }

        return winner;
    }

    const checkForDiagonalWinner = () => {
        let winner = checkForTopDownDiagonalWinner();
        if (winner !== "") {
            return winner;
        }

        return checkForBottomUpDiagonalWinner();
    }

    const checkForTopDownDiagonalWinner = () => {
        let winner = "";

        let initialIcon = gameBoard[0][0];
        if (initialIcon !== null) {
            for (let row = 1; row < NUM_ROWS_ON_BOARD; row++) {
                if (gameBoard[row][row] !== initialIcon) {
                    break;
                } else if (row === NUM_ROWS_ON_BOARD - 1) {
                    winner = initialIcon;
                }
            }
        }

        return winner;
    }

    const checkForBottomUpDiagonalWinner = () => {
        let winner = "";

        let row = NUM_ROWS_ON_BOARD - 1;
        let col = 0;

        let initialIcon = gameBoard[row][col];
        if (initialIcon !== null) {
            do {
                if (row === 0) {
                    winner = initialIcon;
                }
                row--;
                col++;
            } while (row >= 0 && col < NUM_COLUMNS_ON_BOARD &&
                gameBoard[row][col] === initialIcon)
        }

        return winner;
    }

    const isGameBoardFull = () => {
        return markCounter >= NUM_ROWS_ON_BOARD * NUM_COLUMNS_ON_BOARD;
    }

    const getMarkAtLocation = (row, col) => {
        return gameBoard[row][col];
    }

    return { addMark, initializeGameBoard, checkForWinner, TIE_INDICATOR, printGameBoard, NUM_ROWS_ON_BOARD, NUM_COLUMNS_ON_BOARD, getMarkAtLocation };
}

function createGame() {
    let players = [
        createPlayer("Player 1", "X"),
        createPlayer("Player 2", "O")
    ];
    let currentPlayerIndex = 0;

    let gameBoard = createGameBoard();
    gameBoard.initializeGameBoard();

    const runGame = () => {

        let winner = "";

        while (winner === "") {
            gameBoard.printGameBoard();
            console.log(`It's ${players[currentPlayerIndex].playerName}'s turn`);
            
            let row = prompt("Please enter a row:");
            let column = prompt("Please enter a column");
            takeTurn(row, column);

            winner = gameBoard.checkForWinner();
        }

        if (winner === gameBoard.TIE_INDICATOR) {
            console.log("It's a tie!");
        } else {
            console.log(`${winner}s win!`);
        }
    }

    const takeTurn = (row, column) => {
        gameBoard.addMark(row, column, players[currentPlayerIndex].playerIcon);
        currentPlayerIndex = ++currentPlayerIndex % players.length;
    }

    return { runGame };
}

const gameDisplay = (function () {
    const divGameBoardDisplay = document.querySelector(".game .game-board");
    const divPlayerWinsDisplay = document.querySelector(".game .player-wins");

    const displayGameBoard = (gameBoard) => {
        for (let row = 0; row < gameBoard.NUM_ROWS_ON_BOARD; row++) {
            for (let col = 0; col < gameBoard.NUM_COLUMNS_ON_BOARD; col++) {
                let divGameBoardTile = document.createElement("div");
                divGameBoardTile.classList.add("game-tile");
                applyLocationBasedClasses(divGameBoardTile, row, col);
                divGameBoardTile.textContent = gameBoard.getMarkAtLocation(row, col);
                divGameBoardDisplay.appendChild(divGameBoardTile);
            }
        }
    }

    const applyLocationBasedClasses = (divGameBoardTile, row, col) => {
        if (row === 0) {
            divGameBoardTile.classList.add("top");
        }
        if (row === gameBoard.NUM_ROWS_ON_BOARD - 1) {
            divGameBoardTile.classList.add("bottom");
        }
        if (col === 0) {
            divGameBoardTile.classList.add("left");
        }
        if (col === gameBoard.NUM_COLUMNS_ON_BOARD - 1) {
            divGameBoardTile.classList.add("right");
        }
    }

    const displayPlayerWins = (player1, player2) => {
        let divPlayer1Info = document.createElement("div");
        divPlayer1Info = createPlayerWinsString(player1);
        divPlayerWinsDisplay.appendChild(divPlayer1Info);

        let divPlayer2Info = document.createElement("div");
        divPlayer2Info = createPlayerWinsString(player2);
        divPlayerWinsDisplay.appendChild(divPlayer2Info);
    }

    const createPlayerWinsString = (player) => {
        return `${player.playerName}: ${player.getNumWins()}`;
    }

    return { displayGameBoard, displayPlayerWins };
})();

let gameBoard = createGameBoard();
gameBoard.initializeGameBoard();
gameBoard.addMark(0, 0, "x");
gameBoard.addMark(0, 1, "x");
gameBoard.addMark(0, 2, "x");
gameBoard.addMark(1, 0, "x");
gameBoard.addMark(1, 1, "x");
gameBoard.addMark(1, 2, "x");
gameBoard.addMark(2, 0, "x");
gameBoard.addMark(2, 1, "x");
gameBoard.addMark(2, 2, "x");
gameDisplay.displayGameBoard(gameBoard);
// gameDisplay.displayPlayerWins();

// let game = createGame();
// game.runGame();