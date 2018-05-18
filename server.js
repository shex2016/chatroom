const express = require('express');

const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = process.env.PORT || 5000;

var users = [];
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

//app.listen(port, () => console.log(`Listening on port ${port}`));

io.on('connection', function(socket){
  console.log('a user connected, and connectionId: ' + socket.id);
  var sId = socket.id;
  socket.on('disconnect', function(){
    console.log('user disconnected');
    for(let i = 0; i < users.length; i++){
      if(users[i].socketId === socket.id){
        users[i].isOnline = false;        
      }
    }
  });

  socket.on('sign up', (signUpMsg) => {
    console.log('sign up for ' + sId);
    console.log('socketId = '+ socket.id);
    var result = {
      isOk: false,
      sId: socket.id
    }
    
    //TODO: check users with the same name
    for(let i = 0; i < users.length; i++){
      if(users[i].userName === signUpMsg.userName){
        socket.emit('login result', result);
        return;
      }
    }
    result.isOk = true;
    socket.emit('login result', result);
    users.push({
      socketId: sId,
      userName: signUpMsg.userName,
      profilePic:'https://goo.gl/1qhE6T',
      isOnline: true
    });
    console.log(users);
  });

  socket.on('chat message', (msg)=>{
    console.log('message: ' + msg.sId);
    socket.to(msg.sId).emit('chat message', msg);
  });
  socket.on('request for onlinelist', ()=>{
    socket.emit('onlineList', users);
  });
  
});
setInterval(function() {
  io.emit('onlineList', users);
}, 1000);

http.listen(port, function(){
  console.log('listening on *:3000');
});