/**
 * Created by Srujan on 06-06-2016.
 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
var users = [];
var $usersColors = ["red","blue","green","yellow"];
server.listen(3000);

//Responds with perticular html pages on user requests.
app.get('/',function (req, res) {
    console.log("Request for userinfo");
    res.sendfile(__dirname + '/userinfo.html');
});
app.get('/favicon.ico',function (req, res) {
    console.log("Request for favicon.");
    res.sendfile(__dirname + '/favicon.ico');
});
app.get('/simple',function (req, res) {
    res.sendfile(__dirname + '/simple.html');
});
app.get('/board',function (req, res) {
    res.sendfile(__dirname + '/board.html');
});
app.get('/chat',function (req, res) {
    res.sendfile(__dirname + '/chat.html');
});

//Static path to the directories accessed through client(html) pages. 
app.use('/Scripts', express.static(__dirname + '/Scripts'));
app.use('/Styles', express.static(__dirname + '/Styles'));
app.use('/',express.static(__dirname + '/'));
app.use('/panws',express.static(__dirname + '/panws'));

//When user connects. 
io.sockets.on('connection',function (socket) {
    console.log("New user Conneted");


    
    //Receive a chat message from user.
    socket.on('send message',function (data) {
        //Broadcast the chat message.
        io.sockets.emit('new message',data);
    });

    //Receive the dice value rolled by user
    socket.on('diceRolled',function (diceValue) {
        //Broadcast the pawn movement to all users.
        io.sockets.emit('move pawn',diceValue);
        //Broadcast the dice value to all chats.
        io.sockets.emit('new message',"Dice rolled with number: " + diceValue);
    });
    
    socket.on('new user',function (user) {
        var $color = $usersColors[users.length];
        users.push(user);
        if (users.length == 1) {
            io.sockets.emit('userjoininglog', "<p style='font-size: 25px;font-family: Papyrus,cursive;color:red;font-weight: bold;'>" + user + " has joined the game...<br></p>")
        }else if (users.length == 2) {
            io.sockets.emit('userjoininglog', "<p style='font-size: 25px;font-family: Papyrus,cursive;color:blue;font-weight: bold;'>" + user + " has joined the game...<br></p>")
        }else if (users.length == 3) {
            io.sockets.emit('userjoininglog', "<p style='font-size: 25px;font-family: Papyrus,cursive;color:green;font-weight: bold;'>" + user + " has joined the game...<br></p>")
        }else if (users.length == 4) {
            io.sockets.emit('userjoininglog', "<p style='font-size: 25px;font-family: Papyrus,cursive;color:yellow;font-weight: bold;'>" + user + " has joined the game...<br></p>")
            io.sockets.emit('startTheGame','');
        }
    })

});