
const socket = io()


import PersonalDeck from './player-deck'

let playerDeck = new PersonalDeck()



const joinGame = document.getElementById('joinGame')
const waiting = document.getElementById('waiting')
const you = document.getElementById('you')
const opponent = document.getElementById('opponent')
const gameRoom = document.getElementById('gameRoom')
const playerDrawPile = document.getElementById('playerDrawPile')


joinGame.addEventListener('click', addToQueue)


function addToQueue () {
  socket.emit('addToQueue')
  waiting.style.display = 'block'
  waiting.innerText = 'waiting to join game'
    
}

socket.on('playerReady', (player) => {
  waiting.style.display = 'block'
  waiting.innerText = `${player.player} is waiting to play`
})

socket.on('startingGame', (player) => {
  waiting.style.display = 'none'
  you.innerText = `You: ${player.you}`
  gameRoom.innerText = `${player.room}`
})

socket.on('opponent', (player) => {
  opponent.innerText = `Opponent: ${player.opponent}`
})

socket.on('clearWaitingRoom', () => {
  waiting.style.display = 'none'
})





