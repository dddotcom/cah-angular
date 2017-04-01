var app = angular.module('AuthApp', ['ui.router', 'AuthCtrls', 'CardsCtrls', 'ngStorage', 'ngLodash', 'ChatCtrls', 'BuildCtrls', 'DeckCtrls', 'luegg.directives']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider){
    $urlRouterProvider.otherwise('/404');

    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/views/home.html',
      controller: 'JoinCtrl'
    })
    .state('build', {
      url: '/build',
      templateUrl: 'app/views/build.html',
      controller: 'BuildCtrl'
    })
    .state('decks', {
      url: '/decks',
      templateUrl: 'app/views/showdeck.html',
      controller: 'DeckCtrl'
    })
    .state('showMyCards', {
      url: '/myCards',
      templateUrl: 'app/views/showMyCards.html',
      controller: 'DeckCtrl'
    })
    .state('signup', {
      url:'/signup',
      templateUrl: 'app/views/userSignup.html',
      controller: 'SignupCtrl'
    })
    .state('login', {
      url:'/login',
      templateUrl: 'app/views/userLogin.html',
      controller: 'LoginCtrl'
    })
    .state('404', {
      url: '/404',
      templateUrl: 'app/views/404.html'
    })
    .state('deckBuilder', {
      url:'/deckBuilder',
      templateUrl: 'app/views/deckBuilder.html',
      controller: 'CustomDeckCtrl'
    })
    .state('join', {
      url: '/:roomId',
      templateUrl: 'app/views/join.html',
      controller: 'JoinCtrl'
    })
    .state('main', {
      url:'/main/:roomId',
      templateUrl: 'app/views/main2.html',
      controller: 'MainCtrl'
    })


    $locationProvider.html5Mode(true);
  }])
  .config(["$httpProvider", function($httpProvider){
    $httpProvider.interceptors.push("AuthInterceptor");
  }]);
