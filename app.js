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
var currentTurnPointer = user0;
var turnCounter = 0;

//Declare all card names here.

//Event cards
var e01,e02,e03,e04,e05,e06,e07,e08,e09,e10,e11,e12,e13,e14,e15,e16,e17,e18,e19,e20,e21,e22,e23,e24;
//Expense cards
var x01,x02,x03,x04,x05,x06,x07,x08,x09,x10,x11,x12,x13,x14,x15,x16,x17,x18,x19,x20,x21,x22,x23,x24;
//Opportunity cards
var p01,p02,p03,p04,p05,p06,p07,p08,p09,p10,p11,p12,p13,p14,p15,p16,p17,p18,p19,p20,p21,p22,p23,p24,p25,p26,p27,p28,p29,p30,p31,p32,p33,p34,p35,p36;
//KnowledgeAndTraining, JobChange, Celebration, AcademicAchievement, HealthIssues
var knt01,jc01,clb01,aca01,hi01;

//Assign cards to variable.
initCards();

//List of cards
var eve = [e01,e02,e03,e04,e05,e06,e07,e08,e09,e10,e11,e12,e13,e14,e15,e16,e17,e18,e19,e20,e21,e22,e23,e24];
var exp = [x01,x02,x03,x04,x05,x06,x07,x08,x09,x10,x11,x12,x13,x14,x15,x16,x17,x18,x19,x20,x21,x22,x23,x24];
var opp = [p01,p02,p03,p04,p05,p06,p07,p08,p09,p10,p11,p12,p13,p14,p15,p16,p17,p18,p19,p20,p21,p22,p23,p24,p25,p26,p27,p28,p29,p30,p31,p32,p33,p34,p35,p36];
var knt = [knt01];
var jc = [jc01];
var clb = [clb01];
var aca = [aca01];
var hi = [hi01];
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
app.get('/dashboard',function (req, res) {
    res.sendfile(__dirname + '/dashboard.html');
});
app.get('/temp',function (req, res) {
    res.sendfile(__dirname + '/temp.html');
});

//Static path to the directories accessed through client(html) pages. 
app.use('/Scripts', express.static(__dirname + '/Scripts'));
app.use('/Styles', express.static(__dirname + '/Styles'));
app.use('/',express.static(__dirname + '/'));
app.use('/panws',express.static(__dirname + '/panws'));

