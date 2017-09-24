'use strict';

// Declare app level module which depends on views, and components
angular.module('webApp', [
  'ngRoute',
  'webApp.login',
  'webApp.signup',
  'webApp.welcome',
  'webApp.register',
  'webApp.dashboard',
  'webApp.invoice',
  'webApp.reports',
  'webApp.invoiceview',
  'webApp.bill',
  'webApp.calculator',
  'webApp.purchaseorder',
  'webApp.addPost'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

  $routeProvider.otherwise({redirectTo: '/login'});
}]);
