import * as jwt from 'jsonwebtoken'

export class TokenExpiredError extends Error {
  constructor() {
    super('Expired token')
    this.name = this.constructor.name
  }
}

export class TokenInvalidError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class TokenSignError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class TokenService {
  secret: string
  ttl: number

  constructor(secret: string, ttl: number) {
    this.secret = secret
    this.ttl = ttl
  }

  async sign(payload: any = {}): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      return jwt.sign(
        payload,
        this.secret,
        {algorithm: 'HS256', expiresIn: this.ttl},
        (error, token) => {
          if (error) {
            return reject(new TokenSignError(error.message))
          }
          return resolve(token)
        }
      )
    })
  }

  async verify(token: string): Promise<object> {
    return new Promise<any>((resolve, reject) => {
      return jwt.verify(
        token,
        this.secret,
        {algorithms: ['HS256']},
        (error, payload) => {
          if (error) {
            if (error.name === 'TokenExpiredError') {
              return reject(new TokenExpiredError())
            } else if (error.name === 'JsonWebTokenError') {
              return reject(new TokenInvalidError(error.message))
            }
            // NOTE: This point should never be reached
            return reject(error)
          }
          return resolve(payload)
        }
      )
    })
  }

  decode(token: string): object {
    return jwt.decode(token) as object
  }
}
