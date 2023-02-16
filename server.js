const app = require('./app.js');
const sendnotification = require('./middlewares/Sendnotification.js');
const port = process.env.PORT || 5001;
const http = require('http').Server(app);
const asyncerror = require('./middlewares/catchasyncerror.js')
const jwt = require('jsonwebtoken');
const { get } = require('http');
const ConnectedUser = require('./model/connecteduser.js')
const ErrorHandler = require('./middlewares/errorhandler.js');
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});


app.get('/', (req, res) => {
  res.send('app is working');
});

http.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});

io.on('connection', asyncerror(async (socket) => {
  console.log('A user connected');
  let token = socket.handshake.query.token;
  let wrongtoken=false;
  console.log(token)
  socket.on('disconnect',()=>{
    console.log('disconnected')
  })
  if (token!==null||token!==undefined) {
    let userId = jwt.verify(token, 'moiz2194',(err)=>{
    if(err){
       wrongtoken=true
      return 
    }
    })
    if(wrongtoken!==true){
      
    const verify = await ConnectedUser.findOne({ user_id: userId });
    if (verify === null) {
      await ConnectedUser.create({ socket_id: socket.id, user_id: userId })
    } else {
      await ConnectedUser.findOneAndUpdate({ user_id: userId }, {
        socket_id: socket.id
      })
    }
    
  }else{
    console.log('token is wrong', token)
  }
  } else {
    console.log('token is null', token)
  }

}));

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  http.close(() => {
    process.exit(1);
  });
});
const getIO = () => {
  return io
}
exports.Scan = getIO