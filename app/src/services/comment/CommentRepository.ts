import HttpRepository from '@/services/HttpRepository'
import { CommentEntity, CommentFilter } from '@/types'

export interface ICommentRepository {
  getAll: (params: CommentFilter) => Promise<{ comments: CommentEntity[] }>
  create: (comment: Partial<CommentEntity>) => Promise<{ comment: CommentEntity }>
}

export default class CommentRepository extends HttpRepository {}
