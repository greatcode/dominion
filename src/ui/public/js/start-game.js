
const socket = io()

const joinGameButton = document.getElementById('joinGameButton')
const leaveWaitingRoomButton = document.getElementById('leaveWaitingRoom')
const discardButton = document.getElementById('discardButton')
const finishDiscardButton = document.getElementById('finishDiscardButton')
const discardMoatCardButton = document.getElementById('discardMoatCardButton')
const keepMoatCardButton = document.getElementById('keepMoatCardButton')
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
const supplyAction = document.getElementById('supplyAction')





joinGameButton.addEventListener('click', addToQueue)
leaveWaitingRoomButton.addEventListener('click', exitWaitingRoom)
discardButton.addEventListener('click', toDiscardPile)
finishDiscardButton.addEventListener('click', finishSelectDiscard)
discardMoatCardButton.addEventListener('click', discardMoatToAvoidAttack)
keepMoatCardButton.addEventListener('click', keepMoatAndTakeAttack)

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
  socket.emit('playingCard', this.id)
}

function buyCard (e) {
  socket.emit('buyingCard', this.id)
}

function attackDiscard (e) {
  socket.emit('selectedAttackDiscard', this.id)
}

function discardCard (e) {
  socket.emit('discardSelectedCards', this.id)
}

function discardMoatToAvoidAttack(){
  discardMoatCardButton.style.display = 'none'
  keepMoatCardButton.style.display = 'none'
  socket.emit('avoidAttack')
}

function keepMoatAndTakeAttack(){
  discardMoatCardButton.style.display = 'none'
  keepMoatCardButton.style.display = 'none'
  socket.emit('takeAttack')
}

function toDiscardPile (){
  socket.emit('discardHand')
  discardButton.style.display = 'none'
  yourPlayTracker.style.display = 'none'
  opponentPlayTracker.style.display = 'block'
}

function finishSelectDiscard (){
  socket.emit('finishDiscard')
  finishDiscardButton.style.display = 'none'
}

function selectAttackDiscard({divNum, cardName}){
  const cardElement = document.createElement('button')
  cardElement.id = `${divNum}`
  cardElement.classList.add('playingCards')
  cardElement.innerText = cardName
  cardElement.addEventListener('click', attackDiscard)
  yourHand.append(cardElement)
}


function selectToDiscard({divNum, cardName}){
  const cardElement = document.createElement('button')
  cardElement.id = `${divNum}`
  cardElement.classList.add('playingCards')
  cardElement.innerText = cardName
  cardElement.addEventListener('click', discardCard)
  yourHand.append(cardElement)

}

function activeCardHand({divNum, cardName}){
  const cardElement = document.createElement('button')
      cardElement.id = `${divNum}`
      cardElement.classList.add('playingCards')
      cardElement.innerText = cardName
      cardElement.addEventListener('click', playCard)
      yourHand.append(cardElement)
}

function inactiveCardHand (cardName){
  const cardElement = document.createElement('p')
      cardElement.classList.add('playingCards')
      cardElement.innerText = cardName
      yourHand.append(cardElement)
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
  discardButton.style.display = 'none'
  yourHand.innerText = 'Your Hand:'
  for (let card of playerCards.hand) {
    inactiveCardHand(card[CARD_VALUES.NAME])
  }
  yourPlayingHand.innerText = `Played Cards:`
  
  yourPlayTracker.style.display = 'none'
  opponentPlayTracker.style.display = 'block'
  yourDiscardPile.innerText = `Discard Pile: ${playerCards.discardPile.length} cards`
})

socket.on('attackDiscard', ({playerCards, mustDiscard}) =>{
  discardButton.style.display = 'none'
  yourHand.innerText = `You must Discard ${mustDiscard} card(s)`
  playerCards.hand.forEach((card, index) => {
    selectAttackDiscard({
      divNum: String(index),
      cardName: card[CARD_VALUES.NAME]
    })
  })
  yourDiscardPile.innerText = `Discard Pile: ${playerCards.discardPile.length} cards`
})

