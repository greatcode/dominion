
class SupplyCards{
  constructor() {
    this.supplyCards = {
      victoryCards: {
        'Provice': {
          'amount': 8,
          'cost': 8,
          'points': 6,
          'type': 'vc'
        },
        'Duchy': {
          'amount': 8,
          'cost': 5,
          'points': 3,
          'type': 'vc'
        },
        'Estate': {
          'amount': 8,
          'cost': 2,
          'points': 1,
          'type': 'vc'
        },
        'Curse': {
          'amount': 10,
          'cost': 0,
          'points': -1,
          'type': 'vc'
        }
      },
      coinCards: {
        'Gold': {
          'amount': 30,
          'cost': 6,
          'value': 3,
          'type': 'coin'
        },
        'Silver': {
          'amount': 40,
          'cost': 3,
          'value': 2,
          'type': 'coin'
        },
        'Copper': {
          'amount': 46,
          'cost': 0,
          'value': 1,
          'type': 'coin'
        }
      }
    }
  }


}

module.exports = SupplyCards