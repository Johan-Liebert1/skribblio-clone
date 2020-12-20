const socketController = socket => {
	// socket.emit("Hello"); // hello is an event
	// socket.broadcast.emit("Hello");
	// socket.on("newMessage", ({ message }) => {
	// 	socket.broadcast.emit("messageNotification", {
	// 		message,
	// 		nickname: socket.nickname
	// 	});
	// });

	const broadcast = (eventName, data) => {
		socket.broadcast.emit(eventName, data);
	};

	socket.on("setNickname", ({ nickname }) => {
		socket.nickname = nickname;
		broadcast("newUser", { nickname });

		console.log(socket.nickname, " joined");
	});

	socket.on("disconnect", () => {
		broadcast("disconnected", { nickname: socket.nickname });
	});

	socket.on("sendMessage", ({ message }) => {
		broadcast("newMessage", { message, nickname: socket.nickname });
	});

	socket.on("beginPath", ({ x, y }) => {
		broadcast("beganPath", { x, y });
	});

	socket.on("strokePath", ({ x, y }) => {
		broadcast("strokedPath", { x, y });
	});
};

export default socketController;
