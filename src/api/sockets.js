//

const path = require('path')
const { report } = require('process')
const PersonalDeck = require(path.join(__dirname, './game/player-deck.js'))
// const SupplyCards = require(path.join(__dirname, './game/supply-cards.js'))
const Game = require(path.join(__dirname, './game/game.js'))
const CardsInPlay = require(path.join(__dirname, './game/cards-in-play.js'))
const ActionHandler = require(path.join(__dirname, './game/action.js'))


let waitingRooms = []
let activeRooms = {}
let socketGame = {}
// [gameRoom] = [socket, socket]
// [gameRoom] = { supply, players: [socket, socket] }
// [gameRoom] = supply

/**
 * Room
 *  Two Players
 *  All Cards
 *  Positioning of Cards
 *  Value of cards in play
 *  Game
 *  Points / Score
 *  
 * [gameRoom] = {
 *   game: {
 *     players: [
 *       {socket, cards}
       ]
 *     supply cards
 *   }
 * }
 */

let room = 0

const CARD_VALUES = {
  NAME: 0,
  TYPE: 1,
  VALUE: 2,
}

function onConnection(socket) {
  console.log('A user connected')

  const playerDeck = new PersonalDeck()
  const cardsInPlay = new CardsInPlay()
  const actionHandler = new ActionHandler()

  // myRoom = activeRooms.filter((room) => // socket.id room.game.players.contains...)

  function updatePlayer (roomNumber, turn=true) {
    socket.to(roomNumber).emit('updateOpponent', {
      opponentCards: playerDeck,
      opponentPlay: cardsInPlay
    })

    if (turn) {
      socket.emit('activePlayer', {
        playerCards: playerDeck,
        playerPlay: cardsInPlay,

      })
    }
    
    else {
      socket.emit('waitingPlayer', {
        playerCards: playerDeck,
        playerPlay: cardsInPlay,
      })
    }
  }

  function updateSupplyCards (roomNumber, supply) {
    console.log(`buy: ${cardsInPlay.buy}, socket: ${socket.id}`)
    if (cardsInPlay.buy > 0) {
      console.log('in cards in play')
      socket.emit('activeSupply', {
        supply: supply,
        treasure: cardsInPlay.treasure
      })
    }
    else {
      socket.emit('updateSupply', supply)
    }
  
    socket.to(roomNumber).emit('updateSupply', supply)
  }

  function deactivateSupply(roomNumber, supply) {
    socket.emit('updateSupply', supply)
    socket.to(roomNumber).emit('updateSupply', supply)
  }

  function selectToDiscard() {
    socket.emit('selectCardsToDiscard', {
      playerCards: playerDeck,
      playerPlay: cardsInPlay,
    })
  }

  function attacked(){
    deactivateSupply(socketGame[socket.id], activeRooms[socketGame[socket.id]].supply.supplyCards)
    if (activeRooms[socketGame[socket.id]].attack == 'Militia') {
      const DISCARDTO = 3
      if (playerDeck.hand.length > DISCARDTO) {
        console.log('in player attack discard')
        actionHandler.forcedToDiscard = playerDeck.hand.length - DISCARDTO
        attackDiscard()
      }
      else{
        socket.to(socketGame[socket.id]).emit('changeTurn')
      }
    }
  }

  function attackDiscard() {
    socket.emit('attackDiscard', {
      playerCards: playerDeck,
      mustDiscard: actionHandler.forcedToDiscard
    })
  }




  // Whenever someone disconnects this piece of code executes
  socket.on('disconnect', function () {
    console.log('A user disconnected')
  })

  socket.on('addToQueue', () => {
    const PLAYERS_PER_GAME = 2
    if (!waitingRooms.includes(socket)) {
      waitingRooms.push(socket)

      if (waitingRooms.length >= PLAYERS_PER_GAME) {
        room++
        gameRoom = 'room' + room
        // const supplyCards = new SupplyCards()
        // const supply = supplyCards;
        const players = [waitingRooms.pop(), waitingRooms.pop()]
        activeRooms[gameRoom] = new Game(gameRoom, players)
        activeGame = activeRooms[gameRoom]
        console.log(`game_room: ${activeGame._room}`)
        if (waitingRooms.length == 0) {
          socket.broadcast.emit('clearWaitingRoom')
        }
        else {
          socket.broadcast.emit('playerReady', {
            player: waitingRooms[0].id
          })
        }
        for (const i in activeGame._monarchs) {
          player = activeGame._monarchs[i]
          opponent = activeGame._monarchs.filter(players => players != player)
          player.join(gameRoom)
          player.emit('startingGame', {
            you: player.id,
            opponentId: opponent[0].id,
            room: gameRoom
          })
          socketGame[player.id] = gameRoom
        }

        // updateSupplyCards(gameRoom, activeGame.supply.supplyCards)
      }
      else {
        socket.broadcast.emit('playerReady', {player: socket.id})
      }
    }
  })

  socket.on('leaveWaitingRoom', () => {
    const socketToRemove = waitingRooms.indexOf(socket)
    const removeSocket = waitingRooms.splice(socketToRemove, 1);
    socket.broadcast.emit('clearWaitingRoom')
  })

  socket.on('startingPile', () => {
    playerDeck.createStartingPile()
    playerDeck.drawHand()
    if (activeRooms[socketGame[socket.id]].playingMonarch == socket) {
      updatePlayer(socketGame[socket.id])
      updateSupplyCards(socketGame[socket.id], activeRooms[socketGame[socket.id]].supply.supplyCards)
    }
    else {
      updatePlayer(socketGame[socket.id], false)
    }
  })
  

  socket.on('discardHand', () => {
    playerDeck.discard()
    cardsInPlay.resetTracker()
    playerDeck.drawHand()
    updatePlayer(socketGame[socket.id], false)
    socket.to(socketGame[socket.id]).emit('changeTurn')
  })

  socket.on('selectedAttackDiscard', (card_id) => {
    playerDeck.selectDiscard(card_id)
    actionHandler.decreaseForcedToDiscard()
    if(actionHandler.forcedToDiscard){
      attackDiscard()
    }
    else{
      activeRooms[socketGame[socket.id]].clearPlayerAttack()
      updatePlayer(socketGame[socket.id], false)
      socket.to(socketGame[socket.id]).emit('changeTurn')
    }
  })



  socket.on('discardSelectedCards', (card_id) => {
    playerDeck.selectDiscard(card_id)
    selectToDiscard()
  })

  socket.on('finishDiscard', () => {
    if(actionHandler.redrawCards) {
      const cardsToDraw = actionHandler.cardsBeforeDiscard - playerDeck.hand.length
      for (let i = 1; i <= cardsToDraw; i++) {
        playerDeck.drawCard()
      }
      actionHandler.noRedrawAfterDiscard()
      actionHandler.lengthHandBeforeDiscard(0)
      updatePlayer(socketGame[socket.id])
    }
  })



  socket.on('playingCard', (card_id) => {
    playerDeck.playCards(card_id)
    lastCard = playerDeck.playedCards.length - 1
    const playedCard = playerDeck.playedCards[lastCard]
    const actionCheck = activeRooms[socketGame[socket.id]].supply.supplyCards.actionCards
    if (Object.keys(actionCheck).includes(playedCard[CARD_VALUES.NAME])) {
      console.log(`ActionCheck: ${playedCard[CARD_VALUES.NAME]}`)
      const cardValues = playedCard[CARD_VALUES.VALUE]
      cardsInPlay.actionPlayed(cardValues)
      if (cardValues.card > 0){
        for(let i=1; i <= cardValues.card; i++) {
          playerDeck.drawCard()
        }
      }
      if(playedCard[CARD_VALUES.NAME] == 'Cellar'){
        actionHandler.lengthHandBeforeDiscard(playerDeck.hand.length)
        actionHandler.redrawAfterDiscard()
        selectToDiscard()
        
      }
      else if(playedCard[CARD_VALUES.NAME] == 'Militia'){
        activeRooms[socketGame[socket.id]].playerAttacked(playedCard[CARD_VALUES.NAME])
        updatePlayer(socketGame[socket.id], false)
        socket.to(socketGame[socket.id]).emit('attackOpponent')
        
      }
      else {
        updatePlayer(socketGame[socket.id])
        updateSupplyCards(socketGame[socket.id], activeRooms[socketGame[socket.id]].supply.supplyCards)
      }
    }
    else {
      cardsInPlay.treasurePlayed(playedCard[CARD_VALUES.VALUE])
      updatePlayer(socketGame[socket.id])
      updateSupplyCards(socketGame[socket.id], activeRooms[socketGame[socket.id]].supply.supplyCards)
    }
  })

  socket.on('playerAttacked', () => {
    deactivateSupply(socketGame[socket.id], activeRooms[socketGame[socket.id]].supply.supplyCards)
    
    if(playerDeck.moatInHand){
      socket.emit('discardMoatQuery')
    }
    else{
      attacked()
    }
  })

  socket.on('avoidAttack', () => {
    moatIndex = ''
    playerDeck.hand.forEach((card, index) => {
      if(card[CARD_VALUES.NAME] == 'Moat'){
        moatIndex = index
      }
    })
    playerDeck.selectDiscard(moatIndex)
    updatePlayer(socketGame[socket.id], false)
    socket.to(socketGame[socket.id]).emit('changeTurn')
  })

  socket.on('takeAttack', () => {
    attacked()
  })

  socket.on('buyingCard', (card_id) => {
    decreaseBuy = -1
    const supplyCheck = activeRooms[socketGame[socket.id]].supply.supplyCards
    if (Object.keys(supplyCheck.coinCards).includes(card_id)) {
      cardKey = supplyCheck.coinCards[card_id]
    }
    else if(Object.keys(supplyCheck.victoryCards).includes(card_id)){
      cardKey = supplyCheck.victoryCards[card_id]
    }
    else if(Object.keys(supplyCheck.actionCards).includes(card_id)){
      cardKey = supplyCheck.actionCards[card_id]
    }
    card = [card_id, cardKey.type, cardKey.value]
    cardKey.amount -= 1
    playerDeck.purchaseCard(card)
    cardsInPlay.updateBuy(decreaseBuy, cardKey.cost*-1)
    updatePlayer(socketGame[socket.id])
    updateSupplyCards(socketGame[socket.id], activeRooms[socketGame[socket.id]].supply.supplyCards)
  })



  socket.on('myTurn', () => {
    updatePlayer(socketGame[socket.id])
    updateSupplyCards(socketGame[socket.id], activeRooms[socketGame[socket.id]].supply.supplyCards)
  })




}

exports.onConnection = onConnection
