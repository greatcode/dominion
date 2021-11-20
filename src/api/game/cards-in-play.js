
class CardsInPlay{
  constructor() {
    this.action = 1
    this.buy = 1
    this.treasure = 0
    this.CARD_VALUES = {
      NAME: 0,
      TYPE: 1,
      VALUE: 2
    }
  }

  updateTracker(cards) {
    this.treasure = 0
   for (let card of cards) {
     if(card[this.CARD_VALUES.TYPE] == 'coin') {
       this.treasure += card[2]
     }
   }
  }

  updateBuy(adjustBuy, adjustTreasure=0) {
    this.buy += adjustBuy
    this.treasure += adjustTreasure
  }
  



  resetTracker(){
    this.buy = 1
    this.action = 1
    this.treasure = 0
  }
}

module.exports = CardsInPlay