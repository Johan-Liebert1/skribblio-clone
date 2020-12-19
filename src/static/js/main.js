(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])