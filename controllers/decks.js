var express = require('express');
var Deck = require('../models/deck');
var router = express.Router();

//all decks
router.get('/', function(req, res){
  Deck.find(function(err, decks){
    if(err) return res.status(500).send(err);
    return res.send(decks);
  });
});

//deck id
router.get('/:deckName', function(req, res){
  Deck.find({name : req.params.deckName}, function(err, deck) {
    if (err) return res.status(500).send(err);
    return res.send(deck);
  });
});

//create new deck
router.post('/', function(req, res){
  Deck.create(req.body, function(err, deck){
    if (err) return res.status(500).send(err);
    return res.send(deck);
  });
});

//deck w/ all cards

//all users decks


module.exports = router;
