import io from "socket.io-client";
import store, {createRoom, joinRoom, initGame, nextTurn, addToBoard, rotate, setPlayer, 
  setMeeple, postMessage, setJoinRoomErr, setStartGameErr, playerDisconnected, 
  playingWithBots, selectMeeple, newHost, changeGameState, hostLeft, playerLeft, resetState, removeAndScore} from "./store";

const socket = io(window.location.origin);

socket.on('connect', () => {
  const gameState = store.getState().game
  if (gameState.roomId !== '') {
    socket.emit('rejoinRoom', gameState.roomId, gameState.player.name)
  }
});

socket.on('disconnectedPlayer', player => {
  store.dispatch(playerDisconnected(player))
})

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

socket.on('newPlayer', (player, newTile, numTiles) => {
  store.dispatch(nextTurn(player, newTile, numTiles));
});

socket.on('me', (player, meeple, roomId) => {
  store.dispatch(setPlayer(player, meeple, roomId));
});

socket.on('meepleOn', meeple => {
  store.dispatch(setMeeple(meeple));
});

socket.on('postMessage', (player, message) => {
  store.dispatch(postMessage(player, message));
});

socket.on('pickedMeeple', (meeple, newMeeple, player) => {
  store.dispatch(selectMeeple(meeple, newMeeple, player));
});

socket.on('botsPlay', () => {
  store.dispatch(playingWithBots())
})

socket.on('newHost', (players) => {
  store.dispatch(newHost(players))
})

socket.on('changeGameState', state => {
  store.dispatch(changeGameState(state))
})

socket.on('hostLeft', () => {
  store.dispatch(hostLeft(true))
  store.dispatch(resetState())
})

socket.on('playerLeft', (newMeeples, newPlayers) => {
  store.dispatch(playerLeft(newMeeples, newPlayers))
})

socket.on('removeMeepleScore', () => {
  store.dispatch(removeAndScore())
})

export default socket;
