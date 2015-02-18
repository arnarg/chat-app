var ChatClient = angular.module("ChatClient", [
	'ui.router',
	'ui.router.tabs',
	'ui.bootstrap',
	'ui.bootstrap.tpls'
]);

ChatClient.config(["$stateProvider", "$urlRouterProvider",
function ($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/login");

	$stateProvider
		.state("login", {
			url: "/login",
			templateUrl: "views/login.html",
			controller: "LoginController"
		})
		.state("rooms", {
			url: "/rooms/:user",
			templateUrl: "views/rooms.html",
			controller: "RoomsController"
		})
		.state("room", {
			url: "/room/:user/:room",
			templateUrl: "views/room.html",
			controller: "RoomController"
		})
		.state("room.public", {
			url: "",
			templateUrl: "views/room.public.html",
			controller: "RoomPublicController"
		})
		.state("room.private", {
			url: "/private/:other",
			templateUrl: "views/room.private.html",
			controller: "RoomPrivateController"
		});
}]);
