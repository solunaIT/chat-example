var app = require('express')();
//var http = require('http').Server(app);

var fs = require('fs');var fs = require('fs');
var key = fs.readFileSync('.key'); //CERT KEY
var cert = fs.readFileSync('.crt' ); //CERT FILE
var ca = fs.readFileSync('.crt' ); //CERT CA
var options = {
  key: key,
  cert: cert,
  ca: ca
};
//var http = require('https').Server(app);
var http = require('https');
var https = http.createServer(options, app);

var io = require('socket.io')(https, {origins:'solunapilates.es:* http://gesoluna.solunapilates.es:* http://www.solunapilates.es:* http://gesoluna.beenergy.info:* http://gesoluna.clinicaordonez.com:*'});
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


//CONNECTION
io.on('connection', function(socket){
	//BROADCAST USER CONNECTION

	var useridd;


  socket.on('eventToClient', function(data) {
      // you can try one of these three options
             var userid = data.userid;
             var username = data.username;
             var message = data.message;
             var toid = data.toid;
             var room = data.room;
             
             
             var timestamp = data.timestamp;
      // this is used to send to all connecting sockets
      io.sockets.emit('eventToClient', { userid: userid, username: username, message: message,toid: toid, room: room, timestamp: timestamp });
      console.log('Mensaje de '+username+' para: '+ toid+' sala: '+room+' mensaje: '+decodeURIComponent(message));

      // this is used to send to all connecting sockets except the sending one
      //socket.broadcast.emit('eventToClient',{ userid: userid, username: username, message: message,toid: toid });
      // this is used to the sending one
      //socket.emit('eventToClient',{ userid: userid, username: username, message: message,toid: toid });
  });

  //FUNCTION on userConnected
  socket.on('userConnected', function(data) {
  			var userid = data.userid;
            var username = data.username;
            var avatar = data.avatar;
            useridd = userid;
            var centername = data.centername;
            var room = data.room;
  		io.sockets.emit('userConnected',{ userid: userid, username: username,avatar: avatar, centername: centername, room: room});
  });


  	socket.on('disconnect', function() {
      	io.sockets.emit('userDisconnect',useridd);
    });
});

https.listen(port, function(){
  console.log('listening on *:' + port);
});
