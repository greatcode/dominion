
export class PersonalDeck{
  constructor() {
    this.drawPile = []
    this.hand = []
    this.discardPile = []
    this.playedCards = []
  }

  createStartingPile() {
    const STARTING_COPPER_CARDS = 4
    const STARTING_ESTATE_CARDS = 3
    for (let i = 1; i <= STARTING_COPPER_CARDS; i++) {
      this.drawPile.push('copper')
    }
    for (let i = 1; i <= STARTING_ESTATE_CARDS; i++) {
      this.drawPile.push('estate')
    }
    this.drawPile = this._shuffleCards(this.drawPile)
  }

  _shuffleCards(cards) {
    let shuffledCards = cards.sort((a, b) => 0.5 - Math.random())
    return shuffledCards
  }

  drawCard() {
    this.hand.push(this.drawPile.pop())
  }

  drawHand() {
    const CARDS_PER_DRAW_HAND = 3
    for (let i = 1; i <= CARDS_PER_DRAW_HAND; i++) {
      this.drawCard()
      }
  }

  discard() {
    let discardHand = this.hand.length
    let discardPlayedCards = this.playedCards.length
    for (let i = 1; i <= discardHand; i++) {
      this.discardPile.push(this.hand.pop())
    }
    for (let i = 1; i <= discardPlayedCards; i++) {
      this.discardPile.push(this.playedCards.pop())
    }
  }

  replinishDrawPile(){
    this.discardPile = this._shuffleCards(this.discardPile)
    let discardPileLength = this.discardPile.length
    for (let i = 1; i <= discardPileLength; i++) {
      this.drawPile.push(this.discardPile.pop())
    }
  }
}
