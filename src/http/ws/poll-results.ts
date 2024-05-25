import { FastifyInstance } from "fastify";

export async function pollResults(app: FastifyInstance) {
  app.get(
    "/polls/:pollId/results",
    { websocket: true },
    (connection, request) => {
      connection.socket.on("message", (message: string) => {
        connection.socket.send(`you sent: ${message}`);

        setInterval(() => {
          connection.socket.send("2 seconds have passed");
        }, 2000);
      });
    }
  );
}
