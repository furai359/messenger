const express = require('express')
const useSocket = require('socket.io')
const PORT = 9999
const index = express()
const server = require('http').Server(index)
const io = useSocket(server);
const rooms = new Map()

index.get('/rooms/:roomID', (req, res) => {
  const roomID = req.params.roomID
  const obj = rooms.has(roomID)
      ? { users: [...rooms.get(roomID).get('users').values()],
        messages: [...rooms.get(roomID).get('messages').values()] }
      : { users: [], messages: [] }

  res.json(obj)
})
index.use(express.json())

index.post('/rooms', (req, res) => {
  const {roomID, userName} = req.body;
  if(!rooms.has(roomID)) {
    console.log(`создаем комнату ${roomID}`)
    rooms.set(roomID, new Map([
      ['users', new Map()],
      ['messages', []],
    ]))
  }
  res.send()
  /*res.json([...rooms.keys(), ...rooms.values()]);*/
})

io.on('connection', socket => {
  socket.on('ROOM:JOIN', ({roomID, userName}) => {
    socket.join(roomID)
    rooms.get(roomID).get('users').set(socket.id, userName)
    const users = [...rooms.get(roomID).get('users').values()]
    socket.to(roomID).emit('ROOM:USER_JOINED', {users, userName})
  })

  socket.on('ROOM:NEW_MESSAGE', ({roomID, userName, text}) => {
    console.log(`${roomID} - ${userName}: ${text}`)
    const message = {
      userName,
      text
    }
    rooms.get(roomID).get('messages').push(message)
    socket.to(roomID).emit('ROOM:NEW_MESSAGE', message)
  })

  socket.on('disconnect', () => {
    rooms.forEach((value, roomID) => {
      if(value.get('users').delete(socket.id)) {
        const users = [...rooms.get(roomID).get('users').values()]
        socket.to(roomID).emit('ROOM:USER_LEFT', {users})
      }
    })
  })
})

server.listen(PORT, err => {
  if(err) throw Error(err)
  console.log(`серв запущен на порту ${PORT}`)
})