
const socket = io()

const title = document.getElementById('title')
const joinGameButton = document.getElementById('joinGameButton')
const leaveWaitingRoomButton = document.getElementById('leaveWaitingRoom')
const discardButton = document.getElementById('discardButton')
const finishDiscardButton = document.getElementById('finishDiscardButton')
const showMoatCardButton = document.getElementById('showMoatCardButton')
const doNotShowMoatCardButton = document.getElementById('doNotShowMoatCardButton')
const waiting = document.getElementById('waiting')
const gameRoom = document.getElementById('gameRoom')
const opponent = document.getElementById('opponent')
const opponentVictoryPoints = document.getElementById('opponentVictoryPoints')
const opponentDrawPile = document.getElementById('opponentDrawPile')
const opponentHand = document.getElementById('opponentHand')
const showMoatCard = document.getElementById('showMoatCard')
const opponentDiscardPile = document.getElementById('opponentDiscardPile')
const opponentPlayingHand = document.getElementById('opponentPlayingHand')
const opponentPlayTracker = document.getElementById('opponentPlayTracker')
const opponentActionsAvailable = document.getElementById('opponentActionsAvailable')
const opponentBuysAvailable = document.getElementById('opponentBuysAvailable')
const opponentTreasure = document.getElementById('opponentTreasure')
const you = document.getElementById('you')
const yourVictoryPoints = document.getElementById('yourVictoryPoints')
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
showMoatCardButton.addEventListener('click', showMoatToAvoidAttack)
doNotShowMoatCardButton.addEventListener('click', doNotShowMoatAndTakeAttack)

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

function showMoatToAvoidAttack(){
  showMoatCardButton.style.display = 'none'
  doNotShowMoatCardButton.style.display = 'none'
  socket.emit('avoidAttack')
}

function doNotShowMoatAndTakeAttack(){
  showMoatCardButton.style.display = 'none'
  doNotShowMoatCardButton.style.display = 'none'
  socket.emit('takeAttack')
}

