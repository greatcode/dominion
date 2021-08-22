
const socket = io()

const joinGameButton = document.getElementById('joinGameButton')
const leaveWaitingRoomButton = document.getElementById('leaveWaitingRoom')
const drawHandButton = document.getElementById('drawHandButton')
const discardButton = document.getElementById('discardButton')
const waiting = document.getElementById('waiting')
const gameRoom = document.getElementById('gameRoom')
const opponent = document.getElementById('opponent')
const opponentDrawPile = document.getElementById('opponentDrawPile')
const opponentHand = document.getElementById('opponentHand')
const opponentDiscardPile = document.getElementById('opponentDiscardPile')
const you = document.getElementById('you')
const yourDrawPile = document.getElementById('yourDrawPile')
const yourHand = document.getElementById('yourHand')
const yourDiscardPile = document.getElementById('yourDiscardPile')


joinGameButton.addEventListener('click', addToQueue)
leaveWaitingRoomButton.addEventListener('click', exitWaitingRoom)
drawHandButton.addEventListener('click', drawHand)
discardButton.addEventListener('click', toDiscardPile)


function addToQueue () {
  socket.emit('addToQueue')
  waiting.innerText = 'waiting to join game'
  joinGameButton.style.display = 'none'
  leaveWaitingRoomButton.style.display = 'block'
}

function exitWaitingRoom () {
  socket.emit('leaveWaitingRoom')
  waiting.innerText = ''
  joinGameButton.style.display = 'block'
  leaveWaitingRoomButton.style.display = 'none'

}


function toDiscardPile (){
  socket.emit('discardHand', gameRoom.innerText)
  discardButton.style.display = 'none'
  drawHandButton.style.display = 'block'
}

function drawHand (){
  socket.emit('drawHand', gameRoom.innerText)
  discardButton.style.display = 'block'
  drawHandButton.style.display = 'none'
}

socket.on('playerReady', (player) => {
  waiting.innerText = `${player.player} is waiting to play`
})

socket.on('startingGame', (player) => {
  you.innerText = `Monarch_${player.you}`
  opponent.innerText = `Monarch_${player.opponentId}`
  gameRoom.innerText = `${player.room}`
  waiting.style.display = 'none'
  leaveWaitingRoomButton.style.display = 'none'
  drawHandButton.style.display = 'block'
  socket.emit('startingPile', gameRoom.innerText)
})

socket.on('drawPileUpdate', (pile) => {
  yourDrawPile.innerText = `Draw Pile: ${pile} cards`
})
socket.on('opponentPile', (pile) => {
  opponentDrawPile.innerText = `Opponent Draw Pile: ${pile} cards`
})

socket.on('handUpdate', (hand) => {
  yourHand.innerText = `Your Hand: ${hand}`
})
socket.on('opponentHand', (hand) => {
  opponentHand.innerText = `Opponent Hand: ${hand}`
})

socket.on('discardPileUpdate', (discardPile) => {
  yourDiscardPile.innerText = `Discard Pile: ${discardPile} cards`
})
socket.on('opponentDiscard', (discardPile) => {
  opponentDiscardPile.innerText = `Opponent Discard Pile: ${discardPile} cards`
})


socket.on('clearWaitingRoom', () => {
  waiting.innerText = ''
})





