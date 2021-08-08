//

let waitingRooms = []
let activeRooms = {}
let room = 0

function onConnection(socket) {
  console.log('A user connected')

  

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

  socket.on('drawPile', (pile) => {
   socket.to(pile.room).emit('opponentPile', {'servePile': pile.emitPile})
  })

  socket.on('currentHand', (hand) => {
    socket.to(hand.room).emit('opponentHand', {'serveHand': hand.emitHand})
  })

  socket.on('discardPile', (pile) => {
    socket.to(pile.room).emit('opponentDiscard', {'serveDiscard': pile.emitDiscard})
  })



}

exports.onConnection = onConnection
