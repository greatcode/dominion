
const socket = io()

// const createGame = document.getElementById('createGame')
const joinGame = document.getElementById('joinGame')

// createGame.addEventListener('click', addToWaitingRoom)
joinGame.addEventListener('click', addToGame)

// function addToWaitingRoom () {
//     socket.emit('addToWaitRoom')
// }

function addToGame () {
    socket.emit('addToGame')
}

socket.on('startGame', (roomName) => {
    window.location.href = 'http://localhost:3000/start_game/' + roomName
})