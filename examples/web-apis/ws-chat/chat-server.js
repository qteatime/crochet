const Ws = require("ws");

const wss = new Ws.WebSocketServer({ port: 8081 });
const clients = new Map();

function reply(ws, tag, value) {
  ws.send(JSON.stringify({ "@type": tag, value }));
}

function broadcast(tag, value) {
  const msg = JSON.stringify({ "@type": tag, value });
  for (const ws of clients.keys()) {
    ws.send(msg);
  }
}

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const message = JSON.parse(data.toString("utf-8"));
    switch (message["@type"]) {
      case "connect":
        clients.set(ws, { name: message.value.name });
        reply(ws, "connected", { name: message.value.name });
        broadcast("joined", { name: message.value.name });
        break;

      case "send":
        const session = clients.get(ws);
        broadcast("received", {
          name: session.name,
          message: message.value.message,
        });
        break;

      default:
        console.log("Received unknown message", message);
    }
  });

  ws.on("close", () => {
    console.log(":: disconnected");
    clients.delete(ws);
  });

  console.log(":: connected");
});
