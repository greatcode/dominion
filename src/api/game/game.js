
class Game{
  constructor(room, monarchs){
    this._room = room
    this._monarchs = monarchs
    this.playingMonarch = monarchs[0]
  }
}

module.exports = Game