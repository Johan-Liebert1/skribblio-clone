let sockets = [];

const socketController = (socket, io) => {
	// socket.emit("Hello"); // hello is an event
	// socket.broadcast.emit("Hello");
	// socket.on("newMessage", ({ message }) => {
	// 	socket.broadcast.emit("messageNotification", {
	// 		message,
	// 		nickname: socket.nickname
	// 	});
	// });

	const broadcast = (eventName, data) => {
		// this will broadcast to all sockets except the current socket
		socket.broadcast.emit(eventName, data);
	};

	const superBroadcast = (eventName, data) => {
		// this will broadcast to everyone. Even to the current socket
		io.emit(eventName, data);
	};

	socket.on("setNickname", ({ nickname }) => {
		socket.nickname = nickname;

		sockets.push({ id: socket.id, points: 0, nickname });

		broadcast("newUser", { nickname });

		superBroadcast("playerUpdate", { sockets });
	});

	socket.on("disconnect", () => {
		sockets = sockets.filter(s => s.id !== socket.id);
		broadcast("disconnected", { nickname: socket.nickname });
		superBroadcast("playerUpdate", { sockets });
	});

	socket.on("sendMessage", ({ message }) => {
		broadcast("newMessage", { message, nickname: socket.nickname });
	});

	socket.on("beginPath", ({ x, y }) => {
		broadcast("beganPath", { x, y });
	});

	socket.on("strokePath", ({ x, y, color }) => {
		broadcast("strokedPath", { x, y, color });
	});

	socket.on("fill", ({ color }) => {
		broadcast("filled", { color });
	});
};

export default socketController;
