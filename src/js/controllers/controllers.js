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
	};
});

ChatClient.controller("NavbarController",
function ($scope, $location, socket){
	$scope.rooms = function(){
		console.log("navbarcontroller");
		$location.path("/rooms/:user");
	};
});

ChatClient.controller("RoomController",
function ($scope, $location, $routeParams, socket){
	$scope.message = "Hello from Room";
	$scope.currentRoom = $routeParams.room;
	$scope.currentUser = $routeParams.user;
	$scope.currentUsers = {};
	$scope.currentOps = {};
	$scope.errorMessage = "";
	$scope.messageHistory = [];
	$scope.newMessage = "";
	$scope.roomTopic = "";
	var joinmsg = "";
	var partmsg = "";

	socket.on("updatechat", function(roomName, messageHistory){
		$scope.messageHistory = messageHistory;
	});

	socket.on("servermessage", function(status, room, user){
		if(status === "join"){
			if($scope.currentUser === user){
				if(joinmsg === ""){
					joinmsg = " just joined in on the fun!";
					socket.emit("sendmsg", {roomName: room, msg: joinmsg});
				}
			}
		}
	});

	socket.on("updateusers", function(roomName, users, ops){
		// TODO: Check if the roomName equals the current room !
		$scope.currentUsers = users;
		$scope.currentOps = ops;
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
			alert("An operator just kicked you from the room");
		}
	});

	socket.on("banned", function(room, bannee, banner){
		if(bannee === $scope.currentUser){
			$location.path("/rooms/" + $scope.currentUser);
			alert("An operator just banned you from the room");
		}
	});

	$scope.sendMessage = function(){
		if($scope.newMessage === "") {
			$scope.errorMessage ="Please write a message";
		} else {
			socket.emit("sendmsg", {roomName: $scope.currentRoom, msg: $scope.newMessage});
			$scope.newMessage = "";
		}
	};

	$scope.backToRooms = function(){
		socket.emit("partroom", $scope.currentRoom);
		$location.path("/rooms/" + $scope.currentUser);
	};

	$scope.kickUser = function(userToKick){
		socket.emit("kick", {user: userToKick, room: $scope.currentRoom}, function(success){
			if(success){
				console.log("kicked successfully");
			} else {
				console.log("kick failed");
			}
		});
	};

	$scope.isUserOrOp = function(userToCheck){
		if($scope.currentOps[userToCheck] !== undefined || $scope.currentUser === userToCheck || $scope.currentOps[$scope.currentUser] === undefined){
			return true;
		}
		return false;
	};
});

ChatClient.controller("PrivateController",
function ($scope, $routeParams, $location, socket){
	$scope.user = $routeParams.user;
	$scope.newMessage = "";
	$scope.errorMessage = "";
	$scope.messageHistory = [];
	$scope.currentUser = $routeParams.currentUser;
	$scope.roomName = $routeParams.room;
	$scope.roomNameHistory = [];

	socket.on("updatechat", function(roomName, messageHistory){
		$scope.messageHistory = messageHistory;
	});

	$scope.sendPrivateMessage = function(){
		socket.emit("privatemsg", {nick: $scope.user, message: $scope.newMessage}, function(success){
			console.log("aeji");
			if(success) {
				console.log("virkadi");
			}
			else {
				$scope.errorMessage = "The message was not sent, please try again";
			}
		});
	};
	socket.on("recv_privatemsg", function(nick, message){
		$scope.newMessage = message;
	});
});

ChatClient.controller("RoomsController",
function ($scope, $location, $routeParams, socket){
	$scope.rooms = [];
	$scope.roomlist = {};
	$scope.roomName = "";
	$scope.currentUser = $routeParams.user;
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
					$location.path("/room/" + $scope.currentUser + "/" + $scope.roomName);
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
});
