// Accessing some required DOM elements to interact with them dynamically...
const gameContainer = document.querySelector(".game-container");
const boardContainer = document.querySelector(".board-container");
const playGameButton = document.querySelector("#play-game");
const displayPlayerTurn = document.querySelector(".player-turn");
const statsContainer = document.querySelector(".stats-container");
const playMode = document.querySelector(".play-mode");

// Toggle and display play mode of the game...
playMode.onclick = function (e) {
     gameBoard.resetGame(gameController.getPlayMode());
     gameController.togglePlayMode();
     playMode.textContent = gameController.getPlayMode();
};

// Add animation to board on content load...
document.addEventListener("DOMContentLoaded", () => {
     gameContainer.classList.add("animate-container");
});

// Create Game Board of 3 x 3
const gameBoard = (function () {
     let boardCellsArray = [];
     const createBoard = () => {
          let cellNumber = 0;
          for (let i = 0; i < 3; i++) {
               for (let j = 0; j < 3; j++) {
                    let cell = document.createElement("div");
                    cell.classList.add(`cell`);
                    cell.classList.add(`cell-${i}${j}`);
                    cell.setAttribute("data-cell", cellNumber);
                    boardContainer.append(cell);
                    cellNumber++;
               }
          }
     };
     // Reset board content when restarting the game or changing game play mode...
     const resetBoard = () => {
          for (let i = 0; i < boardContainer.children.length; i++) {
               boardContainer.children[i].textContent = "";
          }
     };
     // Reset every thing including board content, players progress etc...
     const resetGame = (previousMode) => {
          resetBoard();
          boardCellsArray = [];
          if (previousMode === "P VS COMP") {
               player1.resetScore();
               computer.resetScore();
               gameController.resetMatchDraw();
               document.querySelector(".p1.score").textContent = "0";
               document.querySelector(".tie-score").textContent = "0";
               document.querySelector(".p2.score").textContent = "0";
               document.querySelector(".p2.name").textContent = "PLAYER2";
          } else {
               player1.resetScore();
               player2.resetScore();
               gameController.resetMatchDraw();
               document.querySelector(".p1.score").textContent = "0";
               document.querySelector(".tie-score").textContent = "0";
               document.querySelector(".p2.score").textContent = "0";
               document.querySelector(".p2.name").textContent = "COMPUTER";
          }
     };

     // Every time a move is made by the any player, add it to the boardCellsArray...
     const addCellToArray = (index, mark) => {
          if (boardCellsArray[index] === undefined) {
               boardCellsArray[index] = mark;
          }
     };
     // Check to see if cell of array is empty or not before making move by the computer...
     const checkEmptyCell = (index) => {
          if (boardCellsArray[index] === undefined) return true;
          else return false;
     };
     // Check if winning/tie conditions fulfill or not...
     const checkResult = () => {
          let cells = [...boardCellsArray];
          console.log("cells are", cells);
          console.log(`Cells are equal?`, cells[0] === cells[1]);
          // First define winning cell indexes(i.e. consective three same moves)...
          let cellsMatchingIndices = [
               [0, 1, 2],
               [3, 4, 5],
               [6, 7, 8],
               [0, 3, 6],
               [1, 4, 7],
               [2, 5, 8],
               [0, 4, 8],
               [2, 4, 6],
          ];
          // Then make check on them one by one...
          for (matchArray of cellsMatchingIndices) {
               let tempArray = [];
               // First check that whether three winning slots are filled or not...
               for (cell of matchArray) {
                    if (cells[cell] === undefined) {
                         break;
                    } else {
                         tempArray.push(cells[cell]);
                    }
               }
               // If all the three slots of any winning combination are filled then check whether they are by same player?
               if (tempArray.length === 3) {
                    if (tempArray[0].alt === tempArray[1].alt && tempArray[1].alt === tempArray[2].alt) {
                         return "win";
                    }
               }
          }
          // If no winning combination found and every slot has been filled then the game is "tied" otherwise continue...
          if (cells.length === 9) {
               for (cell of cells) {
                    if (cell === undefined) return "incomplete";
               }
               return "tie";
          } else if (cells.length < 9) {
               return "incomplete";
          }
     };
     let isGameStarted = false;
     // Start the game with empty board every time it is called...
     const playGame = () => {
          resetBoard();
          boardCellsArray = [];
          if (!isGameStarted) {
               isGameStarted = true;
               statsContainer.style.opacity = "1";
               displayPlayerTurn.style.opacity = "1";
               displayPlayerTurn.textContent = `${gameController.initialPlayer().name} Turn`;
               boardContainer.addEventListener("click", (event) => {
                    let index;
                    let targetCell;
                    if (!(event.target === boardContainer)) {
                         index = Number(event.target.dataset["cell"]);
                         targetCell = event.target;
                         gameController.addContentToBoard(index, targetCell);
                    }
               });
          }
     };

     return { resetGame, createBoard, resetBoard, playGame, addCellToArray, checkResult, checkEmptyCell };
})();

