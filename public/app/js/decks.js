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
