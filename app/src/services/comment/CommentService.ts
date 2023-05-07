import RepositoryFactory from '@/services/RepositoryFactory'
import { CommentFilter, CommentEntity } from '@/types'
import { ICommentRepository } from './CommentRepository'

export class CommentService {
  private commentRepository: ICommentRepository

  constructor() {
    this.commentRepository = RepositoryFactory.get('comment')
  }

  public async getAll(params: CommentFilter): Promise<CommentEntity[]> {
    const { comments } = await this.commentRepository.getAll(params)

    return comments
  }

  public async create(comment: Partial<CommentEntity>): Promise<CommentEntity> {
    const { comment: newComment } = await this.commentRepository.create(comment)

    return newComment
  }
}

export default new CommentService()
