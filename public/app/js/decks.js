angular.module('DeckCtrls', ['Services'])
.controller('MyStuffCtrl', ['$scope', 'BlackCardAPI', 'DeckAPI', 'WhiteCardAPI', 'Auth', '$location', function($scope, BlackCardAPI, DeckAPI, WhiteCardAPI, Auth, $location){
  $scope.myDecks = [];
  $scope.deckId = '';
  $scope.myCards = {};
  $scope.editingCard = '';
  $scope.oldValue = '';
  $scope.blanks;

  $scope.initialize = function(){
    DeckAPI.getMyDecks().then(function success(res){
      $scope.myDecks = res;
    }, function error(err){
      console.log(err);
    });
  }

  $scope.initialize();

  WhiteCardAPI.getMyCards().then(function success(res){
    $scope.myCards.whiteCards = res;
  }, function error(err){
    console.log("Error in myCards", err)
  });

  BlackCardAPI.getMyCards().then(function success(res){
    $scope.myCards.blackCards = res;
  }, function error(err){
    console.log("Error in myCards", err)
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

  $scope.deleteExpansion = function(deckId){
    //move cards in whiteCards and blackCards to user creaated
    $scope.whiteCards.forEach(function(card){
      $scope.removeFromExpansion(false, card);
    });

    $scope.blackCards.forEach(function(card){
      $scope.removeFromExpansion(true, card);
    });

    //delete deck
    DeckAPI.deleteDeck(deckId)
    .then(function success(res){
    }, function error(err){
      console.log("error", err);
    });
    $location.path('/myExpansions')
  }

  $scope.removeFromExpansion = function(isBlackCard, card){
    DeckAPI.getDeckId('User Created Cards')
    .then(function success(res){
      var id = res[0]._id;
      card.pack = id;
      if(isBlackCard){
        BlackCardAPI.updateCard(card).then(function success(res){
          $scope.getCards();
        }, function error(err){
          console.log("error", err);
        });
      } else {
        WhiteCardAPI.updateCard(card).then(function success(res){
          $scope.getCards();
        }, function error(err){
          console.log("error", err);
        });
      }
    }, function error(err){
      console.log("error", err);
    });
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

}])
.controller('DeckCtrl', ['$scope', 'BlackCardAPI', 'DeckAPI', 'WhiteCardAPI', 'Auth', function($scope, BlackCardAPI, DeckAPI, WhiteCardAPI, Auth){
  $scope.decks = [];
  $scope.deckId = '';
  $scope.blackCards = [];
  $scope.whiteCards = [];

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

  $scope.newDeck = { blackCards: new Set(), whiteCards: new Set(), packName: '' };
  $scope.blackCards = [];
  $scope.whiteCards = [];
  $scope.myDecks = [];
  $scope.isAllSelected = { blackCards: false, whiteCards: false};
  $scope.message = '';
  $scope.deckId = '';

  $scope.initializeCards = function(){
    $scope.newDeck = { blackCards: new Set(), whiteCards: new Set(), packName: '' };
    DeckAPI.getMyDecks().then(function success(res){
      $scope.myDecks = res;
    }, function error(err){
      console.log(err);
    });

    DeckAPI.getDeckId('User Created Cards')
    .then(function success(res){
      var id = res[0]._id;
      WhiteCardAPI.getMyAvailableCards(id).then(function success(res){
        $scope.whiteCards = res;
      }, function error(err){
        console.log("Error in myCards", err)
      })
      BlackCardAPI.getMyAvailableCards(id).then(function success(res){
        $scope.blackCards = res;
      }, function error(err){
        console.log("Error in myCards", err)
      })

    }, function error(err){
      console.log("error", err);
    });
  }

  if (Auth.isLoggedIn()){
    $scope.initializeCards();
  }

  $scope.deckRulesMet = function(){
    return $scope.newDeck.blackCards.size >= MIN_BLACK_CARDS && $scope.newDeck.whiteCards.size >= MIN_WHITE_CARDS;
  }

  $scope.expansionRulesMet = function(){
    return $scope.newDeck.blackCards.size > 0 || $scope.newDeck.whiteCards.size > 0;
  }

  $scope.updateCustomDeck = function(id){
    var bc = Array.from($scope.newDeck.blackCards);
    var wc = Array.from($scope.newDeck.whiteCards);
    bc.forEach(function(c){
      c.pack = id;
      BlackCardAPI.updateCard(c).then(function success(res){
      }, function error(err){
        console.log("error", err);
      });
    });
    wc.forEach(function(c){
      c.pack = id;
      WhiteCardAPI.updateCard(c).then(function success(res){
      }, function error(err){
        console.log("error", err);
      });
    });
    $scope.message = "Expansion has been updated with " + (wc.length + bc.length) + " new cards!";
    $scope.initializeCards();
  }

  $scope.createCustomDeck = function(){
    if($scope.newDeck.packName === ''){
      $scope.message = '';
      $scope.errorMessage = "Please name your expansion";
    } else {
      $scope.errorMessage = "";
      var deck = {
        name: $scope.newDeck.packName
      }

      DeckAPI.createDeck(deck).then(function success(res){
        var newDeck = res;
        var newDeckId = newDeck._id;
        var bc = Array.from($scope.newDeck.blackCards);
        var wc = Array.from($scope.newDeck.whiteCards);
        //update cards with new deck id
        bc.forEach(function(c){
          c.pack = newDeckId;
          BlackCardAPI.updateCard(c).then(function success(res){
          }, function error(err){
            console.log("error", err);
          });
        });
        wc.forEach(function(c){
          c.pack = newDeckId;
          WhiteCardAPI.updateCard(c).then(function success(res){
          }, function error(err){
            console.log("error", err);
          });
        });
        $scope.message = newDeck.name + " Expansion has been created!";
        $scope.initializeCards();
      }, function error(err){
        console.log(err);
      })
    }
  }

  $scope.addCards = function(){
    $scope.whiteCards.forEach(function(card) {
        if (card.selected) {
        // $scope.newDeck.whiteCards.add(card._id);
        $scope.newDeck.whiteCards.add(card);
      }
    });
    $scope.blackCards.forEach(function(card) {
        if (card.selected) {
        // $scope.newDeck.blackCards.add(card._id);
        $scope.newDeck.blackCards.add(card);
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
