/***************** 服务器操作 *****************/
var express = require("express");
var fs = require('fs');
var https = require('https');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
    extended: true
}));

var privateKey  = fs.readFileSync('../ssl/domain-key-0717.key', 'utf8');
var certificate = fs.readFileSync('../ssl/domain-crt-0717.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

app.use(express.static('./'));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

//登录
app.post("/login", function(req, res) {
    query("select * from user;", function (err, res_msyql) {
       if (err){
           // throw err;
           res.json({code:1, msg:'请联系管理员!'});
       }else{
           var name = req.body.username;
           var password = req.body.password;
           var succ = res_msyql.some(function (obj) {
               if (obj.username == name && obj.password == password){
                    return true;
               }
               return false;
           });
           if(succ){
               res.cookie("username", name);
               res.cookie("password", password);
               res.json({code:0});
           }else{
               res.json({code:2, msg:'请确认输入，重试!'});
           }
       }
    });
});
//注册
app.post("/register", function(req, res) {
    var name = req.body.username;
    var password = req.body.password;
    query("insert into user(username, password) values('"+name+"','"+password+"')", function (err, res_mysql) {
        if (err){
            res.json({code:1, msg:'请联系管理员!'});
            // throw err;
        }else{
            res.json({code:0});
        }
    });
});
//数据查询
app.post("/query", function(req, res) {
    var name = req.body.username;
    // if (name == undefined){
    //     console.log(name);
    //     res.redirect(302, "/login.html");
    //     return;
    // }
    query("select * from punch where username='"+name+"';", function (err, res_msyql) {
        if (err){
            // throw err;
            res.json({code:1, msg:'请联系管理员!'});
        }else{
           res.json({code:0, data:res_msyql});
        }
    });
});
//打卡
app.post("/punch", function(req, res) {
    var name = req.body.username;
    var punchtime = req.body.punchtime;
    var date = new Date(parseInt(punchtime));
    //content规范：2018.07.09 Mon 09:00~18:00
    query("select * from punch where username='"+name+"';", function (err, res_msyql) {
        if (err){
            // throw err;
            res.json({code:1, msg:'请联系管理员!'});
        }else{
            //主逻辑
            var saveID = "";
            var week = "";
            switch (date.getDay()){
                case 1:
                    week = "Mon";
                    break;
                case 2:
                    week = "Tue";
                    break;
                case 3:
                    week = "Wed";
                    break;
                case 4:
                    week = "Thu";
                    break;
                case 5:
                    week = "Fri";
                    break;
                case 6:
                    week = "Sat";
                    break;
                case 7:
                    week = "Sun";
                    break;
            }
            var content = date.getFullYear() +"."+ (date.getMonth()+1) +"."+ date.getDate() +" "+ week +" "+ date.getHours() +":"+ (date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes())+"~";
            res_msyql.forEach(function (obj, ind) {
                var arr = obj.content.split(" ");
                var dateArr = arr[0].split(".");
                var newArr = obj.content.split("~");
                if(date.getFullYear()== dateArr[0] && (date.getMonth()+1) == dateArr[1] && date.getDate() == dateArr[2]){
                    content = newArr[0] + "~" + date.getHours() + ":" + (date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes());
                    saveID = obj.id;
                }
            });
            if(saveID != ""){
                //计算加班时长
                var overtime = 0;
                var start = content.split("~")[0].split(" ")[0] + " " + content.split("~")[0].split(" ")[2];
                var end = content.split("~")[0].split(" ")[0] + " " + content.split("~")[1];
                overtime = Math.max((((new Date(end).getTime()) - (new Date(start).getTime()) - 9*60*60*1000)/(1000*60*60.0)).toFixed(1), 0);
                overtime = overtime>=2?overtime:0;
                query("update punch set content = '"+content+"', overtime = "+overtime+" where id = "+saveID+";", function (err_sub, res_mysql_sub) {
                    if (err_sub){
                        // throw err;
                        res.json({code:1, msg:'请联系管理员!'});
                    }else{
                        res.json({code:0});
                    }
                });
            }else {
                // console.log("insert into punch(username, content, overtime) values('"+name+"','"+content+"', 0);");
                query("insert into punch(username, content, overtime) values('"+name+"','"+content+"', 0);", function (err_sub, res_mysql_sub) {
                    if (err_sub){
                        // throw err;
                        res.json({code:1, msg:'请联系管理员!'});
                    }else{
                        res.json({code:0});
                    }
                });
            }
        }
    });
});

// app.listen(8866, function() {
//     console.log("App started on port 8866");
// });
https.createServer(credentials, app).listen(8866);

/***************** 数据库操作 *****************/
var mysql      = require('mysql');
//交互数据
function query(sql, callback) {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'Qing123456',
        database : 'punchcard_db'
    });
    connection.connect();
    connection.query(sql, function(err, res) {
        callback(err, res);
    });
    connection.end();
}