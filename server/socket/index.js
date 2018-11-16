module.exports = io => {
  io.on("connection", socket => {
    console.log("HELLO");
    socket.on('createRoom', (playerName)=>{
        const roomId = makeid()
        socket.join(roomId)
        socket.emit('roomCreated',roomId, playerName)
    })
    socket.on('joinRoom', (roomId, playerName) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('playerJoined', playerName)
    })
  });
};

function makeid() {
  var text = "";
  var possible =
    "0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
