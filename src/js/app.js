var ChatClient = angular.module("ChatClient", ['ngRoute']);

ChatClient.config(function ($routeProvider){
	$routeProvider
	.when("/login", {
		templateUrl: "views/login.html",
		controller: "LoginController"
	})
	.when("/room/:user/:room/", {
		templateUrl: "views/room.html",
		controller: "RoomController"
	})
	.when("/rooms/:user/", {
		templateUrl: "views/rooms.html",
		controller: "RoomsController"
	})
	.when("/room/:user/:currentUser", {
		templateUrl: "views/privateRoom.html",
		controller: "PrivateController"
	})
	.otherwise({
		redirectTo: "/login"
	});
});
