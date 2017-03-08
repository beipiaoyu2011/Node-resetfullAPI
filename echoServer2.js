var net = require("net");

var server = net.createServer(function(sock){
  sock.setEncoding('utf8');
  sock.on('pipe', function(src){
    console.log('piped');
  });
  sock.on('error', function(err){
    console.log('error - %s', err.message);
  });
  sock.pipe(sock);
});

server.maxConnections = 10;
server.listen(7, function(){
  console.log('echo server bound at port - 7');
});