socket.on('selectCardsToDiscard', ({playerCards, playerPlay}) => {
  discardButton.style.display = 'none'
  finishDiscardButton.style.display = 'block'
  yourHand.innerText = 'Select Cards to Discard:'
  playerCards.hand.forEach((card, index) => {
    selectToDiscard({
      divNum: String(index),
      cardName: card[CARD_VALUES.NAME]
    })
  })
  yourPlayingHand.innerText = `Played Cards:`
    for (let card of playerCards.playedCards) {
      const cardElement = document.createElement('p')
      cardElement.classList.add('playingCards')
      cardElement.innerText = card[CARD_VALUES.NAME]
      yourPlayingHand.append(cardElement)
    }
    
  yourDiscardPile.innerText = `Discard Pile: ${playerCards.discardPile.length} cards`
  yourActionsAvailable.innerText = `Action: ${playerPlay.action}`
})


socket.on('activePlayer', ({playerCards, playerPlay}) => {
  yourDrawPile.innerText = `Draw Pile: ${playerCards.drawPile.length} cards`
  yourHand.innerText = 'Your Hand:'

  discardButton.style.display = 'block'
  console.log(`action: ${playerPlay.action}, inHand:${playerCards.actionInHand}`)
  playerCards.hand.forEach((card, index) => {
    if(playerPlay.action && playerCards.actionInHand) {
      if (card[CARD_VALUES.TYPE] == 'action'){
        activeCardHand({
          divNum: String(index), 
          cardName: card[CARD_VALUES.NAME]
       })
      }
      else{
        inactiveCardHand(card[CARD_VALUES.NAME])
      }
    }
    else if(playerPlay.buy) {
      if (card[CARD_VALUES.TYPE] == 'coin'){
        activeCardHand({
          divNum: String(index), 
          cardName: card[CARD_VALUES.NAME]
       })
      }
      else {
        inactiveCardHand(card[CARD_VALUES.NAME])
      }
    }
    else {
      inactiveCardHand(card[CARD_VALUES.NAME])
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

socket.on('discardMoatQuery', () => {
  discardMoatCardButton.style.display = 'block'
  keepMoatCardButton.style.display = 'block'
})

socket.on('attackOpponent', () => {
  console.log('in attack opponent')
  socket.emit('playerAttacked')
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
  supplyCoins.innerText = 'Coin Cards: '
  for (const [key, value] of Object.entries(supply.coinCards)) {
    if (value.cost <= treasure & value.amount > 0) {
      // console.log(`${key}: ${value.cost}, tr:${treasure}`)
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
    if (value.cost <= treasure & value.amount > 0) {
      // console.log(`${key}: ${value.cost}, tr:${treasure}`)
      const cardElement = document.createElement('button')
      cardElement.id = `${key}`
      cardElement.innerText = `
      ${key}: amount:${value.amount}, value:${value.value}, cost:${value.cost}`
      cardElement.addEventListener('click', buyCard)
      supplyVictory.append(cardElement)
    }
    else {
      const cardElement = document.createElement('p')
      cardElement.innerText = `
      ${key}: amount:${value.amount}, value:${value.value}, cost:${value.cost}`
      supplyVictory.append(cardElement)
    }
  }
  supplyAction.innerText = 'Action Cards: '
  for (const [key, value] of Object.entries(supply.actionCards)) {
    let actions = []
    for (const [actionKey, actionValue] of Object.entries(value.value)) {
      if (actionValue != 0){
        actions.push(`${actionKey}:${actionValue} `)
      }
    }
    if (value.cost <= treasure & value.amount > 0) {
      const cardElement = document.createElement('button')
      cardElement.id = `${key}`
      cardElement.innerText = `
      ${key}: amount:${value.amount}, action: ${actions}, cost:${value.cost}`
      cardElement.addEventListener('click', buyCard)
      supplyAction.append(cardElement)
    }
    else{
      const cardElement = document.createElement('p')
      cardElement.innerText = `
      ${key}: amount:${value.amount}, action: ${actions}, cost:${value.cost}`
      supplyAction.append(cardElement)
    }
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
    ${key}: amount:${value.amount}, value:${value.value}, cost:${value.cost}`
    supplyVictory.append(cardElement)
  }
  supplyAction.innerText = 'Action Cards: '
  for (const [key, value] of Object.entries(supplyCards.actionCards)) {
    let actions = []
    for (const [actionKey, actionValue] of Object.entries(value.value)) {
      if (actionValue != 0){
        actions.push(`${actionKey}:${actionValue} `)
      }
    }
    const cardElement = document.createElement('p')
    cardElement.innerText = `
    ${key}: amount:${value.amount}, action: ${actions}, cost:${value.cost}`
    supplyAction.append(cardElement)
  }

})


socket.on('clearWaitingRoom', () => {
  waiting.innerText = ''
})





