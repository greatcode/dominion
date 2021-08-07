import { PersonalDeck } from "./player-deck.js"

const socket = io()

const yourDeck = new PersonalDeck()


const joinGameButton = document.getElementById('joinGameButton')
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
drawHandButton.addEventListener('click', drawHand)
discardButton.addEventListener('click', toDiscardPile)


function addToQueue () {
  socket.emit('addToQueue')
  waiting.style.display = 'block'
  waiting.innerText = 'waiting to join game'
    
}

function updateDrawPile (){
  yourDrawPile.innerText = `Draw Pile: ${yourDeck.drawPile.length} cards`
  socket.emit('drawPile', {
    'emitPile': yourDeck.drawPile.length,
    'room': gameRoom.innerText 
  })
}

function updateHand () {
  yourHand.innerText = `Your Hand: ${yourDeck.hand}`
    socket.emit('currentHand', {
      'emitHand': yourDeck.hand,
      'room': gameRoom.innerText
    })
}

function updateDiscardPile () {
  yourDiscardPile.innerText = `Discard Pile: ${yourDeck.discardPile.length} cards`
  socket.emit('discardPile', {
    'emitDiscard' : yourDeck.discardPile.length,
    'room': gameRoom.innerText
  })
}

function toDiscardPile (){
  yourDeck.discard()
  updateDiscardPile()
  updateHand()
  discardButton.style.display = 'none'
  drawHandButton.style.display = 'block'
}

function drawHand (){
  const CARDS_NEEDED_TO_DRAWHAND = 3
  if (yourDeck.drawPile.length >= CARDS_NEEDED_TO_DRAWHAND) {
    for (let i = 1; i <= CARDS_NEEDED_TO_DRAWHAND; i++) {
      yourDeck.drawCard()
    }
    updateHand()
    updateDrawPile()
    discardButton.style.display = 'block'
    drawHandButton.style.display = 'none'

  }
  else {
    yourDeck.replinishDrawPile()
    updateDrawPile()
    updateDiscardPile()
    drawHand()
  }
}

socket.on('playerReady', (player) => {
  waiting.innerText = `${player.player} is waiting to play`
})

socket.on('startingGame', (player) => {
  you.innerText = `You: ${player.you}`
  gameRoom.innerText = `${player.room}`
  drawHandButton.style.display = 'block'
  yourDeck.createStartingPile()
  updateDrawPile()
})

socket.on('opponent', (player) => {
  opponent.innerText = `Opponent: ${player.opponent}`
  waiting.style.display = 'none'
})

socket.on('opponentPile', (pile) => {
  opponentDrawPile.innerText = `Opponent Draw Pile: ${pile.servePile} cards`
})

socket.on('opponentHand', (hand) => {
  opponentHand.innerText = `Opponent Hand: ${hand.serveHand}`
})

socket.on('opponentDiscard', (pile) => {
  opponentDiscardPile.innerText = `Opponent Discard Pile: ${pile.serveDiscardPile} cards`
})

socket.on('clearWaitingRoom', () => {
  waiting.innerText = ''
})





