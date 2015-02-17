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

ChatClient.controller("NavbarController",
function ($scope, $location, socket){
	$scope.rooms = function(){
		console.log("navbarcontroller");
		$location.path("/rooms/:user");
	}
})

ChatClient.controller("RoomController",
function ($scope, $location, $routeParams, $window, socket){
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

	$scope.backToRooms = function(){
		$location.path("/rooms/" + $scope.currentUser);
	}

	$scope.kickUser = function(userToKick){
		console.log(userToKick);
		socket.emit("kick", {user: userToKick, room: $scope.currentRoom}, function(success){
			if(success){
				console.log("kicked successfully");
			} else {
				console.log("kick failed");
			}
		});
	}
});

ChatClient.controller("PrivateController",
function ($scope, $routeParams, $location, socket){
	$scope.userToSendTo = $routeParams.user;
	$scope.newMessage = "";
	//$scope.currentUser = $routeParams.currentUser; ??

	$scope.sendPrivateMessage = function(){
		console.log($scope.userToSendTo);
		console.log($scope.newMessage);
		socket.emit("privatemsg", {nick: $scope.userToSendTo, msg: $scope.newMessage}, function(success){
			if(success) {
				console.log("virkadi");
				$scope.newMessage = "";
			}
			else {
				console.log("virkadi ekki");
			}
		});
	};
	socket.on("recv_privatemsg", function(nick, msg){
		$scope.newMessage = msg;
		//console.log($scope.newMessage);
		console.log(nick + " " + msg);
	});
});

ChatClient.controller("RoomsController",
function ($scope, $location, $routeParams, socket){
	$scope.rooms = [];
	$scope.roomName = "";
	$scope.currentUser = $routeParams.user;

	socket.on("roomlist", function(data) {
		$scope.message = data.lobby.topic;
		console.log(data);
		$scope.rooms = Object.keys(data);
	});

	socket.emit("rooms");

	$scope.createRoom = function(){
		if($scope.roomName === "") {
			$scope.errorMessage ="Please write a message";
			console.log("no room name");
		} else {
			socket.emit("joinroom", {room: $scope.roomName}, function(success, reason){
				if(success){
					console.log("success");
					$location.path("/room/" + $scope.currentUser + "/" + $scope.roomName);
					$scope.roomName = "";
				} else {
					console.log(reason);
				}
			});
		}
	}
});
