const Player = require('../GameObjects/Player');
const { Tile, Region } = require('../GameObjects/Tiles');
const initializeDeckPlayers = require('../helperFuncs/deckFuncs')
const getNextPlayer = require('../helperFuncs/playerFuncs')
const makeid = require('../helperFuncs/roomFuncs')
const colorArr = ['red', 'blue', 'purple', 'yellow', 'orange'];

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
        let player = rooms[roomId].players.find(curPlayer => curPlayer.socketId === socketId)
        rooms[roomId].disconnected.push(player)
        if (rooms[roomId].disconnected.length === rooms[roomId].players.length) {
          delete rooms[roomId]
        } else {
          if (player.host) {
            player.setHost(false)
            let newHost = rooms[roomId].players[Math.floor(Math.random()*rooms[roomId].players.length)]
            while (rooms[roomId].disconnected.find(player => player.name === newHost.name)) {
              newHost = rooms[roomId].players[Math.floor(Math.random()*rooms[roomId].players.length)]
            }
            newHost.setHost(true)
            broadcastToAll(socket, roomId, 'newHost', rooms[roomId].players)
          }
          socket.broadcast.to(roomId).emit('disconnectedPlayer', player.name)
        }
      }
    })

    socket.on('createRoom', playerName => {
      const roomId = makeid();
      socket.join(roomId);
      const hostPlayer = new Player(playerName, roomId, socket.id, colorArr[0])
      hostPlayer.setHost(true);
      rooms[roomId] = {players: [hostPlayer], meeple: ['monkey', 'lion', 'tiger', 'gorilla', 'elephant'], disconnected: []};
      socket.emit('roomCreated', roomId, hostPlayer);
    });

    socket.on('joinRoom', (roomId, playerName) => {
      if (!rooms.hasOwnProperty(roomId)) {
        socket.emit('joinRoomErr', 'This room is not found, please try again')
      } else if (rooms[roomId].players.find(player => player.name === playerName)) {
        socket.emit('joinRoomErr', 'That name is taken, please try another')
      } else if (rooms[roomId].players.length < 5) {
        socket.join(roomId);
        const player = new Player(playerName, roomId, socket.id, colorArr[rooms[roomId].players.length]);
        rooms[roomId].players.push(player)
        socket.broadcast.to(roomId).emit('playerJoined', player);
        socket.emit('me', player, rooms[roomId].meeple);
      } else {
        socket.emit('joinRoomErr', 'This room is full, please try a different room')
      }
    });

    socket.on('startGame', (roomId) => {
      if (rooms[roomId].players.length !== (5 - rooms[roomId].meeple.length)) {
        socket.emit('startGameErr', 'The game can only be started when everyone has selected an animal')
      } else if (rooms[roomId].players.length > 1) {
        rooms[roomId].deck = initializeDeckPlayers(rooms[roomId].players)
        const startTile = new Tile([new Region('road', [1, 3], false, [0.5, 0.5]),new Region('city', [0], false, [0.5, 0.1])],0);
        const firstTile = rooms[roomId].deck.getCard();
        broadcastToAll(socket, roomId, 'initGame', rooms[roomId].players, roomId, startTile, firstTile, rooms[roomId].players[0])
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

    socket.on('selectMeeple', (roomId, meeple, player) => {
      const meepleArr = rooms[roomId].meeple;
      const filtered = meepleArr.filter(curMeeple => curMeeple !== meeple);
      rooms[roomId] = {...rooms[roomId], meeple: filtered};
      let curPlayer = rooms[roomId].players.find(play => play.name === player.name)
      curPlayer.setAnimal(meeple)
      broadcastToAll(socket, roomId, 'pickedMeeple', meeple, filtered, curPlayer)
    });

    socket.on('playingWithBots', (roomId) => {
      broadcastToAll(socket, roomId, 'botsPlay')
    });

  }
)}

