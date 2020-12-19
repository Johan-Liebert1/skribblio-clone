(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const NICKNAME = "nickname";
const LOGGED_OUT = "loggedOut";
const LOGGED_IN = "loggedIn";

const nickname = localStorage.getItem(NICKNAME);
const body = document.querySelector("body");
const loginForm = document.getElementById("jsLogin");

const messages = document.getElementById("jsMessages");
const sendMsg = document.getElementById("jsSendMsg");

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

const initSockets = () => {
	getSocket().on("newUser", handleNewUser);
	getSocket().on("disconnected", handleDisconnect);
	getSocket().on("newMessage", handleNewMessage);
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

},{}]},{},[1])