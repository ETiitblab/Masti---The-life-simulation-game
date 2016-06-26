/**
 * Created by Srujan on 06-06-2016.
 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
server.listen(3000);
var users = [];
var $usersColors = ["red","blue","green","yellow"];
var $pawnPositions = [0,0,0,0];

var $turnOfUserNumber = 0;

var user0 = {MU : 0,RS : 0,WB : 0,SI : 0, GI : 0, NI : 0};
var user1 = {MU : 0,RS : 0,WB : 0,SI : 0, GI : 0, NI : 0};
var user2 = {MU : 0,RS : 0,WB : 0,SI : 0, GI : 0, NI : 0};
var user3 = {MU : 0,RS : 0,WB : 0,SI : 0, GI : 0, NI : 0};
var currentTurnPointer;
var turnCounter = 0;

//Declare all card names here.
var e01;//,e02,e03,e04,e05,e06,e07,e08,e09,e10,e11,e12,e13,e14,e15,e16,e17,e18,e19,e20,e21,e22,e23,e24;
//Assign cards to variable.
initCards();

//List of cards
var eve = [e01];
var exp = [];
var opp = [];
var knt = [];
var jc = [];
var clb = [];
var aca = [];
var hi = [];
//Card types on the Job board.
var tileType = [exp,eve,opp,knt,eve,opp,eve,exp,eve,jc,eve,opp,clb,opp,eve,aca,exp,eve,opp,clb,exp,opp,hi,eve];

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

function nextTurn(){
    turnCounter = turnCounter +1;
    if (turnCounter%4 == 0){
        currentTurnPointer = user0;
        io.sockets.emit('new message',"Turn: " + users[0]);
    }else if (turnCounter%4 == 1){
        currentTurnPointer = user1;
        io.sockets.emit('new message',"Turn: " + users[1]);
    }else if (turnCounter%4 == 2){
        currentTurnPointer = user2;
        io.sockets.emit('new message',"Turn: " + users[2]);
    }else if(turnCounter%4 == 3){
        currentTurnPointer = user3;
        io.sockets.emit('new message',"Turn: " + users[3]);
    }else{
        console.log("Exception in function 'nextTurn'");
    }
}

//When user connects. 
io.sockets.on('connection',function (socket) {
    console.log("New user Conneted");
    console.log(socket);
    
    //Receive a chat message from user.
    socket.on('send message',function (data) {
        //Broadcast the chat message.
        io.sockets.emit('new message',data);
    });

    //Receive the dice value rolled by user
    socket.on('diceRolled',function (diceValue) {
        $pawnPositions[turnCounter%4] = ($pawnPositions[turnCounter%4] - 1 + diceValue) % 24 + 1;
        //Broadcast the pawn movement to all users.
        io.sockets.emit('pawn moved',$pawnPositions);
        //Broadcast the dice value to all chats.
        io.sockets.emit('new message',"Dice rolled with number: " + diceValue);
        // $turnOfUserNumber++;
        // $turnOfUserNumber %= 4;

        //show card
        setTimeout(function () {
            io.sockets.emit('show card',["srujan","card01"]);
        },300);

        nextTurn();
    });
    
    socket.on('new user',function (user) {
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
    });
    
});

//ALL CARDS
function initCards() {
    e01 = function () {
        io.sockets.emit('new message', 'e01 card executed.');
    };
}