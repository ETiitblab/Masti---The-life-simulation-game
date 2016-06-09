/**
 * Created by Srujan on 06-06-2016.
 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(3000);

//Responds with perticular html pages on user requests.
app.get('/',function (req, res) {
    res.sendfile(__dirname + '/chat.html');
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

//When user connects. 
io.sockets.on('connection',function (socket) {
    console.log("New user Conneted");
    
    //Add a message to chat. 
    socket.on('send message',function (data) {
        io.sockets.emit('new message',data);
    });
});