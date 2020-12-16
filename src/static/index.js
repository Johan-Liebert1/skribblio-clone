const socket = io("/");

// socket.on("Hello", () => console.log("The server says hello"));

const setNickname = nn => {
	socket.emit("setNickname", { nn });
};

const sendMessage = message => {
	socket.emit("newMessage", { message });
	console.log(`You messaged : ${message}`);
};

const handleMessageNotif = data => {
	const { message, nickname } = data;

	if (!nickname) {
		nickname = "Annonymous";
	}

	console.log(`${nickname} said : ${message}`);
};

socket.on("messageNotification", handleMessageNotif);
