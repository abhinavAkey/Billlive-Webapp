'use restrict';

angular.module('webApp.bill', ['ngRoute', 'firebase','ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.exporter', 'ui.grid.selection'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/bill', {
    templateUrl: 'bill/bill.html',
    controller: 'BillCtrl'
  });
}])

.controller('BillCtrl', ['$scope', '$firebaseAuth', '$location','$log', 'uiGridConstants','uiGridExporterService','uiGridExporterConstants','productService','CommonProp', '$firebaseArray', '$firebaseObject','$rootScope','$route','$http', function($scope, $firebaseAuth, $location, $log, uiGridConstants,uiGridExporterService, uiGridExporterConstants,productService,CommonProp, $firebaseArray, $firebaseObject,$rootScope,$route,$http){
 var data = [];
  $scope.rows = [];
  $rootScope.username = CommonProp.getUser();
  $scope.states = {"Andhra Pradesh" : ["Anantapur","Chittoor","East Godavari","Guntur","Krishna","Kurnool","Prakasam","Srikakulam","SriPotti Sri Ramulu Nellore","Vishakhapatnam","Vizianagaram","West Godavari","Cudappah"],"Arunachal Pradesh" : ["Anjaw","Changlang","Dibang Valley","East Siang","East Kameng","Kurung Kumey","Lohit","Longding","Lower Dibang Valley","Lower Subansiri","Papum Pare","Tawang","Tirap","Upper Siang","Upper Subansiri","West Kameng","West Siang"],    "Assam": ["Baksa","Barpeta","Bongaigaon","Cachar","Chirang","Darrang","Dhemaji","Dima Hasao","Dhubri","Dibrugarh","Goalpara","Golaghat","Hailakandi","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Morigaon","Nagaon","Nalbari","Sivasagar","Sonitpur","Tinsukia","Udalguri"],"Bihar": ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"],     "Chhattisgarh": ["Bastar","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Jashpur","Janjgir-Champa","Korba","Koriya","Kanker","Kabirdham (formerly Kawardha)","Mahasamund","Narayanpur","Raigarh","Rajnandgaon","Raipur","Surajpur","Surguja"],"Dadra and Nagar Haveli" : ["Amal","Silvassa"],"Daman and Diu": ["Daman","Diu"],"Delhi": ["Delhi","New Delhi","North Delhi","Noida","Patparganj","Sonabarsa","Tughlakabad"],"Goa": ["Chapora","Dabolim","Madgaon","Marmugao (Marmagao)","Panaji Port","Panjim","Pellet Plant Jetty/Shiroda","Talpona","Vasco da Gama"],     "Gujarat": ["Ahmedabad","Amreli district","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Dahod","Dang","Gandhinagar","Jamnagar","Junagadh","Kutch","Kheda","Mehsana","Narmada","Navsari","Patan","Panchmahal","Porbandar","Rajkot","Sabarkantha","Surendranagar","Surat","Tapi","Vadodara","Valsad"],"Haryana": ["Ambala","Bhiwani","Faridabad","Fatehabad","Gurgaon","Hissar","Jhajjar","Jind","Karnal","Kaithal","Kurukshetra","Mahendragarh","Mewat","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamuna Nagar"],"Himachal Pradesh": ["Baddi","Baitalpur","Chamba","Dharamsala","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul & Spiti","Mandi","Simla","Sirmaur","Solan","Una"], "Jammu and Kashmir": ["Jammu","Leh","Rajouri","Srinagar"],"Jharkhand": ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribag","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahibganj","Seraikela Kharsawan","Simdega","West Singhbhum"],"Karnataka": ["Bagalkot","Bangalore","Bangalore Urban","Belgaum","Bellary","Bidar","Bijapur","Chamarajnagar", "Chikkamagaluru","Chikkaballapur","Chitradurga","Davanagere","Dharwad","Dakshina Kannada","Gadag","Gulbarga","Hassan","Haveri district","Kodagu","Kolar","Koppal","Mandya","Mysore","Raichur","Shimoga","Tumkur","Udupi","Uttara Kannada","Ramanagara","Yadgir"],"Kerala": ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thrissur","Thiruvananthapuram","Wayanad"],"Madhya Pradesh": ["Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhilai","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Dewas","Dhar","Guna","Gwalior","Hoshangabad","Indore","Itarsi","Jabalpur","Khajuraho","Khandwa","Khargone","Malanpur","Malanpuri (Gwalior)","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Panna","Pithampur","Raipur","Raisen","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Singrauli","Ujjain"],"Maharashtra": ["Ahmednagar","Akola","Alibag","Amaravati","Arnala","Aurangabad","Aurangabad","Bandra","Bassain","Belapur","Bhiwandi","Bhusaval","Borliai-Mandla","Chandrapur","Dahanu","Daulatabad","Dighi (Pune)","Dombivali","Goa","Jaitapur","Jalgaon","Jawaharlal Nehru (Nhava Sheva)","Kalyan","Karanja","Kelwa","Khopoli","Kolhapur","Lonavale","Malegaon","Malwan","Manori","Mira Bhayandar","Miraj","Mumbai (ex Bombay)","Murad","Nagapur","Nagpur","Nalasopara","Nanded","Nandgaon","Nasik","Navi Mumbai","Nhave","Osmanabad","Palghar","Panvel","Pimpri","Pune","Ratnagiri","Sholapur","Shrirampur","Shriwardhan","Tarapur","Thana","Thane","Trombay","Varsova","Vengurla","Virar","Wada"],"Manipur": ["Bishnupur","Churachandpur","Chandel","Imphal East","Senapati","Tamenglong","Thoubal","Ukhrul","Imphal West"],"Meghalaya": ["Baghamara","Balet","Barsora","Bolanganj","Dalu","Dawki","Ghasuapara","Mahendraganj","Moreh","Ryngku","Shella Bazar","Shillong"],"Mizoram": ["Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Serchhip"],"Nagaland": ["Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Peren","Phek","Tuensang","Wokha","Zunheboto"],    "Orissa": ["Bahabal Pur","Bhubaneswar","Chandbali","Gopalpur","Jeypore","Paradip Garh","Puri","Rourkela"],    "Puducherry": ["Karaikal","Mahe","Pondicherry","Yanam"],    "Punjab": ["Amritsar","Barnala","Bathinda","Firozpur","Faridkot","Fatehgarh Sahib","Fazilka","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Mansa","Moga","Sri Muktsar Sahib","Pathankot",                                        "Patiala","Rupnagar","Ajitgarh (Mohali)","Sangrur","Shahid Bhagat Singh Nagar","Tarn Taran"],    "Rajasthan": ["Ajmer","Banswara","Barmer","Barmer Rail Station","Basni","Beawar","Bharatpur","Bhilwara","Bhiwadi","Bikaner","Bongaigaon","Boranada, Jodhpur","Chittaurgarh","Fazilka","Ganganagar","Jaipur","Jaipur-Kanakpura",                                       "Jaipur-Sitapura","Jaisalmer","Jodhpur","Jodhpur-Bhagat Ki Kothi","Jodhpur-Thar","Kardhan","Kota","Munabao Rail Station","Nagaur","Rajsamand","Sawaimadhopur","Shahdol","Shimoga","Tonk","Udaipur"],     "Sikkim": ["Chamurci","Gangtok"],        "Tamil Nadu": ["Ariyalur","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Mandapam","Nagapattinam","Nilgiris","Namakkal","Perambalur","Pudukkottai","Ramanathapuram","Salem","Sivaganga","Thanjavur","Thiruvallur","Tirupur",                                   "Tiruchirapalli","Theni","Tirunelveli","Thanjavur","Thoothukudi","Tiruvallur","Tiruvannamalai","Vellore","Villupuram","Viruthunagar"],    "Telangana": ["Adilabad","Hyderabad","Karimnagar","Mahbubnagar","Medak","Nalgonda","Nizamabad","Ranga Reddy","Warangal"],    "Tripura": ["Agartala","Dhalaighat","Kailashahar","Kamalpur","Kanchanpur","Kel Sahar Subdivision","Khowai","Khowaighat","Mahurighat","Old Raghna Bazar","Sabroom","Srimantapur"],    "Uttar Pradesh": ["Agra","Allahabad","Auraiya","Banbasa","Bareilly","Berhni","Bhadohi","Dadri","Dharchula","Gandhar","Gauriphanta","Ghaziabad","Gorakhpur","Gunji",                                    "Jarwa","Jhulaghat (Pithoragarh)","Kanpur","Katarniyaghat","Khunwa","Loni","Lucknow","Meerut","Moradabad","Muzaffarnagar","Nepalgunj Road","Pakwara (Moradabad)",                                    "Pantnagar","Saharanpur","Sonauli","Surajpur","Tikonia","Varanasi"],    "Uttarakhand": ["Almora","Badrinath","Bangla","Barkot","Bazpur","Chamoli","Chopra","Dehra Dun","Dwarahat","Garhwal","Haldwani","Hardwar","Haridwar","Jamal","Jwalapur","Kalsi","Kashipur","Mall",                                           "Mussoorie","Nahar","Naini","Pantnagar","Pauri","Pithoragarh","Rameshwar","Rishikesh","Rohni","Roorkee","Sama","Saur"],    "West Bengal": ["Alipurduar","Bankura","Bardhaman","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Kolkata","Maldah","Murshidabad","Nadia","North 24 Parganas","Paschim Medinipur","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"] };
  $scope.contactList = [{"contactName" : "Abhishek"},{"contactName" : "Sunny"},{"contactName" : "Suraj"},{"contactName" : "Abhishek"}]


  $scope.deleteRow = function(row) {
    var index = $scope.gridOptions.data.indexOf(row.entity);
    $scope.gridOptions.data.splice(index, 1);
  };

  
  if(!$rootScope.username)
  {
      $location.path('/login');
  }

  $scope.isLast = function(row) {
    return row.uid === $scope.gridApi.grid.renderContainers.body.visibleRowCache[$scope.gridApi.grid.renderContainers.body.visibleRowCache.length-1].uid;
  }

  $scope.gridOptions = {

    showColumnFooter: true,
    data: data,
    exporterCsvFilename: 'Invoice.csv',
    // gridFooterTemplate: "<div class=\"ui-grid-footer-info ui-grid-grid-footer\"><span>{{gridApi.grid.columns[9].getAggregationValue()}}</span><span ng-if=\"grid.renderContainers.body.visibleRowCache.length !== grid.rows.length\" class=\"ngLabel\">({{\"search.showingItems\" | t}} {{grid.renderContainers.body.visibleRowCache.length}})</span><br> <span>Line Total: ${{grid.appScope.linetotal|number}}</span><br><span>The Avg Total: $ {{grid.appScope.linetotal/2|number}}</span></div>",
    // showGridFooter:true,
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
    $scope.gridApi = gridApi;
    console.log($scope.gridOptions.columnDefs[0]);
        
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
    {name: 'itemId',width: '13%',visible:false},
    {name: 'itemCode',width: '13%', displayName: 'Item Code'},
    {name: 'inventoryId',width: '13%', displayName: 'Inventory Id'},

    {name: 'itemName',width: '13%',cellClass:'overflow', displayName: 'Item Name',
    //editableCellTemplate: '<div class="dropdown dropdown-scroll" dropdown dropdown-append-to-body ui-grid-editor ng-model="MODEL_COL_FIELD" ng-change="grid.appScope.toggleModal(row.entity)"><button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">Select <span class="caret"></span></button><ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1"><li role="presentation"><div class="input-group input-group-sm search-control"> <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span><input type="text" class="form-control" placeholder="Query" ng-model="query"></input></div></li><li role="presentation" ng-repeat="item in items | filter:query"> <a href="#"> {{item.name}} </a></li></ul></div>'
    editableCellTemplate: '<div><select  ui-grid-editor ng-model="MODEL_COL_FIELD" ng-change="grid.appScope.toggleModal(row.entity)"><option value="" selected>Choose Item</option><option value="create">Create Item</option><option value="Item1">Item1</option><option value="Item2">Item2</option><option value="Item3">Item3</option></select></div>' 
    },
    //{name: 'itemDesc',width: '10%', displayName: 'ITEM DESCRIPTION'},
    {name: 'quantity',width: '10%', displayName: 'Quantity'},
    {name: 'isTaxeble',width: '10%', displayName: 'isTaxeble'},
    {name: 'quantityType',width: '10%', displayName: 'Quantity Type'},
    {name: 'actualUnitPrice',width: '10%', displayName: 'Unit Price'},
    {name: 'discount',width: '10%', displayName: 'Discount'},
    {name: 'tax',width: '14%', displayName: 'Tax', 
     editableCellTemplate: '<div><select  ui-grid-editor ng-model="MODEL_COL_FIELD" ng-change="grid.appScope.toggleTaxModal(row.entity.tax)"><option value="" selected>Choose Item</option><option value="createTax">Create Item</option><option value="Item1">Item1</option><option value="Item2">Item2</option><option value="Item3">Item3</option></select></div>',

    cellTemplate: '<span>{{row.entity.tax}}% (Tax Amt: {{(((row.entity.quantity * row.entity.actualUnitPrice) - row.entity.discount) / row.entity.tax) | number:2 }} )', aggregationType: uiGridConstants.aggregationTypes.sum },
    {name: 'taxAmountForItem', displayName: '', cellTemplate: '<span> {{grid.appScope.setCellTemplateValues(row.entity,"taxAmount")}}', aggregationType: uiGridConstants.aggregationTypes.sum },
    {name: 'amountAfterTax',width: '10%', displayName: 'Total', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.setCellTemplateValues(row.entity,"total") | number :2}}</div>', aggregationType: uiGridConstants.aggregationTypes.sum,footerCellTemplate: '<div class="ui-grid-cell-contents"><div style="text-align:right;">Subtotal: 1222.00</div> <div style="text-align:right;">CGST Tax: {{gridApi.grid.columns[8].getAggregationValue()}}</div> Total: {{col.getAggregationValue() | number:2 }}</div>'},
    //{name: 'gstItemCode', displayName: 'GST ITEM CODE', aggregationType: uiGridConstants.aggregationTypes.sum,    footerCellTemplate: '<div class="ui-grid-cell-contents"><div style="text-align:right;">Subtotal: 1222.00</div> <div style="text-align:right;">Sales Tax: 12.00</div> Total: {{col.getAggregationValue() | number:2 }}</div>'},
    {name: 'productValue',width: '10%', displayName: 'Buying Price'},
    {name: 'marginAmount',width: '10%', displayName: 'Margin', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.setCellTemplateValues(row.entity,"margin")}}</div>'},
    {name: 'taxOnMargin',width: '10%', displayName: 'Margin Tax', cellTemplate: '<span>{{row.entity.taxOnMargin}}%</span>'},
    {name: 'totalCGST',width: '10%', displayName: 'Total CGST', cellTemplate: '<span>{{grid.appScope.setCellTemplateValues(row.entity,"totalCGST") | number:2}} </span>'},
    {name: 'totalSGST',width: '10%', displayName: 'Total SGST', cellTemplate: '<span>{{grid.appScope.setCellTemplateValues(row.entity,"totalSGST") | number:2}} </span>'},
    {name: 'totalIGST',width: '10%', displayName: 'Total IGST', cellTemplate: '<span>{{grid.appScope.setCellTemplateValues(row.entity,"totalIGST") | number:2}} </span>'},
    {name: 'amountBeforeTax',width: '10%', displayName: 'amountBeforeTax', cellTemplate: '<div class="ui-grid-cell-contents">{{(row.entity.amountAfterTax -  row.entity.taxAmountForItem) | number :2}}</div>', aggregationType: uiGridConstants.aggregationTypes.sum,footerCellTemplate: '<div class="ui-grid-cell-contents"><div style="text-align:right;">Subtotal: 1222.00</div> <div style="text-align:right;">CGST Tax: {{gridApi.grid.columns[8].getAggregationValue()}}</div> Total: {{col.getAggregationValue() | number:2 }}</div>'},
    {name: 'isAdded',width: '10%', displayName: 'Added'},
    {name: 'isUpdated',width: '10%', displayName: 'Updated'},
    {name: 'isDeleted',width: '10%', displayName: 'Deleted'},
    {name: 'Delete',width: '10%',cellTemplate: '<button class="btn primary" ng-click="grid.appScope.deleteRow(row)"><span class="glyphicon glyphicon-remove"></button>'}
  ];
  
$scope.gridOptions.columnDefs[0];

 $scope.setCellTemplateValues = function(param,column){

    var output = 0;

    if(column == "total"){

      output = ((param.quantity * param.actualUnitPrice) - param.discount) + (((param.quantity * param.actualUnitPrice) - param.discount) / param.tax)
      param.amountAfterTax = output;

    } else if(column == "margin"){

      output = (param.actualUnitPrice - param.productValue) * param.quantity
      param.marginAmount = output;

    }else if(column == "taxAmount"){

      output = (((param.quantity * param.actualUnitPrice) - param.discount) / param.tax)
      param.taxAmountForItem = output;

    }else if(column == "totalCGST" || column == "totalSGST"){

      var result  = false;
      var fromState = "AP";
      var toState = "AP";

      if(fromState === toState){
        result = true;
      }
      if(result){
        output = (((param.quantity * param.actualUnitPrice) - param.discount) / param.tax) / 2 ;
        param.totalSGST = output;
        param.totalCGST = output;
      }
      

    }else if(column == "totalIGST"){

      var result  = false;
      var fromState = "AP";
      var toState = "AP";

      if(fromState === toState){
        result = true;
      }

      if(!result){
        output = (((param.quantity * param.actualUnitPrice) - param.discount) / param.tax) ;
        param.totalIGST = output;
      }

    }

    return output;
  }
  
//  $scope.grandTotal = function(total){
//   var grandTotal = total
//   console.log(grandTotal);
//   return grandTotal;
// }

$scope.totalTax = function(){

  var output  = false;
  var fromState = "AP";
  var toState = "AP";

   if(fromState === toState){
     output = true;
   }

  return output;

}

 $scope.downloadCSV = function(){
  $scope.gridApi.exporter.csvExport(uiGridExporterConstants.VISIBLE,uiGridExporterConstants.ALL);
}

 $scope.downloadPDF = function(){
  $scope.gridApi.exporter.pdfExport(uiGridExporterConstants.VISIBLE,uiGridExporterConstants.ALL);
}


  // $scope.gridOptions.data = [{
  //   "itemId": "1234",
  //   "itemCode": "I123",
  //   "itemName": "Item1",
  //   "qty": 10,
  //   "qtyType": "Kg",
  //   "unitPrice": 15,
  //   "discount": 10,
  //   "buyingPrice": 10,
  //   "tax": 10,
  //   "marginTax":10
  // }, {
  //   "itemId": "2345",
  //   "itemCode": "I234",
  //   "itemName": "Item2",
  //   "qty": 10,
  //   "qtyType": "Kg",
  //   "unitPrice": 25,
  //   "discount": 10,
  //   "buyingPrice": 20,
  //   "tax": 10,
  //   "marginTax":10
  // }, {
  //   "itemId": "4567",
  //   "itemCode": "I345",
  //   "itemName": "Item3",
  //   "qty": 10,
  //   "qtyType": "Kg",
  //   "unitPrice": 35,
  //   "discount": 10,
  //   "buyingPrice": 15,
  //   "tax": 10,
  //   "marginTax":10
  // }];

  $scope.invoiceData = {
  "billNumber" : "",
  "billFromContactId" : "fromContact",
  "billToContactId" : "toContact",
  "companyId" : "C1234",
  "uid":"i123",
  "items" : [
  {
  "itemId" : "RjdNmYSI3tNBA7mwBqfd",
  "inventoryId" : "ahlLu86AeMe1S0FOQgvM",
  "itemName" : "1234",
  "isTaxeble" : "true",
  "productValue": "10",
  "quantityType":"KG",
  "quantity": "10",
  "tax":"10",
  "actualUnitPrice":"20",
  "amountBeforeTax": "20",
  "taxAmountForItem": "3",
  "totalCGST": "9.5",
  "totalSGST":"9.5",
  "totalIGST":"",
  "amountAfterTax": "4",
  "discount": "10",
  "marginAmount":"12",
  "taxOnMargin":"10",
  "taxId":"fh300oAMwUa9CGN8xBpL",
  "isAdded":"Yes",
  "isUpdated":"No",
  "isDeleted":"No"
  }
  ],
  "dateOfBill" : "11/01/2017",
  "dueDate" :  "12/01/2017",
  "totalAmount" : "5000",
  "totalTax" : "234",
  "totalCGST" : "117",
  "totalSGST" : "117",
  "totalIGST" : "",
  "referenceMobileNumber" : "8176179482",
  "referenceAadharCardNumber" : "A1234",
  "isTaxeble" : "true",
  "isUpdated" : "No",
  "isDeleted" : "No",
  "year" : "2017",
  "month" : "January",
  "day" :"12"

};
  
$scope.gridOptions.data = $scope.invoiceData.items;

console.log($scope.gridOptions.data);


$scope.saveGridData = function(){

console.log("$scope.gridOptions.data=====",JSON.stringify($scope.gridOptions.data));


var data = {"billFromContactId" : "fromContact","billToContactId" : "toContact","uid":"i123","items" : $scope.gridOptions.data,"dateOfBill" : "11/01/2017","dueDate" :  "12/01/2017","totalAmount" : "5000","totalTax" : "234","totalCGST" : "9.5","totalSGST" : "9.5","totalIGST" : "","referenceMobileNumber" : "8176179482","referenceAadharCardNumber" : "A1234","isTaxeble" : "true","isUpdated" : "No","isDeleted" : "No","year" : "2017","taxId":"fh300oAMwUa9CGN8xBpL","month" : "January","day" :"12"}

console.log("JSON.stringify(data)====",JSON.stringify(data))
    //Call the services
    $http.post('http://localhost:8081/billlive/company/bill/add?companyId=C123456&uid=U1234', JSON.stringify(data)).then(function (response) {
    if (response.data)
    $scope.msg = "Post Data Submitted Successfully!";
    }, function (response) {
    $scope.msg = "Service not Exists";
    $scope.statusval = response.status;
    $scope.statustext = response.statusText;
    $scope.headers = response.headers();
    });
}


   $scope.addData = function(itemId,itemCode,itemName,qty,qtyType,unitPrice,discount,buyingPrice,tax) {
    var n = $scope.gridOptions.data.length + 1;
    $scope.gridOptions.data.push({
                "itemId": itemId,
                "itemCode": itemCode,
                "itemName": itemName,
                "qty": qty,
                "qtyType": qtyType,
                "unitPrice": unitPrice,
                "discount": discount,
                "buyingPrice": buyingPrice,
                "tax": tax
              });
    
  };

  $scope.showItemModal = false;
    $scope.itemButtonClicked = "";
    $scope.toggleModal = function(option){
      if( option.itemName == 'create'){
         $scope.itemButtonClicked = "Cancel";
        $scope.showItemModal = !$scope.showItemModal;
      }else if( option.itemName == 'Item1'){
        option.itemDesc="desc1";
      }else if( option.itemName == 'Item2'){
        option.itemDesc="desc2";
      }else if( option.itemName == 'Item3'){
        option.itemDesc="desc3";
      }
       
    };

    $scope.showContactModal = false;
    $scope.contactButtonClicked = "";

    $scope.toggleContactModal = function(option,addType){
      console.log("toggleToContactModal======"+option);
      console.log(addType);
      if( option == 'createContact'){
        $scope.addressType = addType;
         $scope.contactButtonClicked = "Cancel";
        $scope.showContactModal = !$scope.showContactModal;
      }
       
    };

    $scope.showTaxModal = false;
    $scope.taxButtonClicked = "";

    $scope.toggleTaxModal = function(option){
      console.log("toggleTaxModal======"+option);
      if( option == 'createTax'){
         $scope.taxButtonClicked = "Cancel";
        $scope.showTaxModal = !$scope.showTaxModal;
      }
    };

    $scope.addContact = function () {
       console.log($scope.type);

    var addressType = $scope.addressType;
    var type = $scope.type;
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
    var state = document.getElementById('state').options[document.getElementById('state').selectedIndex].innerHTML
    var district = $scope.district;
    var city = $scope.user.city;
    var phoneNumber = $scope.user.phoneNumber;
    var email = $scope.user.email;
    var typeOfUser = $scope.user.typeOfUser;
  console.log(type+"    "+addressType+"   "+firstName+"    "+lastName+"    "+company+"    "+legalOrTradingName+"    "+lineOfBusiness+"    "+organizationDesc+"    "+gstRegistrationNum+"    "+website+"    "+address
      +"    "+country+"    "+state+"    "+district+"    "+city+"    "+phoneNumber+"    "+email+"    "+typeOfUser);

    var data = {
                  "postId" : "p123",
                  "contactCompanyName" : $scope.user.company,
                  "firstName" : $scope.user.firstName,
                  "lastName" : $scope.user.lastName,
                  "email" : $scope.user.email,
                  "phoneNumber" : $scope.user.phoneNumber,
                  "fax" : $scope.user.fax,
                  "mobileNumber" : $scope.user.mobileNumber,
                  "website" : $scope.user.website,
                  "address" : $scope.user.address,
                  "country" : $scope.user.country,
                  "state" : document.getElementById('state').options[document.getElementById('state').selectedIndex].innerHTML,
                  "district" : $scope.district,
                  "city" : $scope.user.city,
                  "taxId" : "t123",
                  "lineOfBusiness" : $scope.user.lineOfBusiness, 
                  "organizationDesc" : $scope.user.organizationDesc,
                  "gstRegistrationNum" : $scope.user.gstRegistrationNum,
                  "typeOfUser" : $scope.type
              };

     console.log(JSON.stringify(data));         
    //Call the services
    $http.post('http://localhost:8081/billlive/company/addcontact?companyId=C123456&uid=U1234', JSON.stringify(data)).then(function (response) {
    if (response.data)
    $scope.msg = "Contact Data Submitted Successfully!";
    console.log($scope.msg);
    }, function (response) {
    $scope.msg = "Service not Exists";
    $scope.statusval = response.status;
    $scope.statustext = response.statusText;
    $scope.headers = response.headers();
    });




   };




 $scope.addTax = function (taxDesc,totalTaxPercentage,taxPercentageCGST,taxPercentageSGST,taxPercentageIGST) {

    var totalTaxPercentage = totalTaxPercentage;
    var taxPercentageCGST = taxPercentageCGST;
    var taxPercentageSGST = taxPercentageSGST;
    var taxDesc = taxDesc;
    var taxPercentageIGST = taxPercentageIGST;
    
  console.log(totalTaxPercentage+"    "+taxPercentageCGST+"   "+taxPercentageSGST+"    "+taxDesc+"    "+taxPercentageIGST);

       var taxData = {
        companyId : "c123",
        totalTaxPercentage : totalTaxPercentage,
        taxPercentageCGST : taxPercentageCGST,
        taxPercentageSGST : taxPercentageSGST,
        taxDesc : taxDesc,
        taxPercentageIGST : taxPercentageIGST
    };
    console.log(JSON.stringify(taxData))
    //Call the services
    $http.post('http://localhost:8081/billlive/company/tax/add?companyId=C123456&uid=U1234', JSON.stringify(taxData)).then(function (response) {
    if (response)
    $scope.msg = "Posted tax Data Submitted Successfully!";
    console.log($scope.msg);
    }, function (response) {
    $scope.msg = "Service not Exists";
    $scope.statusval = response.status;
    $scope.statustext = response.statusText;
    $scope.headers = response.headers();
    });




   };


   $scope.addItem = function (item) {


    var hsnCode = item.hsnCode;
    var gstItemCode = item.gstItemCode;
    var itemName = item.itemName ;
    var itemDesc = item.itemDesc ;
    var quantityDesc = item.quantityDesc;
    var buyQuantityType = item.buyQuantityType;
    var actualQuantity = item.actualQuantity ;
    var remainingQuantity = item.remainingQuantity;
    var unitPrice = item.unitPrice;
    var sellingPrice = item.sellingPrice;
    var sellingPrice = item.sellingPrice;
    var otherSellQuantityTypeOption = item.otherSellQuantityTypeOption;
    var otherSellOptionQuantityEquivalent = item.otherSellOptionQuantityEquivalent;
    var otherSellOptionBuyingPrice = item.otherSellOptionBuyingPrice;
    var otherSellOptionSellingPrice = item.otherSellOptionSellingPrice;
    var defaultMarginPercentage = item.defaultMarginPercentage;
    var defaultMarginAmount = item.defaultMarginAmount ;
    var minimumStockValue = item.minimumStockValue;
    var taxId = item.taxId;

       var itemData = {
        "hsnCode" : hsnCode,
        "gstItemCode" : gstItemCode,
        "itemName" : itemName ,
        "itemDesc" : itemDesc ,
        "inventories" : [
          {
              "quantityDesc" : quantityDesc,
              "buyQuantityType" : buyQuantityType,
              "actualQuantity" : actualQuantity ,
              "remainingQuantity" : remainingQuantity,
              "unitPrice" : unitPrice,
              "sellingPrice" : sellingPrice,
              "otherSellQuantityTypeOption" : otherSellQuantityTypeOption, 
              "otherSellOptionQuantityEquivalent" : otherSellOptionQuantityEquivalent,
              "otherSellOptionBuyingPrice" : otherSellOptionBuyingPrice,
              "otherSellOptionSellingPrice" : otherSellOptionSellingPrice,
              "defaultMarginPercentage" : defaultMarginPercentage,
              "defaultMarginAmount" : defaultMarginAmount ,
              "minimumStockValue" : minimumStockValue
          }
        ],
        "taxId" : "67XhYcnQh2U31POWgztn"
    };

    console.log(JSON.stringify(itemData))
    //Call the services
    $http.post('http://localhost:8081/billlive/company/item/add?companyId=C123456&uid=U1234', JSON.stringify(itemData)).then(function (response) {
    if (response)
    $scope.msg = "Posted tax Data Submitted Successfully!";
    console.log($scope.msg);
    }, function (response) {
    $scope.msg = "Service not Exists";
    $scope.statusval = response.status;
    $scope.statustext = response.statusText;
    $scope.headers = response.headers();
    });




   };


    // $http({
    //         method: 'GET',
    //         url: 'http://localhost:8081/billlive/company/getallbills?companyId=C123456&uid=U1234',
    //         headers: {'Content-Type': 'application/json'}
    //     }).success(function(data){
    //         // With the data succesfully returned, call our callback
    //         console.log("contacts=====",data);
    //     }).error(function(){
    //         console.log("error");
    //     });


   $scope.type = "customer";

    // $scope.toggleFromContactModal = function(option){
    //   console.log("toggleFromContactModal======"+option);
    //   if( option == 'createContact'){
    //      $scope.contactButtonClicked = "Cancel";
    //     $scope.showContactModal = !$scope.showContactModal;
    //   }
       
    // };

  $scope.addRow = function() {
    var n = $scope.gridOptions.data.length + 1;
    $scope.gridOptions.data.push({
                  "itemId": "",
                  "itemCode": "",
                  "itemName": "",
                  "qty": "",
                  "qtyType": "",
                  "unitPrice": "",
                  "discount": "",
                  "buyingPrice": "" ,
                  "tax": ""
              });
  };

  $scope.logout = function(){
    CommonProp.logoutUser();
  }

    $scope.products = productService.getProducts();
var i;
if($scope.products.length != 0){
  for(i=0;i<$scope.products.length;i++){
    $scope.addData($scope.products[i].itemId,$scope.products[i].itemCode,$scope.products[i].itemName,$scope.products[i].qty,$scope.products[i].qtyType,$scope.products[i].unitPrice,$scope.products[i].discount,$scope.products[i].buyingPrice,$scope.products[i].tax);
  }
  
}

$scope.logout = function(){
    CommonProp.logoutUser();
  }

}]);