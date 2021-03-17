const mongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://zhuiming:wyzdsazyw1314@cluster0.ggins.mongodb.net/markdown_db?retryWrites=true&w=majority";
var fs = require("fs");


//login
function selectUser(username, callback){
   mongoClient.connect(uri,function(err, client){
        if(err) throw err;
        client.db("markdown_db").collection("user_info").find({"name":username}).toArray(function(err, res){
            if(err) throw err;
            callback(res);
            client.close();
        }); 
   });
}

//register
function insertUser(username, password, callback){
    mongoClient.connect(uri,function(err, client){
        if(err) throw err;
        client.db("markdown_db").collection("user_info").find({"name":username}).toArray(function(err, res){
            if(err) throw err;
            if(res.length>0){
                callback(res, false);
            }else{
                client.db("markdown_db").collection("user_info").insertOne({"name":username, "pwd":password}, (err, res)=>{
                    if(err) throw err;
                    callback(res, true);
                    //client.close();
                })
            }
            client.close();
        }); 
        
   });
}
//upload md file
function uploadMd(username, filename, filecontent, operation, callback){
    mongoClient.connect(uri,function(err, client){
        if(err) throw err;
        fileCollection = client.db("markdown_db").collection("user_info");
        if(operation=="insert"){ //insert
            fileCollection.updateOne({"name":username},{$addToSet:{file:{"filename":filename, "filecontent":filecontent}}},function(err, res){
                if(err) throw err;
                //console.log('insert');
                callback(res, true);
                
            });
        }else{ //update
            fileCollection.updateOne({"name":username, "file.filename":filename}, {$set:{'file.$.filecontent':filecontent}}, function(err, res){
                if(err) throw err;
                //console.log('update');
                callback(res, false);
            });
        }
        client.close();
    });         
}

//download md file
function downloadMd(username, index, callback){
    mongoClient.connect(uri,function(err, client){
         if(err) throw err;
         client.db("markdown_db").collection("user_info").find({"name":username},{projection: {_id:0, file:{"$slice":[parseInt(index), parseInt(index)+1]}}}).toArray(function(err, res){
             if(err) throw err;
             callback(res);
             client.close();
         });
    });
 }

 //delete md file
 function deleteMd(username, filename, callback){
    mongoClient.connect(uri,function(err, client){
        if(err) throw err;
        client.db("markdown_db").collection("user_info").updateOne({"name":username},{"$pull": {"file":{"filename":filename}}},function(err, res){
            if(err) throw err;
            callback(res);
            client.close();
        });
   });
 }
exports.selectUser = selectUser;
exports.insertUser = insertUser;
exports.uploadMd = uploadMd;
exports.downloadMd = downloadMd;
exports.deleteMd = deleteMd;