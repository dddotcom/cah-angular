var mongoose = require('mongoose');

var DeckSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }
});

module.exports = mongoose.model('Deck', DeckSchema);
