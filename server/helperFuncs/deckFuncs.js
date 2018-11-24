const getDeckTiles = require('../GameObjects/startTiles')
const Deck = require('../GameObjects/Deck')

const initializeDeckPlayers = (players) => {
  const deck = new Deck(getDeckTiles());
  deck.shuffle();
  players.forEach((player, i) => {
    let randIdx = Math.floor(Math.random() * players.length);
    players[i] = players[randIdx];
    players[randIdx] = player;
  });
  return deck
}

module.exports = initializeDeckPlayers
