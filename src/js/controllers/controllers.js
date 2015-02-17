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
function ($scope, $routeParams, $window, socket){
	$scope.message = "Hello from Room";
	$scope.currentRoom = $routeParams.room;
	$scope.currentUser = $routeParams.user;
	$scope.currentUsers = [];
	$scope.errorMessage = "";
	$scope.messageHistory = [];
	$scope.newMessage = "";

	socket.on("updatechat", function(roomName, messageHistory){
		$scope.messageHistory = messageHistory;
	});

	socket.on("updateusers", function(roomName, users, ops){
		// TODO: Check if the roomName equals the current room !
		$scope.currentUsers = users;
	});

	socket.emit("joinroom", {room: $scope.currentRoom}, function(success, why){
		if(success){
			console.log("success");
		} else {
			console.log(":((");
		}
	});
	
	$scope.sendMessage = function(){
		console.log($scope.currentUser);
		if($scope.newMessage === "") {
			$scope.errorMessage ="Please write a message";
		} else {
			socket.emit("sendmsg", {roomName: $scope.currentRoom, msg: $scope.newMessage});
			$scope.newMessage = "";
		}
	};

	$scope.back = function() {
		$window.history.back();
	}
});

ChatClient.controller("PrivateController",
function ($scope, $routeParams, $location, socket){
	$scope.userToSendTo = $routeParams.user;
	$scope.
	//$scope.roomName = ??
	$scope.privateMessage = function(){
		console.log("kemst ég hingað?");
		$location.path("/privateRoom/" + $scope.userToSendTo);
	};
})

ChatClient.controller("RoomsController",
function ($scope, $routeParams, socket){
	$scope.rooms = [];
	$scope.currentUser = $routeParams.user;

	socket.on("roomlist", function(data) {
		$scope.message = data.lobby.topic;
		console.log(data);
		$scope.rooms = Object.keys(data);
	});

	socket.emit("rooms");
});
