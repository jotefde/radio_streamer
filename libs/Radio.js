class Radio {
  static Init (_list) {
    this.stations = []
    for (let name in _list) {
      this.stations[name] = _list[name]
      this.stations[name].setBufferLimit(this.BufferSize())
    }
  }

  static Get (name) {
    return (this.stations[name]) ? this.stations[name] : undefined
  }

  static BufferSize (_size = undefined) {
    if(_size) this.bufferLimit = parseInt(_size)
    else return this.bufferLimit
  }
}


exports.default = Radio