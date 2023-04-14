var myURL = "http://127.0.0.1:3000";

var socket = io(myURL,{secure:true});

// $.ajax({
//     url: myURL,
//     type: 'GET',
//     success: function (data) {
//         socket.emit('emit_from_here');
//     }
// });

socket.on('playermoved',function(move){
    socketMoves(move) //call socket moves which have to broadcast the player2 move
})

socket.on('resetted',function(status){
    if(status.reset == true){ // if status is true
        creatminiHTMLTable();//reset the minitable once it recieves reset signal from the other player's board
    }
    
})

