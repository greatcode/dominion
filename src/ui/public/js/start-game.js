
const socket = io()


const joinGame = document.getElementById('joinGame')
const waiting = document.getElementById('waiting')
const you = document.getElementById('you')
const opponent = document.getElementById('opponent')
const gameRoom = document.getElementById('gameRoom')

joinGame.addEventListener('click', addToQueue)


function addToQueue () {
    socket.emit('addToQueue')
    waiting.style.display = 'block'
    waiting.innerText = 'waiting to join game'
    
}

function showCard () {
    thisRoom = document.getElementById('gameRoom').innerText
    socket.emit('showCard', thisRoom)
}

socket.on('playerReady', (player) => {
   waiting.style.display = 'block'
   waiting.innerText = `${player.player} is waiting to play`
})

socket.on('startingGame', (player) => {
    waiting.style.display = 'none'
    you.innerText = `You: ${player.you}`
    gameRoom.innerText = `${player.room}`
    playCard.style.display = 'block'
})

socket.on('opponent', (player) => {
    opponent.innerText = `Opponent: ${player.opponent}`
})

socket.on('clearWaitingRoom', () => {
    waiting.style.display = 'none'
})





