
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
const supply = document.getElementById('supply')
const supplyCoins = document.getElementById('supplyCoins')
const supplyVictory = document.getElementById('supplyVictory')


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

function playCard (e) {
  console.log(this.id)
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
  supply.style.display = 'block'
  socket.emit('startingPile', gameRoom.innerText)
})


socket.on('updatePlayerCards', (playerCards) => {
  yourDrawPile.innerText = `Draw Pile: ${playerCards.drawPile.length} cards`
  yourHand.innerText = 'Your Hand:'
  let card_num = 0
  playerCards.hand.forEach(card => {
    card_num++
    if (card[1] == 'vc') {
      const cardElement = document.createElement('p')
      cardElement.classList.add('playingCards')
      cardElement.innerText = card[0]
      yourHand.append(cardElement)
    }
    else {
      let div_num = String(card_num)
      const cardElement = document.createElement('button')
      cardElement.id = `${div_num}`
      cardElement.classList.add('playingCards')
      cardElement.innerText = card[0]
      cardElement.addEventListener('click', playCard)
      yourHand.append(cardElement)
    }
  });
  yourDiscardPile.innerText = `Discard Pile: ${playerCards.discardPile.length} cards`
})

socket.on('updateOpponentCards', (opponentCards) => {
  opponentDrawPile.innerText = `Opponent Draw Pile: ${opponentCards.drawPile.length} cards`
  opponentHand.innerText = `Opponent Hand: ${opponentCards.hand.length}`
  opponentDiscardPile.innerText = `Opponent Discard Pile: ${opponentCards.discardPile.length} cards`
})

socket.on('updateSupply', (supplyCards) => {
  for (const [key, value] of Object.entries(supplyCards.coinCards)) {
    const cardElement = document.createElement('p')
    cardElement.innerText = `
    ${key}: amount:${value.amount}, value:${value.value}, cost:${value.cost}`
    supplyCoins.append(cardElement)
  }
  for (const [key, value] of Object.entries(supplyCards.victoryCards)) {
    const cardElement = document.createElement('p')
    cardElement.innerText = `
    ${key}: amount:${value.amount}, value:${value.points}, cost:${value.cost}`
    supplyVictory.append(cardElement)
  }

})


socket.on('clearWaitingRoom', () => {
  waiting.innerText = ''
})





