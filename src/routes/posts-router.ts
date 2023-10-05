import express, { Request, Response } from 'express'

import { postsService } from '../domain'
import { authGuardMiddleware } from '../middlewares'
import { validateObjectId } from '../middlewares'
import { PostErrorsValidation, PostValidation } from '../middlewares'
import { CreatePostModel } from '../models'
import { URIParamsPostModel } from '../models'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../shared'

export const postsRouter = () => {
  const router = express.Router()

  router.get(`/`, async (req: Request, res: Response) => {
    const posts = await postsService.getAllPosts()

    posts ? res.status(200).send(posts) : res.sendStatus(404)
  })

  router.get(
    `/:id`,
    validateObjectId,
    async (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
      const blog = await postsService.getPostById(req.params.id)

      blog ? res.status(200).send(blog) : res.sendStatus(404)
    },
  )

  router.post(
    `/`,
    authGuardMiddleware,
    PostValidation(),
    PostErrorsValidation,
    async (req: RequestWithBody<CreatePostModel>, res: Response) => {
      const { blogId, content, shortDescription, title } = req.body

      const newPost = await postsService.createPost(
        blogId,
        content,
        shortDescription,
        title,
      )

      return res.status(201).send(newPost)
    },
  )

  router.put(
    `/:id`,
    validateObjectId,
    authGuardMiddleware,
    PostValidation(),
    PostErrorsValidation,
    async (
      req: RequestWithParamsAndBody<URIParamsPostModel, CreatePostModel>,
      res: Response,
    ) => {
      const { blogId, content, shortDescription, title } = req.body

      const { id } = req.params

      const isUpdated = await postsService.updatePost(
        id,
        title,
        shortDescription,
        content,
        blogId,
      )

      isUpdated ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  router.delete(
    `/:id`,
    validateObjectId,
    authGuardMiddleware,
    async (req: RequestWithParams<URIParamsPostModel>, res) => {
      const isDeleted = await postsService.deletePost(req.params.id)

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  return router
}
