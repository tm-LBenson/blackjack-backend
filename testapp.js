const ListOfGames = require('./src/blackjack/ListOfGames');

const sampleGames = {
  ABC123: {
    players: ['John', 'Doe', 'Alice', 'Bob'],
  },
  XYZ789: {
    players: ['Eve', 'Charlie'],
  },
  KAZ2Y5: {
    players: ['Sam', 'Dean', 'Castiel', 'Jack', 'Rowena', 'Gabriel', 'Mary'],
  },
  GHI101: {
    players: ['Emma', 'Henry'],
  },
};

function seedGames() {
  for (let gameId in sampleGames) {
    ListOfGames.addGame(gameId, sampleGames[gameId]);
  }
  console.log('Games seeded successfully!');
}

module.exports = seedGames;
