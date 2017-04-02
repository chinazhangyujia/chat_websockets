var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var router = require('./router/index');
var PORT = 8000;
var clients = [];
var sockets = [];

var server = http.Server(app).listen(PORT, function(){
  console.log('listening PORT ' + PORT);
});

var io = require('socket.io')(server);

app.use('/static', express.static('./static'));
app.use(urlencodedParser);
app.use('/', router);

io.on('connection', function(socket){

  app.post('/login', function(req, res){
    sockets.push(socket);
    var client = {name: req.body.username, socketid: socket.id};
    //console.log('this  '+ client);
    clients.push(client);
    res.redirect('/');
  });

  // sockets.push(socket);
  //console.log(clients);
  //console.log('this           '+ clients[0].name);
  console.log(clients.length + ' users left');
  socket.on('from_user', function(data){
    var send_to = data.send_to;
    var target_client = clients.find(function(a){
      return a.name === send_to;
    });

    var target_socket = sockets.find(function(a){
      return a.id === target_client.socketid;
    });
    //console.log(target_socket);

    console.log(target_socket == socket);

    //console.log(socket);
    socket.emit('to_user', data.content);
    //io.emit('to_user', data.content);
    console.log(data.content);
    console.log('send message to ' + target_client.name + ' users');
  });

  // socket.on('disconnect', function(socket){
  //   sockets.splice(clients.indexOf({socket}), 1);
  //   console.log(sockets.length + ' users left');
  // });
});
