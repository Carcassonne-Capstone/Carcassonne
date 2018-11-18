const Player = require('../GameObjects/Player')
const Deck = require('../GameObjects/Deck')

let deck = [];

module.exports = io => {
  io.on("connection", socket => {
    console.log("HELLO");
    socket.on('createRoom', (playerName)=>{
        const roomId = makeid()
        const player = new Player(playerName, roomId)
        socket.join(roomId)
        socket.emit('roomCreated',roomId, player)
    })
    socket.on('joinRoom', (roomId, playerName) => {
        socket.join(roomId)
        const player = new Player(playerName, roomId)
        socket.broadcast.to(roomId).emit('playerJoined', player)
    })
    socket.on('startGame', (roomId, players) => {
        deck = new Deck(require('../GameObjects/startTiles'));
        const startTile = deck.getCard();
        deck.shuffle();
        const firstTile = deck.getCard();
        players.forEach((player, i) => {
            let randIdx = Math.floor(Math.random() * players.length)
            players[i] = players[randIdx];
            players[randIdx] = player
        })
        const firstPlayer = players[0];
        socket.broadcast.to(roomId).emit('initGame', players, roomId, startTile, firstTile, firstPlayer)
        socket.emit('initGame', players, roomId, startTile, firstTile, firstPlayer)
    })
  });
};

function makeid() {
  var text = "";
  var possible = "0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
