var express = require('express');
var BlackCard = require('../models/blackCard');
var ObjectId = require('mongoose').Types.ObjectId;
var router = express.Router();

//get all the black cards
router.get('/', function(req, res){
  BlackCard.find({userId: null}, function(err, blackCards){
    if(err) return res.status(500).send(err);
    return res.send(blackCards);
  });
});

router.get('/:deckIds', function(req, res){
  var idArray = req.params.deckIds.split(",");
  BlackCard.find({
    pack: { $in: idArray }
  }, function (err, cards){
    if (err) return res.status(500).send(err);
    return res.send(cards);
  });
});

router.get('/myCards/:userId', function(req, res) {
  BlackCard.find({
    userId: req.params.userId
  }, function(err, cards){
    if (err) return res.status(500).send(err);
    return res.send(cards);
  });
});

router.post('/', function(req, res){
  BlackCard.create(req.body, function(err, blackCard){
    if (err) return res.status(500).send(err);
    return res.send(blackCard);
  });
});

router.put('/:cardId', function(req, res){
  BlackCard.findByIdAndUpdate(req.params.cardId, req.body, function(err){
    if(err) return res.status(500).send(err);
    return res.send({message: 'successful black card update'});
  });
});

router.delete('/:cardId', function(req, res){
  BlackCard.findByIdAndRemove(req.params.cardId, function(err){
    if (err) return res.status(500).send(err);
    return res.send({message: 'successful black card delete'});
  });
});

module.exports = router;
