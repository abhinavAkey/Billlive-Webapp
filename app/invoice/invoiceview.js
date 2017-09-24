'use restrict';

angular.module('webApp.invoiceview', ['ngRoute', 'firebase','ngTouch', 'ui.grid', 'ui.grid.exporter'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/invoiceview', {
    templateUrl: 'invoice/invoiceview.html',
    controller: 'InvoiceviewCtrl'
  });
}])

.controller('InvoiceviewCtrl', ['$scope', '$firebaseAuth', '$location','$log', 'uiGridConstants','uiGridExporterService','uiGridExporterConstants','productService','CommonProp', '$firebaseArray', '$firebaseObject','$rootScope','$window', function($scope, $firebaseAuth, $location, $log, uiGridConstants,uiGridExporterService, uiGridExporterConstants,productService,CommonProp, $firebaseArray, $firebaseObject,$rootScope,$window){

  
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
    showColumnFooter: true,
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
      

      $scope.addBill=function(data){
        productService.addProduct(data);
        window.location = "#/bill";
      }            
  $scope.gridOptions.columnDefs = [
  {name: 'itemId',visible:false},
  {name: 'itemName',cellClass:'overflow', displayName: 'ITEM NAME',
  editableCellTemplate: '<div><select ng-model="row.entity.itemName" ng-change="grid.appScope.toggleModal(row.entity)"><option value="" selected>Choose Item</option><option value="create">Create Item</option><option value="Item1">Item1</option><option value="Item2">Item2</option><option value="Item3">Item3</option></select></div>' 
},
  {name: 'itemDesc', displayName: 'ITEM DESCRIPTION'},
  {name: 'uid', displayName: 'UID'},
  {name: 'postId', displayName: 'POST ID'},
  {name: 'gstItemCode', displayName: 'GST ITEM CODE', aggregationType: uiGridConstants.aggregationTypes.sum,    footerCellTemplate: '<div class="ui-grid-cell-contents"><div style="text-align:right;">Subtotal: 1222.00</div> <div style="text-align:right;">Sales Tax: 12.00</div> Total: {{col.getAggregationValue() | number:2 }}</div>'},
  {name: 'taxId', displayName: 'ITEM CODE'},
  {name: 'inventoryType', displayName: 'INVENTORY TYPE'}
    ];

 $scope.downloadCSV = function(){
  $scope.gridApi.exporter.csvExport(uiGridExporterConstants.VISIBLE,uiGridExporterConstants.ALL);
}
 $scope.downloadPDF = function(){
  $scope.gridApi.exporter.pdfExport(uiGridExporterConstants.VISIBLE,uiGridExporterConstants.ALL);
}
  
  $scope.gridOptions.data = [{
    "itemId": "1234",
    "itemName": "Item1",
    "itemDesc": "Desc1",
    "uid": "true",
    "postId": 20,
    "gstItemCode": 40,
    "taxId": "1234",
    "inventoryType": "January"
  }, {
    "itemId": "2345",
    "itemName": "Item2",
    "itemDesc": "Desc3",
    "uid": "true",
    "postId": 20,
    "gstItemCode": 40,
    "taxId": "1234",
    "inventoryType": "January"
  }, {
    "itemId": "3456",
    "itemName": "Item3",
    "itemDesc": "Desc3",
    "uid": "true",
    "postId": 20,
    "gstItemCode": 40,
    "taxId": "1234",
    "inventoryType": "January"
  }];
 

  
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