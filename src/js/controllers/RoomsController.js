ChatClient.controller("RoomsController",
["$scope", "$state", "$rootScope", "$stateParams", "socket",
function ($scope, $state, $rootScope, $stateParams, socket){
	var init = function() {
		console.log("Initialize...");
		$scope.rooms = [];
		$scope.roomlist = {};
		$scope.roomName = "";
		$scope.currentUser = $stateParams.user;
		$scope.errorMessage = "";

		socket.on("roomlist", function(data) {
			$scope.rooms = Object.keys(data);
			$scope.roomlist = data;
		});

		$scope.createRoom = function(){
			if($scope.roomName === "") {
				$scope.errorMessage = "Please write a name for your room";
				console.log("no room name");
			} else {
				socket.emit("joinroom", {room: $scope.roomName}, function(success, reason){
					if(success){
						console.log("success");
						$state.go("room",
							{ user: $scope.currentUser, room: $scope.roomName});
						$scope.roomName = "";
					} else {
						console.log(reason);
					}
				});
			}
		};

		$scope.notBanned = function(room){
			var banlist = $scope.roomlist[room].banned;
			if(banlist[$scope.currentUser] !== undefined){
				return false;
			}
			return true;
		};

		socket.emit("rooms");
	};

	if ($rootScope.loggedIn) {
		init();
	}
	else {
		$state.go("login");
	}
}]);
