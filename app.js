const gameContainer = document.querySelector(".game-container");
const boardContainer = document.querySelector(".board-container");
const playGameButton = document.querySelector("#play-game");
const displayPlayerTurn = document.querySelector(".player-turn");
const statsContainer = document.querySelector(".stats-container");
const playMode = document.querySelector(".play-mode");
playMode.onclick = function (e) {
     console.log(`Play mode button activated`, e.target);
     // let mode = getPlayMode();
     // console.log(mode);
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
     const resetBoard = () => {
          for (let i = 0; i < boardContainer.children.length; i++) {
               boardContainer.children[i].textContent = "";
          }
     };
     const resetGame = (mode) => {
          resetBoard();
          boardCellsArray = [];
          if (mode === "P VS COMP") {
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
     const addCellToArray = (index, mark) => {
          // console.log(index, mark);
          // console.log(boardCellsArray[index] === undefined);
          if (boardCellsArray[index] === undefined) {
               boardCellsArray[index] = mark;
               return 0;
          } else return "error";
          // console.log("array elements", boardCellsArray);
     };
     const checkEmptyCell = (index) => {
          if (boardCellsArray[index] === undefined) return true;
          else return false;
     };
     const checkResult = () => {
          let cells = [...boardCellsArray];
          console.log("cells are", cells);
          console.log(`Cells are equal?`, cells[0] === cells[1]);
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
          for (matchArray of cellsMatchingIndices) {
               let tempArray = [];
               for (cell of matchArray) {
                    if (cells[cell] === undefined) {
                         break;
                    } else {
                         tempArray.push(cells[cell]);
                    }
               }
               if (tempArray.length === 3) {
                    if (tempArray[0].alt === tempArray[1].alt && tempArray[1].alt === tempArray[2].alt) {
                         return "win";
                    }
               }
          }
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

gameBoard.createBoard();

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
const computer = (function () {
     const { name, mark, updateScore, getScore, resetScore } = createPlayer({ name: "COMPUTER", markPath: markCircle, alt: "circle", width: "56px" });
     const autoPlayTurn = () => {
          let randomTurn = Math.floor(Math.random() * 9);

          // console.log(`cell array is ${gameBoard.boardCellsArray}`);
          // console.log(`cell at random turn ${randomTurn} is ${gameBoard.boardCellsArray[randomTurn]}`);
          while (gameBoard.checkEmptyCell(randomTurn) === false) {
               randomTurn = Math.floor(Math.random() * 9);
          }
          console.log("random turn", randomTurn);
          // gameBoard.boardCellsArray[randomTurn] = computer.mark();
          // boardContainer.children[randomTurn].append(computer.mark());
          gameController.addContentToBoard(randomTurn, boardContainer.children[randomTurn]);
     };

     return { name, mark, updateScore, getScore, resetScore, autoPlayTurn };
})();
// console.log(computer);
let player1 = createPlayer({ name: "PLAYER1", markPath: markCross, alt: "cross", width: "70px" });
let player2 = createPlayer({ name: "PLAYER2", markPath: markCircle, alt: "circle", width: "56px" });
// let computer = createPlayer({ name: "COMPUTER", markPath: markCircle, alt: "circle", width: "56px" });

const gameController = (() => {
     let mode = "P VS P";
     const togglePlayMode = () => {
          // Reset whole game
          gameBoard.resetGame(mode);
          // gameBoard.playGame();
          if (mode === "P VS COMP") {
               // player1 = createPlayer({ name: "PLAYER1", markPath: markCross, alt: "cross", width: "70px" });
               // player2 = createPlayer({ name: "PLAYER2", markPath: markCircle, alt: "circle", width: "56px" });
               // computer = null;
               mode = "P VS P";
          } else {
               // player1 = createPlayer({ name: "PLAYER1", markPath: markCross, alt: "cross", width: "70px" });
               // computer = createPlayer({ name: "COMPUTER", markPath: markCircle, alt: "circle", width: "56px" });
               // player2 = null;
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
     const addContentToBoard = (index, targetCell) => {
          // console.log("cell content", targetCell.firstChild);
          if (targetCell.firstChild === null) {
               // console.log(`cell is empty before appending`);
               // targetCell.textContent = currentPlayer.mark;
               // console.log(currentPlayer.mark());
               targetCell.append(currentPlayer.mark());
               // console.log(`after appending cell is ${targetCell.firstChild}`);
               gameBoard.addCellToArray(index, currentPlayer.mark());
               let result = gameBoard.checkResult();
               // console.log("game result is", result);
               if (result === "tie" || result === "win") {
                    gameOver(result, currentPlayer);
                    currentPlayer = player1;
                    return 0;
               }
               if (gameController.getPlayMode() === "P VS P") {
                    currentPlayer = playerTurn(currentPlayer);
                    displayPlayerTurn.textContent = `${currentPlayer.name} Turn`;
               } else if (gameController.getPlayMode() === "P VS COMP" && currentPlayer === player1) {
                    currentPlayer = playerTurn(currentPlayer);
                    computer.autoPlayTurn();
               } else if (gameController.getPlayMode() === "P VS COMP" && currentPlayer === computer) {
                    currentPlayer = playerTurn(currentPlayer);
                    displayPlayerTurn.textContent = `${currentPlayer.name} Turn`;
               }
          }
     };
     // let initialPlayer = player1;
     const playerTurn = (currentPlayer) => {
          // console.log("current player", currentPlayer);
          if (currentPlayer === player1 && gameController.getPlayMode() === "P VS P") {
               return player2;
          } else if (currentPlayer === player1 && gameController.getPlayMode() === "P VS COMP") {
               return computer;
          } else {
               return player1;
          }
     };
     const gameOver = (result, currentPlayer) => {
          let modalMessage = document.querySelector(".modal-container");
          let announceText = document.querySelector(".announce-text");
          const playAgain = document.querySelector(".play-again");
          if (result === "win") {
               // console.log(`${currentPlayer.name} won the match`);
               currentPlayer.updateScore();
               if (currentPlayer.name === "PLAYER1") {
                    // console.log(`current player is ${currentPlayer}`)
                    document.querySelector(".p1.score").textContent = currentPlayer.getScore();
                    modalMessage.style.top = "0px";
                    // modalMessage.style.pointerEvents = "all";
                    announceText.textContent = `PLAYER1 WON!`;
               } else if (currentPlayer.name === "PLAYER2") {
                    // console.log(`current player is ${currentPlayer}`)
                    document.querySelector(".p2.score").textContent = currentPlayer.getScore();
                    modalMessage.style.top = "0px";
                    // modalMessage.style.pointerEvents = "all";
                    announceText.textContent = `PLAYER2 WON!`;
               } else if (currentPlayer.name === "COMPUTER") {
                    // console.log(`current player is ${currentPlayer}`)
                    document.querySelector(".p2.score").textContent = currentPlayer.getScore();
                    modalMessage.style.top = "0px";
                    // modalMessage.style.pointerEvents = "all";
                    announceText.textContent = `COMPUTER WON!`;
               }
          } else if (result === "tie") {
               updateMatchDraw();
               document.querySelector(".tie-score").textContent = getMatchDraw();
               modalMessage.style.top = "0px";
               // modalMessage.style.pointerEvents = "all";
               announceText.textContent = `Match Draw!`;
          }
          playAgain.addEventListener("click", (e) => {
               gameBoard.playGame();
               modalMessage.style.top = "-1000px";
          });
          window.onclick = function (e) {
               // console.log(e.target ===modalMessage)
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

// console.log(gameController.playerTurn(player2))
playGameButton.addEventListener("click", (e) => {
     gameBoard.playGame();
     playGameButton.textContent = "Restart Game";
});
