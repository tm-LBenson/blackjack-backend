class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
    this.points = this.calculatePoints();
  }

  calculatePoints() {
    switch (this.value) {
      case 'A':
        return 11;
      case 'K':
      case 'Q':
      case 'J':
        return 10;
      default:
        return parseInt(this.value);
    }
  }
}

class Deck {
  constructor() {
    this.cards = this.generateDeck();
    this.shuffle();
  }

  generateDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = [
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'J',
      'Q',
      'K',
      'A',
    ];
    return suits.flatMap((suit) =>
      values.map((value) => new Card(suit, value))
    );
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw() {
    return this.cards.pop();
  }
}

class Player {
  constructor(id) {
    this.id = id;
    this.hand = [];
    this.status = 'waiting';
    this.balance = 1000; // Starting balance.
    this.currentBet = 0;
    this.totalValue = 0; // New property to track the total value of the hand.
  }

  addCard(card) {
    this.hand.push(card);
    this.calculateHandValue(); // Update the total value whenever a new card is added.
  }

  placeBet(amount) {
    if (this.balance >= amount) {
      this.currentBet = amount;
      this.balance -= amount;
    } else {
      throw new Error('Insufficient funds');
    }
  }

  reset() {
    this.hand = [];
    this.status = 'waiting';
    this.currentBet = 0;
    this.totalValue = 0; // Reset the total value.
  }

  calculateHandValue() {
    // Calculate the total value based on the cards in the hand.
    let value = this.hand.reduce((sum, card) => sum + card.points, 0);

    // Adjust for Aces if the value exceeds 21.
    this.hand.forEach((card) => {
      if (value > 21 && card.value === 'A' && card.points === 11) {
        card.points = 1;
        value -= 10;
      }
    });

    this.totalValue = value;
  }
}

class Dealer {
  constructor() {
    this.hand = [];
  }

  addCard(card) {
    this.hand.push(card);
  }

  reset() {
    this.hand = [];
  }
}

class GameState {
  constructor() {
    this.players = {};
    this.dealer = new Dealer();
    this.deck = new Deck();
    this.gameStatus = 'waiting for players';
  }

  addPlayer(playerId) {
    if (!this.players[playerId]) {
      this.players[playerId] = new Player(playerId);
    }
  }

  removePlayer(playerId) {
    delete this.players[playerId];
  }

  allPlayersReady() {
    return Object.values(this.players).every(
      (player) => player.status !== 'waiting'
    );
  }

  startGame() {
    if (this.allPlayersReady()) {
      this.gameStatus = 'in progress';
      this.dealInitialCards();
    }
  }

  dealInitialCards() {
    for (let player of Object.values(this.players)) {
      player.addCard(this.deck.draw());
      player.addCard(this.deck.draw());
    }
    this.dealer.addCard(this.deck.draw());
    this.dealer.addCard(this.deck.draw());
  }

  // Add other game logic methods as needed.
}

module.exports = new GameState();
