var io = io();
var chatlog = '';
var userName;
if (localStorage.userName) {
    var useOld = confirm('Use ' + localStorage.userName + ' as your user name?');
    if (!useOld) {	
	localStorage.userName = prompt('Choose a username');
    }
} else {
    localStorage.userName = prompt('Choose a username');
}
userName = localStorage.userName;

var room;
do {
    room = prompt('Choose a chat room to connect to');
} while (isNaN(room));
room = parseInt(room);
io.emit('joinRoom', {roomnum: room});

io.on('sendMsg', function(msg) {
    chatlog += '<b>' + msg.user + '</b>: '+ msg.data + '<br>';
    document.getElementById('chat').innerHTML = chatlog;
});

function msgServer() {
    var s = document.getElementById('msg').value;
    document.getElementById('msg').value = '';
    if (s != '')
	io.emit('msg', {user: userName, data: s});
}

function scrollBottom() {
    var chatdiv = document.getElementsByClassName('chatdiv')[0];
    chatdiv.scrollTop = chatdiv.scrollHeight;
}
