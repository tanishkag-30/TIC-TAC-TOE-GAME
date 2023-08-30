/* 
 * Current Issues
 * -> How to best write HTML code in JS -> Template object with all HTML templates
 * 
 */

 // At every turn, we recreate playerOdd and playerEven with the correct attributes
 function Player (agent, icon) {
    this.agent = agent;
    this.icon = icon;
 }
 
 // remove the 9 tiles and refactor
 // tiles: Array(9).fill(new Tile);
 
 function Tile (isTaken, text) {
   this.isTaken = isTaken || false;
   this.text = text || '';
 }
 
 /* 
  * 
  * Game Data
  * --> turn game object into a Function / Class
  */
 var game = {
   gameInProgress: false,
   playerOdd: null,
   playerEven: null,
   currentPlayer: null,
   winner: false,
   tiles: [{
     isTaken: false,
     text: '' // 'x' or 'o'
   }, {
     isTaken: false,
     text: '' // 'x' or 'o'
   }, {
     isTaken: false,
     text: '' // 'x' or 'o'
   }, {
     isTaken: false,
     text: '' // 'x' or 'o'
   }, {
     isTaken: false,
     text: '' // 'x' or 'o'
   }, {
     isTaken: false,
     text: '' // 'x' or 'o'
   }, {
     isTaken: false,
     text: '' // 'x' or 'o'
   }, {
     isTaken: false,
     text: '' // 'x' or 'o'
   }, {
     isTaken: false,
     text: '' // 'x' or 'o'
   }],
   
   shouldGameContinue: function() {
     let result = true;
     icon = this.currentPlayer.icon;
     
     if (
       // horizontal tiles
       this.checkTiles(0, 1, 2, icon) ||
       this.checkTiles(3, 4, 5, icon) ||
       this.checkTiles(6, 7, 8, icon) ||
       // vertical tiles
       this.checkTiles(0, 3, 6, icon) ||
       this.checkTiles(1, 4, 7, icon) ||
       this.checkTiles(2, 5, 8, icon) ||
       // diagonal tiles
       this.checkTiles(0, 4, 8, icon) ||
       this.checkTiles(2, 4, 6, icon)) {
       result = false;
       this.winner = true;
       view.showWinner(icon);
     } else if (game.tiles.every(tile => tile.isTaken === true) && this.winner === true) {
       view.showWinner(icon);
     } else  if (game.tiles.every(tile => tile.isTaken === true)) {
       view.showWinner("Nobody ");
     } 
     this.gameInProgress = result;
     return result;
   },
 
   checkTiles: function(a, b, c, move) {
     let result = false;
     if (this.getTile(a) == move &&
         this.getTile(b) == move &&
         this.getTile(c) == move) {
       result = true;
     }
     return result;
   },
 
   getTile: function(number) {
     return this.tiles[number].text;
   },
   
   shouldAIMove: function () {
     if (this.currentPlayer.agent === "AI") {
       // setTimeout removes / loses the context of "this"
       setTimeout(this.AIMove.bind(this), 500);
     }
   },
   
   AIMove: function () {
       let choice = null;
     
       // function AItactics(selection, move, val) {
       //   move.isTaken = true;
       //   move.text = this.currentPlayer.icon;
       //   view.XorYinTile(move.text, val);
       //   selection = firstMove;
       // }
     
       while (choice === null && this.shouldGameContinue()) {
         let value = Math.floor(Math.random() * 9);
         let tile = this.tiles[value];
         let firstMove = this.tiles[4];
         // refactor
         if (!firstMove.isTaken) {
           firstMove.isTaken = true;
           firstMove.text = this.currentPlayer.icon;
           view.XorYinTile(firstMove.text, 4);
           choice = firstMove;
           
         } else if (!tile.isTaken) {
           tile.isTaken = true;
           tile.text    = this.currentPlayer.icon;
           view.XorYinTile(this.currentPlayer.icon, value);
           choice = tile;
         }
       }
       this.switchTurn();
   },
   
   switchTurn: function() {
     this.shouldGameContinue();
     
     if (this.currentPlayer === this.playerOdd) {
       this.currentPlayer = this.playerEven;
     } else {
       this.currentPlayer = this.playerOdd;
     }
     
     if (this.currentPlayer) {
       view.setMessage("It's player " + game.currentPlayer.icon + "'s turn.");
       this.shouldAIMove();
     }
   },
   
 };
 
 /* 
  *
  * Event Handlers
  *
  */
 var handlers = {
   setStartingPlayer: function(event) {
     game.playerOdd = new Player("Human", event.target.value);
     game.currentPlayer = game.playerOdd;
     game.gameInProgress  = true;
     if (game.playerOdd.icon === 'X') {
       game.playerEven = new Player('Human', 'O');
     } else {
       game.playerEven = new Player('Human', 'X');
     }
     
     view.renderConfig(2);
   },
 
   setOpponent: function(event) {
     game.playerEven = new Player(event.target.value, game.playerEven.icon); if ( game.playerOdd.icon === "X") {
       game.playerEven.icon = "O";
     } 
     game.gameInProgress  = true;
     view.renderConfig(3);
   },
 
   tileClick: function(event) {
     if (!game.gameInProgress || game.currentPlayer.agent === 'AI') return;
     
     let clickedTileIndex = event.target.id,
              clickedTile = game.tiles[clickedTileIndex];
     
     if (!clickedTile.isTaken) {
       clickedTile.isTaken = true;
       clickedTile.text    = game.currentPlayer.icon;
       view.XorYinTile(game.currentPlayer.icon, clickedTileIndex);
       game.switchTurn();
       game.shouldGameContinue();
     }
   },
   
   computerPlayerTurn: function() {
       console.log(game.playerOdd, game.tiles);
   }
 };
 
 /* 
  *
  * Game Templates
  *
  */
  
 var templates = {
   playerButtonTemplate: function () {
     return (
       `<div id="pick-player">
         <button onclick="handlers.setStartingPlayer(event)" class="player-select" value="X">X</button>
         <button onclick="handlers.setStartingPlayer(event)" class="player-select" value="O">O</button>
       </div>`
     );
   },
   
   opponentButtonTemplate: function () {
     return (
       `<div id="pick-opponent">
         <button onclick="handlers.setOpponent(event)" class="opponent-select" value="AI">AI</button>
         <button onclick="handlers.setOpponent(event)" class="opponent-select" value="Human">HUMAN</button>
       </div>`
     );
   },
   
   restartButtonTemplate: function() {
     let restartButton = document.createElement("button");
     restartButton.setAttribute("onclick", "view.restartGame()");
     restartButton.innerText = "Restart";
     return restartButton;
   },
   
   renderTable() {
     return (
         `<tr>
           <td class="tile" onclick="handlers.tileClick(event)" id="0"></td>
           <td class="tile" onclick="handlers.tileClick(event)" id="1"></td>
           <td class="tile" onclick="handlers.tileClick(event)" id="2"></td>
         </tr>
         <tr>
           <td class="tile" onclick="handlers.tileClick(event)" id="3"></td>
           <td class="tile" onclick="handlers.tileClick(event)" id="4"></td>
           <td class="tile" onclick="handlers.tileClick(event)" id="5"></td>
         </tr>
         <tr>
           <td class="tile" onclick="handlers.tileClick(event)" id="6"></td>
           <td class="tile" onclick="handlers.tileClick(event)" id="7"></td>
           <td class="tile" onclick="handlers.tileClick(event)" id="8"></td>
         </tr>
        `
     )
   }
 };
 
 /* 
  *
  * Game View
  *
  */
 
 var view = {
   tictactoe:     document.getElementById('tictactoe'),
   playerButtons: document.createElement('div'),
   messageBox:    document.createElement('div'),
   gameBoard:     document.createElement('table'),
   configStep: 1,
   
   setupBoard: function() {
     this.renderConfig(1);
     this.gameBoard.innerHTML = templates.renderTable();
     
     tictactoe.appendChild(this.gameBoard);
     tictactoe.appendChild(this.messageBox);
     tictactoe.appendChild(this.playerButtons);
     tictactoe.appendChild(templates.restartButtonTemplate());
   },
   
   renderConfig: function (step) {
     
     this.configStep = step;
     switch(view.configStep) {
       case 1:
         this.setMessage("Welcome, to begin please pick a player");
         this.playerButtons.innerHTML = templates.playerButtonTemplate();
         break;
       case 2:
         game.gameInProgress = false;
         this.setMessage("Please pick an opponent");
         this.playerButtons.innerHTML = templates.opponentButtonTemplate();
         break;
       case 3:
         this.playerButtons.innerHTML = null;
         this.setMessage("It's player " + game.currentPlayer.icon + "'s turn.");
         break;
       default:
         // no opponent
     }
   },
   
   showWinner: function (icon) {
     window.alert(icon + " wins!");
     this.restartGame();
   },
 
   XorYinTile: function(mark, index) {
     document.getElementById(index).innerText = mark;
     document.getElementById(index).classList.add("inactive");
   },
 
   setMessage: function(msg) {
     this.messageBox.innerHTML = msg;
   },
   
   restartGame: function() {
     let tiles = game.tiles;
     game.gameInProgress = false;
     game.playerOdd = null;
     game.playerEven = null;
     view.setMessage("Please select a player to start the game.");
     game.winner = false;
     
     // Gameboard tiles
     for (var i = 0; i < tiles.length; i++) {
       tiles[i].isTaken = false;
       tiles[i].text = '';
       document.getElementById(i).innerText = '';
       document.getElementById(i).classList.remove('inactive');
     }
     view.renderConfig(1);
   }
   
 }; // end view
 
 // Start game here
 document.addEventListener("DOMContentLoaded", function() {
   view.setupBoard();
   console.log("game started");
 });