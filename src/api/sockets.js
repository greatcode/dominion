//

const path = require('path')
const { report } = require('process')
const PersonalDeck = require(path.join(__dirname, './game/player-deck.js'))
// const SupplyCards = require(path.join(__dirname, './game/supply-cards.js'))
const CardsInPlay = require(path.join(__dirname, './game/cards-in-play.js'))
const Game = require(path.join(__dirname, './game/game.js'))

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

function onConnection(socket) {
  console.log('A user connected')

  const playerDeck = new PersonalDeck()
  const cardsInPlay = new CardsInPlay()

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
          console.log(`socketGame: ${socketGame[player.id]}`)
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
    console.log(`socket room ${socketGame[socket.id]}`)
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

  socket.on('playingCard', (card_id) => {
    playerDeck.playCards(card_id)
    cardsInPlay.updateTracker(playerDeck.playedCards)
    updatePlayer(socketGame[socket.id])
    updateSupplyCards(socketGame[socket.id], activeRooms[socketGame[socket.id]].supply.supplyCards)
  })

  socket.on('buyingCard', (card_id) => {
    decreaseBuy = -1
    cardKey = activeRooms[socketGame[socket.id]].supply.supplyCards.coinCards[card_id]
    card = [card_id, cardKey.type, cardKey.value]
    cardKey.amount -= 1
    playerDeck.purchaseCard(card)
    cardsInPlay.updateBuy(decreaseBuy, cardKey.cost*-1)
    updatePlayer(socketGame[socket.id])
    updateSupplyCards(socketGame[socket.id], activeRooms[socketGame[socket.id]].supply.supplyCards)
  })

  socket.on('myTurn', () => {
    updatePlayer(socketGame[socket.id])
    console.log(`myturn: ${socket.id}`)
    updateSupplyCards(socketGame[socket.id], activeRooms[socketGame[socket.id]].supply.supplyCards)
  })




}

exports.onConnection = onConnection
