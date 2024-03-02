const path = require('path')

const express = require('express')
const WebSocket = require('ws')
const handleWS = require('./handleWS')

const app = express()
const server = app.listen(3000)

const wss = new WebSocket.Server({ noServer: true })

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req)
  })
})

server.on('listening', () => {
  const { port } = server.address()
  console.log(`Server is running on port ${port}`)
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

wss.on('connection', (ws) => {
  console.log('Client connected')
  ws.on('message', (msg) => {
    console.log(`Received message: ${msg}`)
    const message = JSON.parse(msg)
    handleWS(ws, message)
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})
