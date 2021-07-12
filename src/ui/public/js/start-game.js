
const socket = io()

const createGame = document.getElementById('createGame')
const joinGame = document.getElementById('joinGame')

createGame.addEventListener('click', addToWaitingRoom)
joinGame.addEventListener('click', addToGame)

function addToWaitingRoom () {
    socket.emit('addToWaitRoom')
}

function addToGame () {
    socket.emit('addToGame')
}