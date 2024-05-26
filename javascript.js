// TODO: Prevent players from selecting an already occupied tile (game logic already prevents overwriting these tiles, but selecting an occupied tile currently still counts as a turn)
// TODO: Display winner instead of a generic game over message
// TODO: Add score-keeping
// TODO: Add ability to start a new game
// TODO: Optional: Highlight the winning combination when there's a winner

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
        let isWinnerPresent = checkForHorizontalWinner();
        if (isWinnerPresent) {
            return isWinnerPresent;
        }

        isWinnerPresent = checkForVerticalWinner();
        if (isWinnerPresent) {
            return isWinnerPresent;
        }

        return checkForDiagonalWinner();
    }

    const checkForHorizontalWinner = () => {
        let isWinnerPresent = false;

        let row = 0;

        while (!isWinnerPresent && row < NUM_ROWS_ON_BOARD) {
            let initialIcon = gameBoard[row][0];

            if (initialIcon !== null) {
                for (let col = 1; col < NUM_COLUMNS_ON_BOARD; col++) {
                    if (gameBoard[row][col] !== initialIcon) {
                        break;
                    } else if (col === NUM_COLUMNS_ON_BOARD - 1) {
                        isWinnerPresent = true;
                    }
                }
            }

            row++;
        }

        return isWinnerPresent;
    }

    const checkForVerticalWinner = () => {
        let isWinnerPresent = false;

        let col = 0 ;

        while (!isWinnerPresent && col < NUM_COLUMNS_ON_BOARD) {
            let initialIcon = gameBoard[0][col];

            if (initialIcon !== null) {
                for (let row = 1; row < NUM_ROWS_ON_BOARD; row++) {
                    if (gameBoard[row][col] !== initialIcon) {
                        break;
                    } else if (row === NUM_ROWS_ON_BOARD - 1) {
                        isWinnerPresent = true;
                    }
                }
            }

            col++;
        }

        return isWinnerPresent;
    }

    const checkForDiagonalWinner = () => {
        let isWinnerPresent = checkForTopDownDiagonalWinner();
        if (isWinnerPresent) {
            return isWinnerPresent;
        }

        return checkForBottomUpDiagonalWinner();
    }

    const checkForTopDownDiagonalWinner = () => {
        let isWinnerPresent = false;

        let initialIcon = gameBoard[0][0];
        if (initialIcon !== null) {
            for (let row = 1; row < NUM_ROWS_ON_BOARD; row++) {
                if (gameBoard[row][row] !== initialIcon) {
                    break;
                } else if (row === NUM_ROWS_ON_BOARD - 1) {
                    isWinnerPresent = true;
                }
            }
        }

        return isWinnerPresent;
    }

    const checkForBottomUpDiagonalWinner = () => {
        let isWinnerPresent = false;

        let row = NUM_ROWS_ON_BOARD - 1;
        let col = 0;

        let initialIcon = gameBoard[row][col];
        if (initialIcon !== null) {
            do {
                if (row === 0) {
                    isWinnerPresent = true;
                }
                row--;
                col++;
            } while (row >= 0 && col < NUM_COLUMNS_ON_BOARD &&
                gameBoard[row][col] === initialIcon)
        }

        return isWinnerPresent;
    }

    const isGameBoardFull = () => {
        return markCounter >= NUM_ROWS_ON_BOARD * NUM_COLUMNS_ON_BOARD;
    }

    const getMarkAtLocation = (row, col) => {
        return gameBoard[row][col];
    }

    const getNumGameBoardRows = () => {
        return NUM_ROWS_ON_BOARD;
    }

    const getNumGameBoardColumns = () => {
        return NUM_COLUMNS_ON_BOARD;
    }

    return { addMark, initializeGameBoard, checkForWinner, TIE_INDICATOR, printGameBoard, getMarkAtLocation, getNumGameBoardRows, getNumGameBoardColumns, isGameBoardFull };
}

