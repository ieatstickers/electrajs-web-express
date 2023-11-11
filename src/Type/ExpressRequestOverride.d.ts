declare namespace Express {
  export interface Request {
    electra?: { [key: string]: any }
  }
}
