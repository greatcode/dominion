//

let waitingRooms = []
let activeRooms = {}
let room = 0

function onConnection(socket) {
  console.log('A user connected')

  card = 0
  

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
            player.join(gameRoom)
            player.emit('startingGame', {
              you: activeRooms[gameRoom][i].id,
              room: gameRoom
            })
          }
          for (const i in activeRooms[gameRoom]) {
            player = activeRooms[gameRoom][i]
            player.to(gameRoom).emit('opponent', {
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
