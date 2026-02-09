// 型定義

export interface User {
  id: string
  email: string
  username: string
  displayName: string
  bio?: string
  avatar?: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  authorId: string
  author: User
  preface: string
  content: string
  sources: Source[]
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Source {
  id: string
  postId: string
  type: 'URL' | 'BOOK' | 'PAPER' | 'ARTICLE' | 'OTHER'
  title?: string
  url?: string
  author?: string
  publishDate?: string
  notes?: string
  createdAt: Date
}

export interface Tag {
  id: string
  name: string
  description?: string
  createdAt: Date
}

export interface PostTag {
  id: string
  postId: string
  tagId: string
  addedBy: 'AI' | 'USER'
  createdAt: Date
}

export interface Report {
  id: string
  postId: string
  reporterId: string
  reason: 'FALSE_INFORMATION' | 'MISSING_SOURCE' | 'INAPPROPRIATE_CONTENT' | 'SPAM' | 'OTHER'
  description?: string
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED'
  reviewedBy?: string
  reviewedAt?: Date
  reviewNote?: string
  createdAt: Date
}

export interface CommunityNote {
  id: string
  postId: string
  authorId: string
  content: string
  sources?: string
  helpfulCount: number
  notHelpfulCount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  author: User
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface Like {
  id: string
  postId: string
  userId: string
  createdAt: Date
}
