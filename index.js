const Gameboard = (() => {

    let board = ["", "", "", "", "", "", "", "", ""];

    //getBoard is getter function
    //when called passes the current of board
    const getBoard = () => board;

    const updateBoard = (index, symbol) => {
        if (board[index] === "") {
            board[index] = symbol;
            return true;
        }

        else {
            return false;
        }
    }

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    }

    const checkWin = (symbol) => {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winConditions.some(condition =>
            condition.every(index => board[index] === symbol)
        );
    };

    const checkTie = () => {
        return board.every(cell => cell !== "");
    };

    return {
        getBoard,
        updateBoard,
        resetBoard,
        checkWin,
        checkTie
    };

})();

const Player = (name, symbol) => {
    return { name, symbol };
};

const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameActive = true;


    const initializeGame = (player1Name, player2Name) => {
        players = [
            Player(player1Name, "X"),
            Player(player2Name, "O")
        ];
        currentPlayerIndex = 0;
        gameActive = true;
        Gameboard.resetBoard();
        console.log(Gameboard.getBoard());
        console.log(`${players[currentPlayerIndex].name}'s turn`);
        DisplayController.updateMessage(`${players[currentPlayerIndex].name}'s turn`);
        DisplayController.renderBoard();
    };

    const handleTurn = (index) => {
        if (!gameActive) return;
        if (Gameboard.updateBoard(index, players[currentPlayerIndex].symbol)) {
            DisplayController.renderBoard();
            console.log(Gameboard.getBoard());
            if (Gameboard.checkWin(players[currentPlayerIndex].symbol)) {
                gameActive = false;
                console.log(`${players[currentPlayerIndex].name} wins!`);
                DisplayController.updateMessage(`${players[currentPlayerIndex].name} wins!`);
            } else if (Gameboard.checkTie()) {
                gameActive = false;
                console.log(`It's a tie!`);
                DisplayController.updateMessage(`It's a tie!`);
            } else {
                currentPlayerIndex = (currentPlayerIndex + 1) % 2;
                console.log(`${players[currentPlayerIndex].name}'s turn`);
                DisplayController.updateMessage(`${players[currentPlayerIndex].name}'s turn`);
            }
        } else {
            console.log('Invalid move! Cell already taken.');
        }
    };

    return {
        initializeGame,
        handleTurn
    };
})();


const DisplayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const messageDisplay = document.querySelector(".message");
    const restartButton = document.querySelector(".restart");

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            GameController.handleTurn(index);
        });
    });

    restartButton.addEventListener("click", () => {
        const player1Name = document.querySelector("#player1").value || "Player 1";
        const player2Name = document.querySelector("#player2").value || "Player 2";
        GameController.initializeGame(player1Name, player2Name);
    });

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const updateMessage = (message) => {
        messageDisplay.textContent = message;
    };

    return {
        renderBoard,
        updateMessage
    };
})();