'use restrict';

angular.module('webApp.purchaseorder', ['ngRoute', 'firebase','ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.exporter', 'ui.grid.selection'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/purchaseorder', {
		templateUrl: 'purchaseorder/purchaseorder.html',
		controller: 'PurchaseorderCtrl'
	});
}])

.controller('PurchaseorderCtrl', ['$scope', '$firebaseAuth', '$location','$log', 'uiGridConstants','uiGridExporterService','uiGridExporterConstants','productService','CommonProp', '$firebaseArray', '$firebaseObject','$rootScope', function($scope, $firebaseAuth, $location, $log, uiGridConstants,uiGridExporterService, uiGridExporterConstants,productService,CommonProp, $firebaseArray, $firebaseObject,$rootScope){

	
  $scope.deleteRow = function(row) {
    var index = $scope.gridOptions.data.indexOf(row.entity);
    $scope.gridOptions.data.splice(index, 1);
  };
$rootScope.username = CommonProp.getUser();
if(!$rootScope.username){
    $location.path('/login');
  }

  
  var data = [];
   $scope.rows = [];

$scope.isLast = function(row) {
  return row.uid === $scope.gridApi.grid.renderContainers.body.visibleRowCache[$scope.gridApi.grid.renderContainers.body.visibleRowCache.length-1].uid;
}

  $scope.gridOptions = {showColumnFooter: true,
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
    exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500,
      exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
};

  $scope.gridOptions.onRegisterApi = function(gridApi){
    //set gridApi on scope
    $scope.gridApi = gridApi;
        
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
          console.log("selected row is ",JSON.stringify($scope.rows));
           $scope.rows = $scope.gridApi.selection.getSelectedRows();
                console.log("selected row is ",JSON.stringify($scope.rows));

        });
  }
      

      $scope.addBill=function(data){
        productService.addProduct(data);
        window.location = "#/bill";
      }            
  $scope.gridOptions.columnDefs = [
  {name: 'itemId',width: '10%'}, 
  {name: 'isTaxeble',width: '10%'},
  {name: 'productValue',width: '5%'},
  {name: 'totalAmount',width: '10%', aggregationType: uiGridConstants.aggregationTypes.sum},
  {name: 'quantityType',width: '15%'},
  {name: 'quantity',width: '10%'},
  {name: 'taxAmountForItem',width: '15%'},
  {name: 'taxId',width: '15%'},
  {name: 'inventoryType',width: '15%'},
  {name: 'Delete',width: '11%',cellTemplate: '<button class="btn primary" ng-click="grid.appScope.deleteRow(row)"><span class="glyphicon glyphicon-remove"></button>'}
  ];

 $scope.downloadCSV = function(){
  $scope.gridApi.exporter.csvExport(uiGridExporterConstants.VISIBLE,uiGridExporterConstants.ALL);
}
 $scope.downloadPDF = function(){
  $scope.gridApi.exporter.pdfExport(uiGridExporterConstants.VISIBLE,uiGridExporterConstants.ALL);
}
  
  $scope.gridOptions.data = [{
    "itemId": "Item1",
    "isTaxeble": "true",
    "productValue": 20,
    "totalAmount": 40,
    "quantityType": "Kg",
    "quantity": 2,
    "taxAmountForItem": 1.2,
    "taxId": "1234",
    "inventoryType": "January"
  }, {
    "itemId": "Item2",
    "isTaxeble": "true",
    "productValue": 20,
    "totalAmount": 40,
    "quantityType": "Kg",
    "quantity": 2,
    "taxAmountForItem": 1.2,
    "taxId": "1234",
    "inventoryType": "January"
  }, {
     "itemId": "Item3",
    "isTaxeble": "true",
    "productValue": 20,
    "totalAmount": 40,
    "quantityType": "Kg",
    "quantity": 2,
    "taxAmountForItem": 1.2,
    "taxId": "1234",
    "inventoryType": "January"
  }];

   $scope.addData = function(itemId,isTaxeble,productValue,totalAmount,quantityType,quantity,taxAmountForItem,taxId,inventoryType) {
    var n = $scope.gridOptions.data.length + 1;
    $scope.gridOptions.data.push({
                "itemId": itemId,
                "isTaxeble": isTaxeble,
                "productValue": productValue,
                "totalAmount": totalAmount,
                "quantityType": quantityType,
                "quantity": quantity,
                "taxAmountForItem": taxAmountForItem,
                "taxId": taxId,
                "inventoryType": inventoryType
              });
  };

  $scope.addRow = function() {
    var n = $scope.gridOptions.data.length + 1;
    $scope.gridOptions.data.push({
                 "itemId": "",
                "isTaxeble": "",
                "productValue": "",
                "totalAmount": "",
                "quantityType": "",
                "quantity": "",
                "taxAmountForItem": "",
                "taxId": "",
                "inventoryType":""
              });
  };

  $scope.logout = function(){
    CommonProp.logoutUser();
  }

}])
.service('productService', function() {
  var productList = [];

  var addProduct = function(newObj) {
     var i;
     console.log("newObj.length====",newObj.length,newObj );
for (i = 0; i < newObj.length; i++) {
      productList.push(newObj[i]);
    }
  };
  console.log(productList);
  var getProducts = function(){
      return productList;
  };

  return {
    addProduct: addProduct,
    getProducts: getProducts
  };

});