const assert = require('chai').assert

const path = require('path')
const PersonalDeck = require(path.join(__dirname, '../../../build/api/game/PersonalDeck'))

describe('PersonalDeck', () => {
  describe('constructor', () => {
    it('defaults to 0 cards in the drawPile', () => {
      const playerDeck = new PersonalDeck(createFakeShuffle())
      assert.equal(playerDeck.drawPile.length, 0)
    })
  })

  describe('createStartingPile()', () => {
    it('fills the drawPile with 10 cards', () => {
      const playerDeck = new PersonalDeck(createFakeShuffle())
      playerDeck.createStartingPile()
      assert.equal(playerDeck.drawPile.length, 10)
    })

    it('shuffle the drawPile', () => {
      let numShuffles = 0
      const random = {
        shuffle(cards) {
          assert.equal(cards.length, 10)
          numShuffles++
          // let lastCard = [cards.pop()]
          // let newCards = lastCard.concat(cards)
          // return newCards
        }
      }
      const playerDeck = new PersonalDeck(random)

      playerDeck.createStartingPile()

      assert.equal(numShuffles, 1)
    })
  })
})

function createFakeShuffle() {
  return {
    shuffle() {}
  }
}