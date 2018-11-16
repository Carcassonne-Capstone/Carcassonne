import io from 'socket.io-client'
import store, { createRoom, joinRoom } from './store'


const socket = io(window.location.origin)

socket.on('connect', () => {
    console.log('I am connected')
})

socket.on('roomCreated', (roomId, playerName) => {
    store.dispatch(createRoom(roomId, playerName))
})

socket.on('playerJoined', (playerName) => {
    store.dispatch(joinRoom(playerName))
})

export default socket