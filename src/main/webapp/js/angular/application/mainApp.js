var cdaApp = angular.module("cdaApp",['ngRoute', 'angularFileUpload']);

cdaApp.config(['$routeProvider',
  function($routeProvider) {
	$routeProvider.when('/viewCDA/', {
    	  templateUrl: 'templates/viewcda.html'
      }).
      otherwise({
        redirectTo: '/viewCDA/'
      });
    
}]);



/*cdaApp.controller('MenuController', function($scope, $location) {
	
	$scope.isActive = function (viewLocation) { 
        return $location.path().indexOf(viewLocation) > -1;
    };
	
 
});*/


