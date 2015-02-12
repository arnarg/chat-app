var ChatClient = angular.module("ChatClient", ['ngRoute']);

ChatClient.config(function ($routeProvider){
	$routeProvider
	.when("/home/index", {
		templateUrl: "views/home.html",
		controller: "HomeController"
	})
	.when("/home/login", {
		templateUrl: "views/login.html",
		controller: "LoginController"
	})
	.when("/home/room", {
		templateUrl: "views/room.html",
		controller: "RoomController"
	})
	.when("/home/rooms", {
		templateUrl: "views/rooms.html",
		controller: "RoomsController"
	})
	.otherwise({
		redirectTo: "home/index"
	});
});

ChatClient.controller("HomeController", 
function ($scope){
	$scope.message = "Hello from home";
});

ChatClient.controller("LoginController", 
function ($scope){
	$scope.message = "Hello from Login";
});

ChatClient.controller("RoomController", 
function ($scope){
	$scope.message = "Hello from Room";
});

ChatClient.controller("RoomsController", 
function ($scope){
	$scope.message = "Hello from Rooms";
});