function nextTurn(){
    updateDashboard();
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

function updateDashboard(){
    var usersArray = [user0,user1,user2,user3];
    io.sockets.emit('updateDashboard',usersArray);
}

function liftCard(){
    var tileNumber = $pawnPositions[turnCounter%4];
    // console.log("liftcard","tileNumber: " + tileNumber);
    var cardType = tileType[tileNumber-1];
    // console.log("liftcard","cardType: " + cardType);
    // console.log("liftcard",cardType);
    var card = cardType[Math.floor(Math.random()*(cardType.length))];
    // console.log("liftcard","card: " + card);
    // console.log("liftcard",card);
    card();
    currentTurnPointer.RS += 5;
}

//When user connects. 
io.sockets.on('connection',function (socket) {
    console.log("New user Conneted");
    // console.log(socket);
    
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
        liftCard();

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
    //Event Cards
    e01 = function () {
        io.sockets.emit('new message', 'e01 card executed.');
    };
    e02 = function () {
        io.sockets.emit('new message', 'e02 card executed.');
    };
    e03 = function () {
        io.sockets.emit('new message', 'e03 card executed.');
    };
    e04 = function () {
        io.sockets.emit('new message', 'e04 card executed.');
    };
    e05 = function () {
        io.sockets.emit('new message', 'e05 card executed.');
    };
    e06 = function () {
        io.sockets.emit('new message', 'e06 card executed.');
    };
    e07 = function () {
        io.sockets.emit('new message', 'e07 card executed.');
    };
    e08 = function () {
        io.sockets.emit('new message', 'e08 card executed.');
    };
    e09 = function () {
        io.sockets.emit('new message', 'e09 card executed.');
    };
    e10 = function () {
        io.sockets.emit('new message', 'e10 card executed.');
    };
    e11 = function () {
        io.sockets.emit('new message', 'e11 card executed.');
    };
    e12 = function () {
        io.sockets.emit('new message', 'e12 card executed.');
    };
    e13 = function () {
        io.sockets.emit('new message', 'e13 card executed.');
    };
    e14 = function () {
        io.sockets.emit('new message', 'e14 card executed.');
    };
    e15 = function () {
        io.sockets.emit('new message', 'e15 card executed.');
    };
    e16 = function () {
        io.sockets.emit('new message', 'e16 card executed.');
    };
    e17 = function () {
        io.sockets.emit('new message', 'e17 card executed.');
    };
    e18 = function () {
        io.sockets.emit('new message', 'e18 card executed.');
    };
    e19 = function () {
        io.sockets.emit('new message', 'e19 card executed.');
    };
    e20 = function () {
        io.sockets.emit('new message', 'e20 card executed.');
    };
    e21 = function () {
        io.sockets.emit('new message', 'e21 card executed.');
    };
    e22 = function () {
        io.sockets.emit('new message', 'e22 card executed.');
    };
    e23 = function () {
        io.sockets.emit('new message', 'e23 card executed.');
    };
    e24 = function () {
        io.sockets.emit('new message', 'e24 card executed.');
    };
    
    //Expense Cards
    x01 = function () {
        io.sockets.emit('new message', 'x01 card executed.');
    };
    x02 = function () {
        io.sockets.emit('new message', 'x02 card executed.');
    };
    x03 = function () {
        io.sockets.emit('new message', 'x03 card executed.');
    };
    x04 = function () {
        io.sockets.emit('new message', 'x04 card executed.');
    };
    x05 = function () {
        io.sockets.emit('new message', 'x05 card executed.');
    };
    x06 = function () {
        io.sockets.emit('new message', 'x06 card executed.');
    };
    x07 = function () {
        io.sockets.emit('new message', 'x07 card executed.');
    };
    x08 = function () {
        io.sockets.emit('new message', 'x08 card executed.');
    };
    x09 = function () {
        io.sockets.emit('new message', 'x09 card executed.');
    };
    x10 = function () {
        io.sockets.emit('new message', 'x10 card executed.');
    };
    x11 = function () {
        io.sockets.emit('new message', 'x11 card executed.');
    };
    x12 = function () {
        io.sockets.emit('new message', 'x12 card executed.');
    };
    x13 = function () {
        io.sockets.emit('new message', 'x13 card executed.');
    };
    x14 = function () {
        io.sockets.emit('new message', 'x14 card executed.');
    };
    x15 = function () {
        io.sockets.emit('new message', 'x15 card executed.');
    };
    x16 = function () {
        io.sockets.emit('new message', 'x16 card executed.');
    };
    x17 = function () {
        io.sockets.emit('new message', 'x17 card executed.');
    };
    x18 = function () {
        io.sockets.emit('new message', 'x18 card executed.');
    };
    x19 = function () {
        io.sockets.emit('new message', 'x19 card executed.');
    };
    x20 = function () {
        io.sockets.emit('new message', 'x20 card executed.');
    };
    x21 = function () {
        io.sockets.emit('new message', 'x21 card executed.');
    };
    x22 = function () {
        io.sockets.emit('new message', 'x22 card executed.');
    };
    x23 = function () {
        io.sockets.emit('new message', 'x23 card executed.');
    };
    x24 = function () {
        io.sockets.emit('new message', 'x24 card executed.');
    };
    
    //Opportunity cards
    p01 = function () {
        io.sockets.emit('new message', 'p01 card executed.');
    };
    p02 = function () {
        io.sockets.emit('new message', 'p02 card executed.');
    };
    p03 = function () {
        io.sockets.emit('new message', 'p03 card executed.');
    };
    p04 = function () {
        io.sockets.emit('new message', 'p04 card executed.');
    };
    p05 = function () {
        io.sockets.emit('new message', 'p05 card executed.');
    };
    p06 = function () {
        io.sockets.emit('new message', 'p06 card executed.');
    };
    p07 = function () {
        io.sockets.emit('new message', 'p07 card executed.');
    };
    p08 = function () {
        io.sockets.emit('new message', 'p08 card executed.');
    };
    p09 = function () {
        io.sockets.emit('new message', 'p09 card executed.');
    };
    p10 = function () {
        io.sockets.emit('new message', 'p10 card executed.');
    };
    p11 = function () {
        io.sockets.emit('new message', 'p11 card executed.');
    };
    p12 = function () {
        io.sockets.emit('new message', 'p12 card executed.');
    };
    p13 = function () {
        io.sockets.emit('new message', 'p13 card executed.');
    };
    p14 = function () {
        io.sockets.emit('new message', 'p14 card executed.');
    };
    p15 = function () {
        io.sockets.emit('new message', 'p15 card executed.');
    };
    p16 = function () {
        io.sockets.emit('new message', 'p16 card executed.');
    };
    p17 = function () {
        io.sockets.emit('new message', 'p17 card executed.');
    };
    p18 = function () {
        io.sockets.emit('new message', 'p18 card executed.');
    };
    p19 = function () {
        io.sockets.emit('new message', 'p19 card executed.');
    };
    p20 = function () {
        io.sockets.emit('new message', 'p20 card executed.');
    };
    p21 = function () {
        io.sockets.emit('new message', 'p21 card executed.');
    };
    p22 = function () {
        io.sockets.emit('new message', 'p22 card executed.');
    };
    p23 = function () {
        io.sockets.emit('new message', 'p23 card executed.');
    };
    p24 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };
    p25 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };
    p26 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };
    p27 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };
    p28 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };
    p29 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };
    p30 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };
    p31 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };
    p32 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };
    p33 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };
    p34 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };
    p35 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };
    p36 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
    };

    //Other cards
    knt01 = function(){
        io.sockets.emit('new message', 'knt01 card executed.');
    };
    jc01 = function(){
        io.sockets.emit('new message', 'jc01 card executed.');
    };
    clb01 = function () {
        io.sockets.emit('new message', 'clb01 card executed.');
    };
    aca01 = function () {
        io.sockets.emit('new message', 'aca01 card executed.');
    };
    hi01 = function () {
        io.sockets.emit('new message', 'hi01 card executed.');
    };

}