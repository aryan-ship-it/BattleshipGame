//Author: Aryan Shah
//Description: This routes module creates custom routes and demonstrates the use of routes using the database manager module

var express = require('express');
var router = express.Router();
//use database manager module
var mydb = require('./dbmgr.js');

//use the url module
const url = require('url');

//test variables
//keeps temporary track of scores from player1 route
var player1score = 0;
//keeps track of the scores from player 2 route
var player2score = 0;
var player1Moves = [];//stores all the moves played by player1
var player2Moves = [];//stores all the moves played by player2
//Setup database, only need to run this once. Unblock to run once then block this line again
//mydb.setup();

router.post('/username',function(req,res){
    let usernameData = req.body;
    //sends the username to insert it if the username is not in the database
    mydb.insertUniqueRec(usernameData)
})

//Demo / route to print hello
router.get('/player1/', function (req, res) {
    try{
    let myURL = url.parse(req.url, true); // parse the URL
    let username = myURL.query.username; // parse username
    let gamestatus = myURL.query.gamestatus;   //parse the gamestatus
    let gamecoordinates = myURL.query.gamecoordinates.split(','); // split the coordinates into an array
    if  (gamecoordinates != 'undefined'){ //if it is not undefined after the split        
        let gamestyle = myURL.query.style; // parse the style property of the move
        let x = Number(gamecoordinates[0]); //coordinate x
        let y = Number(gamecoordinates[1]); // coordinate y
        player1Moves.push([x,y,gamestyle]) //store it into an array

    }
    //console.log(player1Moves)
    if(gamestatus == 'reset' ){
        player1score = 0; // reset the score to 0
        player1Moves = [] // reset the array to 0
        res.end(); //end the response
        
    }
    else if(gamestatus == 'gameover'){
        console.log('game is over')
        if(player1score ==  0 || player1score == 1){ //if player1score is more than 1 after game over
            player1score = 0; //reset it to 0
            res.end()
        }
        else{ //else insert the score in the database if it is lower
            let querydata = {username : username} //querydata is username
            let updData = {score: player1score} //data to be updated is the score
            mydb.insertScores(querydata,updData); //insert if the score is lower than the current highscore of the user
            player1score = 0; //reset the score to 0

            res.end();
        }       
    }
    else if(gamestatus == 'sunk' || gamestatus == 'hit' || gamestatus == 'missed'){ //if the game status is a hit and game is not over 
        player1score++;//increament player score
        res.end();
    }
    res.end(); //end response

    }
    catch(err){
        throw err; //error handling measure server side
    }

});


router.get('/player2/', function (req, res) {
    try{
        let myURL = url.parse(req.url, true);
        let username = myURL.query.username;
        let gamestatus = myURL.query.gamestatus;
        let gamecoordinates = myURL.query.gamecoordinates.split(',');
        if  (gamecoordinates != 'undefined'){        
            let gamestyle = myURL.query.style;
            let x = Number(gamecoordinates[0]);
            let y = Number(gamecoordinates[1]);
            player2Moves.push([x,y,gamestyle])
    
        }
        console.log(player2Moves)
        if(gamestatus == 'reset' ){
            player2score = 0;
            player2Moves = [];
            res.end();
        }
        else if(gamestatus == 'gameover'){
            console.log('game is over')
            if(player2score ==  0 || player2score == 1){
                player2score = 0;
                res.end()
            }
            else{
                let querydata = {username : username}
                let updData = {score: player2score}
                mydb.insertScores(querydata,updData);
                player2score = 0;
                res.end();
            }       
        }
        else if(gamestatus == 'sunk' || gamestatus == 'hit' || gamestatus == 'missed'){
            player2score++;
            res.end();
        }
        res.end();

    }
    catch(err){
        throw err;
    }
    
});

//send the array of all the records with usernames and their highscores
router.get('/highscores',function(req,res){
    try{
        let responseFunc = function(data){res.end(JSON.stringify(data))} //send resposne of records and highscores
        mydb.gethighscores(responseFunc);  //call back function which accesses the database with highscore object array

    }
    catch(err){
        throw err;
    } 

})

//sends all the moves played by player1 to the front end

router.get('/player1Moves',function(req,res){
    try{
        res.end(JSON.stringify(player1Moves)); //sends response of all the moves player1 has played
    }
    catch(err){
        throw err; //error handling server side.
    }
    
})

//sends all the moves played by player2 to the front end
router.get('/player2Moves',function(req,res){
    try{
        res.end(JSON.stringify(player2Moves)); //sedns response of all the moves player2 has played
    }
    catch(err){
        throw err; //error handling server side
    }
    
})

//Demo /p4 route to find all records in the database
router.get('/p4', function (req, res) {
    mydb.findAll(0);
    res.send("Finding all records");
});

//Demo /p6 route to delete collection in the database
router.get('/p6', function (req, res) {
    mydb.deleteCollection();
    res.send("Deleted Collection");
});

module.exports = router;
