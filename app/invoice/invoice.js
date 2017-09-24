'use restrict';

angular.module('webApp.invoice', ['ngRoute', 'firebase', 'ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.exporter', 'ui.grid.selection'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/invoice', {
      templateUrl: 'invoice/invoice.html',
      controller: 'InvoiceCtrl'
    });
  }])

  .controller('InvoiceCtrl', ['$scope', '$firebaseAuth', '$location', '$log', 'uiGridConstants', 'uiGridExporterService', 'uiGridExporterConstants', 'productService', 'CommonProp', '$firebaseArray', '$firebaseObject', '$rootScope', '$window', '$http', function ($scope, $firebaseAuth, $location, $log, uiGridConstants, uiGridExporterService, uiGridExporterConstants, productService, CommonProp, $firebaseArray, $firebaseObject, $rootScope, $window, $http) {

    var data = [];
    $scope.rows = [];
    $rootScope.username = CommonProp.getUser();
    $scope.states = { "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "SriPotti Sri Ramulu Nellore", "Vishakhapatnam", "Vizianagaram", "West Godavari", "Cudappah"], "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Siang", "East Kameng", "Kurung Kumey", "Lohit", "Longding", "Lower Dibang Valley", "Lower Subansiri", "Papum Pare", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"], "Assam": ["Baksa", "Barpeta", "Bongaigaon", "Cachar", "Chirang", "Darrang", "Dhemaji", "Dima Hasao", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "Tinsukia", "Udalguri"], "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"], "Chhattisgarh": ["Bastar", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Jashpur", "Janjgir-Champa", "Korba", "Koriya", "Kanker", "Kabirdham (formerly Kawardha)", "Mahasamund", "Narayanpur", "Raigarh", "Rajnandgaon", "Raipur", "Surajpur", "Surguja"], "Dadra and Nagar Haveli": ["Amal", "Silvassa"], "Daman and Diu": ["Daman", "Diu"], "Delhi": ["Delhi", "New Delhi", "North Delhi", "Noida", "Patparganj", "Sonabarsa", "Tughlakabad"], "Goa": ["Chapora", "Dabolim", "Madgaon", "Marmugao (Marmagao)", "Panaji Port", "Panjim", "Pellet Plant Jetty/Shiroda", "Talpona", "Vasco da Gama"], "Gujarat": ["Ahmedabad", "Amreli district", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Dahod", "Dang", "Gandhinagar", "Jamnagar", "Junagadh", "Kutch", "Kheda", "Mehsana", "Narmada", "Navsari", "Patan", "Panchmahal", "Porbandar", "Rajkot", "Sabarkantha", "Surendranagar", "Surat", "Tapi", "Vadodara", "Valsad"], "Haryana": ["Ambala", "Bhiwani", "Faridabad", "Fatehabad", "Gurgaon", "Hissar", "Jhajjar", "Jind", "Karnal", "Kaithal", "Kurukshetra", "Mahendragarh", "Mewat", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamuna Nagar"], "Himachal Pradesh": ["Baddi", "Baitalpur", "Chamba", "Dharamsala", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul & Spiti", "Mandi", "Simla", "Sirmaur", "Solan", "Una"], "Jammu and Kashmir": ["Jammu", "Leh", "Rajouri", "Srinagar"], "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribag", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"], "Karnataka": ["Bagalkot", "Bangalore", "Bangalore Urban", "Belgaum", "Bellary", "Bidar", "Bijapur", "Chamarajnagar", "Chikkamagaluru", "Chikkaballapur", "Chitradurga", "Davanagere", "Dharwad", "Dakshina Kannada", "Gadag", "Gulbarga", "Hassan", "Haveri district", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysore", "Raichur", "Shimoga", "Tumkur", "Udupi", "Uttara Kannada", "Ramanagara", "Yadgir"], "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thrissur", "Thiruvananthapuram", "Wayanad"], "Madhya Pradesh": ["Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhilai", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Dewas", "Dhar", "Guna", "Gwalior", "Hoshangabad", "Indore", "Itarsi", "Jabalpur", "Khajuraho", "Khandwa", "Khargone", "Malanpur", "Malanpuri (Gwalior)", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Pithampur", "Raipur", "Raisen", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Singrauli", "Ujjain"], "Maharashtra": ["Ahmednagar", "Akola", "Alibag", "Amaravati", "Arnala", "Aurangabad", "Aurangabad", "Bandra", "Bassain", "Belapur", "Bhiwandi", "Bhusaval", "Borliai-Mandla", "Chandrapur", "Dahanu", "Daulatabad", "Dighi (Pune)", "Dombivali", "Goa", "Jaitapur", "Jalgaon", "Jawaharlal Nehru (Nhava Sheva)", "Kalyan", "Karanja", "Kelwa", "Khopoli", "Kolhapur", "Lonavale", "Malegaon", "Malwan", "Manori", "Mira Bhayandar", "Miraj", "Mumbai (ex Bombay)", "Murad", "Nagapur", "Nagpur", "Nalasopara", "Nanded", "Nandgaon", "Nasik", "Navi Mumbai", "Nhave", "Osmanabad", "Palghar", "Panvel", "Pimpri", "Pune", "Ratnagiri", "Sholapur", "Shrirampur", "Shriwardhan", "Tarapur", "Thana", "Thane", "Trombay", "Varsova", "Vengurla", "Virar", "Wada"], "Manipur": ["Bishnupur", "Churachandpur", "Chandel", "Imphal East", "Senapati", "Tamenglong", "Thoubal", "Ukhrul", "Imphal West"], "Meghalaya": ["Baghamara", "Balet", "Barsora", "Bolanganj", "Dalu", "Dawki", "Ghasuapara", "Mahendraganj", "Moreh", "Ryngku", "Shella Bazar", "Shillong"], "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"], "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"], "Orissa": ["Bahabal Pur", "Bhubaneswar", "Chandbali", "Gopalpur", "Jeypore", "Paradip Garh", "Puri", "Rourkela"], "Puducherry": ["Karaikal", "Mahe", "Pondicherry", "Yanam"], "Punjab": ["Amritsar", "Barnala", "Bathinda", "Firozpur", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Sri Muktsar Sahib", "Pathankot", "Patiala", "Rupnagar", "Ajitgarh (Mohali)", "Sangrur", "Shahid Bhagat Singh Nagar", "Tarn Taran"], "Rajasthan": ["Ajmer", "Banswara", "Barmer", "Barmer Rail Station", "Basni", "Beawar", "Bharatpur", "Bhilwara", "Bhiwadi", "Bikaner", "Bongaigaon", "Boranada, Jodhpur", "Chittaurgarh", "Fazilka", "Ganganagar", "Jaipur", "Jaipur-Kanakpura", "Jaipur-Sitapura", "Jaisalmer", "Jodhpur", "Jodhpur-Bhagat Ki Kothi", "Jodhpur-Thar", "Kardhan", "Kota", "Munabao Rail Station", "Nagaur", "Rajsamand", "Sawaimadhopur", "Shahdol", "Shimoga", "Tonk", "Udaipur"], "Sikkim": ["Chamurci", "Gangtok"], "Tamil Nadu": ["Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mandapam", "Nagapattinam", "Nilgiris", "Namakkal", "Perambalur", "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga", "Thanjavur", "Thiruvallur", "Tirupur", "Tiruchirapalli", "Theni", "Tirunelveli", "Thanjavur", "Thoothukudi", "Tiruvallur", "Tiruvannamalai", "Vellore", "Villupuram", "Viruthunagar"], "Telangana": ["Adilabad", "Hyderabad", "Karimnagar", "Mahbubnagar", "Medak", "Nalgonda", "Nizamabad", "Ranga Reddy", "Warangal"], "Tripura": ["Agartala", "Dhalaighat", "Kailashahar", "Kamalpur", "Kanchanpur", "Kel Sahar Subdivision", "Khowai", "Khowaighat", "Mahurighat", "Old Raghna Bazar", "Sabroom", "Srimantapur"], "Uttar Pradesh": ["Agra", "Allahabad", "Auraiya", "Banbasa", "Bareilly", "Berhni", "Bhadohi", "Dadri", "Dharchula", "Gandhar", "Gauriphanta", "Ghaziabad", "Gorakhpur", "Gunji", "Jarwa", "Jhulaghat (Pithoragarh)", "Kanpur", "Katarniyaghat", "Khunwa", "Loni", "Lucknow", "Meerut", "Moradabad", "Muzaffarnagar", "Nepalgunj Road", "Pakwara (Moradabad)", "Pantnagar", "Saharanpur", "Sonauli", "Surajpur", "Tikonia", "Varanasi"], "Uttarakhand": ["Almora", "Badrinath", "Bangla", "Barkot", "Bazpur", "Chamoli", "Chopra", "Dehra Dun", "Dwarahat", "Garhwal", "Haldwani", "Hardwar", "Haridwar", "Jamal", "Jwalapur", "Kalsi", "Kashipur", "Mall", "Mussoorie", "Nahar", "Naini", "Pantnagar", "Pauri", "Pithoragarh", "Rameshwar", "Rishikesh", "Rohni", "Roorkee", "Sama", "Saur"], "West Bengal": ["Alipurduar", "Bankura", "Bardhaman", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Kolkata", "Maldah", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Medinipur", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"] };
  
    var date = new Date();
    $scope.currentYear =  date.getFullYear();
    $scope.currentMonth = date.getMonth() + 1;
    $scope.currentDate = date.getDate();
    $scope.deleteRow = function (row) {
      var index = $scope.gridOptions.data.indexOf(row.entity);
      row.entity.isDeleted = 'Yes';
      console.log((row.entity));
      // $scope.gridOptions.data.splice(index, 1);
    };


    if (!$rootScope.username) {
      $location.path('/login');
    }

    $scope.isLast = function (row) {
      return row.uid === $scope.gridApi.grid.renderContainers.body.visibleRowCache[$scope.gridApi.grid.renderContainers.body.visibleRowCache.length - 1].uid;
    }

    $scope.gridOptions = {

      showColumnFooter: true,
      data: data,
      exporterCsvFilename: 'Invoice.csv',
      // gridFooterTemplate: "<div class=\"ui-grid-footer-info ui-grid-grid-footer\"><span>{{gridApi.grid.columns[9].getAggregationValue()}}</span><span ng-if=\"grid.renderContainers.body.visibleRowCache.length !== grid.rows.length\" class=\"ngLabel\">({{\"search.showingItems\" | t}} {{grid.renderContainers.body.visibleRowCache.length}})</span><br> <span>Line Total: ${{grid.appScope.linetotal|number}}</span><br><span>The Avg Total: $ {{grid.appScope.linetotal/2|number}}</span></div>",
      // showGridFooter:true,
      exporterPdfDefaultStyle: { fontSize: 9 },
      exporterPdfTableStyle: { margin: [10, 10, 10, 10] },
      exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },
      exporterPdfHeader: { text: "Invoice", style: 'headerStyle' },
      exporterPdfFooter: function (currentPage, pageCount) {
        return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
      },
      exporterPdfCustomFormatter: function (docDefinition) {
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

    $scope.gridOptions.onRegisterApi = function (gridApi) {
      $scope.gridApi = gridApi;
      console.log($scope.gridOptions.columnDefs[0]);

      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        console.log("selected row is ", JSON.stringify($scope.rows));
        $scope.rows = $scope.gridApi.selection.getSelectedRows();
        console.log("selected row is ", JSON.stringify($scope.rows));
      });
    }

    $scope.addBill = function (data) {
      productService.addProduct(data);
      window.location = "#/bill";
    }

    $scope.gridOptions.columnDefs = [
      { name: 'invoiceFromContactId', width: '13%' },
      { name: 'invoiceToContactId', width: '13%' },
      { name: 'uid', width: '13%' },
      { name: 'items[0].itemId', width: '13%', visible: false },
      { name: 'items[0].itemCode', width: '13%', displayName: 'Item Code' },
      { name: 'items[0].inventoryId', width: '13%', displayName: 'Inventory Id' },

      {
        name: 'items[0].itemName', width: '13%', cellClass: 'overflow', displayName: 'Item Name',
        //editableCellTemplate: '<div class="dropdown dropdown-scroll" dropdown dropdown-append-to-body ui-grid-editor ng-model="MODEL_COL_FIELD" ng-change="grid.appScope.toggleModal(row.entity.items[0])"><button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">Select <span class="caret"></span></button><ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1"><li role="presentation"><div class="input-group input-group-sm search-control"> <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span><input type="text" class="form-control" placeholder="Query" ng-model="query"></input></div></li><li role="presentation" ng-repeat="item in items | filter:query"> <a href="#"> {{item.name}} </a></li></ul></div>'
        editableCellTemplate: '<div><select  ui-grid-editor ng-model="MODEL_COL_FIELD" ng-change="grid.appScope.toggleModal(row.entity.items[0])"><option value="" selected>Choose Item</option><option value="create">Create Item</option><option ng-repeat="item in grid.appScope.itemsList.data" value="{{item.itemName}}#{{item.itemId}}">{{item.itemName}}</option></select></div>',
        cellTemplate: '<span>{{grid.appScope.setCellTemplateValues(row.entity.items[0],"itemName")}}</span>'
      },
      //{name: 'itemDesc',width: '10%', displayName: 'ITEM DESCRIPTION'},
      { name: 'items[0].quantity', width: '10%', displayName: 'Quantity' },
      { name: 'items[0].isTaxeble', width: '10%', displayName: 'isTaxeble' },
      { name: 'items[0].quantityType', width: '10%', displayName: 'Quantity Type' },
      { name: 'items[0].actualUnitPrice', width: '10%', displayName: 'Unit Price' },
      { name: 'items[0].discount', width: '10%', displayName: 'Discount' },
      {
        name: 'items[0].taxPercentage', width: '14%', displayName: 'Tax',
        //editableCellTemplate: '<div><select  ui-grid-editor ng-model="MODEL_COL_FIELD" ng-change="grid.appScope.toggleTaxModal(row.entity.items[0])"><option value="" selected>Choose Item</option><option value="createTax">Create Item</option><option value="Item1">Item1</option><option value="Item2">Item2</option><option value="Item3">Item3</option></select></div>',
        editableCellTemplate: '<div><select  ui-grid-editor ng-model="MODEL_COL_FIELD" ng-change="grid.appScope.toggleTaxModal(row.entity.items[0])"><option value="" selected>Choose Tax</option><option value="createTax">Create Tax</option><option  ng-repeat="tax in grid.appScope.taxList.data" value="{{tax.totalTaxPercentage}}">{{tax.totalTaxPercentage}}</option></select></div>',
        
        cellTemplate: '<span>{{row.entity.items[0].taxPercentage}}% (Tax Amt: {{(((row.entity.items[0].quantity * row.entity.items[0].actualUnitPrice) - row.entity.items[0].discount) / row.entity.items[0].taxPercentage) | number:2 }} )', aggregationType: uiGridConstants.aggregationTypes.sum
      },
      { name: 'items[0].taxAmountForItem', displayName: '', cellTemplate: '<span> {{grid.appScope.setCellTemplateValues(row.entity.items[0],"taxAmount")}}', aggregationType: uiGridConstants.aggregationTypes.sum },
      { name: 'items[0].amountAfterTax', width: '10%', displayName: 'Total', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.setCellTemplateValues(row.entity.items[0],"total") | number :2}}</div>', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents"><div style="text-align:right;">Subtotal: 1222.00</div> <div style="text-align:right;">CGST Tax: {{gridApi.grid.columns[8].getAggregationValue()}}</div> Total: {{col.getAggregationValue() | number:2 }}</div>' },
      //{name: 'gstItemCode', displayName: 'GST ITEM CODE', aggregationType: uiGridConstants.aggregationTypes.sum,    footerCellTemplate: '<div class="ui-grid-cell-contents"><div style="text-align:right;">Subtotal: 1222.00</div> <div style="text-align:right;">Sales Tax: 12.00</div> Total: {{col.getAggregationValue() | number:2 }}</div>'},
      { name: 'items[0].productValue', width: '10%', displayName: 'Buying Price' },
      { name: 'items[0].marginAmount', width: '10%', displayName: 'Margin', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.setCellTemplateValues(row.entity.items[0],"margin")}}</div>' },
      { name: 'items[0].taxOnMargin', width: '10%', displayName: 'Margin Tax', cellTemplate: '<span>{{row.entity.items[0].taxOnMargin}}%</span>' },
      { name: 'items[0].totalCGST', width: '10%', displayName: 'Total CGST', cellTemplate: '<span>{{grid.appScope.setCellTemplateValues(row.entity.items[0],"totalCGST") | number:2}} </span>' },
      { name: 'items[0].totalSGST', width: '10%', displayName: 'Total SGST', cellTemplate: '<span>{{grid.appScope.setCellTemplateValues(row.entity.items[0],"totalSGST") | number:2}} </span>' },
      { name: 'items[0].totalIGST', width: '10%', displayName: 'Total IGST', cellTemplate: '<span>{{grid.appScope.setCellTemplateValues(row.entity.items[0],"totalIGST") | number:2}} </span>' },
      { name: 'items[0].amountBeforeTax', width: '10%', displayName: 'amountBeforeTax', cellTemplate: '<div class="ui-grid-cell-contents">{{(row.entity.items[0].amountAfterTax -  row.entity.items[0].taxAmountForItem) | number :2}}</div>', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents"><div style="text-align:right;">Subtotal: 1222.00</div> <div style="text-align:right;">CGST Tax: {{gridApi.grid.columns[8].getAggregationValue()}}</div> Total: {{col.getAggregationValue() | number:2 }}</div>' },
      { name: 'items[0].isAdded', width: '10%', displayName: 'Added' },
      { name: 'items[0].isUpdated', width: '10%', displayName: 'Updated' },
      { name: 'items[0].isDeleted', width: '10%', displayName: 'Deleted' },
      { name: 'Delete', width: '10%', cellTemplate: '<button class="btn primary" ng-click="grid.appScope.deleteRow(row)"><span class="glyphicon glyphicon-remove"></button>' },
      { name: 'dateOfInvoice', width: '10%', displayName: 'Date of Invoice' },
      { name: 'dueDate', width: '10%', displayName: 'Due Date' },
      { name: 'referenceMobileNumber', width: '10%' },
      { name: 'referenceAadharCardNumber', width: '10%' },
      { name: 'day', width: '10%' },
      { name: 'month', width: '10%' },
      { name: 'year', width: '10%' }      
      
    ];

    $scope.gridOptions.columnDefs[0];

    $scope.setCellTemplateValues = function (param, column) {

      var output = 0;

      if (column == "total") {

        output = ((param.quantity * param.actualUnitPrice) - param.discount) + (((param.quantity * param.actualUnitPrice) - param.discount) / param.taxPercentage)
        param.amountAfterTax = output;

      } else if (column == "margin") {

        output = (param.actualUnitPrice - param.productValue) * param.quantity
        param.marginAmount = output;

      } else if (column == "taxAmount") {

        output = (((param.quantity * param.actualUnitPrice) - param.discount) / param.taxPercentage)
        param.taxAmountForItem = output;

      } else if (column == "totalCGST" || column == "totalSGST") {

        var result = false;
        var fromState = "AP";
        var toState = "AP";

        if (fromState === toState) {
          result = true;
        }
        if (result) {
          output = (((param.quantity * param.actualUnitPrice) - param.discount) / param.taxPercentage) / 2;
          param.totalSGST = output;
          param.totalCGST = output;
        }


      } else if (column == "totalIGST") {

        var result = false;
        var fromState = "AP";
        var toState = "AP";

        if (fromState === toState) {
          result = true;
        }

        if (!result) {
          output = (((param.quantity * param.actualUnitPrice) - param.discount) / param.taxPercentage);
          param.totalIGST = output;
        }

      }else if (column == "itemName"){

        if(param.itemName){
          var arr = [];
          arr = param.itemName.split('#');
          output = arr[0];
        }else{
          output = "";
        }
        

      }

      return output;
    }
    
    //  $scope.grandTotal = function(total){
    //   var grandTotal = total
    //   console.log(grandTotal);
    //   return grandTotal;
    // }

    $scope.totalTax = function () {

      var output = false;
      var fromState = "AP";
      var toState = "AP";

      if (fromState === toState) {
        output = true;
      }

      return output;

    }

    $scope.downloadCSV = function () {
      $scope.gridApi.exporter.csvExport(uiGridExporterConstants.VISIBLE, uiGridExporterConstants.ALL);
    }

    $scope.downloadPDF = function () {
      $scope.gridApi.exporter.pdfExport(uiGridExporterConstants.VISIBLE, uiGridExporterConstants.ALL);
    }

    // GET REQUESTS

    //Get Invoices

    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function () {
    //   if (this.readyState == 4 && this.status == 200) {
    //     var data = this.response;
    //     $scope.invoiceData = JSON.parse(data);
    //     console.log($scope.invoiceData.data);
    //     $scope.gridOptions.data = $scope.invoiceData.data;
    //   }
    // };
    // xhttp.open("GET", "http://ec2-54-236-19-206.compute-1.amazonaws.com/billlive/company/getallinvoices?companyId=C123456&uid=U1234", true);
    // xhttp.send();

    //Get Contacts

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = this.response;
        $scope.contactList = JSON.parse(data);
        console.log($scope.contactList.data);
      }
    };
    xhttp.open("GET", "http://ec2-54-236-19-206.compute-1.amazonaws.com/billlive/company/getallcontacts?companyId=C123456&uid=U1234", true);
    xhttp.send();


    //Get Taxes

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = this.response;
        $scope.taxList = JSON.parse(data);
        console.log($scope.taxList.data);
      }
    };
    xhttp.open("GET", "http://ec2-54-236-19-206.compute-1.amazonaws.com/billlive/company/getalltaxs?companyId=C123456&uid=U1234", true);
    xhttp.send();


    //Get Items

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = this.response;
        $scope.itemsList = JSON.parse(data);
        console.log($scope.itemsList.data);
      }
    };
    xhttp.open("GET", "http://ec2-54-236-19-206.compute-1.amazonaws.com/billlive/company/getallitems?companyId=C123456&uid=U1234", true);
    xhttp.send();


    $scope.gridOptions.data = {
      "invoiceFromContactId" : "fromContact",
      "invoiceToContactId" : "toContact",
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
      "taxPercentage":"10",
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
      "dateOfInvoice" : "11/01/2017",
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
    
    //$scope.gridOptions.data = $scope.invoiceData;
    
    console.log($scope.gridOptions.data);

    $scope.saveGridData = function () {

      console.log("$scope.gridOptions.data=====", JSON.stringify($scope.gridOptions.data));
      //console.log($scope.gridApi.grid.columns[12].getAggregationValue());

      var data = { "invoiceFromContactId": $scope.from, "invoiceToContactId": $scope.to, "uid": "i123", "items": $scope.gridOptions.data, "dateOfInvoice": $scope.dateOfInvoice, "dueDate": $scope.dueDate, "totalAmount": $scope.gridApi.grid.columns[12].getAggregationValue(), "totalTax": $scope.gridApi.grid.columns[11].getAggregationValue(), "totalCGST": $scope.gridApi.grid.columns[11].getAggregationValue() / 2, "totalSGST": $scope.gridApi.grid.columns[11].getAggregationValue() / 2, "totalIGST": "", "referenceMobileNumber": $scope.referenceMobileNumber, "referenceAadharCardNumber": $scope.referenceAadharCardNumber, "isTaxeble": "true", "isUpdated": "No", "isDeleted": "No", "year": date.getFullYear(), "month": date.getMonth() + 1, "day": date.getDate() }
      //console.log("JSON.stringify(data)====", JSON.stringify(data))
      //Call the services
      // $http.post('http://ec2-54-236-19-206.compute-1.amazonaws.com/billlive/company/invoice/add?companyId=C123456&uid=U1234', JSON.stringify(data)).then(function (response) {
      // if (response.data)
      // $scope.msg = "Post Data Submitted Successfully!";
      // }, function (response) {
      // $scope.msg = "Service not Exists";
      // $scope.statusval = response.status;
      // $scope.statustext = response.statusText;
      // $scope.headers = response.headers();
      // });
    }


    $scope.addData = function (item) {
      console.log(item)
      var taxeble;
      if(item.taxId == ""){
        taxeble = false;
      }else{
        taxeble = true;
      }
      var n = $scope.gridOptions.data.length + 1;
      $scope.gridOptions.data.push({
        items : [{
          "itemId": item.itemId,
          "itemCode": item.itemCode,
          "itemName": item.itemName,
          // "quantity": qty,
          // "quantityType": qtyType,
          "actualUnitPrice": item.unitPrice,
          // "discount": item.discount,
          "productValue": item.sellingPrice,
          "taxPercentage": "12",
          "inventoryId": item.inventories[0].inventoryId,
          "isTaxeble": taxeble
        }
        ]
      });
      // window.location = "#/invoice";

    };

    $scope.showItemModal = false;
    $scope.itemButtonClicked = "";
    $scope.toggleModal = function (option) {

      var arr = [];
      arr = option.itemName.split('#');

      console.log(arr)
      if (option.itemName == 'create') {
        $scope.itemButtonClicked = "Cancel";
        $scope.showItemModal = !$scope.showItemModal;
      } else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            var data = this.response;
            $scope.itemDetails = JSON.parse(data);
            console.log($scope.itemDetails.data);
          }
        };
        xhttp.open("GET", "http://ec2-54-236-19-206.compute-1.amazonaws.com/billlive/company/getitem?companyId=C123456&uid=U1234&itemId="+arr[1], true);
        xhttp.send();
      }

    };

    $scope.showContactModal = false;
    $scope.contactButtonClicked = "";

    $scope.toggleContactModal = function (option, addType) {
      console.log("toggleToContactModal======" + option);
      console.log(addType);
      if (option == 'createContact') {
        $scope.addressType = addType;
        $scope.contactButtonClicked = "Cancel";
        $scope.showContactModal = !$scope.showContactModal;
      }

    };

    $scope.showTaxModal = false;
    $scope.taxButtonClicked = "";

    $scope.toggleTaxModal = function (option) {
      console.log("toggleTaxModal======" + option.taxPercentage);
      if (option.taxPercentage == 'createTax') {
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
      console.log(type + "    " + addressType + "   " + firstName + "    " + lastName + "    " + company + "    " + legalOrTradingName + "    " + lineOfBusiness + "    " + organizationDesc + "    " + gstRegistrationNum + "    " + website + "    " + address
        + "    " + country + "    " + state + "    " + district + "    " + city + "    " + phoneNumber + "    " + email + "    " + typeOfUser);

      var data = {
        "postId": "p123",
        "contactCompanyName": $scope.user.company,
        "firstName": $scope.user.firstName,
        "lastName": $scope.user.lastName,
        "email": $scope.user.email,
        "phoneNumber": $scope.user.phoneNumber,
        "fax": $scope.user.fax,
        "mobileNumber": $scope.user.mobileNumber,
        "website": $scope.user.website,
        "address": $scope.user.address,
        "country": $scope.user.country,
        "state": document.getElementById('state').options[document.getElementById('state').selectedIndex].innerHTML,
        "district": $scope.district,
        "city": $scope.user.city,
        "taxId": "t123",
        "lineOfBusiness": $scope.user.lineOfBusiness,
        "organizationDesc": $scope.user.organizationDesc,
        "gstRegistrationNum": $scope.user.gstRegistrationNum,
        "typeOfUser": $scope.type
      };

      console.log(JSON.stringify(data));
      //Call the services
      $http.post('http://ec2-54-236-19-206.compute-1.amazonaws.com/billlive/company/addcontact?companyId=C123456&uid=U1234', JSON.stringify(data)).then(function (response) {
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




    $scope.addTax = function (taxDesc, totalTaxPercentage, taxPercentageCGST, taxPercentageSGST, taxPercentageIGST) {

      var totalTaxPercentage = totalTaxPercentage;
      var taxPercentageCGST = taxPercentageCGST;
      var taxPercentageSGST = taxPercentageSGST;
      var taxDesc = taxDesc;
      var taxPercentageIGST = taxPercentageIGST;

      console.log(totalTaxPercentage + "    " + taxPercentageCGST + "   " + taxPercentageSGST + "    " + taxDesc + "    " + taxPercentageIGST);

      var taxData = {
        companyId: "c123",
        totalTaxPercentage: totalTaxPercentage,
        taxPercentageCGST: taxPercentageCGST,
        taxPercentageSGST: taxPercentageSGST,
        taxDesc: taxDesc,
        taxPercentageIGST: taxPercentageIGST
      };
      console.log(JSON.stringify(taxData))
      //Call the services
      $http.post('http://ec2-54-236-19-206.compute-1.amazonaws.com/billlive/company/tax/add?companyId=C123456&uid=U1234', JSON.stringify(taxData)).then(function (response) {
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
      var itemName = item.itemName;
      var itemDesc = item.itemDesc;
      var quantityDesc = item.quantityDesc;
      var buyQuantityType = item.buyQuantityType;
      var actualQuantity = item.actualQuantity;
      var remainingQuantity = item.remainingQuantity;
      var unitPrice = item.unitPrice;
      var sellingPrice = item.sellingPrice;
      var sellingPrice = item.sellingPrice;
      var otherSellQuantityTypeOption = item.otherSellQuantityTypeOption;
      var otherSellOptionQuantityEquivalent = item.otherSellOptionQuantityEquivalent;
      var otherSellOptionBuyingPrice = item.otherSellOptionBuyingPrice;
      var otherSellOptionSellingPrice = item.otherSellOptionSellingPrice;
      var defaultMarginPercentage = item.defaultMarginPercentage;
      var defaultMarginAmount = item.defaultMarginAmount;
      var minimumStockValue = item.minimumStockValue;
      var taxId = item.taxId;

      var itemData = {
        "hsnCode": hsnCode,
        "gstItemCode": gstItemCode,
        "itemName": itemName,
        "itemDesc": itemDesc,
        "inventories": [
          {
            "quantityDesc": quantityDesc,
            "buyQuantityType": buyQuantityType,
            "actualQuantity": actualQuantity,
            "remainingQuantity": remainingQuantity,
            "unitPrice": unitPrice,
            "sellingPrice": sellingPrice,
            "otherSellQuantityTypeOption": otherSellQuantityTypeOption,
            "otherSellOptionQuantityEquivalent": otherSellOptionQuantityEquivalent,
            "otherSellOptionBuyingPrice": otherSellOptionBuyingPrice,
            "otherSellOptionSellingPrice": otherSellOptionSellingPrice,
            "defaultMarginPercentage": defaultMarginPercentage,
            "defaultMarginAmount": defaultMarginAmount,
            "minimumStockValue": minimumStockValue
          }
        ],
        "taxId": "67XhYcnQh2U31POWgztn"
      };

      console.log(JSON.stringify(itemData))
      //Call the services
      $http.post('http://ec2-54-236-19-206.compute-1.amazonaws.com/billlive/company/item/add?companyId=C123456&uid=U1234', JSON.stringify(itemData)).then(function (response) {
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

    $scope.type = "customer";

    $scope.addRow = function () {
      var n = $scope.gridOptions.data.length + 1;
      $scope.gridOptions.data.push({
        items : [{
          "itemId": "",
          "itemCode": "",
          "itemName": "",
          // "quantity": qty,
          // "quantityType": qtyType,
          "actualUnitPrice": "",
          // "discount": item.discount,
          "productValue": "",
          "taxPercentage": "12",
          "inventoryId": "",
          "isTaxeble": "",
        }
        ],
        dateOfInvoice : $scope.dateOfInvoice,
        dueDate:$scope.dueDate,
        referenceMobileNumber: $scope.referenceMobileNumber,
        referenceAadharCardNumber : $scope.referenceAadharCardNumber,
        year : $scope.currentYear,
        month : $scope.currentMonth,
        day : $scope.currentDate
      });
    };

    $scope.logout = function () {
      CommonProp.logoutUser();
    }

  }])
  .service('productService', function () {
    var productList = [];

    var addProduct = function (newObj) {
      var i;
      console.log("newObj.length====", newObj.length, newObj);
      for (i = 0; i < newObj.length; i++) {
        productList.push(newObj[i]);
      }
    };
    console.log(productList);
    var getProducts = function () {
      return productList;
    };

    return {
      addProduct: addProduct,
      getProducts: getProducts
    };

  }).directive('modal', function () {
    return {
      template: '<div class="modal fade">' +
      '<div class="modal-dialog">' +
      '<div class="modal-content">' +
      '<div class="modal-header">' +
      '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
      '</div>' +
      '<div class="modal-body" ng-transclude></div>' +
      '</div>' +
      '</div>' +
      '</div>',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.$watch(attrs.visible, function (value) {
          if (value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function () {
          scope.$apply(function () {
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function () {
          scope.$apply(function () {
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });