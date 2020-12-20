import express from "express";
import path from "path";
import { Server } from "socket.io";
import socketController from "./socketController.js";

const app = express();
const PORT = 5000;

const __dirname = path.resolve();

console.log("dirname", __dirname);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src/views"));
app.use(express.static(path.join(__dirname, "src/static")));

app.get("/", (req, res) => {
	return res.render("home");
});

const server = app.listen(PORT, () => `Server listening on port ${PORT}`);

const io = new Server(server); // having socketIO run of top of HTTP Server
// io is a WebSocket server running on top of HTTP server

io.on("connection", socket => socketController(socket, io));
