import { deepStrictEqual, strictEqual } from 'assert'
import mocha from 'mocha'
import Scanner from '../index.js'

const { describe, it } = mocha

describe('ping-scan', () => {
  it('should be a constructor', () => {
    strictEqual(typeof Scanner, 'function')
  })

  it('should implement the EventEmitter interface', () => {
    const scanner = new Scanner()

    strictEqual(typeof scanner.on, 'function')
  })

  it('should automatically detect networks if no networks are given', () => {
    const scanner = new Scanner()

    strictEqual(scanner.networks.length > 0, true)
  })

  it('should fill the host list based on the networks', () => {
    const scanner = new Scanner({ networks: ['127.0.0.0/24'] })

    strictEqual(scanner.hosts.length, 254)
    strictEqual(scanner.hosts[0], '127.0.0.1')
    strictEqual(scanner.hosts[253], '127.0.0.254')
  })

  it('should use the given concurrent argument', () => {
    const scanner = new Scanner({ concurrent: 123 })

    strictEqual(scanner.concurrent, 123)
  })

  it('should use the given timeout argument', () => {
    const scanner = new Scanner({ timeout: 1234 })

    strictEqual(scanner.timeout, 1234)
  })

  describe('scan', () => {
    it('should be a method', () => {
      const scanner = new Scanner()

      strictEqual(typeof scanner.scan, 'function')
    })

    it('should be a async method', () => {
      const scanner = new Scanner({ networks: ['127.0.0.0/28'] })

      const result = scanner.scan()

      strictEqual(typeof result.then, 'function')
      strictEqual(typeof result.catch, 'function')
    })

    it('should return a Map', async () => {
      const scanner = new Scanner({ networks: ['127.0.0.0/28'] })

      const result = await scanner.scan()

      strictEqual(result instanceof Map, true)
    })

    it('should return a Map of all hosts', async () => {
      const scanner = new Scanner({ networks: ['127.0.0.0/28'] })

      const result = await scanner.scan()

      for (const host of scanner.hosts) {
        strictEqual(result.has(host), true)
      }
    })

    it('should return a Map with the alive status as boolean value', async () => {
      const scanner = new Scanner({ networks: ['127.0.0.0/28'] })

      const result = await scanner.scan()

      for (const host of scanner.hosts) {
        strictEqual(typeof result.get(host), 'boolean')
      }
    })

    it('should emit start at the start of the scan', async () => {
      let timestamp = null
      const scanner = new Scanner({ networks: ['127.0.0.0/28'] })

      scanner.on('start', () => {
        timestamp = Date.now()
      })

      const start = Date.now()
      await scanner.scan()

      strictEqual(timestamp - start < 2, true)
    })

    it('should emit end at the end of the scan', async () => {
      let timestamp = null
      const scanner = new Scanner({ networks: ['127.0.0.0/28'] })

      scanner.on('end', () => {
        timestamp = Date.now()
      })

      await scanner.scan()
      const end = Date.now()

      strictEqual(end - timestamp < 2, true)
    })

    it('should emit scan for each host', async () => {
      const emitted = []
      const scanner = new Scanner({ networks: ['127.0.0.0/28'] })

      scanner.on('scan', host => {
        emitted.push(host)
      })

      await scanner.scan()

      deepStrictEqual(emitted.sort(), scanner.hosts.sort())
    })

    it('should emit either alive or timeout for each host', async () => {
      const emitted = []
      const scanner = new Scanner({ networks: ['127.0.0.0/28'] })

      scanner.on('alive', host => {
        emitted.push(host)
      })

      scanner.on('timeout', host => {
        emitted.push(host)
      })

      await scanner.scan()

      deepStrictEqual(emitted.sort(), scanner.hosts.sort())
    })
  })
})
