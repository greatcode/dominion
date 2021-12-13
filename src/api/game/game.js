
const path = require('path')
const SupplyCards = require(path.join(__dirname, './supply-cards.js'))

class Game{
  constructor(room, monarchs){
    this._room = room
    this._monarchs = monarchs
    this.playingMonarch = monarchs[0]
    this.supply = new SupplyCards()
    this.attack = ''
  }

  playerAttacked(cardName){
    this.attack = cardName
    console.log(`attackCard: ${this.attack}`)
  }

  clearPlayerAttack(){
    this.attack=''
    console.log(`attackCard: ${this.attack}`)
  }


}

module.exports = Game