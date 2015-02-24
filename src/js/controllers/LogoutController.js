ChatClient.controller("LogoutController",
["$scope", "$rootScope", "$state", "socket",
function ($scope, $rootScope, $state, socket){
	socket.emit("logout");
	$rootScope.loggedIn = false;
	$state.go("login");
}]);