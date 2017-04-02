var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var router = require('./router/index');
var PORT = 8000;
var clients = [];

var server = app.listen(PORT, function(){
  console.log('listening PORT ' + PORT);
});

var io = require('socket.io')(server);
app.use('/static', express.static('./static'));
app.use(urlencodedParser);
app.use('/', router);

io.on('connection', function (socket) {
  socket.on('add user', function(username) {
    var msg = `${username} login!`
    console.log(`${username} login!`)
    socket.broadcast.emit('broadcast', `${username} login!`);
    clients.push({username, socket})
  })
  socket.on('say', function(data) {
    var user = clients.find((x) => x.username === data.send_to)
    if (!user) {
      console.log('user not exists!')
      return
    }
    socket.to(user.socket.id).emit('broadcast', data.msg)
    console.log(`send msg to ${data.send_to}`)
    // socket.broadcast.emit('broadcast', msg);
    // socket.to(clients.find((x) => x.username === 'zc111').socket.id).emit('broadcast', msg)
  })
});

