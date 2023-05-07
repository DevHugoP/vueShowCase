export interface CommentEntity {
  id: number
  content: string
  externalUserId: string
  author: string
  orderId: number
  createdAt: string
  updatedAt: string
}

export interface CommentFilter {
  orderId: number
}
