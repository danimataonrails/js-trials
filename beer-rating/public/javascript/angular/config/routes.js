app.config(['$routeProvider',
  function($routeProvider, $routeParams){
    $routeProvider
      .when('/', { templateUrl: 'javascript/angular/views/home/index.html', controller: 'HomeController' })
      .when('/beers/:id/ratings', { templateUrl: 'javascript/angular/views/ratings/index.html', controller: 'RatingsController' })
      .otherwise({ redirectTo: '/' });
  }
]); 