// Initially at game page load create and display the board...
gameBoard.createBoard();

// Create players for the game...
const createPlayer = ({ name, markPath, alt, width }) => {
     name;
     const mark = () => {
          let markImage = document.createElement("img");
          markImage.src = markPath;
          markImage.alt = alt;
          markImage.style.width = width;
          return markImage;
     };
     let playerScore = 0;
     const updateScore = function () {
          playerScore++;
     };
     const resetScore = () => {
          playerScore = 0;
     };
     const getScore = () => {
          return playerScore;
     };
     return { name, mark, updateScore, getScore, resetScore };
};
const markCircle = "./icons/circle-outline.svg";
const markCross = "./icons/close-thick.svg";

// In case of player vs computer mode create computer player module and inherit properties and methods from create player factory function...
const computer = (function () {
     const { name, mark, updateScore, getScore, resetScore } = createPlayer({ name: "COMPUTER", markPath: markCircle, alt: "circle", width: "56px" });
     // Method to play turn by the computer in "P  VS COMP" mode
     const autoPlayTurn = () => {
          let randomTurn = Math.floor(Math.random() * 9);
          while (gameBoard.checkEmptyCell(randomTurn) === false) {
               randomTurn = Math.floor(Math.random() * 9);
          }
          gameController.addContentToBoard(randomTurn, boardContainer.children[randomTurn]);
     };
     return { name, mark, updateScore, getScore, resetScore, autoPlayTurn };
})();

// Create two players...
let player1 = createPlayer({ name: "PLAYER1", markPath: markCross, alt: "cross", width: "70px" });
let player2 = createPlayer({ name: "PLAYER2", markPath: markCircle, alt: "circle", width: "56px" });

