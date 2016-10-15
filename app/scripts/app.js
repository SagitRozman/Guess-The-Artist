'use strict';

/**
 * @ngdoc overview
 * @name guessTheArtistApp
 * @description
 * # guessTheArtistApp
 *
 * Main module of the application.
 */
angular
  .module('guessTheArtistApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
