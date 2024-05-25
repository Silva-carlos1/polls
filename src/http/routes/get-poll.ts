import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:pollId", async (request, replay) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(), 
    });

    const { pollId } = getPollParams.parse(request.params);

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
       options: {
        select: {
          id: true,
          title: true
        }
       }
      }
    })
    
    if (!poll) {
      return replay.status(400).send({ message: "Poll not found" })
    }

    return replay.send({ poll });
  });
}
