
class SupplyCards{
  constructor() {
    this.supplyCards = {
      victoryCards: {
        'Province': {
          'amount': 1,
          'cost': 8,
          'value': 6,
          'type': 'vc'
        },
        'Duchy': {
          'amount': 1,
          'cost': 5,
          'value': 3,
          'type': 'vc'
        },
        'Estate': {
          'amount': 1,
          'cost': 2,
          'value': 1,
          'type': 'vc'
        },
        'Curse': {
          'amount': 1,
          'cost': 0,
          'value': -1,
          'type': 'vc'
        }
      },
      coinCards: {
        'Gold': {
          'amount': 5,
          'cost': 6,
          'value': 3,
          'type': 'coin'
        },
        'Silver': {
          'amount': 5,
          'cost': 3,
          'value': 2,
          'type': 'coin'
        },
        'Copper': {
          'amount': 7,
          'cost': 0,
          'value': 1,
          'type': 'coin'
        }
      },
      actionCards: {
        'Cellar': {
          'amount': 3,
          'cost': 2,
          'value': {
            'card': 0,
            'action': 1,
            'buy': 0,
            'treasure': 0
          },
          'type': 'action'
        },
        'Moat': {
          'amount': 3,
          'cost': 2,
          'value': {
            'card': 0,
            'action': 0,
            'buy': 0,
            'treasure': 2
          },
          'type': 'action'
        },
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
        },
        'Militia': {
          'amount': 3,
          'cost': 4,
          'value': {
            'card': 0,
            'action': 0,
            'buy': 0,
            'treasure': 2
          },
          'type': 'action'
        },

        'Market': {
          'amount': 3,
          'cost': 5,
          'value': {
            'card': 1,
            'action': 1,
            'buy': 1,
            'treasure': 1
          },
          'type': 'action'
        },
        
      }
    }
  }


}

module.exports = SupplyCards