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
	$scope.kick = false;
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
		else if(status === "quit"){
			console.log("quit");
		}
	});

	socket.on("updateusers", function(roomName, users, ops){
		if (roomName === $scope.currentRoom) {
			$scope.currentUsers = users;
			$scope.currentOps = ops;
		}
	});

	socket.on("kicked", function(room, kickee, kicker){
		// $scope.kick is to prevent the code below from running multiple
		// times as the server sends more than one "kicked" event sometimes
		if(kickee === $scope.currentUser && !$scope.kick){
			$scope.kick = true;
			$state.go("rooms", { user: $scope.currentUser });
			toastr.error("Check yo self befo' yo wreck yo self!", "You've been kicked");
		}
	});

	socket.on("banned", function(room, bannee, banner){
		// same as with "kicked" event
		if(bannee === $scope.currentUser && !$scope.kick){
			$scope.kick = true;
			$state.go("rooms", { user: $scope.currentUser });
			toastr.error("I guess you did not check yourself.", "You have been banned");
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

	$scope.disconnect = function(){
		socket.emit("disconnect");
		console.log("disconnected");
		$state.go("login");
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

	$scope.privateMessage = function(user){
		console.log("private message");
		if ($scope.messageHistory[user] === undefined) {
			$scope.createPrivateTab(user, true);
		}
	};

	$scope.$on('$destroy', function() {
		socket.getSocket().removeAllListeners();
	});
}]);
