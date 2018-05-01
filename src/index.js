const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const mongo = require("mongodb").MongoClient;

let database;

mongo.connect("mongodb://localhost", function(err, client) {
  if (err) {
    process.exit(1);
  }
  database = client.db('chat')
  client.db('chat').collection('message').remove()
})

/**
*/
io.on('connection', (socket) => {
  socket.on('new_message', data => {
    if (typeof data === 'object') {
      if (typeof data.username === 'string' && typeof data.message === 'string') {
        const collection = database.collection('message')

        collection.insert(data)
        socket.emit('add_message', data);
        socket.broadcast.emit('add_message', data);
      }
    }
  })
})

/**
*/
app.use(express.static(__dirname + '/node_modules'))
app.set('views', __dirname + '/views');
app.use('/assets', express.static(__dirname + '/assets'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/messages', (req, res) => {
  const collection = database.collection('message');

  collection.find({}).toArray(function(err, docs) {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(docs))
  });
})

app.get('*', (req, res) => {
  res.render('404_not_found')
})

server.listen(3000, () => {
  console.log('==========================================');
  console.log('Server started on port 3000')
  console.log('[url] http://localhost:3000')
  console.log('[url] http://127.0.0.1:3000/')
})
