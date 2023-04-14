//const { response } = require("express")

//Author: Aryan Shah

const highscoresURL = 'http://127.0.0.1:3000/highscores' //route to get highscores

//fetch the list of username and highscores
fetch(highscoresURL).then(response =>{
    return response.json(); 
})
.then(data =>{
  displayScores(data); //call display scores to show the scores
    
})
.catch(err =>{
    console.error(err);
})

//makes the highscores table and displays it to the table
function displayScores(data) {
    // creates a <table> element and a <tbody> element
    const tbl = document.createElement("table");
    const tblBody = document.createElement("tbody");
  
    // creating all cells
    for (let i = 0; i < data.length; i++) {
      // creates a table row
      var row = document.createElement("tr"); //create row
      let username = data[i].username //set username
      let score = data[i].score //set the username score
      var cell = document.createElement("td");
      var cellText = document.createTextNode(`${username}`); //enter the username 
      cell.appendChild(cellText);
      row.appendChild(cell);      
      cell = document.createElement("td");
      cellText = document.createTextNode(`${score}`); //enter the username score
      cell.appendChild(cellText);
      row.appendChild(cell);  
      // add the row to the end of the table body
      tblBody.appendChild(row);
    }
  
    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    document.body.appendChild(tbl);
    // sets the border attribute of tbl to '2'
    tbl.setAttribute("border", "1");
  }

