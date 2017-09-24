'use restrict';

angular.module('webApp.reports', ['ngRoute', 'firebase','ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.exporter', 'ui.grid.selection'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/reports', {
    templateUrl: 'reports/reports.html',
    controller: 'ReportsCtrl'
  });
}])

.controller('ReportsCtrl', ['$scope', '$firebaseAuth', '$location','$log', 'uiGridConstants','uiGridExporterService','uiGridExporterConstants','productService','CommonProp', '$firebaseArray', '$firebaseObject','$rootScope','$route', function($scope, $firebaseAuth, $location, $log, uiGridConstants,uiGridExporterService, uiGridExporterConstants,productService,CommonProp, $firebaseArray, $firebaseObject,$rootScope,$route){

  $rootScope.username = CommonProp.getUser();
  if(!$rootScope.username){
    $location.path('/login');
  }

  var date = new Date();
  var years = [];
  for(var i=date.getFullYear();i >= 2015;i--) {
    years.push(i);
  }
  $scope.years = years;
  
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  $scope.months = months;

  var dates = [];

  for(var i = 1; i <= 31; i++) {
        dates.push(i);
      }

  $scope.dates = dates;

  var data = [];
   $scope.rows = [];

  
  $scope.gridOptions = {
    data: data,
    exporterCsvFilename: 'Invoice.csv',
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableStyle: {margin: [10, 10, 10, 10]},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
    exporterPdfHeader: { text: "Invoice", style: 'headerStyle' },
    exporterPdfFooter: function ( currentPage, pageCount ) {
      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
      return docDefinition;
    },
    enableCellEditOnFocus: true,
    exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500,
      exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
};

  $scope.gridOptions.onRegisterApi = function(gridApi){
    //set gridApi on scope
    $scope.gridApi = gridApi;
        
  }
      
        
  $scope.gridOptions.columnDefs = [
  {name: 'billNumber',width: '13%',cellTemplate: '<span><button class="btn btn-link" ng-click="grid.appScope.billView(row.entity.billNumber)">{{row.entity.billNumber}}</a></span>'},
  {name: 'itemCode',width: '13%', displayName: 'Item Code'},
  {name: 'itemName',width: '13%',cellClass:'overflow', displayName: 'Item Name'},
  //{name: 'itemDesc',width: '10%', displayName: 'ITEM DESCRIPTION'},
  {name: 'qty',width: '10%', displayName: 'Quantity'},
  {name: 'qtyType',width: '10%', displayName: 'Quantity Type'},
  {name: 'unitPrice',width: '10%', displayName: 'Unit Price'},
  {name: 'discount',width: '10%', displayName: 'Discount'},
  {name: 'tax',width: '14%', displayName: 'Tax'},

  {name: 'total',field:'total',width: '10%', displayName: 'Total'}
  ];




 $scope.downloadCSV = function(){
  $scope.gridApi.exporter.csvExport(uiGridExporterConstants.VISIBLE,uiGridExporterConstants.ALL);
}
 $scope.downloadPDF = function(){
  $scope.gridApi.exporter.pdfExport(uiGridExporterConstants.VISIBLE,uiGridExporterConstants.ALL);
}

  
  $scope.billView = function(billNumber){
        $scope.contactButtonClicked = "Cancel";
        $scope.showContactModal = !$scope.showContactModal;

    http({method : "GET",url : "welcome.htm"
      }).then(function mySuccess(response) {
          $scope.gridDate = response.data;
      }, function myError(response) {
          $scope.errorMessage = response.statusText;
      });   
    };

$scope.getGridData = function(){

console.log("$scope.gridOptions.data=====",$scope.gridOptions.data);

$scope.gridOptions.data = [{
    "billNumber" : "B1234",
    "itemId": "1234",
    "itemCode": "I123",
    "itemName": "Item1",
    "qty": 10,
    "qtyType": "Kg",
    "unitPrice": 15,
    "discount": 10,
    "tax": 10,
    "total": 154
  }, {
    "billNumber" : "B2345",
    "itemId": "2345",
    "itemCode": "I234",
    "itemName": "Item2",
    "qty": 10,
    "qtyType": "Kg",
    "unitPrice": 25,
    "discount": 10,
    "tax": 10,
    "total": 264
  }, {
    "billNumber" : "B3456",
    "itemId": "4567",
    "itemCode": "I345",
    "itemName": "Item3",
    "qty": 10,
    "qtyType": "Kg",
    "unitPrice": 35,
    "discount": 10,
    "tax": 10,
    "total": 374
  }];

  // var data = $scope.gridOptions.data;
  //   //Call the services
  //   $http.post('http://localhost:8081/billlive/test/company/contact/add', JSON.stringify(data)).then(function (response) {
  //   if (response.data)
  //   $scope.msg = "Post Data Submitted Successfully!";
  //   }, function (response) {
  //   $scope.msg = "Service not Exists";
  //   $scope.statusval = response.status;
  //   $scope.statustext = response.statusText;
  //   $scope.headers = response.headers();
  //   });
}
   


    // $scope.showContactModal = false;
    // $scope.contactButtonClicked = "";

    // $scope.toggleContactModal = function(option,addType){
    //   console.log("toggleToContactModal======"+option);
    //   console.log(addType);
    //   if( option == 'createContact'){
    //     $scope.addressType = addType;
    //      $scope.contactButtonClicked = "Cancel";
    //     $scope.showContactModal = !$scope.showContactModal;
    //   }
       
    // };


  $scope.logout = function(){
    CommonProp.logoutUser();
  }


$scope.logout = function(){
    CommonProp.logoutUser();
  }

}]);