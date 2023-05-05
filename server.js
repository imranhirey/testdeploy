const io = require('socket.io')(3000)
let ejs = require('ejs');

const express = require('express')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

// use public folder for static files

app.get('/', (req, res) => {
  res.render('index')
})




const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})


app.listen(3002, () => {
  console.log('server is running on port 3000')
}
)