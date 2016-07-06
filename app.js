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
    var cardType = tileType[tileNumber-1];
    var card = cardType[Math.floor(Math.random()*(cardType.length))];
    card();
    /*var userName = users[turnCounter%4];         setTimeout(function () {
        nextTurn();
    },1000);*/
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
        // nextTurn();
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

function alterStandardValues(mu,rs,wb,si,gi,ni,next){
    currentTurnPointer.MU += mu;
    currentTurnPointer.RS += rs;
    currentTurnPointer.WB += wb;
    currentTurnPointer.SI += si;
    currentTurnPointer.GI += gi;
    currentTurnPointer.NI += ni;
    if (next == "true"){
        nextTurn();
    }
}

//ALL CARDS
function initCards() {
    //Event Cards
    e01 = function () {
        io.sockets.emit('new message', 'e01 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e01"]);
        },300);
        alterStandardValues(0,5,0,0,300,300,"true");
    };
    e02 = function () {
        io.sockets.emit('new message', 'e02 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e02"]);
        },300);
        alterStandardValues(-((0.1)*currentTurnPointer.NI),-10,-5,0,0,0,"true");
    };
    e03 = function () {
        io.sockets.emit('new message', 'e03 card exeuted.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e03"]);
        },300);
        alterStandardValues(-(0.2*currentTurnPointer.NI),0,-10,0,0,0,"true");
    };
    e04 = function () {
        io.sockets.emit('new message', 'e04 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e04"]);
        },300);
        alterStandardValues(-(0.5*currentTurnPointer.MU),-20,-30,0,0,0,"true");
    };
    e05 = function () {
        io.sockets.emit('new message', 'e05 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e05"]);
        },300);
        nextTurn();
    };
    e06 = function () {
        io.sockets.emit('new message', 'e06 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e06"]);
        },300);
        nextTurn();
    };
    e07 = function () {
        io.sockets.emit('new message', 'e07 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e07"]);
        },300);
        nextTurn();
    };
    e08 = function () {
        io.sockets.emit('new message', 'e08 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e08"]);
        },300);
        nextTurn();
    };
    e09 = function () {
        io.sockets.emit('new message', 'e09 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e09"]);
        },300);
        nextTurn();
    };
    e10 = function () {
        io.sockets.emit('new message', 'e10 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e10"]);
        },300);
        nextTurn();
    };
    e11 = function () {
        io.sockets.emit('new message', 'e11 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e11"]);
        },300);
        nextTurn();
    };
    e12 = function () {
        io.sockets.emit('new message', 'e12 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e12"]);
        },300);
        nextTurn();
    };
    e13 = function () {
        io.sockets.emit('new message', 'e13 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e13"]);
        },300);
        nextTurn();
    };
    e14 = function () {
        io.sockets.emit('new message', 'e14 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e14"]);
        },300);
        nextTurn();
    };
    e15 = function () {
        io.sockets.emit('new message', 'e15 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e15"]);
        },300);
        nextTurn();
    };
    e16 = function () {
        io.sockets.emit('new message', 'e16 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e16"]);
        },300);
        nextTurn();
    };
    e17 = function () {
        io.sockets.emit('new message', 'e17 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e17"]);
        },300);
        nextTurn();
    };
    e18 = function () {
        io.sockets.emit('new message', 'e18 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e18"]);
        },300);
        nextTurn();
    };
    e19 = function () {
        io.sockets.emit('new message', 'e19 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e19"]);
        },300);
        nextTurn();
    };
    e20 = function () {
        io.sockets.emit('new message', 'e20 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e20"]);
        },300);
        nextTurn();
    };
    e21 = function () {
        io.sockets.emit('new message', 'e21 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e21"]);
        },300);
        nextTurn();
    };
    e22 = function () {
        io.sockets.emit('new message', 'e22 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e22"]);
        },300);
        nextTurn();
    };
    e23 = function () {
        io.sockets.emit('new message', 'e23 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e23"]);
        },300);
        nextTurn();
    };
    e24 = function () {
        io.sockets.emit('new message', 'e24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"e24"]);
        },300);
        nextTurn();
    };
    
    //Expense Cards
    x01 = function () {
        io.sockets.emit('new message', 'x01 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x01"]);
        },300);
        nextTurn();
    };
    x02 = function () {
        io.sockets.emit('new message', 'x02 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x02"]);
        },300);
        nextTurn();
    };
    x03 = function () {
        io.sockets.emit('new message', 'x03 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x03"]);
        },300);
        nextTurn();
    };
    x04 = function () {
        io.sockets.emit('new message', 'x04 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x04"]);
        },300);
        nextTurn();
    };
    x05 = function () {
        io.sockets.emit('new message', 'x05 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x05"]);
        },300);
        nextTurn();
    };
    x06 = function () {
        io.sockets.emit('new message', 'x06 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x06"]);
        },300);
        nextTurn();
    };
    x07 = function () {
        io.sockets.emit('new message', 'x07 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x07"]);
        },300);
        nextTurn();
    };
    x08 = function () {
        io.sockets.emit('new message', 'x08 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x08"]);
        },300);
        nextTurn();
    };
    x09 = function () {
        io.sockets.emit('new message', 'x09 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x09"]);
        },300);
        nextTurn();
    };
    x10 = function () {
        io.sockets.emit('new message', 'x10 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x10"]);
        },300);
        nextTurn();
    };
    x11 = function () {
        io.sockets.emit('new message', 'x11 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x11"]);
        },300);
        nextTurn();
    };
    x12 = function () {
        io.sockets.emit('new message', 'x12 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x12"]);
        },300);
        nextTurn();
    };
    x13 = function () {
        io.sockets.emit('new message', 'x13 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x13"]);
        },300);
        nextTurn();
    };
    x14 = function () {
        io.sockets.emit('new message', 'x14 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x14"]);
        },300);
        nextTurn();
    };
    x15 = function () {
        io.sockets.emit('new message', 'x15 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x15"]);
        },300);
        nextTurn();
    };
    x16 = function () {
        io.sockets.emit('new message', 'x16 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x16"]);
        },300);
        nextTurn();
    };
    x17 = function () {
        io.sockets.emit('new message', 'x17 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x17"]);
        },300);
        nextTurn();
    };
    x18 = function () {
        io.sockets.emit('new message', 'x18 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x18"]);
        },300);
        nextTurn();
    };
    x19 = function () {
        io.sockets.emit('new message', 'x19 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x19"]);
        },300);
        nextTurn();
    };
    x20 = function () {
        io.sockets.emit('new message', 'x20 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x20"]);
        },300);
        nextTurn();
    };
    x21 = function () {
        io.sockets.emit('new message', 'x21 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x21"]);
        },300);
        nextTurn();
    };
    x22 = function () {
        io.sockets.emit('new message', 'x22 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x22"]);
        },300);
        nextTurn();
    };
    x23 = function () {
        io.sockets.emit('new message', 'x23 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x23"]);
        },300);
        nextTurn();
    };
    x24 = function () {
        io.sockets.emit('new message', 'x24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"x24"]);
        },300);
        nextTurn();
    };
    
    //Opportunity cards
    p01 = function () {
        io.sockets.emit('new message', 'p01 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p01"]);
        },300);
        nextTurn();
    };
    p02 = function () {
        io.sockets.emit('new message', 'p02 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p02"]);
        },300);
        nextTurn();
    };
    p03 = function () {
        io.sockets.emit('new message', 'p03 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p03"]);
        },300);
        nextTurn();
    };
    p04 = function () {
        io.sockets.emit('new message', 'p04 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p04"]);
        },300);
        nextTurn();
    };
    p05 = function () {
        io.sockets.emit('new message', 'p05 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p05"]);
        },300);
        nextTurn();
    };
    p06 = function () {
        io.sockets.emit('new message', 'p06 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p06"]);
        },300);
        nextTurn();
    };
    p07 = function () {
        io.sockets.emit('new message', 'p07 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p07"]);
        },300);
        nextTurn();
    };
    p08 = function () {
        io.sockets.emit('new message', 'p08 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p08"]);
        },300);
        nextTurn();
    };
    p09 = function () {
        io.sockets.emit('new message', 'p09 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p09"]);
        },300);
        nextTurn();
    };
    p10 = function () {
        io.sockets.emit('new message', 'p10 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p10"]);
        },300);
        nextTurn();
    };
    p11 = function () {
        io.sockets.emit('new message', 'p11 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p11"]);
        },300);
        nextTurn();
    };
    p12 = function () {
        io.sockets.emit('new message', 'p12 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p12"]);
        },300);
        nextTurn();
    };
    p13 = function () {
        io.sockets.emit('new message', 'p13 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p13"]);
        },300);
        nextTurn();
    };
    p14 = function () {
        io.sockets.emit('new message', 'p14 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p14"]);
        },300);
        nextTurn();
    };
    p15 = function () {
        io.sockets.emit('new message', 'p15 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p15"]);
        },300);
        nextTurn();
    };
    p16 = function () {
        io.sockets.emit('new message', 'p16 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p16"]);
        },300);
        nextTurn();
    };
    p17 = function () {
        io.sockets.emit('new message', 'p17 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p17"]);
        },300);
        nextTurn();
    };
    p18 = function () {
        io.sockets.emit('new message', 'p18 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p18"]);
        },300);
        nextTurn();
    };
    p19 = function () {
        io.sockets.emit('new message', 'p19 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p19"]);
        },300);
        nextTurn();
    };
    p20 = function () {
        io.sockets.emit('new message', 'p20 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p20"]);
        },300);
        nextTurn();
    };
    p21 = function () {
        io.sockets.emit('new message', 'p21 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p21"]);
        },300);
        nextTurn();
    };
    p22 = function () {
        io.sockets.emit('new message', 'p22 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p22"]);
        },300);
        nextTurn();
    };
    p23 = function () {
        io.sockets.emit('new message', 'p23 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p23"]);
        },300);
        nextTurn();
    };
    p24 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p24"]);
        },300);
        nextTurn();
    };
    p25 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p25"]);
        },300);
        nextTurn();
    };
    p26 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p26"]);
        },300);
        nextTurn();
    };
    p27 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p27"]);
        },300);
        nextTurn();
    };
    p28 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p28"]);
        },300);
        nextTurn();
    };
    p29 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p29"]);
        },300);
        nextTurn();
    };
    p30 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p30"]);
        },300);
        nextTurn();
    };
    p31 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p31"]);
        },300);
        nextTurn();
    };
    p32 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p32"]);
        },300);
        nextTurn();
    };
    p33 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p33"]);
        },300);
        nextTurn();
    };
    p34 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p34"]);
        },300);
        nextTurn();
    };
    p35 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p35"]);
        },300);
        nextTurn();
    };
    p36 = function () {
        io.sockets.emit('new message', 'p24 card executed.');
        var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',[userName,"p36"]);
        },300);
        nextTurn();
    };

    //Other cards
    knt01 = function(){
        io.sockets.emit('new message', 'knt01 card executed.');
        /*var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',["srujan","knt01"]);
        },300);*/
        nextTurn();
    };
    jc01 = function(){
        io.sockets.emit('new message', 'jc01 card executed.');
        /*var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',["srujan","jc01"]);
        },300);*/
        nextTurn();
    };
    clb01 = function () {
        io.sockets.emit('new message', 'clb01 card executed.');
        /*var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',["srujan","clb01"]);
        },300);*/
        nextTurn();
    };
    aca01 = function () {
        io.sockets.emit('new message', 'aca01 card executed.');
        /*var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',["srujan","aca01"]);
        },300);*/
    };
    hi01 = function () {
        io.sockets.emit('new message', 'hi01 card executed.');
        /*var userName = users[turnCounter%4];
        setTimeout(function () {
            io.sockets.emit('show card',["srujan","hi01"]);
        },300);*/
    };

}