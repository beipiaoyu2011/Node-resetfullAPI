var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var index = require('./routes/index');
// var users = require('./routes/users');
var app = express();

var libs = process.cwd() + '/libs/';
require(libs + '/auth/auth');

var config = require('./config');
var log = require('./log')(module);
var oauth2 = require('./auth/oauth2');

var api = require('./routes/api');
var users = require('./routes/users');
var articles = require('./routes/articles');

//连接数据库
// var db=mongoose.connect('mongodb://127.0.0.1:27017/test'); //连接到一个test的数据库
// //如果连接成功会执行error回调
// db.connection.on("error", function (error) {
//     console.log("数据库连接失败：" + error);
// });
// //如果连接成功会执行open回调
// db.connection.on("open", function () {
//     console.log("数据库连接成功");
// });
// //定义一个 schema,描述此集合里有哪些字段，字段是什么类型
// var StudentSchema = new mongoose.Schema({
//     name: {type: String},
//     home: {type: String},
//     age: {type: Number, default: 0},
//     time: {type: Date, default: Date.now},
//     email: {type: String, default: ''}
// });
// //创建模型，可以用它来操作数据库中的student集合，指的是整体
// var StudentModel = db.model('student', StudentSchema);
// //根据模型创建实体，是指的个体对象
// var StudentEntity = new StudentModel({
//     name: 'beipiaoyu77',
//     age: 66,
//     email: 'beipiaoyu@gmail.com',
//     home: 'shanghai'
// });
// //用save 方法把自己保存到数据库中
// StudentEntity.save(function(error, data){
//     if(error){
//         console.log('error:',error);
//     }else {
//         // console.log(data);
//     }
// });
//
// StudentModel.find({},function(error, docs) {
//     // console.log(docs);
// })
// StudentModel.remove({age:26},function(error, docs) {
//     // console.log(docs);
// })
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);
//resetfull api
var ArticleModel = require('./libs/mongoose').ArticleModel;
app.get('/api/articles', function(req, res) {
    res.send('Got artices is starting now');
    return ArticleModel.find(function(err, articles) {
        if(!err) {
            res.send(articles);
        } else {
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    })
});
app.post('/api/articles', function(req, res) {
    res.send('Post artices is starting now');
    var aritcle = new ArticleModel({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        images: req.body.images
    });
    aritcle.save(function(err, aritcle) {
        if(!err) {
            console.log('article created');
            return res.send({ status: 'ok', article: article });
        } else {
            console.log(err);
            if(err.name == 'validationError') {
                res.statusCode = 400;
                res.send({ error: 'validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s', res.statusCode, err.message);
        }
    });
});
//获取
app.get('/api/articles/:id', function(req, res) {
    res.send('Got id is starting now');
    return ArticleModel.findById(req.params.id, function(err, article) {
        if(!article) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if(!err) {
            res.send({ status: 'ok', article: article });
        } else {
            if(err.name == 'validationError') {
                res.statusCode = 400;
                res.send({ error: 'validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s', res.statusCode, err.message);
        }
    });
});
//更新
app.put('/api/articles/:id', function(req, res) {
    res.send('update is starting now');
    return ArticleModel.findById(req.params.id, function(err, article) {
        if(!article) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        article.title = req.body.title;
        article.description = req.body.description;
        article.author = req.body.author;
        article.images = req.body.images;
        return article.save(function(err) {
            console.log('article updated');
            if(!err) {
                res.send({ status: 'ok', article: article });
            } else {
                if(err.name == 'validationError') {
                    res.statusCode = 400;
                    res.send({ error: 'validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                log.error('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    });
});
//删除
app.delete('/api/articles/:id', function(req, res) {
    res.send('delete is starting now');
    return ArticleModel.findById(req.params.id, function(err, article) {
        if(!article) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return article.remove(function(err) {
            console.log('article removed');
            if(!err) {
                res.send({ status: 'ok' });
            } else {
                if(err.name == 'validationError') {
                    res.statusCode = 400;
                    res.send({ error: 'validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                log.error('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.listen(config.get('port'), function() {
    console.log('Express server listening on port ' + config.get('port'));
});
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
