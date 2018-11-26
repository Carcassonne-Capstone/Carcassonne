const Player = require('../GameObjects/Player');
const { Tile, Region } = require('../GameObjects/Tiles');
const initializeDeckPlayers = require('../helperFuncs/deckFuncs')
const getNextPlayer = require('../helperFuncs/playerFuncs')
const makeid = require('../helperFuncs/roomFuncs')
const colorArr = [0xff0000, 0x0000ff, 0x9400d3, 0xffff00, 0xffa500];
const soundArr = ['/Sounds/elephant9.mp3', '/Sounds/lion.mp3', '/Sounds/spidermonkey.mp3', '/Sounds/Tiger2.mp3', '/Sounds/elephant9.mp3']
const rooms = {};

const broadcastToAll = ( socket, roomId, message, ...props) => {
  socket.broadcast.to(roomId).emit(message, ...props)
  socket.emit(message, ...props)
}

module.exports = io => {
  io.on('connection', socket => {

    socket.on('createRoom', playerName => {
      const roomId = makeid();
      socket.join(roomId);
      rooms[roomId] = {colorIdx: 0};
      socket.emit('roomCreated', roomId, new Player(playerName, roomId, colorArr[0], soundArr[0]));
    });

    socket.on('joinRoom', (roomId, playerName) => {
      socket.join(roomId);
      rooms[roomId].colorIdx++;
      const player = new Player(playerName, roomId, colorArr[rooms[roomId].colorIdx], soundArr[rooms[roomId].colorIdx]);
      socket.broadcast.to(roomId).emit('playerJoined', player);
      socket.emit('me', player);
    });

    socket.on('startGame', (roomId, players) => {
      rooms[roomId].deck = initializeDeckPlayers(players)
      const startTile = new Tile([new Region('road', [1, 3], false, [0.5, 0.5]),new Region('city', [0], false, [0.5, 0.1])],0);
      const firstTile = rooms[roomId].deck.getCard();
      broadcastToAll(socket, roomId, 'initGame', players, roomId, startTile, firstTile, players[0])
    });

    socket.on('tilePlaced', (roomId, coords) => {
      broadcastToAll(socket, roomId, 'newTile', coords)
    });

    socket.on('turnEnded', (curPlayer, allPlayers, roomId) => {
      const newPlayer = getNextPlayer(allPlayers, curPlayer)
      const tile = rooms[roomId].deck.getCard();
      if (tile) {
        broadcastToAll(socket, roomId, 'newPlayer', newPlayer, tile)
      } else {
        broadcastToAll(socket, roomId, 'gameOver')
      }
    });

    socket.on('rotateTile', roomId => {
      broadcastToAll(socket, roomId, 'rotate')
    });

    socket.on('meeplePlaced', (roomId, coords, player, regionIdx, tile) => {
      broadcastToAll(socket, roomId, 'meepleOn', { coords, player, regionIdx, tile })
    });

    socket.on('newMessage', (roomId, player, message) => {
      broadcastToAll(socket, roomId, 'postMessage', player, message)
    })
    
  });
};