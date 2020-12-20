import { chooseWord } from "./words.js";

let sockets = [];
let gameInProgress = false;
let word, leader;

const chooseLeader = () => sockets[Math.floor(Math.random() * sockets.length)];

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

	const startGame = () => {
		if (!gameInProgress) {
			gameInProgress = true;
			leader = chooseLeader();
			word = chooseWord();

			setTimeout(() => {
				superBroadcast("gameStarted");
				io.to(leader.id).emit("leaderNotification", { word }); // only send to the leader
			}, 1500);
		}
	};

	const endGame = () => {
		gameInProgress = false;
		superBroadcast("gameEnded");
	};

	socket.on("setNickname", ({ nickname }) => {
		socket.nickname = nickname;

		sockets.push({ id: socket.id, points: 0, nickname });

		broadcast("newUser", { nickname });

		superBroadcast("playerUpdate", { sockets });
		if (sockets.length === 2) {
			startGame();
		}
	});

	socket.on("disconnect", () => {
		sockets = sockets.filter(s => s.id !== socket.id);

		if (sockets.length === 1) {
			endGame();

			if (leader) {
				if (leader.id === socket.id) {
					endGame();
				}
			}
		}

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
