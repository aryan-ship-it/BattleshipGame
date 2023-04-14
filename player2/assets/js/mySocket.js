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
    socketMoves(move)
})

socket.on('resetted',function(status){
    creatminiHTMLTable();
})
