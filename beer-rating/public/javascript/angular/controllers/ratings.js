app.controller('RatingsController', function($location, $routeParams, $scope, $rootScope, Beer, Rating){
  $scope.current_beer = null;
  resetNewBeer();
  resetNewRating();
  
  $scope.selectBeer = function(beer_id){
    $location.path('/beers/' + beer_id + '/ratings');
  }
  
  $scope.submitBeer = function(e){
    Beer.create(
      {'name': $scope.new_beer.name}, 
      function(response){
        loadBeers();
        resetNewBeer();
      }
    );
  }

  $scope.submitRating = function(e){
    Rating.create(
      {'beer_id': $routeParams.id, 'author': $scope.new_rating.author, 'rating': $scope.new_rating.rating, 'comment': $scope.new_rating.comment}, 
      function(response){
        loadBeerRatings($routeParams.id);
        resetNewRating();
      }
    );
  }

  if(angular.isDefined($rootScope.beers)){
    loadBeerRatings($routeParams.id);
  }
  else{
    loadBeers();
  }
  
  function resetNewBeer(){
    $scope.new_beer = {name: ''};
  }
  
  function resetNewRating(){
    $scope.new_rating = {author: '', rating: 0, comment: ''};
  }

  function loadBeerRatings(beer_id){
    for(var i in $rootScope.beers){
      if($rootScope.beers[i].id == $routeParams.id){
        $scope.current_beer = $rootScope.beers[i];
        break;
      }
    }
    Rating.all({beer_id: beer_id}).$promise.then(
      function(response){
        $scope.ratings = response;
      }
    );
  }

  function loadBeers(){
    Beer.all({}).$promise.then(
      function(response){
        $rootScope.beers = response;
        loadBeerRatings($routeParams.id)
      }
    );
  }
  
});
