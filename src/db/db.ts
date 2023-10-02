import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

import { BlogViewModel } from '../models/blogs/BlogViewModel'
import { PostViewModel } from '../models/posts/PostViewModel'

dotenv.config()

const mongoURI = process.env.MONGO_URI

if (!mongoURI) throw new Error('mongoURI not found')

const client = new MongoClient(mongoURI)

export const blogsCollection = client.db().collection<BlogViewModel>('blogs')
export const postsCollection = client.db().collection<PostViewModel>('posts')

export async function runDb() {
  try {
    await client.connect()

    await client.db('routes').command({ ping: 1 })

    console.log('mongoDb successfully connected')
  } catch {
    console.log("Smth went wrong, can't connect to mongoDb")
    await client.close()
  }
}
