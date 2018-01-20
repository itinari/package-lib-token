# lib-token

Token service to sign and verify token

## Usage

```typescript
import {
  TokenService,
  TokenExpiredError,
  TokenInvalidError,
  TokenSignError,
} from '@itinari/lib-token'

const tokenService = new TokenService('mysecretkey', 3600)

// Sign
try {
  const token = await tokenService.sign({
    foo: 'bar',
  })
} catch (error) {
  if (error instanceof TokenSignError) {
    // ...
  }
}

// Verify
try {
  const payload = await tokenService.verify(token)
} catch (error) {
  if (error instanceof TokenExpiredError) {
    // ...
  } else if (error instanceof TokenInvalidError) {
    // ...
  }
}
```
