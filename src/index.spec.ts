import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinon from 'sinon'
import {expect} from 'chai'

import {
  TokenService,
  TokenExpiredError,
  TokenInvalidError,
  TokenSignError,
} from '.'

chai.use(chaiAsPromised)

let clock: sinon.SinonFakeTimers

before(() => {
  clock = sinon.useFakeTimers()
})

after(() => {
  clock.restore()
})

describe('TokenService', () => {
  const tokenService = new TokenService('test', 1)

  describe('sign', () => {
    it('should return a token', async () => {
      const token = await tokenService.sign()
      expect(token).equals(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjAsImV4cCI6MX0._P62kWb-NE1dbIE99AKpZjHdJQP0z2MPJj9qDq-_0P4'
      )
    })

    it('should throw TokenSignError', () => {
      const tokenService = new TokenService('', 1)
      const promise = tokenService.sign()
      return expect(promise).rejectedWith(TokenSignError)
    })
  })

  describe('verify', () => {
    it('should return payload', async () => {
      const token = await tokenService.sign({foo: 'bar'})
      const payload = await tokenService.verify(token)
      expect(payload).deep.equals({
        iat: 0,
        exp: 1,
        foo: 'bar',
      })
    })

    it('should throw TokenExpiredError', async () => {
      const token = await tokenService.sign({foo: 'bar'})
      clock.tick(1000)
      const promise = tokenService.verify(token)
      return expect(promise).rejectedWith(TokenExpiredError)
    })

    it('should throw TokenInvalidError', () => {
      const promise = tokenService.verify('')
      return expect(promise).rejectedWith(TokenInvalidError)
    })
  })
})
