
class PersonalDeck{
  constructor() {
    this.drawPile = []
    this.hand = []
    this.actionInHand = false
    this.moatInHand = false
    this.discardPile = []
    this.playedCards = []
    this.CARD_VALUES = {
      NAME: 0,
      TYPE: 1,
      VALUE: 2
    }
  }


  createStartingPile() {
    const STARTING_COPPER_CARDS = 7
    const STARTING_ESTATE_CARDS = 3
    const coins = ['Copper', 'coin', 1]
    const victoryCards = ['Estate', 'vc', 1]
    for (let i = 1; i <= STARTING_COPPER_CARDS; i++) {
      this.drawPile.push(coins)
    }
    for (let i = 1; i <= STARTING_ESTATE_CARDS; i++) {
      this.drawPile.push(victoryCards)
    }
    this.drawPile = this._shuffleCards(this.drawPile)
  }

  _shuffleCards(cards) {
    let shuffledCards = cards.sort((a, b) => 0.5 - Math.random())
    return shuffledCards
  }

  drawCard() {
    const OUT_OF_CARDS = 0
    if (this.drawPile == OUT_OF_CARDS) {
      this.replinishDrawPile()
    }
    this.hand.push(this.drawPile.pop())
    this.actionCheck()  
  }

  drawHand() {
    const CARDS_PER_DRAW_HAND = 5
    if (this.drawPile.length < CARDS_PER_DRAW_HAND) {
      this.replinishDrawPile()
    }
    for (let i = 1; i <= CARDS_PER_DRAW_HAND; i++) {
      this.drawCard()
      }
  }

  actionCheck(){
    this.actionInHand = false
    this.moatInHand = false
    for (let card of this.hand) {
      if (card[this.CARD_VALUES.TYPE] == 'action') {
        this.actionInHand = true
        if (card[this.CARD_VALUES.NAME] == 'Moat') {
          this.moatInHand = true
        }
      }
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
    this.actionInHand = false
    this.moatInHand = false
  }

  purchaseCard(card) {
    this.discardPile.push(card)
  }

  playCards(card_place) {
    let playedCard = this.hand[card_place]
    this.playedCards.push(playedCard)
    this.hand.splice(card_place, 1)
    let lastcard = this.playedCards.length -1
    if (this.playedCards[lastcard][this.CARD_VALUES.TYPE] == 'action'){
      this.actionCheck()
    }
  }

  selectDiscard(card_place) {
    let discardedCard = this.hand[card_place]
    this.discardPile.push(discardedCard)
    this.hand.splice(card_place, 1)
    this.actionCheck()
  }

  replinishDrawPile(){
    this.discardPile = this._shuffleCards(this.discardPile)
    this.drawPile = this.drawPile.concat(this.discardPile)
    this.discardPile = []
  }



}

module.exports = PersonalDeck
