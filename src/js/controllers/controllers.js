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

ChatClient.controller("RoomController",
["$scope", "$state", "$stateParams", "socket",
function ($scope, $state, $stateParams, socket){
	$scope.currentRoom = $stateParams.room;
	$scope.currentUser = $stateParams.user;

	$scope.message = "Hello from Room";
	$scope.currentUsers = {};
	$scope.currentOps = {};
	$scope.errorMessage = "";
	$scope.messageHistory = {
		public: []
	};
	$scope.roomTopic = "";
	var joinmsg = "";
	var partmsg = "";

	// Tabs
	$scope.tabData = [
		{
			heading: $scope.currentRoom,
			route: "room.public",
			active: true,
			params: {},
			closable: false
		}
	];

	$scope.go = function(state, params) {
		$state.go(state, params);
	};

	$scope.closeTab = function(tab) {
		var index = $scope.tabData.indexOf(tab);
		if (index > -1) {
			$scope.messageHistory[tab.heading] = undefined;
			$scope.tabData.splice(index, 1);
		}
	};

	$scope.createPrivateTab = function(user, isActive) {
		$scope.tabData.push({
			heading: user,
			route: "room.private",
			active: isActive,
			params: {
				other: user
			},
			closable: true
		});
		$scope.messageHistory[user] = [];
	};

	// Socket event handlers
	socket.on("updatechat", function(roomName, messageHistory){
		$scope.messageHistory.public = messageHistory;
		console.log($scope.messageHistory);
		//$("#chatWindow").prop({ scrollTop: $("#chatWindow").prop("scrollHeight") });
		$("#chatWindow").animate({ scrollTop: $(document).height() }, "fast");
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

	socket.on("kicked", function(room, kickee, kicker){
		if(kickee === $scope.currentUser){
			$state.go("rooms", { user: $scope.currentUser });
			toastr.error("Check yo self befo' yo wreck yo self!", "You've been kicked");
		}
	});

	socket.on("banned", function(room, bannee, banner){
		if(bannee === $scope.currentUser){
			$state.go("rooms", { user: $scope.currentUser });
			toastr.error("I guess you did not check yourself.", "You've been banned");
		}
	});

	socket.on("recv_privatemsg", function(nick, message){
		if ($scope.messageHistory[nick] === undefined) {
			$scope.createPrivateTab(nick, false);
		}
		$scope.messageHistory[nick].push({
			timestamp: Date.now(),
			nick: nick,
			message: message
		});
	});

	// Sending the server that we want to join the room
	socket.emit("joinroom", {room: $scope.currentRoom}, function(success, why){
		if(success){
			console.log("success");
		} else {
			console.log(":((");
		}
	});

	// Operations for the page
	$scope.backToRooms = function(){
		socket.emit("partroom", $scope.currentRoom);
		$state.go("rooms", { user: $scope.currentUser });
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

	$scope.banUser = function(userToBan){
		socket.emit("ban", {user: userToBan, room: $scope.currentRoom}, function(success){
			if(success){
				console.log("banned successfully");
			} else {
				console.log("ban failed");
			}
		});
	};

	$scope.isUserOrOp = function(userToCheck){
		if ($scope.currentOps[userToCheck] !== undefined ||
			$scope.currentUser === userToCheck ||
			$scope.currentOps[$scope.currentUser] === undefined){
			return true;
		}
		return false;
	};

	$scope.privateMessage = function(user) {
		console.log("private message");
		if ($scope.messageHistory[user] === undefined) {
			$scope.createPrivateTab(user, true);
		}
		console.log($scope.messageHistory);
	};
}]);

ChatClient.controller("RoomsController",
["$scope", "$state", "$stateParams", "socket",
function ($scope, $state, $stateParams, socket){
	$scope.rooms = [];
	$scope.roomlist = {};
	$scope.roomName = "";
	$scope.currentUser = $stateParams.user;
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
					$state.go("room",
						{ user: $scope.currentUser, room: $scope.roomName});
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
}]);
