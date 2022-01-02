
class PlayTracker{
  constructor() {
    this.action = 1
    this.buy = 1
    this.treasure = 0
    this.CARD_VALUES = {
      NAME: 0,
      TYPE: 1,
      VALUE: 2,
    }
  }

  treasurePlayed(cardValue) {
    this.treasure += cardValue
  }

  actionPlayed(actionCardValues){
    this.action += -1
    this.action += actionCardValues.action
    this.buy += actionCardValues.buy
    this.treasure += actionCardValues.treasure
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

module.exports = PlayTracker