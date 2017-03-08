var net = require('net');
var readline = require('readline');
console.log('type "exit" or "quit" to quit.');
var sock = net.connect({port: 7},function(){
    console.log('client connected');
    sock.setEncoding('utf8');
    sock.write('hello echo server\r\n')
});
sock.on('data', function(data){
    console.log('got data from client - ', data);
    sock.write(data);
});
sock.on('end', function(){
    console.log('client disconneted');
});
sock.on('error', function(err){
    console.log('client error', err);
});
sock.on('close', function(err){
    console.log('client is closed');
    process.exit(0);
});
var r1 = readline.createInterface({
    input: process.stdin
});
function quitEcho(){
    r1.close();
    sock.end();
    console.log('quit echo server');
}
r1.on('line', function(cmd){
    if(cmd.indexOf('quit') == 0 || cmd.indexOf('exit') == 0) {
        quitEcho();
    }else {
        sock.write(cmd, '\r\n');
    }
});
r1.on('SIGINT', quitEcho);
