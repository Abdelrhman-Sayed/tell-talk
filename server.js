var express = require ('express');
var bodyparser = require ('body-parser');
var app = express();
var http = require ('http').Server(app);
var io = require('socket.io')(http);
var mongoose=require('mongoose');
require('dotenv').config();


app.use(express.static(__dirname));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

var Message = mongoose.model('Message',{
    name: String,
    message: String
});


app.get('/messages',(req, res) =>{
    Message.find({}, (err,messages)=>{
        res.send(messages)
    })

});

app.post('/messages',(req, res)=>{
    var message = new Message(req.body)

    message.save((err)=>{
        if(err)
            sendStatus(500)

    io.emit('message', req.body)
    res.sendStatus(200);
    })

});

io.on('connection', (socket)=>{
    console.log('a user connected')
});

mongoose.connect( process.env.MONGO_DB_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
   });

mongoose.connection.on('connected', () =>
{
   console.log('Connected to the database');
});
mongoose.connection.on('error', (err) =>
{
   console.error(`Failed to connected to the database: ${err}`);
});

var PORT = 3000 ;
http.listen(PORT, () =>
{
    console.log(`Server is ready for connections on port ${PORT}`);
});