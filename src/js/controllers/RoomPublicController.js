ChatClient.controller("RoomPublicController",
["$scope", "$state", "$stateParams", "socket",
function ($scope, $state, $stateParams, socket) {
	$scope.newMessage = "";

	$scope.sendMessage = function(){
		if($scope.newMessage === "") {
			$scope.$parent.errorMessage = "Please write a message";
		} else {
			socket.emit("sendmsg", {roomName: $scope.currentRoom, msg: $scope.newMessage});
			$scope.newMessage = "";
			$scope.$parent.errorMessage = "";
		}
	};
}]);