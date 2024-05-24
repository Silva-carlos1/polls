import { z } from "zod";
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/votes", async (request, replay) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    });

    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = voteOnPollParams.parse(request.params);
    const { pollOptionId } = voteOnPollBody.parse(request.body);

    let { sessionId } = request.cookies

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId
          }
        }
      })
      
      if (userPreviousVoteOnPoll  && userPreviousVoteOnPoll.pollOptionId != pollOptionId) {
        
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id
          }
        })

      } else if (userPreviousVoteOnPoll) {
        return replay.status(400).send({message: 'You already voted on this poll'})
      }
    }
    
    if (!sessionId) {
      sessionId = randomUUID();

      replay.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, //30 Days
        signed: true,
        httpOnly: true,
      });
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId
      }
    })

    return replay.status(201).send();
  });
}
