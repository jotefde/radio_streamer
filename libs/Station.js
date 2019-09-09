const { Readable, PassThrough } = require('stream');
const request = require('request')

class Station {
  constructor (_url) {
    this.url = _url
    this.buffer = []
    this.bufferedBytes = 0
    this.enabled = false
    this.source = undefined
    this.listeners = 0
    this.bufferLimit = 0
    this.dataAgent = new Readable({
      objectMode: true,
      read() {}
    })
    this.stream = new Readable({
      objectMode: true,
      read() {}
    })
    this.dataAgent.on('data', this.dataReceiver.bind(this))
  }

  dataReceiver (chunk) {
    this.stream.push(chunk)
    this.buffer.push(chunk)
    this.bufferedBytes += chunk.length
    while (this.bufferedBytes > this.bufferLimit) {
      let removedChunk = this.buffer.shift()
      this.bufferedBytes -= removedChunk.length
    }
  }

  setBufferLimit (_limit) {
    this.bufferLimit = _limit
  }

  Buffer () {
    return this.buffer
  }

  Pipe (pipeline) {
    this.stream.pipe(pipeline)
  }

  Enabled () {
    return this.enabled
  }

  Start () {
    this.enabled = true
    request
      .get(this.url)
      .on('error', err => {
        console.error(err)
      })
      .on('response', function (response) {
        this.source = response
        response.on('data', function (data) {
          this.dataAgent.push(data)
        }.bind(this))
      }.bind(this))
  }

  Stop () {
    this.bufferedBytes = 0
    while (this.buffer.length) this.buffer.pop()
    this.enabled = false
    this.source.emit('close')
  }
}

exports.default = Station