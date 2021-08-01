
export class PersonalDeck{
  constructor() {
    this.drawPile = []
    this.hand = []
    this.discardPile = []
  }

  createStartingPile() {
    for (let i = 1; i <= 4; i++) {
      this.drawPile.push('copper')
    }
    for (let i = 1; i <= 3; i++) {
      this.drawPile.push('estate')
    }
    this.drawPile = this.shuffleCards(this.drawPile)
  }

  shuffleCards(cards) {
    let shuffledCards = cards.sort((a, b) => 0.5 - Math.random())
    return shuffledCards
  }

  drawCard() {
    this.hand.push(this.drawPile.pop())
  }

  drawHand() {
    for (let i = 1; i <= 3; i++) {
      this.drawCard()
      }
  }
}