function toDiscardPile (){
  socket.emit('discardHand')
  showMoatCard.style.display = 'none'
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

function createCoinAndVCSupplyCards(key, value, type, active){
  const cardElement = document.createElement('div')
  cardElement.className = 'card'
  const imageElement = document.createElement('img')
  imageElement.className = 'card-img'
  imageElement.src = '/static/img/base_bg.png'
  const detailElement = document.createElement('div')
  detailElement.className = 'card-img-overlay'
  const titleElement = document.createElement('h5')
  titleElement.className = 'card-title'
  titleElement.innerText = `${key}`
  const quantityElement = document.createElement('p')
  quantityElement.className = 'card-text'
  quantityElement.innerText = `Cards Left: ${value.amount}`
  const valueElement = document.createElement('p')
  valueElement.className = 'card-text'
  valueElement.innerText = `Value: ${value.value}`
  const costElement = document.createElement('p')
  costElement.className = 'card-text'
  costElement.innerText = `Cost ${value.cost}`
  detailElement.append(titleElement)
  detailElement.append(quantityElement)
  detailElement.append(valueElement)
  detailElement.append(costElement)
  if(active){
  const buyButton = document.createElement('button')
  buyButton.className = 'card-text'
  buyButton.id = `${key}`
  buyButton.innerText = 'Buy Card'
  buyButton.addEventListener('click', buyCard)
  detailElement.append(buyButton)
  }
  cardElement.append(imageElement)
  cardElement.append(detailElement)
  if(type == 'coin'){
  supplyCoins.append(cardElement)
  return;
  }
  supplyVictory.append(cardElement)      
}

function createActionSupplyCards(key, value, active){
  let actions = []
  for (const [actionKey, actionValue] of Object.entries(value.value)) {
    if (actionValue != 0){
      console.log('adding actions')
      actions.push(`${actionKey}:${actionValue} `)
    }
  }
  const cardElement = document.createElement('div')
  cardElement.className = 'card'
  const imageElement = document.createElement('img')
  imageElement.className = 'card-img'
  imageElement.src = '/static/img/base_bg.png'
  const detailElement = document.createElement('div')
  detailElement.className = 'card-img-overlay'
  const titleElement = document.createElement('h5')
  titleElement.className = 'card-title'
  titleElement.innerText = `${key}`
  const quantityElement = document.createElement('p')
  quantityElement.className = 'card-text'
  quantityElement.innerText = `Cards Left: ${value.amount}`
  const actionElement = document.createElement('p')
  actionElement.className = 'card-text'
  actionElement.innerText = `Actions: ${actions}`
  const costElement = document.createElement('p')
  costElement.className = 'card-text'
  costElement.innerText = `Cost ${value.cost}`
  detailElement.append(titleElement)
  detailElement.append(quantityElement)
  detailElement.append(actionElement)
  detailElement.append(costElement)
  if(active){
  const buyButton = document.createElement('button')
  buyButton.className = 'card-text'
  buyButton.id = `${key}`
  buyButton.innerText = 'Buy Card'
  buyButton.addEventListener('click', buyCard)
  detailElement.append(buyButton)
  }
  cardElement.append(imageElement)
  cardElement.append(detailElement)
  supplyAction.append(cardElement)
}


socket.on('playerReady', (player) => {
  waiting.innerText = `${player.player} is waiting to play`
})

socket.on('startingGame', (player) => {
  you.innerText = `Monarch_${player.you}`
  opponent.innerText = `Monarch_${player.opponentId}`
  gameRoom.innerText = `${player.room}`
  yourVictoryPoints.innerText = `Victory Points: ${player.victoryPoints}`
  opponentVictoryPoints.innerText = `Opponent Victory Points: ${player.victoryPoints}`
  waiting.style.display = 'none'
  leaveWaitingRoomButton.style.display = 'none'
  title.style.display = 'none'
  supply.style.display = 'block'
  socket.emit('startingPile')
})

socket.on('waitingPlayer', ({playerCards, playerVCPoints}) => {
  discardButton.style.display = 'none'
  yourHand.innerText = 'Your Hand:'
  for (let card of playerCards.hand) {
    inactiveCardHand(card[CARD_VALUES.NAME])
  }
  yourPlayingHand.innerText = `Played Cards:`
  
  yourPlayTracker.style.display = 'none'
  opponentPlayTracker.style.display = 'block'
  yourVictoryPoints.innerText = `Your Victory Points ${playerVCPoints}`
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


socket.on('activePlayer', ({playerCards, playerPlay, playerVCPoints}) => {
  yourDrawPile.innerText = `Draw Pile: ${playerCards.drawPile.length} cards`
  yourHand.innerText = 'Your Hand:'

  discardButton.style.display = 'block'
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
  yourVictoryPoints.innerText = `Your Victory Points ${playerVCPoints}`
  yourDiscardPile.innerText = `Discard Pile: ${playerCards.discardPile.length} cards`
  yourActionsAvailable.innerText = `Action: ${playerPlay.action}`
  yourBuysAvailable.innerText = `Buy: ${playerPlay.buy}`
  yourTreasure.innerText = `Treaure: ${playerPlay.treasure}`

  
})

socket.on('showMoatQuery', () => {
  showMoatCardButton.style.display = 'block'
  doNotShowMoatCardButton.style.display = 'block'
})

socket.on('showMoat', (cards) => {
  opponentHand.innerText = `Opponent Hand: ${cards}`
  showMoatCard.style.display = 'block'
})

socket.on('attackOpponent', () => {
  socket.emit('playerAttacked')
})

socket.on('changeTurn', () => {
  socket.emit('myTurn')
})

socket.on('updateOpponent', ({opponentCards, opponentPlay, opponentVCPoints}) => {
  opponentDrawPile.innerText = `Opponent Draw Pile: ${opponentCards.drawPile.length} cards`
  opponentHand.innerText = `Opponent Hand: ${opponentCards.hand.length}`
  opponentVictoryPoints.innerText = `Opponent Victory Points: ${opponentVCPoints}`
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
      createCoinAndVCSupplyCards(key, value,'coin', true)
    }
    else {
      createCoinAndVCSupplyCards(key, value,'coin', false)
    }
    
  }
  supplyVictory.innerText = 'Victory Cards: '
  for (const [key, value] of Object.entries(supply.victoryCards)) {
    if (value.cost <= treasure & value.amount > 0) {
      createCoinAndVCSupplyCards(key, value,'victory', true)
    }
    else {
      createCoinAndVCSupplyCards(key, value,'victory', false)
    }
  }
  supplyAction.innerText = 'Action Cards: '
  for (const [key, value] of Object.entries(supply.actionCards)) {
    // let actions = []
    // for (const [actionKey, actionValue] of Object.entries(value.value)) {
    //   if (actionValue != 0){
    //     actions.push(`${actionKey}:${actionValue} `)
    //   }
    // }
    if (value.cost <= treasure & value.amount > 0) {
      createActionSupplyCards(key, value, true)
      // const cardElement = document.createElement('button')
      // cardElement.id = `${key}`
      // cardElement.innerText = `
      // ${key}: amount:${value.amount}, action: ${actions}, cost:${value.cost}`
      // cardElement.addEventListener('click', buyCard)
      // supplyAction.append(cardElement)
    }
    else{
      createActionSupplyCards(key, value, false)
      // const cardElement = document.createElement('p')
      // cardElement.innerText = `
      // ${key}: amount:${value.amount}, action: ${actions}, cost:${value.cost}`
      // supplyAction.append(cardElement)
    }
  }
})

socket.on('updateSupply', (supplyCards) => {
  supplyCoins.innerText = 'Coin Cards: '
  for (const [key, value] of Object.entries(supplyCards.coinCards)) {
    createCoinAndVCSupplyCards(key, value,'coin', false)
  }
  supplyVictory.innerText = 'Victory Cards: '
  for (const [key, value] of Object.entries(supplyCards.victoryCards)) {
    createCoinAndVCSupplyCards(key, value,'victory', false)
  }
  supplyAction.innerText = 'Action Cards: '
  for (const [key, value] of Object.entries(supplyCards.actionCards)) {
    createActionSupplyCards(key, value, false)
    // let actions = []
    // for (const [actionKey, actionValue] of Object.entries(value.value)) {
    //   if (actionValue != 0){
    //     actions.push(`${actionKey}:${actionValue} `)
    //   }
    // }
    // const cardElement = document.createElement('p')
    // cardElement.innerText = `
    // ${key}: amount:${value.amount}, action: ${actions}, cost:${value.cost}`
    // supplyAction.append(cardElement)
  }

})



socket.on('youWin', ({myPoints, opponentPoints}) => {
  window.alert(`You Win!!! ${myPoints} to ${opponentPoints}`)
})

socket.on('youLose', ({myPoints, opponentPoints}) => {
  window.alert(`Your Empire has fallen: Final Score You:${myPoints}, Foe:${opponentPoints}`)
})

socket.on('tieGame', (points) =>{
  window.alert(`Finally a worthy opponent. The match ends in a Draw ${points} to ${points}`)
})

socket.on('gameComplete', () => {
console.log('gameComplete running')
  socket.emit('gameOver')
})

socket.on('clearWaitingRoom', () => {
  waiting.innerText = ''
})
