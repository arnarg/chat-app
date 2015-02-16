ChatClient.controller("LoginController",
function ($scope, socket){
    socket.on("roomlist", function(data) {
        console.log(data);
    });
    $scope.message = "Hello from Login";
    socket.emit("rooms");

    $scope.login = function(){
    	console.log("log in ");
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
