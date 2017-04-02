var express = require('express');
var WhiteCard = require('../models/whiteCard');
var router = express.Router();

//get all the white cards
router.get('/', function(req, res){
  WhiteCard.find({userId: null},function(err, whiteCards){
    if(err) return res.status(500).send(err);
    return res.send(whiteCards);
  });
});

router.get('/:deckIds', function(req, res){
  var idArray = req.params.deckIds.split(",");
  console.log(idArray);

  WhiteCard.find({
    pack: { $in: idArray }
  }, function (err, cards){
    if (err) return res.status(500).send(err);
    return res.send(cards);
  });
});

router.get('/myCards/:userId', function(req, res) {
  WhiteCard.find({
    userId: req.params.userId
  }, function(err, cards){
    if (err) return res.status(500).send(err);
    return res.send(cards);
  });
});

router.post('/', function(req, res){
  WhiteCard.create(req.body, function(err, whiteCard){
    if (err) return res.status(500).send(err);
    return res.send(whiteCard);
  });
});

router.put('/:cardId', function(req, res){
  WhiteCard.findByIdAndUpdate(req.params.cardId, req.body, function(err){
    if (err) return res.status(500).send(err);
    return res.send({message: 'successful white card update'});
  });
});

router.delete('/:cardId', function(req, res){
  WhiteCard.findByIdAndRemove(req.params.cardId, function(err) {
    if (err) return res.status(500).send(err);
    return res.send({message: 'successful white card delete'});
  });
});

module.exports = router;
