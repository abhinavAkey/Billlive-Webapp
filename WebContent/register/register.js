'use restrict';

angular.module('webApp.register', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/register', {
		templateUrl: 'register/register.html',
		controller: 'RegisterCtrl'
	});
}])

.controller('RegisterCtrl', ['$scope', '$firebaseAuth', '$location','$http', function($scope, $firebaseAuth, $location,$http){

	$scope.signUp = function(){
		var firstName = $scope.user.firstName;
		var lastName = $scope.user.lastName;
		var company = $scope.user.company;
		var legalOrTradingName = $scope.user.legalOrTradingName;
		var lineOfBusiness = $scope.user.lineOfBusiness;
		var organizationDesc = $scope.user.organizationDesc;
		var gstRegistrationNum = $scope.user.gstRegistrationNum;
		var website = $scope.user.website;
		var address = $scope.user.address;
		var country = $scope.user.country;
		var state = $scope.user.state;
		var district = $scope.user.district;
		var city = $scope.user.city;
		var phoneNumber = $scope.user.phoneNumber;
		var email = $scope.user.email;
		var typeOfUser = $scope.user.typeOfUser;

	console.log(firstName+"    "+lastName+"    "+company+"    "+legalOrTradingName+"    "+lineOfBusiness+"    "+organizationDesc+"    "+gstRegistrationNum+"    "+website+"    "+address
			+"    "+country+"    "+state+"    "+district+"    "+city+"    "+phoneNumber+"    "+email+"    "+typeOfUser);
	
		var data = {
		name: $scope.user.email,
		password: $scope.user.password
		};
		//Call the services
		$http.post('http://localhost:8081/billlive/company/signup', JSON.stringify(data)).then(function (response) {
		if (response.data)
		$scope.msg = "Post Data Submitted Successfully!";
		}, function (response) {
		$scope.msg = "Service not Exists";
		$scope.statusval = response.status;
		$scope.statustext = response.statusText;
		$scope.headers = response.headers();
		});
		
	}

}])