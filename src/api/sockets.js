//

const path = require('path')
const PersonalDeck = require(path.join(__dirname, './game/player-deck.js'))


let waitingRooms = []
let activeRooms = {}
let room = 0

function onConnection(socket) {
  console.log('A user connected')

  function updateDrawPile (roomNumber) {
    socket.emit('drawPileUpdate', playerDeck.drawPile.length)
    socket.to(roomNumber).emit('opponentPile', playerDeck.drawPile.length)
  }

  function updateHand (roomNumber) {
    socket.emit('handUpdate', playerDeck.hand)
    socket.to(roomNumber).emit('opponentHand', playerDeck.hand)
  }

  function updateDiscardPile (roomNumber) {
    socket.emit('discardPileUpdate', playerDeck.discardPile.length)
    socket.to(roomNumber).emit('opponentDiscard', playerDeck.discardPile.length)
  }

  // function updatePlayedCards (roomNumber) {
  //   socket.emit('playedCardsUpdate', playerDeck.playedCards)

  // }

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
        activeRooms[gameRoom] = [waitingRooms.pop(), waitingRooms.pop()]
        if (waitingRooms.length == 0) {
          socket.broadcast.emit('clearWaitingRoom')
        }
        else {
          socket.broadcast.emit('playerReady', {
            player: waitingRooms[0].id
          })
        }
        for (const i in activeRooms[gameRoom]) {
          player = activeRooms[gameRoom][i]
          opponent = activeRooms[gameRoom].filter(players => players != player)
          player.join(gameRoom)
          player.emit('startingGame', {
            you: player.id,
            opponentId: opponent[0].id,
            room: gameRoom
          })
        
        }
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
    playerDeck = new PersonalDeck()
    playerDeck.createStartingPile()
    updateDrawPile(roomNumber)
    updateHand(roomNumber)
    updateDiscardPile(roomNumber)
  })

  socket.on('drawHand', (roomNumber) => {
    playerDeck.drawHand()
    updateDrawPile(roomNumber)
    updateHand(roomNumber)
    updateDiscardPile(roomNumber)
  })

  socket.on('discardHand', (roomNumber) => {
    playerDeck.discard()
    updateHand(roomNumber)
    updateDiscardPile(roomNumber)
  })

}

exports.onConnection = onConnection
