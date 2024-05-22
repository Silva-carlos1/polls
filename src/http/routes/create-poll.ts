import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (request, replay) => {
    const createPollBody = z.object({
      title: z.string()
    })
  
    const { title } = createPollBody.parse(request.body)
  
    const poll = await prisma.poll.create({
      data: {
        title,
      }
    })
  
    return replay.status(201).send({"pollId": poll.id})
  })
} 