var ChatClient = angular.module("ChatClient", ['ngRoute']);

ChatClient.config(function ($routeProvider){
	$routeProvider
	.when("/login", {
		templateUrl: "views/login.html",
		controller: "LoginController"
	})
	.when("/room", {
		templateUrl: "views/room.html",
		controller: "RoomController"
	})
	.when("/rooms", {
		templateUrl: "views/rooms.html",
		controller: "RoomsController"
	})
	.otherwise({
		redirectTo: "/login"
	});
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