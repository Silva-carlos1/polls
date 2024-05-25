import fastify from "fastify"
import cookie from "@fastify/cookie"
import websocket from "@fastify/websocket";
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import { voteOnPoll } from "./routes/vote-on-poll";
import { pollResults } from "./ws/poll-results";

const app = fastify()

app.register(cookie, {
  secret: "polls-app",
  hook: 'onRequest',
})

app.register(websocket)

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)

app.register(pollResults)
app.get('/w', { websocket: true }, (connection, request) => {
  console.log('New WebSocket connection established');

  connection.socket.on('message', (message: string) => {
    console.log(`Received message: ${message}`);
    connection.socket.send(`you sent: ${message}`);
  });

  connection.socket.on('close', (code: any, reason: any) => {
    console.log(`WebSocket connection closed, code: ${code}, reason: ${reason}`);
  });

  connection.socket.on('error', (error: any) => {
    console.error('WebSocket error:', error);
  });
});


app.listen({ port: 3333}).then(() => {
  console.log("HTTP server running!")
})

