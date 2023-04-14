
//Purpose: create functions that modify the view for a Battleship game




function hasClass(element, className) { return element.classList.contains(className);}
//addClass(element, className) – adds a given class to an element if it does not have the class. Does nothing otherwise.
function addClass(element, className) {
    if (element.classList)
        element.classList.add(className);
    else if (!hasClass(element, className))
        element.className += " " + className;
}
//removeClass(element, className) – removes a given class from an element if the class has it. Does nothing otherwise.
function removeClass(element, className) {
    if (element.classList)
        element.classList.remove(className);
}

//changeText(element, msg) – changes the text of a given element to the given message
function changeText(element, msg) {
    if (element !== null)
        element.innerHTML = msg;
}
//clearMessages – Removes all messages from the message div.
function clearMessages() {
    var messageDiv = document.getElementById("messagediv");
    if (messageDiv !== null)
        messageDiv.innerHTML = null;
}
//addMessage(msg) – adds a given text (msg) to the message div.
function addMessage(msg) {
    var messageDiv = document.getElementById("messagediv");
    if (messageDiv !== null)
        messageDiv.innerHTML += msg+"<br>";
    messageDiv.scrollTop = messageDiv.scrollHeight;
}

//markBox(mark) – Adds a mark message to a given game board box
function markBox(element, className) {
    if (element.classList)
        element.classList.add(className);
    else if (!hasClass(element, className))
        element.className += " " + className;
}
//Displays username on the game page



function setUsername(userName) {
    var usernameDiv = document.getElementById("usernameDiv");
    changeText(usernameDiv,userName); 
    addMessage(userName); 
    let UsernameURL =  new Request('http://127.0.0.1:3000/username'); //username URL with specified route
    let data = {username : userName} //convert it to json format
    let myFetchParams = { //fetch parameters sent through the body
        method: 'POST',
        mode:'cors',
        headers : {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data) //sending data through the body for post ajax call
    }
    //post request to enter the username
    fetch(UsernameURL,myFetchParams).catch(err =>{
        console.log(err);
    })
}
//creates HTML table
function creatHTMLTable() {
    var htmlTable = document.getElementById("gametable");
    //if a table doesn't exist, exit
    if (!htmlTable) {
        addMessage("Missing a game table");
        return;
    }
    //remove all table elements if they exist
    while (htmlTable.firstChild) {
        htmlTable.removeChild(htmlTable.firstChild);
    }
    //add a header row with letters A, B, C, ...
    var headerRow = document.createElement("tr");
    for (let j = 0; j < boardXsize; j++) {
        var headerCell = document.createElement("th");
        //Use ASCII codes to fill the header
        headerCell.innerHTML = String.fromCharCode(j + 65);
        headerRow.appendChild(headerCell);
    }
    htmlTable.appendChild(headerRow);
    //add the table body using board size
    for (let i = 0; i < boardYsize; i++) {
        var newRow = document.createElement("tr");
        for (let j = 0; j < boardXsize; j++) {
            var newTd = document.createElement("td");
            addClass(newTd, "vessel");
            newRow.appendChild(newTd);
        }
        htmlTable.appendChild(newRow);
    }

    
}

//create miniHTML table that broadcasts socket moves from player2
function creatminiHTMLTable() {
    var htmlTable = document.getElementById("minitable");
    //if a table doesn't exist, exit
    if (!htmlTable) {
        addMessage("Missing a game table");
        return;
    }
    //remove all table elements if they exist
    while (htmlTable.firstChild) {
        htmlTable.removeChild(htmlTable.firstChild);
    }
    //add a header row with letters A, B, C, ...
    var headerRow = document.createElement("tr");
    for (let j = 0; j < boardXsize; j++) {
        var headerCell = document.createElement("th");
        //Use ASCII codes to fill the header
        headerCell.innerHTML = String.fromCharCode(j + 65);
        headerRow.appendChild(headerCell);
    }
    htmlTable.appendChild(headerRow);
    //add the table body using board size
    for (let i = 0; i < boardYsize; i++) {
        var newRow = document.createElement("tr");
        for (let j = 0; j < boardXsize; j++) {
            var newTd = document.createElement("td");
            addClass(newTd, "vessel");
            newRow.appendChild(newTd);
        }
        htmlTable.appendChild(newRow);
    }

    
}

//play moves recieved through websockets to the minitable
function socketMoves(move){
    let target = document.querySelector("#minitable");
    let xCoord = move[0]; //get xcoordinate
    let yCoord = move[1]; //get ycoordinate
    let style = move[2]; //style of ship,hit,miss or sunk
    let element = target.rows[xCoord+1].cells[yCoord]
    if ((element !== null) && (element.tagName.toLowerCase() === "td")) {
        if (element.innerHTML === "" ) {       
            addClass(element,style);
            if (move === "missed") 
                changeText(element, style); //change text to missed
            else changeText(element, style[0].toUpperCase());  // change text to hit
        }else {
            addMessage(`You already played this move`);
        }

    }


}