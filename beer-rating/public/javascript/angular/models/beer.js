app.factory('Beer', ['$resource',
  function($resource){
    var api_headers = {'Content-Type': 'application/json;charset=UTF-8', 'Pragma': 'no-cache', 'Expires': -1, 'Cache-Control': 'no-cache,no-store'};
    return $resource(
      '/api/beers.json', 
      {}, 
      {
        all: {
          method: 'GET',
          url: '/api/beers.json',
          isArray: true,
          cache: false,
          headers: api_headers
        },
        create: {
          method: 'POST',
          url: '/api/beers.json',
          isArray: true,
          cache: false,
          headers: api_headers
        }
      }
    );
  }
]);
