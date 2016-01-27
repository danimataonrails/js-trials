app.factory('Rating', ['$resource',
  function($resource){
    var api_headers = {'Content-Type': 'application/json;charset=UTF-8', 'Pragma': 'no-cache', 'Expires': -1, 'Cache-Control': 'no-cache,no-store'};
    return $resource(
      '/api/beers/:beer_id/ratings.json', 
      {beer_id: '@beer_id'}, 
      {
        all: {
          method: 'GET',
          url: '/api/beers/:beer_id/ratings.json',
          isArray: true,
          cache: false,
          headers: api_headers
        },
        create: {
          method: 'POST',
          url: '/api/beers/:beer_id/ratings.json',
          isArray: true,
          cache: false,
          headers: api_headers
        }
      }
    );
  }
]);
