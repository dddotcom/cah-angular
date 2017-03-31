angular.module('DeckCtrls', ['Services'])
.controller('DeckCtrl', ['$scope', 'BlackCardAPI', 'DeckAPI', 'WhiteCardAPI', function($scope, BlackCardAPI, DeckAPI, WhiteCardAPI){
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

  //TODO: have all cards as an optio in the dropdown
  //TODO: allow users to show cards from multiple decks
  //TODO: when in the join view, allow users to select which decks they want to play the game with
  //TODO: get a better shuffle function?
  //TODO: show number of open rooms? How to close a room?

  $scope.getCards = function(){
    $scope.blackCards = [];
    $scope.whiteCards = [];
    BlackCardAPI.getCardsFromDeck($scope.deckId).then(function success(response){
      $scope.blackCards = response;
    }, function error(err){
      console.log(err);
    });

    WhiteCardAPI.getCardsFromDeck($scope.deckId).then(function success(response){
      $scope.whiteCards = response;
    }, function error(err){
      console.log(err);
    });
  }

}])
