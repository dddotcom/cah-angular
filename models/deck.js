var mongoose = require('mongoose');

var DeckSchema = mongoose.Schema({
  name: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }
});

module.exports = mongoose.model('Deck', DeckSchema);
