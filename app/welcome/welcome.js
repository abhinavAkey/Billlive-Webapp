'use strict';

angular.module('webApp.welcome', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/Billlive',{
		templateUrl: 'welcome/welcome.html',
		controller: 'WelcomeCtrl'
	});
}])

.controller('WelcomeCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', '$location','$rootScope', function($scope, CommonProp, $firebaseArray, $firebaseObject, $location,$rootScope){
	$rootScope.username = CommonProp.getUser();

	// if(!$rootScope.username){
	// 	$location.path('/login');
	// }
	$scope.isRegistered = true;
	if(!$rootScope.username){
		$rootScope.logIn = false; 
	}else{
		$rootScope.logIn = true;
	}
	
	if($scope.isRegistered == false){

		//console.log("this user is not registered");
		window.location = "#/register";
	}

	// var ref = firebase.database().ref().child('Articles');
	// $scope.articles = $firebaseArray(ref);	

	// $scope.editPost = function(id){
	// 	var ref = firebase.database().ref().child('Articles/' + id);
	// 	$scope.editPostData = $firebaseObject(ref);
	// };

	// $scope.updatePost = function(id){
	// 	var ref = firebase.database().ref().child('Articles/' + id);
	// 	ref.update({
	// 		title: $scope.editPostData.title,
	// 		post: $scope.editPostData.post
	// 	}).then(function(ref){
	// 		$scope.$apply(function(){
	// 			$("#editModal").modal('hide');
	// 		});
	// 	}, function(error){
	// 		console.log(error);
	// 	});
	// };

	// $scope.deleteCnf = function(article){
	// 	$scope.deleteArticle = article;
	// };

	// $scope.deletePost = function(deleteArticle){
	// 	$scope.articles.$remove(deleteArticle);
	// 	$("#deleteModal").modal('hide');
	// };

	$scope.logout = function(){
		CommonProp.logoutUser();
	}
}])