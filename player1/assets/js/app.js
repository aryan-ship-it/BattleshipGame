//Author: Aryan Shah
//Purpose: create a gamePlay object that controls game play for a Battleship game

var gamePlay = {
    Battleship: Object.create(battleship),

//gets then returns the username
    getUsername: function () {
        var currentURL = window.location + "";
        var splitURL = currentURL.split("=");
        return splitURL[1];
    },
//uses  Battleship member to setup and start a game
    playGame: function () {
        this.reset();
    },
// If all ships are marked, it adds a “Game over” message to the message div.
    isGameOver: function () {
        var gameOverCount=0;
        for (let i = 0; i < allVessels.length; i++) {
            gameOverCount += allVessels[i].getHits()-1;
        }
        gameOverCount++;
        if (gameHits===0){
            addMessage("<br>*******************************");
            addMessage("Enemy Fleet Vanquished!");
            addMessage("*******************************");
            try{
                StatusParamaterSender('gameover') //sends request to the backend with status as game over                
            }
            catch(err){
                throw err;
            }
            
        }
    },
// Resets the game board, resets the message div and starts a new game
    reset: function () {
        clearMessages();
        creatHTMLTable();
        try{
            //sends reset signal to the other player's board
            socket.emit('reset',{reset:true});
            //sends request to the backend with the status as reset
            StatusParamaterSender('reset');

        }
        catch(err){
            throw(err);
        }
        creatminiHTMLTable(); //creates a miniHTML table
        this.Battleship.initialize();
        this.Battleship.createShips();
        
    }
};

var username = gamePlay.getUsername();
setUsername(username);
gamePlay.playGame();


