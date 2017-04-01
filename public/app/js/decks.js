angular.module('DeckCtrls', ['Services'])
.controller('DeckCtrl', ['$scope', 'BlackCardAPI', 'DeckAPI', 'WhiteCardAPI', 'Auth', function($scope, BlackCardAPI, DeckAPI, WhiteCardAPI, Auth){
  $scope.decks = [];
  $scope.deckId = '';
  $scope.blackCards = [];
  $scope.whiteCards = [];
  $scope.myCards = {};
  $scope.editingCard = '';
  $scope.oldValue = '';
  $scope.blanks;

  DeckAPI.getDecks().then(function success(response){
    $scope.decks = response;
  }, function error(err){
    console.log(err);
  });

  BlackCardAPI.getCards().then(function success(response){
    $scope.blackCards = response;
    WhiteCardAPI.getCards().then(function success(response2){
        $scope.whiteCards = response2;
    }, function error(err){
      console.log(err);
    })
  }, function error(err){
    console.log(err);
  });

  $scope.getCardsFromManyDecks = function(){
    var deckIds = [];
    $scope.decks.forEach(function(d) {
        if (d.selected) {
        deckIds.push(d._id);
      }
    });

    BlackCardAPI.getCardsFromManyDecks(deckIds).then(function success(response){
      $scope.blackCards = response;
    }, function error(err){
      console.log(err);
    });

    WhiteCardAPI.getCardsFromManyDecks(deckIds).then(function success(response){
      $scope.whiteCards = response;
    }, function error(err){
      console.log(err);
    });
  }

  if (Auth.isLoggedIn()){
    WhiteCardAPI.getMyCards().then(function success(res){
      $scope.myCards.whiteCards = res;
    }, function error(err){
      console.log("Error in myCards", err)
    })
    BlackCardAPI.getMyCards().then(function success(res){
      $scope.myCards.blackCards = res;
    }, function error(err){
      console.log("Error in myCards", err)
    })
  }

  $scope.editCard = function(isBlackCard, card){
    if(!isBlackCard){
      WhiteCardAPI.updateCard(card).then(function success(res){
        $scope.editingCard = '';
      }, function error(err){
        console.log("error", err);
      });
    } else {
      BlackCardAPI.updateCard(card).then(function success(res){
        $scope.editingCard = '';
      }, function error(err){
        console.log("error", err);
      });
    }
  }

  $scope.toggleEdit = function(isBlackCard, card) {
    //TODO: what if someone hits edit on another card before hitting nvm
    if($scope.editingCard !== card._id){
        $scope.editingCard = card._id;
        if(isBlackCard){
          $scope.oldValue = card.question;
          $scope.oldBlanks = card.blanks;
        } else {
          $scope.oldValue = card.answer;
        }
    } else{
      $scope.editingCard = '';
      if(isBlackCard){
        card.question = $scope.oldValue;
        card.blanks = $scope.oldBlanks;
      } else {
          card.answer = $scope.oldValue;
      }
    }
  }

  $scope.deleteCard = function(isBlackCard, cardId) {
    console.log("delete card " + cardId);
    if(isBlackCard){
      BlackCardAPI.deleteCard(cardId).then(function success(res){
        BlackCardAPI.getMyCards().then(function success(res){
          $scope.myCards.blackCards = res;
        }, function error(err){
          console.log("Error in myCards", err);
        })
      }, function error(err){
        console.log("Error in myCards", err);
      });
    } else {
      WhiteCardAPI.deleteCard(cardId).then(function success(res){
        WhiteCardAPI.getMyCards().then(function success(res){
          $scope.myCards.whiteCards = res;
        }, function error(err){
          console.log("Error in myCards", err)
        });
      }, function error(err){
        console.log("error", err);
      });
    }
  }

  $scope.getCards = function(){
    $scope.blackCards = [];
    $scope.whiteCards = [];
    BlackCardAPI.getCardsFromManyDecks($scope.deckId).then(function success(response){
      $scope.blackCards = response;
    }, function error(err){
      console.log(err);
    });

    WhiteCardAPI.getCardsFromManyDecks($scope.deckId).then(function success(response){
      $scope.whiteCards = response;
    }, function error(err){
      console.log(err);
    });
  }
}])
.controller('CustomDeckCtrl', ['$scope', 'BlackCardAPI', 'DeckAPI', 'WhiteCardAPI', 'Auth', function($scope, BlackCardAPI, DeckAPI, WhiteCardAPI, Auth){
  const MAX_PLAYERS  = 10;
  const CARDS_PER_PLAYER = 10;
  const MIN_BLACK_CARDS = 5;
  const MIN_WHITE_CARDS = (MAX_PLAYERS) * (CARDS_PER_PLAYER) + (MAX_PLAYERS) * (MIN_BLACK_CARDS -1); //140

  $scope.newDeck = { blackCards: new Set(), whiteCards: new Set() };
  $scope.blackCards = [];
  $scope.whiteCards = [];
  $scope.decks = [];
  $scope.isAllSelected = { blackCards: false, whiteCards: false};

  DeckAPI.getDecks().then(function success(response){
    $scope.decks = response;
  }, function error(err){
    console.log(err);
  });

  $scope.getCards = function(){
    $scope.blackCards = [];
    $scope.whiteCards = [];
    BlackCardAPI.getCardsFromManyDecks($scope.deckId).then(function success(response){
      $scope.blackCards = response;
    }, function error(err){
      console.log(err);
    });

    WhiteCardAPI.getCardsFromManyDecks($scope.deckId).then(function success(response){
      $scope.whiteCards = response;
    }, function error(err){
      console.log(err);
    });
  }

  $scope.deckRulesMet = function(){
    return $scope.newDeck.blackCards.size >= MIN_BLACK_CARDS && $scope.newDeck.whiteCards.size >= MIN_WHITE_CARDS;
  }

  $scope.createCustomDeck = function(){
    console.log("create my deck!");
    //TODO: change set to array
    // let array = Array.from(mySet);
    // let array = [...mySet];
  }

  $scope.addCards = function(){
    $scope.whiteCards.forEach(function(card) {
        if (card.selected) {
        $scope.newDeck.whiteCards.add(card._id);
      }
    });
    $scope.blackCards.forEach(function(card) {
        if (card.selected) {
        $scope.newDeck.blackCards.add(card._id);
      }
    });
  }

  $scope.toggleAll = function(isBlackCard){
    if(isBlackCard){
      $scope.blackCards.forEach(function(card){
        if($scope.isAllSelected.blackCards){
          card.selected = false;
        } else {
          card.selected = true;
        }
      });

      $scope.isAllSelected.blackCards = !$scope.isAllSelected.blackCards;
    } else {
      $scope.whiteCards.forEach(function(card){
        if($scope.isAllSelected.whiteCards){
          card.selected = false;
        } else {
          card.selected = true;
        }
      });

      $scope.isAllSelected.whiteCards = !$scope.isAllSelected.whiteCards;
    }
  };


}])
