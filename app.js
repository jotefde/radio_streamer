const express = require('express')
const app = express()
const path = require('path')
const Radio = require('./libs/Radio').default
const Station = require('./libs/Station').default

// audio/acc format takes 16-40KB/s (128-320Kbps)
Radio.BufferSize(1000 * 1000)// 1MB (~25sec of audio for 320Kbps) per station
Radio.Init({
    RMFFM: new Station('http://31.192.216.10/RMFFM48'),
    RMFMAXXX: new Station('http://195.150.20.9/RMFMAXXX48'),
    RMFCLASSIC: new Station('http://195.150.20.9/RMFCLASSIC48'),
    OPENFM: new Station('https://stream.open.fm/109?type=.aac')
  })

app.use('/public', express.static('public'))
app.get('/', (req, res) => {
  const index = path.join(__dirname, 'public', 'index.html')
  res.sendFile(index)
})


app.get('/stream/:station', (req, res) => {
  const name = req.params.station
  const station = Radio.Get(name)
  if (!(station instanceof Station)) {
    res.end()
    return false
  }
  if (!station.Enabled()) {
    station.Start()
    console.log(name + ' started')
  }
  station.listeners++
  console.log("connected")

  res.writeHead(200, { 'Content-Type': 'audio/aacp' })
  for (let chunk of station.Buffer()) {
    res.write(chunk)
  }
  console.log("buffer sent")
  station.Pipe(res)

  req.on('close', function () {
    station.listeners--
    console.log('client disconnected')
    if(station.listeners < 1) {
      station.Stop()
      console.log(name + ' stopped.')
    }
  })
})

app.listen(3009, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on 3009`)
})