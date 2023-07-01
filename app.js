const boardContainer = document.querySelector(".board-container");
const playGameButton = document.querySelector("#play-game");

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
     const addCellToArray = (index, mark) => {
          console.log(index, mark);
          console.log(boardCellsArray[index] === undefined);
          if (boardCellsArray[index] === undefined) {
               boardCellsArray[index] = mark;
          }
          console.log("array elements", boardCellsArray);
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
               boardContainer.addEventListener("click", (event) => {
                    let index;
                    let targetCell;
                    if (!(event.target.classList[0] === "game-container")) {
                         index = Number(event.target.dataset["cell"]);
                         targetCell = event.target;
                         gameController.addContentToBoard(index, targetCell);
                    }
               });
          }
     };

     return { createBoard, resetBoard, playGame, addCellToArray, checkResult };
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
     const getScore = () => {
          return playerScore;
     };
     return { name, mark, updateScore, getScore };
};
const markCircle = "./icons/circle-outline.svg";
const markCross = "./icons/close-thick.svg";
const player1 = createPlayer({ name: "p1", markPath: markCross, alt: "cross", width: "70px" });
const player2 = createPlayer({ name: "p2", markPath: markCircle, alt: "circle", width: "56px" });

const gameController = (() => {
     const initialPlayer = () => {
          return player1;
     };
     let currentPlayer = initialPlayer();
     const addContentToBoard = (index, targetCell) => {
          console.log("cell content", targetCell.firstChild);
          if (targetCell.firstChild === null) {
               console.log(`cell is empty before appending`);
               // targetCell.textContent = currentPlayer.mark;
               console.log(currentPlayer.mark());
               targetCell.append(currentPlayer.mark());
               console.log(`after appending cell is ${targetCell.firstChild}`);
               gameBoard.addCellToArray(index, currentPlayer.mark());
               let result = gameBoard.checkResult();
               console.log("game result is", result);
               if (result === "tie" || result === "win") {
                    gameOver(result, currentPlayer);
                    currentPlayer = player1;
                    return 0;
               }
               currentPlayer = playerTurn(currentPlayer);
          }
     };
     // let initialPlayer = player1;
     const playerTurn = (currentPlayer) => {
          // console.log("current player", currentPlayer);
          if (currentPlayer === player1) {
               return player2;
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
               if (currentPlayer.name === "p1") {
                    // console.log(`current player is ${currentPlayer}`)
                    document.querySelector(".p1.score").textContent = currentPlayer.getScore();
                    modalMessage.style.top = "0px";
                    // modalMessage.style.pointerEvents = "all";
                    announceText.textContent = `Player1 Won!`;
               } else if (currentPlayer.name === "p2") {
                    // console.log(`current player is ${currentPlayer}`)
                    document.querySelector(".p2.score").textContent = currentPlayer.getScore();
                    modalMessage.style.top = "0px";
                    // modalMessage.style.pointerEvents = "all";
                    announceText.textContent = `Player2 Won!`;
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
     };
     let tie = 0;
     const updateMatchDraw = () => {
          return tie++;
     };
     const getMatchDraw = () => {
          return tie;
     };
     return { addContentToBoard, gameOver, updateMatchDraw, getMatchDraw, initialPlayer, playerTurn };
})();

// console.log(gameController.playerTurn(player2))
playGameButton.addEventListener("click", (e) => {
     gameBoard.playGame();
     // console.log(e.target)
     playGameButton.textContent = "Restart Game";
});
