cdaApp.controller('BookBlockController', function($scope, $http, $timeout) {
	
	$scope.closeDropDown = function(){
		 $timeout(function() {
			    angular.element('#navigationMenu').trigger('click');
			  }, 100);
	}
});