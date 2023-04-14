
//Purpose: create a listeners that listens for clicks for a Battleship game

//const { response } = require("express");


//addEventListeners to listen for user clicks on the game board and then take the appropriate actions.
document.querySelector('#gametable').addEventListener('click', e => {
    const tableElement = e.target;
    console.log(tableElement)
    console.log(hasClass(e.target, "vessel"));
    if ((tableElement !== null) && (tableElement.tagName.toLowerCase() === "td")) {
        if (e.target.innerHTML === "" ) {
            
            var style = gamePlay.Battleship.makeMove([e.target.parentNode.rowIndex-1,e.target.cellIndex]);
            //emit the move to the server to broadcast it into the player2 board
            socket.emit('playermove',[e.target.parentNode.rowIndex-1,e.target.cellIndex,style]) 
            addClass(e.target,style);
            if (style === "missed") //change the vessel to missed if missed
                changeText(tableElement, style);
            else changeText(tableElement, style[0].toUpperCase());
            //check if game is over
            gamePlay.isGameOver();
           
        }else {
            addMessage("You already clicked there");
        }
    }
});



//addEventListeners to listen for restart button which restarts the game.
document.querySelector("#resetButton").addEventListener('click', e => {
    
    //Reset Game
    gamePlay.reset();
});




//plays the moves that were already played before socket connection
const miniBoardURL = 'http://127.0.0.1:3000/player2Moves'

//load request to miniboard when loading
fetch(miniBoardURL).then(response =>{
    return response.json();
})
.then(data =>{
    let target = document.querySelector('#minitable')
    for(let i = 0; i < data.length;i++){
        let xCoord = data[i][0]; //get x coordinate
        let yCoord = data[i][1]; // get y coordinate
        let style =  data[i][2]; //get style
        let element = target.rows[xCoord+1].cells[yCoord] //table element makes changes to the miniboard
        if ((element !== null) && (element.tagName.toLowerCase() === "td")) {
            if (element.innerHTML === "" ) {       
                addClass(element,style);
                if (style === "missed")
                    changeText(element, style); //change text to missed
                else changeText(element, style[0].toUpperCase());  // change text to hit
            }else {
                addMessage(`You already played this move`);
            }
    
        }
    }

    
})
.catch(err =>{
    console.error(err);
})
