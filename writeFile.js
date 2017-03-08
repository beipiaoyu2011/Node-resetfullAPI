var fs = require('fs');
var writeFile = fs.createWriteStream('example.txt', {
    flags: 'w',
    defaultEncoding: 'utf8',
    model: 0666
});
writeFile.on('finish', function(){
    console.log('file is finished');
    process.exit(0);
})
writeFile.on('error', function(){
    console.log('error');
});
writeFile.write('My name is 火云邪神88!', 'utf8');

writeFile.end();
