
var clientSocket = io('http://localhost:3000')
clientSocket.on('connect', () => {console.log('connected')})
clientSocket.emit('hello')

