
const socket = io()


const joinGame = document.getElementById('joinGame')
const waiting = document.getElementById('waiting')
const you = document.getElementById('you')
const opponent = document.getElementById('opponent')

joinGame.addEventListener('click', addToQueue)


function addToQueue () {
    socket.emit('addToQueue')
    waiting.innerText = 'waiting to join game'
    
}

socket.on('playerReady', (player) => {
   waiting.innerText = `${player.player} is waiting to play`
})

socket.on('startingGame', (player) => {
    waiting.style.display = 'none'
    you.innerText = `You: ${player.you}`
})

socket.on('opponent', (player) => {
    opponent.innerText = `Opponent: ${player.opponent}`
})


