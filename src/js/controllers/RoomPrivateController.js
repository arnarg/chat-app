ChatClient.controller("RoomPrivateController",
["$scope", "$state", "$stateParams", "socket",
function ($scope, $state, $stateParams, socket) {
	$scope.otherUser = $stateParams.other;
	$scope.newMessage = "";

	$scope.sendMessage = function(){
		// senda msg a thann sem er ad fa msg-id
		socket.emit("privatemsg", {nick: $scope.otherUser, message: $scope.newMessage}, function(success){
			if(success) {
				$scope.$parent.messageHistory[$scope.otherUser].push({
					timestamp: Date.now(),
					nick: $scope.currentUser,
					message: $scope.newMessage
				});
				console.log("virkadi");
				$scope.newMessage = "";
				$scope.$parent.errorMessage = "";
			}
			else {
				$scope.$parent.errorMessage = "The message was not sent, please try again";
			}
		});
	};
}]);