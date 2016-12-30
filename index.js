var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(process.env.PORT || 3000);

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var roomdata = {};
var clients = {};

io.on('connection', function(socket) {
    
    socket.on('joinRoom', function(room) {
	var num = room.roomnum;
	if (!roomdata[num]) {
	    roomdata[num] = [];
	    console.log('Created room: ' + num);
	} else {
	    for (var msg in roomdata[num]) {
		io.sockets.connected[socket.id].emit('sendMsg', roomdata[num][msg]);
	    }
	}
	clients[socket.id] = num;
	console.log(socket.id + ' joined room ' + num);
    });

    socket.on('msg', function(msg) {
	roomdata[clients[socket.id]].push(msg);
	for (var client in clients) {
	    if (clients[client] == clients[socket.id])
		io.sockets.connected[client].emit('sendMsg', msg);
	}
    });
    
    socket.on('disconnect', function() {
	console.log(socket.id + ' disconnected');
	var removeRoom = true;
	var num = clients[socket.id];
	delete clients[socket.id];
	for (var client in clients) {
	    if (clients[client] == num) {
		removeRoom = false;
		break;
	    }
	}
	if (removeRoom) {
	    delete roomdata[num];
	    console.log('room ' + num + ' deleted');
	}
    });

});
