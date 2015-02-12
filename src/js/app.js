var ChatClient = angular.module("ChatClient", ['ngRoute']);

ChatClient.config(function($routeProvider){
	$routeProvider
	.when("/home/index", {
		templateUrl: "views/home.html",
		controller: "HomeController"
	})
	.when("/home/about", {
		templateUrl: "views/about.html",
		controller: "AboutController"
	})
	.otherwise({
		redirectTo: "home/index"
	})
});

ChatClient.controller("HomeController", 
function($scope){
	$scope.message = "Hello from home";
});

ChatClient.controller("AboutController", 
function($scope){
	$scope.message = "Hello from about";
});