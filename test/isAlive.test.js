import { strictEqual } from 'assert'
import mocha from 'mocha'
import isAlive from '../lib/isAlive.js'

const { describe, it } = mocha

describe('isAlive', () => {
  it('should be a function', () => {
    strictEqual(typeof isAlive, 'function')
  })

  it('should be a async function', () => {
    const result = isAlive('127.0.0.1')

    strictEqual(typeof result.then, 'function')
    strictEqual(typeof result.catch, 'function')
  })

  it('should return true if the given host is alive', async () => {
    const alive = await isAlive('127.0.0.1')

    strictEqual(alive, true)
  })

  it('should return false if the given host is not alive', async () => {
    const alive = await isAlive('microsoft.com', { timeout: 1000 })

    strictEqual(alive, false)
  })

  it('should use the given timeout if a server is not reachable', async () => {
    const start = Date.now()
    await isAlive('microsoft.com', { timeout: 1000 })

    const timestamp = Date.now()

    strictEqual(timestamp - start > 990, true)
    strictEqual(timestamp - start < 1010, true)
  })
})
