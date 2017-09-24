'use restrict';

angular.module('webApp.dashboard', ['ngRoute', 'firebase','ngTouch', 'ui.grid', 'ui.grid.grouping', 'ui.grid.edit', 'ui.grid.selection'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/dashboard', {
		templateUrl: 'dashboard/dashboard.html',
		controller: 'DashboardCtrl'
	});
}])

.controller('DashboardCtrl', ['$scope', '$firebaseAuth', '$location','$log','productService',function($scope, $firebaseAuth, $location, $log,productService){

	
  $scope.deleteRow = function(row) {
    var index = $scope.gridOptions.data.indexOf(row.entity);
    $scope.gridOptions.data.splice(index, 1);
  };
  
  
   $scope.addRow = function(row) {
   $scope.gridOptions.data.push({
    "firstName": "New",
    "lastName": "New",
    "company": "New",
    "employed": true
  })
  };

$scope.isLast = function(row) {
  return row.uid === $scope.gridApi.grid.renderContainers.body.visibleRowCache[$scope.gridApi.grid.renderContainers.body.visibleRowCache.length-1].uid;
}

  $scope.gridOptions = {};

  $scope.gridOptions.onRegisterApi = function(gridApi){
    //set gridApi on scope
    $scope.gridApi = gridApi;
  }
                  
  $scope.gridOptions.columnDefs = [{
    name: 'Item',
  }, {
    name: 'Description'
  },{
    name: 'Qty'
  },{
    name: 'Unit Price'
  },{
    name: 'Account'
  },{
    name: 'Tax Rate'
  },{
    name: 'Amount USD'
  },{
    name: 'Delete',
    cellTemplate: '<button class="btn primary" ng-click="grid.appScope.deleteRow(row)"><span class="glyphicon glyphicon-remove"></button>'+
    '<button class="btn primary" ng-click="grid.appScope.addRow(row)" ng-show="grid.appScope.isLast(row)"><span class="glyphicon glyphicon-plus"></button>'
  }];



  $scope.gridOptions.data = [{
    "Item": "Cox",
    "Description": "Carney",
    "Qty": "Cox",
    "Unit Price": "Carney",
    "Account": "Carney",
    "Tax Rate": "Cox",
    "Amount USD": "Carney"
  }, {
   "Item": "Cox",
    "Description": "Carney",
    "Qty": "Cox",
    "Unit Price": "Carney",
    "Account": "Carney",
    "Tax Rate": "Cox",
    "Amount USD": "Carney"
  }, {
    "Item": "Cox",
    "Description": "Carney",
    "Qty": "Cox",
    "Unit Price": "Carney",
    "Account": "Carney",
    "Tax Rate": "Cox",
    "Amount USD": "Carney"
  }];

}])