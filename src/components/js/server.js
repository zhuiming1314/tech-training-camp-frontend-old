//server
var express = require('express')
var cors = require('cors'); //解决跨域请求
var app = express();
app.use(cors());
var db = require('./db');

app.post('/process_login', function(req, res){
    var username = req.query.username;
    var password = req.query.password;
    if(!username){
        res.json({code:-1, message:'用户名不能为空'});
    }else if(!password){
        res.json({code:-1, message:'密码不能为空'});
    }else{
        db.selectUser(username, function(result){
            if(result.length>0){
                if(result[0].name==username && result[0].pwd == password){
                    res.json({code:0, message:result[0].name, file:result[0].file});
                }else{
                    res.json({code:-1, message:'用户名或密码错误'});
                }
            }else{
                res.json({code:-1, message:'用户不存在'});
            }
        })
    }
})

app.post('/process_register', function(req, res){
    //console.log(req)
    var username = req.query.username;
    var password = req.query.password;
    var repassword = req.query.repassword;

    if(!username){
        res.json({code:-1, message:'用户名不能为空'});
    }else if(!password){
        res.json({code:-1, message:'密码不能为空'});
    }else if(!repassword){
        res.json({code:-1, message:'确认密码不能为空'});
    }else if(password!=repassword){
        res.json({code:-1, message:'两次密码不一致'})
    }else{      
        db.insertUser(username, password, function(result, flag){
            if(result){
                if(flag){
                    res.json({code:0, message:'注册成功'});
                }else{
                    res.json({code:-1, message:"注册失败，该用户名已存在"});
                }
                
            }else{
                res.json({code:-1, message:'注册失败'});
            }
        })
    }
});
app.post('/process_upload', function(req, res){
    var username = req.query.username;
    var filename = req.query.filename;
    var filecontent = req.query.filecontent;
    var operation = req.query.operation;
    if(!username){
        res.json({code:-1, message:'用户尚未登录'});
    }else{
        db.uploadMd(username, filename, filecontent, operation, function(result){
            if(result){
                res.json({code:0, message:filename});
            }else{
                res.json({code:-1, message:'保存失败'});
            }
        })
    }
})

app.post('/process_download', function(req, res){
    var username = req.query.username;
    var index = req.query.fileindex;
    if(!username){
        res.json({code:-1, message:'用户尚未登录'});
    }else{
        db.downloadMd(username, index,function(result){
            //console.log(result[0].file[0]);
            if(result){
                res.json({code:0, message:result[0].file[0].filecontent});
            }else{
                res.json({code:-1, message:'保存失败'});
            }
        })
    }
})

app.post('/process_delete', function(req, res){
    var username = req.query.username;
    var filename = req.query.filename;
    if(!username){
        res.json({code:-1, message:'用户尚未登录'});
    }else{
        db.deleteMd(username, filename, function(result){
            if(result){
                res.json({code:0, message:filename});
            }else{
                res.json({code:-1, message:'删除失败'});
            }
        })
    }
})

const port = 8081
const ip = '127.0.0.1'
var server = app.listen(port, '127.0.0.1',function(){
    //console.log(server.address);
    //var host = server.address.address;
    //var port = server.address.port;
    console.log('访问地址为 %s:%s', ip, port);
})