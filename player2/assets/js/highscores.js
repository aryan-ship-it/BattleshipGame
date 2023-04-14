//const { response } = require("express")


const highscoresURL = 'http://127.0.0.1:3000/highscores'


fetch(highscoresURL).then(response =>{
    return response.json();
})
.then(data =>{
  displayScores(data);
  console.log(data.length)

    
})
.catch(err =>{
    console.error(err);
})


function displayScores(data) {
    // creates a <table> element and a <tbody> element
    const tbl = document.createElement("table");
    const tblBody = document.createElement("tbody");
  
    // creating all cells
    for (let i = 0; i < data.length; i++) {
      // creates a table row
      var row = document.createElement("tr");
      let username = data[i].username
      let score = data[i].score
      var cell = document.createElement("td");
      var cellText = document.createTextNode(`${username}`);
      cell.appendChild(cellText);
      row.appendChild(cell);      
      cell = document.createElement("td");
      cellText = document.createTextNode(`${score}`);
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

