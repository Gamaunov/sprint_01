import express, { Request, Response } from 'express'

import { blogsService } from '../domain'
import { BlogErrorsValidation, ValidateBlog } from '../middlewares'
import { validateObjectId } from '../middlewares'
import { authGuardMiddleware } from '../middlewares'
import { CreateBlogModel } from '../models'
import { URIParamsBlogIdModel } from '../models'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../shared/index'

export const blogsRouter = () => {
  const router = express.Router()

  router.get(`/`, async (req: Request, res: Response) => {
    const blogs = await blogsService.getAllBlogs()
    blogs ? res.status(200).send(blogs) : res.sendStatus(404)
  })

  router.get(
    `/:id`,
    validateObjectId,
    async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response) => {
      const blog = await blogsService.getBlogById(req.params.id)

      blog ? res.status(200).send(blog) : res.sendStatus(404)
    },
  )

  router.post(
    `/`,
    authGuardMiddleware,
    ValidateBlog(),
    BlogErrorsValidation,
    async (req: RequestWithBody<CreateBlogModel>, res: Response) => {
      const { name, description, websiteUrl } = req.body

      const newBlog = await blogsService.createBlog(
        name,
        description,
        websiteUrl,
      )

      return res.status(201).send(newBlog)
    },
  )

  router.put(
    `/:id`,
    validateObjectId,
    authGuardMiddleware,
    ValidateBlog(),
    BlogErrorsValidation,
    async (
      req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreateBlogModel>,
      res: Response,
    ) => {
      const { name, description, websiteUrl } = req.body

      const { id } = req.params

      const isUpdated = await blogsService.updateBlog(
        id,
        name,
        description,
        websiteUrl,
      )

      isUpdated ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  router.delete(
    `/:id`,
    validateObjectId,
    authGuardMiddleware,
    async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response) => {
      const isDeleted = await blogsService.deleteBlog(req.params.id)

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  return router
}
