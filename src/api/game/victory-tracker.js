class VictoryTracker {
  constructor(monarchs) {
    this.STARTING_POINTS = 3
    this.MONARCHS = {
      MONARCH_ONE: 0,
      MONARCH_TWO: 1
    }
    this._monarchs = monarchs
    this.monarchsVictoryPoints = {}
    this.monarchsVictoryPoints[this._monarchs[this.MONARCHS.MONARCH_ONE].id] = this.STARTING_POINTS
    this.monarchsVictoryPoints[this._monarchs[this.MONARCHS.MONARCH_TWO].id] = this.STARTING_POINTS
    this.emptySupplyPiles = 0
  }

  addVictoryCardPoints(monarch, cardPoints){
    this.monarchsVictoryPoints[monarch] += cardPoints
  }
  

  increaseEmptySupplyPiles() {
    this.emptySupplyPiles++
  }
}

module.exports = VictoryTracker