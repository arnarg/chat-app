ChatClient.controller("LoginController",
["$scope", "$state", "socket",
function ($scope, $state, socket){
	$scope.errorMessage = "";
	$scope.nickname = "";
	$scope.message = "Hello from Login";

	$scope.login = function(){
		if($scope.nickname === ""){
			$scope.errorMessage = "Please choose a nickname";
		} else {
			socket.emit("adduser", $scope.nickname, function(available){
				if(available){
					$state.go("rooms", { user: $scope.nickname });
				} else{
					$scope.errorMessage = "This nickname is already taken";
				}
			});
		}
	};
}]);