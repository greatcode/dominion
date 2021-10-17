//

const path = require('path')
const { report } = require('process')
const PersonalDeck = require(path.join(__dirname, './game/player-deck.js'))
const SupplyCards = require(path.join(__dirname, './game/supply-cards.js'))
const CardsInPlay = require(path.join(__dirname, './game/cards-in-play.js'))

let waitingRooms = []
let activeRooms = {}
// [gameRoom] = [socket, socket]
// [gameRoom] = { supply, players: [socket, socket] }
let supplyRoom = {}
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

  function updatePlayer (roomNumber) {
    socket.emit('updatePlayer', {
      playerCards: playerDeck,
      playerPlay: cardsInPlay
    })
    socket.to(roomNumber).emit('updateOpponent', {
      opponentCards: playerDeck,
      opponentPlay: cardsInPlay
    })
  }

  function updateSupplyCards (roomNumber, supply) {
    socket.emit('updateSupply', supply)
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
        const supplyCards = new SupplyCards()
        const supply = supplyCards;
        const players = [waitingRooms.pop(), waitingRooms.pop()]
        activeRooms[gameRoom] = {supply, players}
        if (waitingRooms.length == 0) {
          socket.broadcast.emit('clearWaitingRoom')
        }
        else {
          socket.broadcast.emit('playerReady', {
            player: waitingRooms[0].id
          })
        }
        for (const i in activeRooms[gameRoom].players) {
          player = activeRooms[gameRoom].players[i]
          opponent = activeRooms[gameRoom].players.filter(players => players != player)
          player.join(gameRoom)
          player.emit('startingGame', {
            you: player.id,
            opponentId: opponent[0].id,
            room: gameRoom
          })
        }
        updateSupplyCards(gameRoom, activeRooms[gameRoom].supply.supplyCards)
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

  socket.on('startingPile', (roomNumber) => {
    
    playerDeck.createStartingPile()
    updatePlayer(roomNumber)
  })
  
  socket.on('drawHand', (roomNumber) => {
    playerDeck.drawHand()
    updatePlayer(roomNumber)
  })

  socket.on('discardHand', (roomNumber) => {
    playerDeck.discard()
    cardsInPlay.resetTracker()
    updatePlayer(roomNumber)
  })

  socket.on('playingCard', ({roomNumber, card_id}) => {
    playerDeck.playCards(card_id)
    cardsInPlay.updateTracker(playerDeck.playedCards)
    updatePlayer(roomNumber)
    
  })


}

exports.onConnection = onConnection
