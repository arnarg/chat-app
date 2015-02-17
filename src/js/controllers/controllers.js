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
	$scope.currentRoom = $routeParams.room;
	$scope.currentUser = $routeParams.user;
	$scope.currentUsers = [];
	$scope.errorMessage = "";
	$scope.messageHistory = [];
	$scope.newMessage = "";
	$scope.roomTopic = "";

	socket.on("updatechat", function(roomName, messageHistory){
		$scope.messageHistory = messageHistory;
		$scope.roomTopic = "Welcome to the room! Please behave :((";
	});

	socket.on("servermessage", function(join, room, user){
		if(join){
			servermsg = user + " just joined in on the fun!";
			if($scope.currentUser === user){
				socket.emit("sendmsg", {roomName: room, msg: servermsg});
			}
		}
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

	socket.on("kicked", function(room, kickee, kicker){
		if(kickee === $scope.currentUser){
			$location.path("/rooms/" + $scope.currentUser);
		}
	});

	socket.on("banned", function(room, bannee, banner){
		if(bannee === $scope.currentUser){
			$location.path("/rooms/" + $scope.currentUser);
			$scope.errorMessage = "You just got banned from the room";
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
	};

	$scope.backToRooms = function(){
		socket.emit("partroom", $scope.currentRoom);
		$location.path("/rooms/" + $scope.currentUser);
	};

	$scope.kickUser = function(userToKick){
		console.log(userToKick);
		socket.emit("kick", {user: userToKick, room: $scope.currentRoom}, function(success){
			if(success){
				kickMsg = userToKick + " just got kicked!";
				socket.emit("sendmsg", {roomName: $scope.currentRoom, msg: kickMsg});
			} else {
				console.log("kick failed");
			}
		});
	};

	$scope.banUser = function(userToBan){
		socket.emit("ban", {user: userToBan, room: $scope.currentRoom}, function(success){
			if(success){
				banMsg = userToBan + " just got banned!!";
				socket.emit("sendmsg", {roomName: $scope.currentRoom, msg: banMsg});
			} else {
				console.log("ban failed");
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
