ChatClient.controller("LogoutController",
["$rootScope", "$state", "socket",
function ($rootScope, $state, socket){
	socket.emit("logout");
	$rootScope.loggedIn = false;
	$state.go("login");
}]);
