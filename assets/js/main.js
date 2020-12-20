// =================================== code for paint board ======================================
const canvas = document.getElementById("jsCanvas");
const controls = document.getElementById("jsControls");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const mode = document.getElementById("jsMode");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 400;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

const stopPainting = () => {
	painting = false;
};

const startPainting = () => {
	painting = true;
};

const beginPath = (x, y) => {
	ctx.beginPath();
	ctx.moveTo(x, y);
};

const strokePath = (x, y, color = null) => {
	let currentColor = ctx.strokeStyle;
	if (color !== null) {
		ctx.strokeStyle = color;
	}
	ctx.lineTo(x, y);
	ctx.stroke();
	ctx.strokeStyle = currentColor;
};

const onMouseMove = event => {
	console.log("mouse move");
	const x = event.offsetX;
	const y = event.offsetY;
	if (!painting) {
		beginPath(x, y);
		getSocket().emit("beginPath", { x, y });
	} else {
		strokePath(x, y);
		getSocket().emit("strokePath", {
			x,
			y,
			color: ctx.strokeStyle
		});
	}
};

const handleColorClick = event => {
	const color = event.target.style.backgroundColor;
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
};

const handleModeClick = () => {
	if (filling === true) {
		filling = false;
		mode.innerText = "Fill";
	} else {
		filling = true;
		mode.innerText = "Paint";
	}
};

const fill = (color = null) => {
	let currentColor = ctx.fillStyle;
	if (color !== null) {
		ctx.fillStyle = color;
	}
	ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
	ctx.fillStyle = currentColor;
};

const handleCanvasClick = () => {
	if (filling) {
		fill();
		getSocket().emit("fill", { color: ctx.fillStyle });
	}
};

const handleCM = event => {
	event.preventDefault();
};

Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick));

if (mode) {
	mode.addEventListener("click", handleModeClick);
}

const handleBeganPath = ({ x, y }) => beginPath(x, y);
const handleStrokedPath = ({ x, y, color }) => strokePath(x, y, color);
const handleFilled = ({ color }) => fill(color);

const disableCanvas = () => {
	console.log("disable canvas");

	canvas.removeEventListener("mousemove", onMouseMove);
	canvas.removeEventListener("mousedown", startPainting);
	canvas.removeEventListener("mouseup", stopPainting);
	canvas.removeEventListener("mouseleave", stopPainting);
	canvas.removeEventListener("click", handleCanvasClick);
};

const enableCanvas = () => {
	console.log("enable canvas");
	canvas.addEventListener("mousemove", onMouseMove);
	canvas.addEventListener("mousedown", startPainting);
	canvas.addEventListener("mouseup", stopPainting);
	canvas.addEventListener("mouseleave", stopPainting);
	canvas.addEventListener("click", handleCanvasClick);
};

const hideControls = () => (controls.style.display = "none");

const showControls = () => (controls.style.display = "flex");

const resetCanvas = () => fill("#fff");

if (canvas) {
	canvas.addEventListener("contextmenu", handleCM);
	enableCanvas();
}
// =================================== code for paint board ======================================

const NICKNAME = "nickname";
const LOGGED_OUT = "loggedOut";
const LOGGED_IN = "loggedIn";

const nickname = localStorage.getItem(NICKNAME);
const body = document.querySelector("body");
const loginForm = document.getElementById("jsLogin");

const messages = document.getElementById("jsMessages");
const sendMsg = document.getElementById("jsSendMsg");

const playerBoard = document.getElementById("jsPBoard");
// leader notifs
const notifs = document.getElementById("jsNotifs");

const handleFormSubmit = e => {
	e.preventDefault();
	const input = loginForm.querySelector("input");
	const { value } = input;
	input.value = "";
	localStorage.setItem(NICKNAME, value);
	body.className = "loggedIn";
	login(value);
};

if (loginForm) {
	loginForm.addEventListener("submit", handleFormSubmit);
}

const fireNotification = (text, color) => {
	const notification = document.createElement("div");
	notification.innerText = text;
	notification.style.backgroundColor = color;
	notification.className = "notification";

	body.appendChild(notification);
};

const handleNewUser = ({ nickname }) => {
	// console.log("handleNewUser data = ", data);
	// const { nickname } = data;
	// console.log(`${nickname} just joined`);

	fireNotification(`${nickname} just joined`, "rgb(0, 122, 255)");
};

const handleDisconnect = ({ nickname }) => {
	fireNotification(`${nickname} just left`, "#ee5253");
};

const handleNewMessage = ({ message, nickname }) => {
	appendMessage(message, nickname);
};

const getSocket = () => window.socket;

const addPlayers = players => {
	playerBoard.innerHTML = "";
	players.forEach(player => {
		const pElement = document.createElement("span");
		pElement.innerText = `${player.nickname}: ${player.points}`;
		playerBoard.appendChild(pElement);
	});
};

const handlePlayerUpdate = ({ sockets }) => addPlayers(sockets);

const handleGameStarted = () => {
	notifs.innerText = "";
	// disable canvas events and hide the paint buttons if current socket is not the leader / painter
	disableCanvas();
	hideControls();
};

const handleLeaderNotification = ({ word }) => {
	enableCanvas();
	showControls();
	notifs.innerText = "";
	notifs.innerHTML = `You are the painter. Paint ${word}`;
};

const handleGameEnded = () => {
	notifs.innerText = "Game has ended";
	disableCanvas();
	hideControls();
	resetCanvas();
};

// =============== subscribe to sockets ==================================
const initSockets = () => {
	getSocket().on("newUser", handleNewUser);
	getSocket().on("disconnected", handleDisconnect);
	getSocket().on("newMessage", handleNewMessage);
	getSocket().on("beganPath", handleBeganPath);
	getSocket().on("strokedPath", handleStrokedPath);
	getSocket().on("filled", handleFilled);
	getSocket().on("playerUpdate", handlePlayerUpdate);
	getSocket().on("gameStarted", handleGameStarted);
	getSocket().on("leaderNotification", handleLeaderNotification);
	getSocket().on("gameEnded", handleGameEnded);
};

const login = nickname => {
	window.socket = io("/"); // client connecting to the socket
	window.socket.emit("setNickname", { nickname });
	initSockets();
};

if (nickname === null) {
	body.className = LOGGED_OUT;
} else {
	body.className = LOGGED_IN;
	login(nickname);
}

// chat functionality
const appendMessage = (text, nickname) => {
	const li = document.createElement("li");
	li.innerHTML = `
        <span class = 'author ${nickname ? "out" : "self"}'> 
            ${nickname ? nickname : "You"}: ${text}
        </span>
    `;
	messages.appendChild(li);
};

const handleSendMsg = event => {
	event.preventDefault();
	const input = sendMsg.querySelector("input");
	const { value } = input;

	getSocket().emit("sendMessage", { message: value });

	input.value = "";
	appendMessage(value);
};

if (sendMsg) {
	sendMsg.addEventListener("submit", handleSendMsg);
}
