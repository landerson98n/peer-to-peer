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
    io.emit('procurar musica',message);
  });

  socket.on('musica encontrada', (message) => {
    console.log(message);
    socket.emit('receber musica', message)
  });
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

server.listen(3333,'192.168.0.16' ,() => {
  console.log('Server started on port 3333');
});


