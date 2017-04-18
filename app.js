var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var router = require('./router/index');
var PORT = 8000;
var clients = [];

var server = http.Server(app).listen(PORT, function(){
  console.log('listening PORT ' + PORT);
});

var io = require('socket.io')(server);

app.use('/static', express.static('./static'));
app.use(urlencodedParser);
app.use('/', router);

io.on('connection', function(socket){

  socket.on('login', function(data){
    var client = {name: data, socketid: socket.id};
    clients.push(client);
    io.emit('to_user', data + ' login');
    console.log(clients.length + ' users left');
  });

  // sockets.push(socket);
  //console.log(clients);
  //console.log('this           '+ clients[0].name);
  console.log(clients.length + ' users left');
  socket.on('from_user', function(data){
    var send_to = data.send_to;
    var target_client;

    target_client = clients.find(function(a){
      return a.name === send_to;
    });

    if (target_client === undefined)
      return;

    var target_socketid = target_client.socketid;
    //console.log(target_socket);

    //console.log(socket);
    io.to(target_socketid).emit('to_user', data.content);
    socket.emit('to_user', data.content);
    //io.emit('to_user', data.content);
    console.log(data.content);
    console.log('send message to ' + target_client.name +  ' ' + target_socketid);
  });

  socket.on('disconnect', function(socket){
    function findSocketIndex(client){
      return client.socketid == socket.id;
    }
    var indexid = clients.findIndex(findSocketIndex);

    clients.splice(indexid, 1);
    console.log(socket.id + 'removed');
    console.log(clients.length + ' users left');
  });
});
