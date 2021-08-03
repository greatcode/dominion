import { PersonalDeck } from "./player-deck.js"

const socket = io()

const yourDeck = new PersonalDeck()


const joinGame = document.getElementById('joinGame')
const waiting = document.getElementById('waiting')
const you = document.getElementById('you')
const opponent = document.getElementById('opponent')
const gameRoom = document.getElementById('gameRoom')
const opponentDrawPile = document.getElementById('opponentDrawPile')
const opponentHand = document.getElementById('opponentHand')
const yourDrawPile = document.getElementById('yourDrawPile')
const yourHand = document.getElementById('yourHand')
const drawHandButton = document.getElementById('drawHandButton')




joinGame.addEventListener('click', addToQueue)
drawHandButton.addEventListener('click', drawHand)


function addToQueue () {
  socket.emit('addToQueue')
  waiting.style.display = 'block'
  waiting.innerText = 'waiting to join game'
    
}

function updateDrawPile (){
  yourDrawPile.innerText = `Draw Pile: ${yourDeck.drawPile.length} cards`
  socket.emit('drawPile', {
    'pile': yourDeck.drawPile.length,
    'room': gameRoom.innerText 
  })
}

function drawHand (){
  if (yourDeck.drawPile.length >= 3) {
    for (let i = 1; i <= 3; i++) {
      yourDeck.hand.push(yourDeck.drawPile.pop())
    }
    yourHand.innerText = `Your Hand: ${yourDeck.hand}`
    socket.emit('currentHand', {
      'hand': yourDeck.hand,
      'room': gameRoom.innerText
    })
  }
}

socket.on('playerReady', (player) => {
  waiting.style.display = 'block'
  waiting.innerText = `${player.player} is waiting to play`
})

socket.on('startingGame', (player) => {
  waiting.style.display = 'none'
  you.innerText = `You: ${player.you}`
  gameRoom.innerText = `${player.room}`
  drawHandButton.style.display = 'block'
  yourDeck.createStartingPile()
  updateDrawPile()
})

socket.on('opponent', (player) => {
  opponent.innerText = `Opponent: ${player.opponent}`
})

socket.on('opponentPile', (pile) => {
  opponentDrawPile.innerText = `Opponent Draw Pile: ${pile.pile} cards`
})

socket.on('opponentHand', (hand) => {
  opponentHand.innerText = `Opponent Hand: ${hand.hand}`
})

socket.on('clearWaitingRoom', () => {
  waiting.style.display = 'none'
})