function createGame() {
    let players = [
        createPlayer("Player 1", "X"),
        createPlayer("Player 2", "O")
    ];
    let currentPlayerIndex = 0;

    let gameBoard = createGameBoard();
    gameBoard.initializeGameBoard();

    // TODO: Remove this if not needed
    // const runGame = () => {

    //     let winner = "";

    //     while (winner === "") {
    //         gameBoard.printGameBoard();
    //         console.log(`It's ${players[currentPlayerIndex].playerName}'s turn`);
            
    //         let row = prompt("Please enter a row:");
    //         let column = prompt("Please enter a column");
    //         takeTurn(row, column);

    //         winner = gameBoard.checkForWinner();
    //     }

    //     if (winner === gameBoard.TIE_INDICATOR) {
    //         console.log("It's a tie!");
    //     } else {
    //         console.log(`${winner}s win!`);
    //     }
    // }

    const takeTurn = (row, column) => {
        gameBoard.addMark(row, column, players[currentPlayerIndex].playerIcon);
        if (!isGameOver()) {
            currentPlayerIndex = ++currentPlayerIndex % players.length;
        }
    }

    const getNumGameBoardRows = () => {
        return gameBoard.getNumGameBoardRows();
    }

    const getNumGameBoardColumns = () => {
        return gameBoard.getNumGameBoardColumns();
    }

    const getGameBoardMarkAtLocation = (row, col) => {
        return gameBoard.getMarkAtLocation(row, col);
    }

    const isGameOver = () => {
        return gameBoard.checkForWinner() || gameBoard.isGameBoardFull();
    }

    const getCurrentPlayer = () => {
        return players[currentPlayerIndex];
    }

    return { takeTurn, getNumGameBoardRows, getNumGameBoardColumns, getGameBoardMarkAtLocation, isGameOver, getCurrentPlayer };
}

const gameDisplay = (function () {

    const ROW_ATTRIBUTE_NAME = "row";
    const COLUMN_ATTRIBUTE_NAME = "col";

    const divGameWinner = document.querySelector(".game .game-winner");
    const divGameBoardDisplay = document.querySelector(".game .game-board");
    const divPlayerWinsDisplay = document.querySelector(".game .player-wins");

    const game = createGame();

    const displayGameBoard = () => {
        while (divGameBoardDisplay.firstChild) {
            divGameBoardDisplay.removeChild(divGameBoardDisplay.lastChild);
        }

        for (let row = 0; row < game.getNumGameBoardRows(); row++) {
            for (let col = 0; col < game.getNumGameBoardColumns(); col++) {
                let divGameBoardTile = document.createElement("div");
                divGameBoardTile.classList.add("game-tile");
                applyLocationBasedClasses(divGameBoardTile, row, col);
                
                divGameBoardTile.setAttribute(ROW_ATTRIBUTE_NAME, row);
                divGameBoardTile.setAttribute(COLUMN_ATTRIBUTE_NAME, col);
                
                divGameBoardTile.textContent = game.getGameBoardMarkAtLocation(row, col);
                
                divGameBoardTile.addEventListener("click", handleGameTileClick);
                
                divGameBoardDisplay.appendChild(divGameBoardTile);
            }
        }
    }

    const applyLocationBasedClasses = (divGameBoardTile, row, col) => {
        if (row === 0) {
            divGameBoardTile.classList.add("top");
        }
        if (row === game.getNumGameBoardRows() - 1) {
            divGameBoardTile.classList.add("bottom");
        }
        if (col === 0) {
            divGameBoardTile.classList.add("left");
        }
        if (col === game.getNumGameBoardColumns() - 1) {
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

    const handleGameTileClick = (event) => {
        if (!game.isGameOver()) {
            game.takeTurn(event.target.getAttribute(ROW_ATTRIBUTE_NAME), event.target.getAttribute(COLUMN_ATTRIBUTE_NAME));
            displayGameBoard();
            if (game.isGameOver()) {
                divGameWinner.textContent = "Game Over!";
            }
        }
    }

    return { displayGameBoard, displayPlayerWins };
})();

// let gameBoard = createGameBoard();
// gameBoard.initializeGameBoard();
// gameBoard.addMark(0, 0, "x");
// gameBoard.addMark(0, 1, "x");
// gameBoard.addMark(0, 2, "x");
// gameBoard.addMark(1, 0, "x");
// gameBoard.addMark(1, 1, "x");
// gameBoard.addMark(1, 2, "x");
// gameBoard.addMark(2, 0, "x");
// gameBoard.addMark(2, 1, "x");
// gameBoard.addMark(2, 2, "x");
gameDisplay.displayGameBoard();
// gameDisplay.displayPlayerWins();

// let game = createGame();
// game.runGame();