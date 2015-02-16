ChatClient.controller("LoginController",
function ($scope, socket){
	$scope.errorMessage = "";
	$scope.nickname = "";
    socket.on("roomlist", function(data) {
        console.log(data);
    });
    $scope.message = "Hello from Login";
    socket.emit("rooms");

    $scope.login = function(){

    }
});

ChatClient.controller("RoomController",
function ($scope){
    $scope.message = "Hello from Room";
});

ChatClient.controller("RoomsController",
function ($scope){
    $scope.message = "Hello from Rooms";
});
