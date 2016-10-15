'use strict';

/**
 * @ngdoc function
 * @name guessTheArtistApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the guessTheArtistApp
 */
angular.module('guessTheArtistApp')
  .controller('MainCtrl', function ($scope, $filter, $timeout, artistsService) {
    var MAX_ROUNDS = 5;
    var allArtists = artistsService.getArtists();
    var attemptsConfig = [
      {num: 1,
        points: 5,
        titlesShown: 1,
        successFeedback: 'Good Job!',
        failureFeedback: 'You can do better than this',
        showHint: false},
      {num: 2,
        points: 3,
        titlesShown: 2,
        successFeedback: 'Nice!',
        failureFeedback: 'You have one more try',
        showHint: false},
      {num: 3,
        points: 1,
        titlesShown: 3,
        successFeedback: 'That\'s right',
        failureFeedback: 'Too bad',
        showHint: true}
    ];

    // Arr to represent the artists that weren't shown yet
    var optionalArtists = [];
    var currRound;

    $scope.error = '';
    $scope.guess = '';
    $scope.randomCoverIndex = 0;
    $scope.attemptResults = {};
    $scope.loading = false;

    // Reset the game to initial state
    function resetGame() {
      $scope.totalScore = 0;
      $scope.gameEnded = false;
      $scope.round = {};
      currRound = 0;
      // Clone the allArtists arr into the optionalArtists arr
      optionalArtists = allArtists.slice(0);

      // start the first round
      newRound();
    }

    // Handle choosing an artist and removing it from the arr
    function popRandomArtist(artists) {
      // Generate a random index out of the artists arr
      var randIndex = Math.floor(Math.random() * artists.length);
      return artists.splice(randIndex, 1)[0];
    }

    function getRandomCoverIndex() {
      return Math.floor(Math.random() * $scope.round.albums.length);
    }

    // start a new round
    function newRound() {
      currRound++;
      if (currRound <= MAX_ROUNDS) {
        $scope.round.num = currRound;
        $scope.round.artist = popRandomArtist(optionalArtists);
        $scope.round.currAttempt = attemptsConfig[0];
        $scope.round.albums = [];
        $scope.loading = true;

        // Generate a random index for the cover
        $scope.randomCoverIndex = getRandomCoverIndex();

        // Get some albums of the artist
        artistsService.getArtistTopAlbums($scope.round.artist).then(function(data) {
          $scope.round.albums = data;
          $scope.loading = false;
        }, function() {
          $scope.error = 'Error occurred - unable to get the next albums';
          $scope.loading = false;
        });
      } else {
        endGame();
      }
    }

    // Show the results of the attempt for a while
    function endAttempt(succeeded, feedback, answer, timeInMilliSec) {
      $scope.attemptResults = { show: true,
        succeeded : succeeded,
        feedback: feedback,
        answer: answer
      };

      // Reset and continue after a few seconds
      $timeout(function() {
        $scope.attemptResults.show = false;
      }, timeInMilliSec);
    }

    function endGame() {
      $scope.gameEnded = true;
    }

    resetGame();


    // Add some functions to the scope
    $scope.resetGame = resetGame;

    // OnSubmit event
    $scope.submit = function(form) {
      if (form.$valid) {
        if ($filter('lowercase')($scope.guess) == $filter('lowercase')($scope.round.artist)) {
          // Get points
          $scope.totalScore += $scope.round.currAttempt.points;

          // Show indication of success and move to the next round
          endAttempt(true, $scope.round.currAttempt.successFeedback, '', 1000);
          newRound();
        } else {
          // Show indication of failure and check for more attempts
          if ($scope.round.currAttempt.num < attemptsConfig.length) {
            endAttempt(false, $scope.round.currAttempt.failureFeedback, '', 1000);
            $scope.round.currAttempt = attemptsConfig[($scope.round.currAttempt.num - 1) + 1];
          } else {
            // Show the right answer and skip to the next round
            endAttempt(false, $scope.round.currAttempt.failureFeedback, $scope.round.artist, 2000);
            newRound();
          }
        }

        // Reset the input and reset the form state
        $scope.guess = '';
        form.$setPristine();
      }
    };

  });
