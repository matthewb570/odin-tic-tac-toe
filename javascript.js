// TODO: Allow player name entry

function createPlayer(playerName, playerIcon) {
    let numWins = 0;

    const getNumWins = () => numWins;
    const incrementNumWins = () => numWins++;

    return { playerName, playerIcon, getNumWins, incrementNumWins };
}

function createGameBoard() {
    const NUM_ROWS_ON_BOARD = 3;
    const NUM_COLUMNS_ON_BOARD = 3;

    let gameBoard;
    let markCounter;

    const addMark = (squareRow, squareColumn, playerIcon) => {    
        let markPlaced = false;
        
        if (squareRow >= 0 && squareRow < NUM_ROWS_ON_BOARD &&
            squareColumn >= 0 && squareColumn < NUM_COLUMNS_ON_BOARD) {
            if (gameBoard[squareRow][squareColumn] === null) {
                gameBoard[squareRow][squareColumn] = playerIcon;
                markCounter++;
                markPlaced = true;
            }
        }

        return markPlaced;
    }

    const resetGameBoard = () => {
        gameBoard = Array(NUM_ROWS_ON_BOARD);
        
        for (let row = 0; row < NUM_ROWS_ON_BOARD; row++) {
            gameBoard[row] = Array(NUM_COLUMNS_ON_BOARD);
            for (let col = 0; col < NUM_COLUMNS_ON_BOARD; col++) {
                gameBoard[row][col] = null;
            }
        }

        markCounter = 0;
    }

    const checkForWinner = () => {
        let winningPath = checkForHorizontalWinner();
        if (winningPath.length !== 0) {
            return winningPath;
        }

        winningPath = checkForVerticalWinner();
        if (winningPath.length !== 0) {
            return winningPath;
        }

        return checkForDiagonalWinner();
    }

    const checkForHorizontalWinner = () => {
        let winningPath = [];

        let row = 0;

        while (winningPath.length < NUM_COLUMNS_ON_BOARD && row < NUM_ROWS_ON_BOARD) {
            let initialIcon = gameBoard[row][0];
            
            if (initialIcon !== null) {
                winningPath.push({row, "col": 0});
                for (let col = 1; col < NUM_COLUMNS_ON_BOARD; col++) {
                    winningPath.push({row, col});
                    if (gameBoard[row][col] !== initialIcon) {
                        winningPath = [];
                        break;
                    }
                }
            }

            row++;
        }

        return winningPath;
    }

    const checkForVerticalWinner = () => {
        let winningPath = [];

        let col = 0;

        while (winningPath.length < NUM_ROWS_ON_BOARD && col < NUM_COLUMNS_ON_BOARD) {
            let initialIcon = gameBoard[0][col];

            if (initialIcon !== null) {
                winningPath.push({"row": 0, col})
                for (let row = 1; row < NUM_ROWS_ON_BOARD; row++) {
                    winningPath.push({row, col});
                    if (gameBoard[row][col] !== initialIcon) {
                        winningPath = [];
                        break;
                    }
                }
            }

            col++;
        }

        return winningPath;
    }

    const checkForDiagonalWinner = () => {
        let winningPath = checkForTopDownDiagonalWinner();
        if (winningPath.length !== 0) {
            return winningPath;
        }

        return checkForBottomUpDiagonalWinner();
    }

    const checkForTopDownDiagonalWinner = () => {
        let winningPath = [];

        let initialIcon = gameBoard[0][0];
        if (initialIcon !== null) {
            winningPath.push({"row": 0, "col": 0})
            for (let row = 1; row < NUM_ROWS_ON_BOARD; row++) {
                winningPath.push({row, "col": row});
                if (gameBoard[row][row] !== initialIcon) {
                    winningPath = [];
                    break;
                }
            }
        }

        return winningPath;
    }

    const checkForBottomUpDiagonalWinner = () => {
        let winningPath = [];

        let row = NUM_ROWS_ON_BOARD - 1;
        let col = 0;

        let initialIcon = gameBoard[row][col];
        if (initialIcon !== null) {
            while (row >= 0 && col < NUM_COLUMNS_ON_BOARD) {
                if (gameBoard[row][col] === initialIcon) {
                    winningPath.push({row, col});
                } else {
                    winningPath = [];
                    break;
                }
                row--;
                col++;
            } 
        }

        return winningPath;
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

    resetGameBoard();

    return { addMark, resetGameBoard, checkForWinner, getMarkAtLocation, getNumGameBoardRows, getNumGameBoardColumns, isGameBoardFull };
}

const game = (function (player1Name, player2Name) {
    let players = [
        createPlayer(player1Name, "X"),
        createPlayer(player2Name, "O")
    ];
    let currentPlayerIndex = 0;

    let gameBoard = createGameBoard();

    const takeTurn = (row, column) => {
        if (!isGameOver()) {
            let markPlaced = gameBoard.addMark(row, column, players[currentPlayerIndex].playerIcon);
            if (!isGameOver()) {
                if (markPlaced) {
                    currentPlayerIndex = ++currentPlayerIndex % players.length;
                }
            } else if (!isCatsGame()) {
                players[currentPlayerIndex].incrementNumWins();
            }
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
        return gameBoard.checkForWinner().length !== 0 || gameBoard.isGameBoardFull();
    }

    const isCatsGame = () => {
        return gameBoard.checkForWinner().length === 0 && gameBoard.isGameBoardFull();
    }

    const getWinningPath = () => {
        return gameBoard.checkForWinner();
    }

    const getCurrentPlayer = () => {
        return players[currentPlayerIndex];
    }

    const getPlayer1 = () => {
        return players[0];
    }

    const getPlayer2 = () => {
        return players[1];
    }

    const startNewGame = () => {
        currentPlayerIndex = 0;
        gameBoard.resetGameBoard();
    }

    return { takeTurn, getNumGameBoardRows, getNumGameBoardColumns, getGameBoardMarkAtLocation, isGameOver, getCurrentPlayer, isCatsGame, getPlayer1, getPlayer2, startNewGame, getWinningPath};
})("Player 1", "Player 2");

const gameDisplay = (function (gameToDisplay) {

    const ROW_ATTRIBUTE_NAME = "row";
    const COLUMN_ATTRIBUTE_NAME = "col";

    const divPlayer1Score = document.querySelector(".game-status-bar .player-wins:first-child");
    const divPlayer2Score = document.querySelector(".game-status-bar .player-wins:last-child");
    const divGameStatus = document.querySelector(".game-status-bar .game-status");
    const divGameBoardDisplay = document.querySelector(".game .game-board");
    const btnNewGame = document.querySelector(".game button.new-game");

    const game = gameToDisplay;

    const displayGameStatus = () => {
        if (!game.isGameOver()) {
            divGameStatus.textContent = `${game.getCurrentPlayer().playerName}'s turn`;
        } else {
            if (game.isCatsGame()) {
                divGameStatus.textContent = "It's a tie!";
            } else {
                divGameStatus.textContent = `${game.getCurrentPlayer().playerName} wins!`;
            }
        }
    }

    const displayGameBoard = () => {
        while (divGameBoardDisplay.firstChild) {
            divGameBoardDisplay.removeChild(divGameBoardDisplay.lastChild);
        }

        for (let row = 0; row < game.getNumGameBoardRows(); row++) {
            for (let col = 0; col < game.getNumGameBoardColumns(); col++) {
                let divGameBoardTile = document.createElement("div");
                divGameBoardTile.classList.add("game-tile");

                applyLocationBasedClasses(divGameBoardTile, row, col);
                applyIcon(divGameBoardTile, game.getGameBoardMarkAtLocation(row, col));

                divGameBoardTile.setAttribute(ROW_ATTRIBUTE_NAME, row);
                divGameBoardTile.setAttribute(COLUMN_ATTRIBUTE_NAME, col);
                                
                divGameBoardTile.addEventListener("click", handleGameTileClick);
                
                divGameBoardDisplay.appendChild(divGameBoardTile);
            }
        }
    }

    const applyIcon = (divGameBoardTile, gameBoardMark) => {
        if (gameBoardMark !== null) {
            let divGameBoardIcon = document.createElement("div");
            divGameBoardIcon.classList.add("icon");

            if (gameBoardMark === game.getPlayer1().playerIcon) {
                divGameBoardIcon.classList.add("cross");
            } else if (gameBoardMark === game.getPlayer2().playerIcon) {
                divGameBoardIcon.classList.add("circle");
            }

            divGameBoardTile.appendChild(divGameBoardIcon);
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
        writePlayerWinsToDiv(player1, divPlayer1Score);
        writePlayerWinsToDiv(player2, divPlayer2Score);
    }

    const writePlayerWinsToDiv = (player, div) => {
        while (div.firstChild) {
            div.removeChild(div.lastChild);
        }
        
        let divPlayerName = document.createElement("div");
        divPlayerName.textContent = player.playerName;

        let divPlayerScore = document.createElement("div");
        divPlayerScore.textContent = player.getNumWins();

        div.appendChild(divPlayerName);
        div.appendChild(divPlayerScore);
    }

    const highlightWinningPath = (winningPath) => {
        for (let coordinate of winningPath) {
            let divWinningGameBoardTile = divGameBoardDisplay.querySelector(`[row="${coordinate.row}"][col="${coordinate.col}"] .icon`);
            divWinningGameBoardTile.classList.add("winning-path");
        }
    }

    const handleGameTileClick = (event) => {
        if (!game.isGameOver()) {
            game.takeTurn(event.target.getAttribute(ROW_ATTRIBUTE_NAME), event.target.getAttribute(COLUMN_ATTRIBUTE_NAME));
            displayGame();
        }
    }

    const handleNewGameButtonClick = (event) => {
        game.startNewGame();
        displayGame();
    }

    const displayGame = () => {
        displayGameStatus();
        displayGameBoard();
        displayPlayerWins(game.getPlayer1(), game.getPlayer2());

        let winningPath = game.getWinningPath();
        if (winningPath.length !== 0) {
            highlightWinningPath(winningPath);
        }
    }

    btnNewGame.addEventListener("click", handleNewGameButtonClick);

    return { displayGame };
})(game);

gameDisplay.displayGame();