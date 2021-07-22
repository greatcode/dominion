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

  socket.on('test', function(){
    console.log('socket works')
  })

  socket.on('addToQueue', () => {
      if (!waitingRooms.includes(socket)) {
        waitingRooms.push(socket)

        if (waitingRooms.length >= 2) {
          room++
          gameRoom = 'room ' + room
          activeRooms[gameRoom] = [waitingRooms.pop(), waitingRooms.pop()]
          for (const i in activeRooms[gameRoom]) {
            player = activeRooms[gameRoom][i]
            player.emit('startingGame', {
              you: activeRooms[gameRoom][i].id
            })
          }
          for (const i in activeRooms[gameRoom]) {
            player = activeRooms[gameRoom][i]
            player.broadcast.emit('opponent', {
              opponent: activeRooms[gameRoom][i].id
            })
          }
        }
        else {
          socket.broadcast.emit('playerReady', {player: socket.id})
        }
    }
  })

}

exports.onConnection = onConnection
