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

    socket.on('disconnecting', () => {
      const [socketId, roomId] = Object.keys(socket.rooms);
      if (roomId) {
        let playerName = Object.keys(rooms[roomId].players).find(name => rooms[roomId].players[name] === socketId)
        socket.broadcast.to(roomId).emit('disconnectedPlayer', playerName)
      }
    })

    socket.on('createRoom', playerName => {
      const roomId = makeid();
      socket.join(roomId);
      rooms[roomId] = {players: {[playerName]: socket.id}};
      const hostPlayer = new Player(playerName, roomId, socket.id, colorArr[0], soundArr[0], '/images/circle.png')
      hostPlayer.setHost();
      socket.emit('roomCreated', roomId, hostPlayer);
    });

    socket.on('joinRoom', (roomId, playerName) => {
      let numPlayers = Object.keys(rooms[roomId].players).length
      if (!rooms.hasOwnProperty(roomId)) {
        socket.emit('joinRoomErr', 'This room is not found, please try again')
      } else if (rooms[roomId].players.hasOwnProperty(playerName)) {
        socket.emit('joinRoomErr', 'That name is taken, please try another')
      } else if (numPlayers < 5) {
        socket.join(roomId);
        const player = new Player(playerName, roomId, socket.id, colorArr[numPlayers], soundArr[numPlayers], '/images/circle.png');
        rooms[roomId].players[playerName] = socket.id;
        socket.broadcast.to(roomId).emit('playerJoined', player);
        socket.emit('me', player);
      } else {
        socket.emit('joinRoomErr', 'This room is full, please try a different room')
      }
    });

    socket.on('startGame', (roomId, players) => {
      if (players.length > 1) {
        rooms[roomId].deck = initializeDeckPlayers(players)
        const startTile = new Tile([new Region('road', [1, 3], false, [0.5, 0.5]),new Region('city', [0], false, [0.5, 0.1])],0);
        const firstTile = rooms[roomId].deck.getCard();
        broadcastToAll(socket, roomId, 'initGame', players, roomId, startTile, firstTile, players[0])
      } else {
        socket.emit('startGameErr', 'The game can only be started when 2 people have joined the room')
      }
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

    socket.on('playingWithBots', (roomId) => {
      broadcastToAll(socket, roomId, 'botsPlay')
    })
    
  });
};