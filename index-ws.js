const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, function () {
  console.log("Server started on port 3000");
});

/** Begin WebSocket */
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  const numbClients = wss.clients.size;
  console.log("Number of clients: " + numbClients);

  wss.broadcast("Current visitors: " + numbClients);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome!");
  }

  ws.on("close", function close() {
    console.log("Client disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
