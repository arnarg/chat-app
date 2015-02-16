ChatClient.controller("LoginController",
function ($scope, $location, socket){

	$scope.errorMessage = "";
	$scope.nickname = "";
    $scope.message = "Hello from Login";

    $scope.login = function(){
    	if($scope.nickname === ""){
    		$scope.errorMessage = "Please choose a nickname";
    	} else {
    		socket.emit("adduser", $scope.nickname, function(available){
    			if(available){
    				$location.path("/rooms/" + $scope.nickname);
    			} else{
    				$scope.errorMessage = "This nickname is already taken";
    			}
    		});
    	}
    }
});

ChatClient.controller("RoomController",
function ($scope){
    $scope.message = "Hello from Room";
});

ChatClient.controller("RoomsController",
function ($scope, $routeParams, socket){
    
    $scope.rooms = [];
    $scope.currentUser = $routeParams.user;

    socket.on("roomlist", function(data) {
    	$scope.message = data.lobby.topic;
    	console.log(Object.keys(data));
    	$scope.rooms = Object.keys(data);
    });
	

    socket.emit("rooms");
});
