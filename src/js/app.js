var ChatClient = angular.module("ChatClient", ['ngRoute']);

ChatClient.config(["$routeProvider", function ($routeProvider){
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
	.when("/room/private/:user:currentUser", {
		templateUrl: "views/privateRoom.html",
		controller: "RoomController"
	})
	.otherwise({
		redirectTo: "/login"
	});
}]);
