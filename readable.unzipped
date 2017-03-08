var fs = require('fs');
var readable = fs.createReadStream('readable.js', {
    flags: 'r',
    encoding:'utf8',
    autoClose: true,
    mode: 0666
});
readable.on('open', function(fd){
    console.log('file is opend, fd-'+fd);
});
readable.on('readable', function(){
    console.log('received is readable');
});
readable.on('data', function(chunk){
    console.log('read %d bytes: %s', chunk.length, chunk);
})
readable.on('end', function(chunk){
    console.log('read end');
})
readable.on('close', function(chunk){
    console.log('file is ended');
})
readable.on('error', function(err){
    console.log('error occured: %s', err.message);
})
