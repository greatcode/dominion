
export class BoardCards{
  constructor() {
    this.victoryCards = {
      'Provice': {
        'amount': 8,
        'cost': 8,
        'points': 6
      },
      'Duchy': {
        'amount': 8,
        'cost': 5,
        'points': 3
      },
      'Estate': {
        'amount': 8,
        'cost': 2,
        'points': 1
      },
      'Curse': {
        'amount': 10,
        'cost': 0,
        'points': -1
      }
    }
    this.coinCards = {
      'Gold': {
        'amount': 30,
        'cost': 6,
        'value': 3
      },
      'Silver': {
        'amount': 40,
        'cost': 3,
        'value': 2
      },
      'Cooper': {
        'amount': 46,
        'cost': 0,
        'value': 1
      }
    }
  }

  drawBardCard(card) {


  }

}