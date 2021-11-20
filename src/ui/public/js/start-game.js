
const socket = io()

const joinGameButton = document.getElementById('joinGameButton')
const leaveWaitingRoomButton = document.getElementById('leaveWaitingRoom')
const discardButton = document.getElementById('discardButton')
const waiting = document.getElementById('waiting')
const gameRoom = document.getElementById('gameRoom')
const opponent = document.getElementById('opponent')
const opponentDrawPile = document.getElementById('opponentDrawPile')
const opponentHand = document.getElementById('opponentHand')
const opponentDiscardPile = document.getElementById('opponentDiscardPile')
const opponentPlayingHand = document.getElementById('opponentPlayingHand')
const opponentPlayTracker = document.getElementById('opponentPlayTracker')
const opponentActionsAvailable = document.getElementById('opponentActionsAvailable')
const opponentBuysAvailable = document.getElementById('opponentBuysAvailable')
const opponentTreasure = document.getElementById('opponentTreasure')
const you = document.getElementById('you')
const yourDrawPile = document.getElementById('yourDrawPile')
const yourHand = document.getElementById('yourHand')
const yourDiscardPile = document.getElementById('yourDiscardPile')
const yourPlayingHand = document.getElementById('yourPlayingHand')
const yourPlayTracker = document.getElementById('yourPlayTracker')
const yourActionsAvailable = document.getElementById('yourActionsAvailable')
const yourBuysAvailable = document.getElementById('yourBuysAvailable')
const yourTreasure = document.getElementById('yourTreasure')
const supply = document.getElementById('supply')
const supplyCoins = document.getElementById('supplyCoins')
const supplyVictory = document.getElementById('supplyVictory')





joinGameButton.addEventListener('click', addToQueue)
leaveWaitingRoomButton.addEventListener('click', exitWaitingRoom)
discardButton.addEventListener('click', toDiscardPile)

const CARD_VALUES = {
  NAME: 0,
  TYPE: 1,
  Value: 2
}



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
  socket.emit('playingCard', this.id)
}

function buyCard (e) {
  console.log(`buying card: ${this.id}`)
  socket.emit('buyingCard', this.id)
}

function toDiscardPile (){
  socket.emit('discardHand')
  discardButton.style.display = 'none'
  yourPlayTracker.style.display = 'none'
  opponentPlayTracker.style.display = 'block'
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
  supply.style.display = 'block'
  socket.emit('startingPile')
})

socket.on('waitingPlayer', ({playerCards, playerPlay}) => {
  yourHand.innerText = 'Your Hand:'
  for (let card of playerCards.hand) {
    const cardElement = document.createElement('p')
      cardElement.classList.add('playingCards')
      cardElement.innerText = card[CARD_VALUES.NAME]
      yourHand.append(cardElement)
  }
  yourPlayingHand.innerText = `Played Cards:`
  
  yourPlayTracker.style.display = 'none'
  opponentPlayTracker.style.display = 'block'
  yourDiscardPile.innerText = `Discard Pile: ${playerCards.discardPile.length} cards`
})


socket.on('activePlayer', ({playerCards, playerPlay}) => {
  yourDrawPile.innerText = `Draw Pile: ${playerCards.drawPile.length} cards`
  yourHand.innerText = 'Your Hand:'

  discardButton.style.display = 'block'
  playerCards.hand.forEach((card, index) => {
    if (card[CARD_VALUES.TYPE] == 'vc') {
      const cardElement = document.createElement('p')
      cardElement.classList.add('playingCards')
      cardElement.innerText = card[CARD_VALUES.NAME]
      yourHand.append(cardElement)
    }
    else {
      let div_num = String(index)
      const cardElement = document.createElement('button')
      cardElement.id = `${div_num}`
      cardElement.classList.add('playingCards')
      cardElement.innerText = card[CARD_VALUES.NAME]
      cardElement.addEventListener('click', playCard)
      yourHand.append(cardElement)
    }
  });

  yourPlayingHand.innerText = `Played Cards:`
    for (let card of playerCards.playedCards) {
      const cardElement = document.createElement('p')
      cardElement.classList.add('playingCards')
      cardElement.innerText = card[CARD_VALUES.NAME]
      yourPlayingHand.append(cardElement)
    }

  yourPlayTracker.style.display = 'block'
  opponentPlayTracker.style.display = 'none'
  yourDiscardPile.innerText = `Discard Pile: ${playerCards.discardPile.length} cards`
  yourActionsAvailable.innerText = `Action: ${playerPlay.action}`
  yourBuysAvailable.innerText = `Buy: ${playerPlay.buy}`
  yourTreasure.innerText = `Treaure: ${playerPlay.treasure}`

  
})

socket.on('changeTurn', () => {
  socket.emit('myTurn')
})

socket.on('updateOpponent', ({opponentCards, opponentPlay}) => {
  opponentDrawPile.innerText = `Opponent Draw Pile: ${opponentCards.drawPile.length} cards`
  opponentHand.innerText = `Opponent Hand: ${opponentCards.hand.length}`
  opponentPlayingHand.innerText = `Played Cards:`
  for (let card of opponentCards.playedCards) {
    const cardElement = document.createElement('p')
    cardElement.classList.add('playingCards')
    cardElement.innerText = card[CARD_VALUES.NAME]
    opponentPlayingHand.append(cardElement)
  }
  
  opponentDiscardPile.innerText = `Opponent Discard Pile: ${opponentCards.discardPile.length} cards`
  opponentActionsAvailable.innerText = `Opponent Action: ${opponentPlay.action}`
  opponentBuysAvailable.innerText = `Opponent Buy: ${opponentPlay.buy}`
  opponentTreasure.innerText = `Opponent Treaure: ${opponentPlay.treasure}`
  
})

socket.on('activeSupply', ({supply, treasure}) => {
  console.log(`treasure: ${treasure}`)
  supplyCoins.innerText = 'Coin Cards: '
  for (const [key, value] of Object.entries(supply.coinCards)) {
    if (value.cost <= treasure & value.amount > 0) {
      console.log(`${key}: ${value.cost}, tr:${treasure}`)
      const cardElement = document.createElement('button')
      cardElement.id = `${key}`
      cardElement.innerText = `
      ${key}: amount:${value.amount}, value:${value.value}, cost:${value.cost}`
      cardElement.addEventListener('click', buyCard)
      supplyCoins.append(cardElement)
    }
    else {
      const cardElement = document.createElement('p')
      cardElement.innerText = `
      ${key}: amount:${value.amount}, value:${value.value}, cost:${value.cost}`
      supplyCoins.append(cardElement)
    }
    
  }
  supplyVictory.innerText = 'Victory Cards: '
  for (const [key, value] of Object.entries(supply.victoryCards)) {
    const cardElement = document.createElement('p')
    cardElement.innerText = `
    ${key}: amount:${value.amount}, value:${value.points}, cost:${value.cost}`
    supplyVictory.append(cardElement)
  }
})

socket.on('updateSupply', (supplyCards) => {
  supplyCoins.innerText = 'Coin Cards: '
  for (const [key, value] of Object.entries(supplyCards.coinCards)) {
    const cardElement = document.createElement('p')
    cardElement.innerText = `
    ${key}: amount:${value.amount}, value:${value.value}, cost:${value.cost}`
    supplyCoins.append(cardElement)
  }
  supplyVictory.innerText = 'Victory Cards: '
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





