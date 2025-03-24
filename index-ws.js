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

process.on("SIGINT", () => {
  wss.clients.forEach(function each(client) {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
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

  db.run(
    `INSERT INTO visitors(count, time) VALUES (${numbClients}, datetime('now'))`
  );

  ws.on("close", function close() {
    console.log("Client disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

/** End WebSocket */
/** Begin Database */

const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(function () {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `);
});

function getCounts() {
  db.each("SELECT * FROM visitors", function (err, row) {
    console.log(row.count);
  });
}

function shutdownDB() {
  getCounts();
  console.log("Database closed");
  db.close();
}
