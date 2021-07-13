
const socket = io()

// const createGame = document.getElementById('createGame')
const joinGame = document.getElementById('joinGame')

// createGame.addEventListener('click', addToWaitingRoom)
joinGame.addEventListener('click', addToQueue)

// function addToWaitingRoom () {
//     socket.emit('addToWaitRoom')
// }

function addToQueue () {
    socket.emit('addToQueue')
}

socket.on('startGame', (roomName) => {
    window.location.href = 'http://localhost:3000/start_game/' + roomName
})