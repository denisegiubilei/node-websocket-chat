import express from 'express';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from 'path';

import { routes } from './routes';

import "./database";

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/pages/client", (request, reponse) => {
  return reponse.render("html/client.html");
})

app.get("/pages/admin", (request, reponse) => {
  return reponse.render("html/admin.html");
})

const http = createServer(app);
const io = new Server(http);

io.on("connection", (socket: Socket) => {
  console.log("Se conectou", socket.id);
})

app.use(express.json());

app.use(routes);

export { http, io };