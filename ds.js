var mongo = require('mongo');
var db = new mongo.Db("test", new mongo.Server('localhost', 27017, {}), {});
db.open(function() {
    // 打开名为user的表
    db.collection("user", function(err, collection) {
        // select * from products 相当于db.products.find()
        collection.find({ name: querystring.parse(url.parse(req.url).query)['name'], pwd: querystring.parse(url.parse(req.url).query)['pwd'] }, function(err, cursor) {
            cursor.toArray(function(err, items) {
                if(items != null && items.length != 0) {
                    res.writeHead(200);
                    var obj = { value: 1 }
                    res.end(JSON.stringify(obj));
                } else {
                    res.writeHead(200);
                    var obj = { value: 0 }
                    res.end(JSON.stringify(obj));
                }
            });
        });
    });
});
