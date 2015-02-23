ChatClient.controller("RoomsController",
["$scope", "$state", "$stateParams", "socket",
function ($scope, $state, $stateParams, socket){
	$scope.rooms = [];
	$scope.roomlist = {};
	$scope.roomName = "";
	$scope.currentUser = $stateParams.user;
	$scope.errorMessage = "";

	socket.on("roomlist", function(data) {
		$scope.message = data.lobby.topic;
		$scope.rooms = Object.keys(data);
		$scope.roomlist = data;
	});

	socket.emit("rooms");

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
}]);