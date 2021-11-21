
class SupplyCards{
  constructor() {
    this.supplyCards = {
      victoryCards: {
        'Provice': {
          'amount': 8,
          'cost': 8,
          'value': 6,
          'type': 'vc'
        },
        'Duchy': {
          'amount': 8,
          'cost': 5,
          'value': 3,
          'type': 'vc'
        },
        'Estate': {
          'amount': 8,
          'cost': 2,
          'value': 1,
          'type': 'vc'
        },
        'Curse': {
          'amount': 10,
          'cost': 0,
          'value': -1,
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
      },
      actionCards: {
        'Smithy': {
          'amount': 10,
          'cost': 4,
          'value': {
            'card': 3,
            'action': 0,
            'buy': 0,
            'treasure': 0
          },
          'type': 'action'
        }
      }
    }
  }


}

module.exports = SupplyCards