import express, { Response } from 'express'

import { blogsService } from '../domain/blogs-service'
import {
  BlogErrorsValidation,
  PostErrorsValidation,
  PostValidation,
  ValidateBlog,
  authGuardMiddleware,
  validateObjectId,
} from '../middlewares'
import { FindBlogMiddleware } from '../middlewares/blogs/findBlogMiddleware'
import {
  BlogQueryModel,
  CreateBlogModel,
  CreatePostByBlogIdModel,
  URIParamsBlogIdModel,
} from '../models'
import {
  BlogIdType,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../shared'

export const blogsRouter = () => {
  const router = express.Router()

  router.get(
    `/`,
    async (req: RequestWithParams<BlogQueryModel>, res: Response) => {
      const data = req.query

      const blogs = await blogsService.getAllBlogs(data)

      return res.status(200).send(blogs)
    },
  )

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
      const data = req.body

      const newBlog = await blogsService.createBlog(data)

      return res.status(201).send(newBlog)
    },
  )

  router.get(
    `/:blogId/posts`,
    FindBlogMiddleware,
    async (req: RequestWithParams<BlogIdType>, res: Response) => {
      const blogId = req.params.blogId

      const data = req.query

      const postsByBlogId = await blogsService.getPostsByBlogId(blogId, data)

      return res.status(200).send(postsByBlogId)
    },
  )

  router.post(
    `/:blogId/posts`,
    authGuardMiddleware,
    FindBlogMiddleware,
    PostValidation(),
    PostErrorsValidation,
    async (
      req: RequestWithParamsAndBody<BlogIdType, CreatePostByBlogIdModel>,
      res: Response,
    ) => {
      const blogId = req.params.blogId

      const data = req.body

      const createdPostByBlogId = await blogsService.createPostByBlogId(
        blogId,
        data,
      )

      return res.status(201).send(createdPostByBlogId)
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
