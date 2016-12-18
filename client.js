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
