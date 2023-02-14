const app = require('./app.js');
const sendnotification = require('./middlewares/Sendnotification.js');
const port = process.env.PORT || 5001;
const http = require('http').Server(app);
const io = require('socket.io')(http);
const gettoken=(thistoken)=>{
  jwt.verify(thistoken,'moiz2194', (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: err });
    }
    return decoded.id;
  });
}
app.get('/', (req, res) => {
    res.send('app is working');
});

http.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
});

io.on('connection', (socket) => {
    console.log('A user connected');
    const token = socket.handshake.query.token;
   let userId= gettoken(token)
   socket.userId=userId
});

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

module.exports=io