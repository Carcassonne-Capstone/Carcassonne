import io from "socket.io-client";
import store, {createRoom, joinRoom, initGame, nextTurn, addToBoard, rotate, setPlayer, setMeeple, gameOver, postMessage, setJoinRoomErr, setStartGameErr} from "./store";

const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('I am connected');
});

// socket.on('disconnecting', () => {
//   socket.emit('playerDisconnected', store.getState())
// })

// socket.on('disconnectedPlayer', player => {
//   console.log(`${player.name} disconnected`)
// })

socket.on('joinRoomErr', (message) => {
  store.dispatch(setJoinRoomErr(message))
})

socket.on('startGameErr', (message) => {
  store.dispatch(setStartGameErr(message))
})

socket.on('roomCreated', (roomId, player) => {
  store.dispatch(createRoom(roomId, player));
});

socket.on('playerJoined', player => {
  store.dispatch(joinRoom(player));
});

socket.on('initGame', (players, roomId, startTile, firstTile, firstPlayer) => {
  store.dispatch(initGame(players, roomId, startTile, firstTile, firstPlayer));
});

socket.on('newTile', coords => {
  store.dispatch(addToBoard(coords));
});

socket.on('rotate', () => {
  store.dispatch(rotate());
});

socket.on('newPlayer', (player, newTile) => {
  store.dispatch(nextTurn(player, newTile));
});

socket.on('me', player => {
  store.dispatch(setPlayer(player));
});

socket.on('meepleOn', meeple => {
  store.dispatch(setMeeple(meeple));
});

socket.on('gameOver', () => {
  store.dispatch(gameOver());
});

socket.on('postMessage', (player, message) => {
  store.dispatch(postMessage(player, message));
});

export default socket;
