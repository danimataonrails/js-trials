app.controller('HomeController', function($location, $scope, $rootScope, Beer){
  Beer.all({}).$promise.then(
    function(response){
      $rootScope.beers = response;
      $location.path('/beers/' + response[0].id + '/ratings');
    }
  );
});
