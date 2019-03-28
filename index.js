const express = require('express');

const app = express();
app.set('view engine','ejs');
app.set('views','./views');
app.get('/index',(req,res)=>res.render('home'));
app.use(express.static('public'));
var server = app.listen(9090,()=> console.log('Server started'));
//sdfsdhfjsdkh
// sdkfjhsdkfjshdf 

var WebSocketServer = require('ws').Server;
var users = {};
var rooms = {};
var wss = new WebSocketServer({server: server});
var sendUser,receiUser,startTime,stopTime,typeSend;
wss.on('connection',function(connection){ // hjklazdsjfhaksjdfh

    connection.on('message',function(message){
        var data;
        try{
            data = JSON.parse(message);
        }catch (e){
            logger.error(e);
            data = {};
        }
        console.log(data); // sdjkfhsdjkfsjdfhjk
        switch(data.type){
            case "loggin":
               
                if(users[data.name]){
                    sendTo(connection,{
                        type:"loggin",
                        success:false
                    });            
                }else{
                    users[data.name] = connection;
                    connection.name = data.name;
                    sendTo(connection,{
                        type:"loggin",
                        success:true
                    });
                }
                break;
            case "message":
                var conn = users[data.name];
                if(conn != null){
                    switch(data.log){
                        case "info":
                            console.log("Message from "+ data.name + ": ",data.val);
                            break;
                        case "debug":
                            break;
                        case "error":
                            break;
                        default:
                    }
                }
                break;
            case "room":
                var cnn = users[data.name];
                if(rooms[data.room]){
                    console.log(data.name,"Join the room: ",data.room);
                    sendTo(connection,{
                        type:"room",
                        create:false,
                        room:data.room
                    });
                }
                else{
                    console.log(data.name,"Create the room: ",data.room)
                    rooms[data.room] = 1;
                    sendTo(connection,{
                        type:"room",
                        create:true,
                        room:data.room
                    });
                }
                break;
            case "start":
                sendUser = data.name;
                startTime = data.val;
                break;
            case "stop":
                receiUser = data.name;
                stopTime = data.val;
                typeSend = data.sendType;
                let ti = stopTime - startTime;
                console.log(sendUser + " sends " + typeSend + " to " + receiUser + ": " + ti + "ms")
                break;
            default:
        }
    });
    connection.on('close',function(){
        if(connection.name){
            delete users[connection.name];
        }
    });
});

function sendTo(connection, message) { 
    connection.send(JSON.stringify(message)); 
 }
