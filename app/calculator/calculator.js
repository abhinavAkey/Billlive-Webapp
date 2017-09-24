'use restrict';

angular.module('webApp.calculator', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/calculator', {
    templateUrl: 'calculator/calculator.html',
    controller: 'CalculatorCtrl'
  });
}])

.controller('CalculatorCtrl', ['$scope', '$location', 'anchorSmoothScroll', function($scope, $location, anchorSmoothScroll){


$scope.taxType = 'inclusive';
$scope.stateTax = 'instatetax';
$scope.gotoElement = function (eID){
      // set the location.hash to the id of
      // the element you wish to scroll to.

      anchorSmoothScroll.scrollTo(eID);
      
    };



$scope.calculate = function(){


  var productValue = $scope.productValue;
var tax = $scope.tax;
var profit;

if($scope.profit == "" || $scope.profit == null){
  profit = 0;
}else{
  profit = $scope.profit;
}

          $scope.retailerActualProductValue = "";
          $scope.retailerActualProductValueWithoutTax = "";
          $scope.retailerProductTax = "";
            $scope.retailerCGSTTax = "";
            $scope.retailerSGSTTax = "";

            $scope.retailerIGSTTax = "";

          
          $scope.retailerProductMargin = "";
          $scope.retailerMarginTax = "";
          $scope.retailerProductValueWithMargin = "";

      
      if($scope.taxType == 'inclusive'){

        

          $scope.retailerActualProductValue = parseInt(productValue);
          $scope.retailerActualProductValueWithoutTax = ((100 * parseInt(productValue))/(100 + parseInt(tax)));
          $scope.retailerProductTax = $scope.retailerActualProductValue - $scope.retailerActualProductValueWithoutTax;
          
          $scope.retailerProductMargin = (parseInt(productValue) * parseInt(profit))/100;
          $scope.retailerMarginTax = ($scope.retailerProductMargin * parseInt(tax))/100
          if($scope.stateTax == 'instatetax'){
            $scope.retailerCGSTTax = ($scope.retailerProductTax + $scope.retailerMarginTax)/2;
            $scope.retailerSGSTTax = ($scope.retailerProductTax + $scope.retailerMarginTax)/2;
          }else{
            $scope.retailerCGSTTax = ($scope.retailerProductTax + $scope.retailerMarginTax)/2;
            $scope.retailerSGSTTax = ($scope.retailerMarginTax)/2;
            $scope.retailerIGSTTax = $scope.retailerProductTax / 2;

          }
          $scope.retailerProductValueWithMargin = parseInt(productValue) + $scope.retailerProductMargin + $scope.retailerMarginTax

      }

      if($scope.taxType == 'exclusive'){

          $scope.retailerActualProductValue = parseInt(productValue);
          $scope.retailerActualProductValueWithTax = $scope.retailerActualProductValue + (($scope.retailerActualProductValue * parseInt(tax)/100))
          $scope.retailerProductMargin = (parseInt(productValue) * parseInt(profit))/100;
          $scope.retailerProductTax = ($scope.retailerActualProductValue * parseInt(tax)) / 100;
          $scope.retailerMarginTax = ($scope.retailerProductMargin * parseInt(tax))/100

          if($scope.stateTax == 'instatetax'){
            $scope.retailerCGSTTax = ($scope.retailerProductTax + $scope.retailerMarginTax)/2;
            $scope.retailerSGSTTax = ($scope.retailerProductTax + $scope.retailerMarginTax)/2;
          }else{
            $scope.retailerCGSTTax = ($scope.retailerProductTax + $scope.retailerMarginTax)/2;
            $scope.retailerSGSTTax = ($scope.retailerMarginTax)/2;
            $scope.retailerIGSTTax = $scope.retailerProductTax / 2;
          }

          
          $scope.retailerProductValueWithMargin = $scope.retailerActualProductValueWithTax + $scope.retailerProductMargin + $scope.retailerMarginTax

      }
      $scope.gotoElement('calculations')


}

}]).directive('numbersOnly', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '' 
           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
}).service('anchorSmoothScroll', function(){
    
    this.scrollTo = function(eID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
        
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };
    
});
