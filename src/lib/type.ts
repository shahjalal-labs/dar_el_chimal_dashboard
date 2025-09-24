export interface ChatUser {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread?: boolean
}

export interface Message {
  id: string
  userId: string
  userName: string
  avatar: string
  content: string
  timestamp: string
  reactions?: string[]
}

export interface AllTypes {
  id: string
}