const gameController = (() => {
     let mode = "P VS P";
     const togglePlayMode = () => {
          currentPlayer = initialPlayer();
          displayPlayerTurn.style.backgroundColor = "#9333ea";
          displayPlayerTurn.textContent = `${currentPlayer.name} Turn`;
          if (mode === "P VS COMP") {
               mode = "P VS P";
          } else {
               mode = "P VS COMP";
          }
     };
     const getPlayMode = function () {
          return mode;
     };
     const initialPlayer = () => {
          return player1;
     };
     let currentPlayer = initialPlayer();
     // When turn is played by any player then add respective content to the game board...
     const addContentToBoard = (index, targetCell) => {
          if (targetCell.firstChild === null) {
               targetCell.append(currentPlayer.mark());
               gameBoard.addCellToArray(index, currentPlayer.mark());
               let result = gameBoard.checkResult();
               if (result === "tie" || result === "win") {
                    gameOver(result, currentPlayer);
                    currentPlayer = player1;
                    displayPlayerTurn.style.backgroundColor = "#9333ea";
                    displayPlayerTurn.textContent = `${currentPlayer.name} Turn`;
                    return 0;
               }
               // Here currentPlayer is the previous player who has already made the move...
               if (getPlayMode() === "P VS P" && currentPlayer === player1) {
                    currentPlayer = playerTurn(currentPlayer);
                    displayPlayerTurn.style.backgroundColor = "#075985";
                    displayPlayerTurn.textContent = `${currentPlayer.name} Turn`;
               } else if (getPlayMode() === "P VS P" && currentPlayer === player2) {
                    currentPlayer = playerTurn(currentPlayer);
                    displayPlayerTurn.style.backgroundColor = "#9333ea";
                    displayPlayerTurn.textContent = `${currentPlayer.name} Turn`;
               } else if (getPlayMode() === "P VS COMP" && currentPlayer === player1) {
                    currentPlayer = playerTurn(currentPlayer);
                    displayPlayerTurn.textContent = `${currentPlayer.name} Turn`;
                    displayPlayerTurn.style.backgroundColor = "#075985";
                    // Play computer turn with 1sec delay...
                    setTimeout(computer.autoPlayTurn, 1000);
               } else if (getPlayMode() === "P VS COMP" && currentPlayer === computer) {
                    currentPlayer = playerTurn(currentPlayer);
                    displayPlayerTurn.style.backgroundColor = "#9333ea";
                    displayPlayerTurn.textContent = `${currentPlayer.name} Turn`;
               }
          }
     };
     const playerTurn = (previousPlayer) => {
          if (previousPlayer === player1 && getPlayMode() === "P VS P") {
               return player2;
          } else if (previousPlayer === player1 && getPlayMode() === "P VS COMP") {
               return computer;
          } else {
               return player1;
          }
     };
     // Display the game result in case of game over(winning/tie) situation...
     const gameOver = (result, currentPlayer) => {
          let modalMessage = document.querySelector(".modal-container");
          let announceText = document.querySelector(".announce-text");
          const playAgain = document.querySelector(".play-again");
          if (result === "win") {
               currentPlayer.updateScore();
               if (currentPlayer.name === "PLAYER1") {
                    document.querySelector(".p1.score").textContent = currentPlayer.getScore();
                    modalMessage.style.top = "0px";
                    announceText.textContent = `PLAYER1 WON!`;
               } else if (currentPlayer.name === "PLAYER2") {
                    document.querySelector(".p2.score").textContent = currentPlayer.getScore();
                    modalMessage.style.top = "0px";
                    announceText.textContent = `PLAYER2 WON!`;
               } else if (currentPlayer.name === "COMPUTER") {
                    document.querySelector(".p2.score").textContent = currentPlayer.getScore();
                    modalMessage.style.top = "0px";
                    announceText.textContent = `COMPUTER WON!`;
               }
          } else if (result === "tie") {
               updateMatchDraw();
               document.querySelector(".tie-score").textContent = getMatchDraw();
               modalMessage.style.top = "0px";
               announceText.textContent = `Match Draw!`;
          }
          playAgain.addEventListener("click", (e) => {
               gameBoard.playGame();
               modalMessage.style.top = "-1000px";
          });
          window.onclick = function (e) {
               if (e.target === modalMessage) {
                    gameBoard.playGame();
                    modalMessage.style.top = "-1000px";
               }
          };
     };
     let tie = 0;
     const updateMatchDraw = () => {
          return tie++;
     };
     const getMatchDraw = () => {
          return tie;
     };
     const resetMatchDraw = () => {
          tie = 0;
     };
     return { togglePlayMode, getPlayMode, addContentToBoard, gameOver, updateMatchDraw, getMatchDraw, initialPlayer, playerTurn, resetMatchDraw };
})();
// Add event listener to the "Start Game" button...
playGameButton.addEventListener("click", (e) => {
     gameBoard.playGame();
     playGameButton.textContent = "Restart Game";
});
