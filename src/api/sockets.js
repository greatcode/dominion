//

function onConnection(socket) {
  console.log('A user connected')

  // Whenever someone disconnects this piece of code executes
  socket.on('disconnect', function () {
    console.log('A user disconnected')
  })
}

exports.onConnection = onConnection
