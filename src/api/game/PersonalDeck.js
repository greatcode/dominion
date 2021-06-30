
class PersonalDeck {

  constructor(random) {
    this.drawPile = []
    this._random = random
  }

  createStartingPile() {
    for (let i = 1; i <= 7; i++) {
      this.drawPile.push('copper')
    }
    for (let i = 1; i <= 3; i++) {
      this.drawPile.push('estate')
    }
    this._random.shuffle(this.drawPile)
  }
}

module.exports = PersonalDeck
