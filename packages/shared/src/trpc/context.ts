// tRPC Context for all procedures
export interface TrpcContext {
  req?: any
  res?: any
  user?: {
    id: string
    email?: string
  }
}
