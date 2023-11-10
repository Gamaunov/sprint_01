import { Router } from 'express'

import { container } from '../composition-root'
import { PostsController } from '../controllers/PostsController'
import {
  authBearerMiddleware,
  checkBasicMiddleware,
  commentErrorsValidation,
  findPostMiddleware,
  postErrorsValidation,
  postValidation,
  tokenParser,
  validateComment,
  validateObjectId,
} from '../middlewares'

export const postsRouter = Router({})
const postsController = container.resolve(PostsController)

postsRouter.get(
  `/`,
  tokenParser,
  postsController.getPosts.bind(postsController),
)

postsRouter.get(
  `/:id`,
  validateObjectId,
  tokenParser,
  postsController.getPost.bind(postsController),
)

postsRouter.post(
  `/`,
  checkBasicMiddleware,
  postValidation(),
  postErrorsValidation,
  postsController.createPost.bind(postsController),
)

postsRouter.get(
  `/:postId/comments`,
  findPostMiddleware,
  tokenParser,
  postsController.getComments.bind(postsController),
)

postsRouter.post(
  `/:postId/comments`,
  authBearerMiddleware,
  findPostMiddleware,
  validateComment(),
  commentErrorsValidation,
  postsController.createComment.bind(postsController),
)

postsRouter.put(
  `/:id`,
  validateObjectId,
  checkBasicMiddleware,
  postValidation(),
  postErrorsValidation,
  postsController.updatePost.bind(postsController),
)

postsRouter.delete(
  `/:id`,
  validateObjectId,
  checkBasicMiddleware,
  postsController.deletePost.bind(postsController),
)

postsRouter.delete(
  '/',
  checkBasicMiddleware,
  postsController.deletePosts.bind(postsController),
)
