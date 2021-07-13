//

let waitingRooms = []
let activeRooms = []

function onConnection(socket) {
  console.log('A user connected')

  // Whenever someone disconnects this piece of code executes
  socket.on('disconnect', function () {
    console.log('A user disconnected')
  })

  socket.on('test', function(){
    console.log('socket works')
  })

  // socket.on('addToWaitRoom', () => {
  //     roomName = socket.id.slice(0,7)
  //     if (!waitingRooms.includes(roomName)) {
  //       waitingRooms.push(roomName)
  //       console.log(waitingRooms)
  //     }
  //   })

  socket.on('addToGame', () => {
    if (waitingRooms.length >= 1) {
      roomName = waitingRooms[0]
      socket.emit('startGame', roomName)
      activeRooms.push(waitingRooms.pop())
      console.log(activeRooms)
    }
    else {
      roomName = socket.id.slice(0,7)
      if (!waitingRooms.includes(roomName)) {
        waitingRooms.push(roomName)
        socket.emit('startGame', roomName)
        console.log(waitingRooms.length + ' ' + activeRooms)
      }
    }
  })

}

exports.onConnection = onConnection
