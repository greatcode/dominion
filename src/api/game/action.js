
class ActionHandler{
  constructor(){
    this.redrawCards = false
    this.cardsBeforeDiscard = 0
    this.forcedToDiscard = 0
  }

  redrawAfterDiscard(){
    this.redrawCards = true
  }

  noRedrawAfterDiscard(){
    this.redrawCards = false
  }

  lengthHandBeforeDiscard(length_hand){
    this.cardsBeforeDiscard = length_hand
  }

  decreaseForcedToDiscard(){
    this.forcedToDiscard--
  }

}



module.exports = ActionHandler