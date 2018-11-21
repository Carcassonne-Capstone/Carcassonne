const Player = require("../GameObjects/Player");
const Deck = require("../GameObjects/Deck");
const { Tile, Region } = require("../GameObjects/Tiles");

let deck = [];

const colorArr = [0xff0000, 0x0000ff, 0x9400d3, 0xffff00, 0xffa500];
const rooms = {};

module.exports = io => {
  io.on("connection", socket => {
    socket.on("createRoom", playerName => {
      const roomId = makeid();
      rooms[roomId] = 0;
      const player = new Player(playerName, roomId, colorArr[0]);
      socket.join(roomId);
      socket.emit("roomCreated", roomId, player);
    });
    socket.on("joinRoom", (roomId, playerName) => {
      socket.join(roomId);
      rooms[roomId]++;
      const player = new Player(playerName, roomId, colorArr[rooms[roomId]]);
      socket.broadcast.to(roomId).emit("playerJoined", player);
      socket.emit("me", player);
    });
    socket.on("startGame", (roomId, players) => {
      deck = new Deck(require("../GameObjects/startTiles"));
      const startTile = new Tile(
        [
          new Region("road", [1, 3], false, [0.5, 0.5]),
          new Region("city", [0], false, [0.5, 0.1])
        ],
        0
      );
      deck.shuffle();
      const firstTile = deck.getCard();
      players.forEach((player, i) => {
        let randIdx = Math.floor(Math.random() * players.length);
        players[i] = players[randIdx];
        players[randIdx] = player;
      });
      const firstPlayer = players[0];
      socket.broadcast
        .to(roomId)
        .emit("initGame", players, roomId, startTile, firstTile, firstPlayer);
      socket.emit(
        "initGame",
        players,
        roomId,
        startTile,
        firstTile,
        firstPlayer
      );
    });

    socket.on("tilePlaced", (roomId, coords) => {
      socket.broadcast.to(roomId).emit("newTile", coords);
      socket.emit("newTile", coords);
    });

    socket.on("turnEnded", (curPlayer, allPlayers, roomId) => {
      let playerIdx = allPlayers.findIndex(
        player => curPlayer.name === player.name
      );
      playerIdx++;
      if (playerIdx >= allPlayers.length) {
        playerIdx = 0;
      }
      const tile = deck.getCard();
      if (tile) {
        socket.broadcast
          .to(roomId)
          .emit("newPlayer", allPlayers[playerIdx], tile);
        socket.emit("newPlayer", allPlayers[playerIdx], tile);
      } else {
        socket.broadcast.to(roomId).emit("gameOver");
        socket.emit("gameOver");
      }
    });

    socket.on("rotateTile", roomId => {
      socket.broadcast.to(roomId).emit("rotate");
      socket.emit("rotate");
    });

    socket.on("meeplePlaced", (roomId, coords, player, regionIdx, tile) => {
      socket.broadcast
        .to(roomId)
        .emit("meepleOn", { coords, player, regionIdx, tile });
      socket.emit("meepleOn", { coords, player, regionIdx, tile });
    });
  });
};

function makeid() {
  var text = "";
  var possible = "0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
