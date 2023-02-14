const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log(`A user connected ${socket.id}` );

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('message', (message) => {
      console.log(message);
      io.emit('message',message);
  });
  
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

server.listen(3333,'172.20.10.10' ,() => {
  console.log('Server started on port 3333');
});


