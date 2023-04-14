
//Purpose: create ship, and battleship objects for a Battleship game

var boardXsize = 10, boardYsize = 10;
var gameHits=0;
var vessels = [["Cruiser", 2], ["Submarine", 3], ["Destroyer", 4], ["Battleship", 5]];
var allVessels = [];
var ship = {
    Name: "",
    Length: 0,
    Orientation: "x",
    Hits:0,
    //set vessel name
    setName: function (name) { this.Name = name; },
    //set vessel length
    setLength: function (length) { this.Length = length; },
    //set vessel orientation
    setOrientation: function (orientation) { this.Orientation = orientation; },
    //set vessel name
    decHits: function () { this.Hits = this.Hits-1; },
    //set vessel name, length, orientation and hits
    setShipDetails: function (name, length, orientation) {
        this.Name = name;
        this.Length = length;
        this.Hits = length;
        this.Orientation = orientation;
    },
    //get vessel name
    getName: function () { return this.Name; },
    //get vessel length
    getLength: function () { return this.Length; },
    //get vessel orientation
    getOrientation: function () { return this.Orientation; },
    //get vessel Hits
    getHits: function () { return this.Hits; }
};
var battleship = {
    Board: [],
    status: '', 
    miniBoard : [],
    //Creates an empty 10 x 10 board
    initialize: function () {
        addMessage("Initializing Vessels Commander....");
        addMessage("Board is set.");
        if (this.Board.length > 0)
            this.Board = [];
        //reset and set game hits
        gameHits = 0;
        vessels.forEach(function(vesselInfo) {
           gameHits += vesselInfo[1];
        });
        //set up the board
        for (let i = 0; i< boardYsize; i++) {
            this.Board.push([]);
            for (let j = 0; j< boardXsize; j++) {
                this.Board[i].push("");
            }
        }
    },
    //Given a set of coordinates, orientation and size, it checks to see if a vessel of that length can be placedin that position. If it can, it returns true, if not it returns false.
    canIPlaceShip: function (coordinates, orientation, size) {
        if (orientation === "x") {
            //if board falls outside x coordinates
            if (coordinates[0] + size >= boardXsize)
                return false;
        } else {
            //if board falls outside x coordinates
            if (coordinates[1] + size >= boardYsize)
                return false;
        }
        //if there is an overlap, return false
        for (let i = 0; i < size; i++) {
            if (orientation === "x") {
                if (this.Board[coordinates[0] + i][coordinates[1]] !== "")
                    return false;
            } else {
                if (this.Board[coordinates[0]][coordinates[1] + i] !== "")
                    return false;
            }
        }
        return true;
    },
    //Randomly selects a position to place a ship on the board using the ships orientation (x: horizontal, y: vertical) and marks coordinates with the first letter of the ship name.
    putShip: function (ship) {
        //get random coordinates
        var xCoord = Math.floor(Math.random()*boardXsize);
        var yCoord = Math.floor(Math.random()*boardYsize);
        //check to see if ship can be placed at coordinates
        while (!this.canIPlaceShip([xCoord, yCoord],ship.getOrientation(), ship.getLength())) {
            xCoord = Math.floor(Math.random()*boardXsize);
            yCoord = Math.floor(Math.random()*boardYsize);
            ship.setOrientation(Math.random()>0.5?"x":"y");
        }
        
        //if so, place the ship
        for (let i=0; i<ship.getLength(); i++) {
            if (ship.getOrientation() === "x") {
                this.Board[xCoord+i][yCoord] = ship.getName();
            } else {
                this.Board[xCoord][yCoord+i] = ship.getName();
            }
        }
    },
    //creates 4 ship objects with random orientations and calls putShip(ship) to put ships on the board
    createShips: function () {
        allVessels = [];
        //create all vessels
        for (let i = 0; i< vessels.length; i++) {
            allVessels.push(Object.create(ship));
            var orientation = Math.random()>0.5?"x":"y";
            allVessels[i].setShipDetails(vessels[i][0], vessels[i][1], orientation);
            //place vessels on the board
            this.putShip(allVessels[i]);
        }
    },
    //Takes a coordinate parameter and makes a move on the board
    makeMove: function (coordinates) {
        if (this.Board[coordinates[0]][coordinates[1]] === "") {
            this.status = 'missed'
            addMessage("You missed!");
            StatusParamaterSender(this.status,coordinates,'missed')
            return "missed";
        } else {
            //get the vessel name
            var vesselName = this.Board[coordinates[0]][coordinates[1]];
            for (let i = 0; i < allVessels.length; i++) {
                if (allVessels[i].getName() === vesselName) {
                    //adjust hit count per vessel
                    gameHits--;
                    if (allVessels[i].getHits()-1) {
                        allVessels[i].decHits();
                        //update message div
                        this.status = 'hit'
                        addMessage("You hit a " + vesselName + "!");
                    } else {
                        this.status = 'sunk'
                        addMessage("You sunk a " + vesselName + "!");
                        
                    }
                }
            }
            StatusParamaterSender(this.status,coordinates,this.Board[coordinates[0]][coordinates[1]].toLowerCase())            
            return this.Board[coordinates[0]][coordinates[1]].toLowerCase();
        }
        

    },

};

let playerroute = 'http://127.0.0.1:3000/player2'

function StatusParamaterSender(status,coordinates,style){
    let url = new URL(playerroute)
    let parameter = url.searchParams;
    parameter.set('username',username);
    parameter.set('gamecoordinates',coordinates);
    parameter.set('gamestatus',status);
    parameter.set('style',style);
    fetch(url).then(response => {
        return response
    })
    .catch(err =>{
        console.log(err)
    })
    
}