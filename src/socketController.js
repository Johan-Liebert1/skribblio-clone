const socketController = socket => {
	// socket.emit("Hello"); // hello is an event
	// socket.broadcast.emit("Hello");
	socket.on("newMessage", ({ message }) => {
		socket.broadcast.emit("messageNotification", {
			message,
			nickname: socket.nickname
		});
	});

	socket.on("setNickname", ({ nickname }) => {
		console.log("Nickname = ", nickname);
		socket.nickname = nickname;
	});
};

export default socketController;
