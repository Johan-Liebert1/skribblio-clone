const NICKNAME = "nickname";
const LOGGED_OUT = "loggedOut";
const LOGGED_IN = "loggedIn";

const nickname = localStorage.getItem(NICKNAME);
const body = document.querySelector("body");
const loginForm = document.getElementById("jsLogin");

const login = nickname => {
	window.socket = io("/"); // client connecting to the socket
	window.socket.emit("setNickname", { nickname });
};

if (nickname === null) {
	body.className = LOGGED_OUT;
} else {
	body.className = LOGGED_IN;
	login(nickname);
}

handleFormSubmit = e => {
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
