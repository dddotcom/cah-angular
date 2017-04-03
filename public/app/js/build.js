angular.module('BuildCtrls', ["Services"])

.controller('BuildCtrl', ["$scope", 'BlackCardAPI','WhiteCardAPI', "Auth", 'DeckAPI', function($scope, BlackCardAPI, WhiteCardAPI, Auth, DeckAPI) {
    $scope.createBlackCard = "";
    $scope.frontBlack = true;
    $scope.backBlack = false;
    $scope.frontWhite = true;
    $scope.backWhite = false;
    $scope.radiobtn = 1;
    $scope.customBlack = {
    	question: '',
    	blanks: 0,
        userId: Auth.currentUser().id,
        pack: ''
    };
    $scope.customWhite = {
    	answer: '',
        userId: Auth.currentUser().id,
        pack: ''
    };

    $scope.togglefrontBlack = function() {
        $scope.frontBlack = !$scope.frontBlack
        $scope.backBlack = false;
      }
    $scope.togglebackBlack = function() {
        $scope.backBlack = !$scope.backBlack
        $scope.frontBlack = false;
    }
    //black card preview button
    $scope.update = function(blackCard, num) {
    	console.log(blackCard, num);
    	$scope.customBlack.question = blackCard;
     	$scope.customBlack.blanks = num;
  	};
  	//black card submit button
  	$scope.createcustomBlack = function() {
  		// No put values for $scope.customBlack in your cards database
  		//yup
        DeckAPI.getDeckId('User Created Cards')
        .then(function success(res){
            $scope.customBlack.pack = res[0]._id;
            BlackCardAPI.addCard($scope.customBlack)
            .then(function success(res2) {
                $scope.customBlack ={
                    question: '',
                    blanks: 0,
                    userId: Auth.currentUser().id,
                    pack: ''
                };
            }, function error(err){
                console.log("Error creating ", err)
            })
        }, function error(err){
            console.log('Error Finding Deck', err)
        })
  	};

  	$scope.togglefrontWhite = function() {
        $scope.frontWhite = !$scope.frontWhite
        $scope.backWhite = false;
      }
    $scope.togglebackWhite = function() {
        $scope.backWhite = !$scope.backWhite
        $scope.frontWhite = false;
    }
    //white card preview button
  	$scope.create = function(whiteCard) {
  		console.log(whiteCard);
  		$scope.customWhite.answer = whiteCard;
  	}; 
  	//white card submitt button
  	$scope.createcustomWhite = function() {	
        DeckAPI.getDeckId('User Created Cards')
        .then(function success(res){
            $scope.customWhite.pack = res[0]._id;
            WhiteCardAPI.addCard($scope.customWhite)
                .then(function success(res2) {
                    $scope.customWhite = {
                        answer: '',
                        userId: Auth.currentUser().id,
                        pack: ''
                    };
                }, function error(err){
                    console.log("Error creating ", err)
                })
        }, function error(err){
            console.log('Error Finding Deck', err)
            })
  		};
    
	}]);

















