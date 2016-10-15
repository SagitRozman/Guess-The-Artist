angular.module('guessTheArtistApp')
  .factory('artistsService', ['$http', function($http) {

    var ITUNES_API_URL = 'https://itunes.apple.com';
    var NUM_OF_ALBUMS = 3;

    var artists = ['The Beatles',
                   'Guns N Roses',
                   'Elton John',
                   'Queen',
                   'Gogol Bordello',
                   'Barry Manilow',
                   'Asaf Avidan',
                   'Kenny Rogers',
                   'Leonard Cohen',
                   'Muse',
                   'Bob Dylan',
                   'Red Hot Chili Peppers',
                   'Nirvana',
                   'LINKIN PARK',
                   'Amy Winehouse',
                   'Rihanna',
                   'Britney Spears',
                   'Bon Jovi',
                   'Pink Floyd',
                   'Avril Lavigne'
                  ];

    var getArtists = function() {
      return artists;
    };

    var getArtistTopAlbums = function(name) {
      return $http.jsonp(ITUNES_API_URL + '/search', {
        params: {
          "callback": "JSON_CALLBACK",
          "term": name,
          "entity": "album",
          "limit": NUM_OF_ALBUMS
        }
      }).then(
          function (response) {
            // Post-process the result to contain relevant fields for our app
            var topAlbums = [];
            for (var i=0; i < response.data.results.length; i++) {
              topAlbums.push({
                title: response.data.results[i].collectionName,
                cover:  response.data.results[i].artworkUrl100
              });
            }

            return topAlbums;
          },
          function (httpError) {
            // translate the error
            throw httpError.status + " : " + httpError.data;
          });
    };

    return {
      getArtists : getArtists,
      getArtistTopAlbums : getArtistTopAlbums
    };
  }]);
