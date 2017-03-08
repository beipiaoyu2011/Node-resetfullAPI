//使用zlib模块来压缩和解压缩
var fs = require('fs');
var zlib = require('zlib');
var gzlib = zlib.createGzip();
var inFile = fs.createReadStream('readable.js');
var outGzip = fs.createWriteStream('readable.gz');
inFile.pipe(gzlib).pipe(outGzip);
setTimeout(function(){
  var gunzip = zlib.createUnzip({flush: zlib.Z_FULL_FLUSH});
  var inGzip = fs.createReadStream('readable.gz');
  var outFile = fs.createWriteStream('readable.unzipped');
  inGzip.pipe(gunzip).pipe(outFile);
}, 5000);
