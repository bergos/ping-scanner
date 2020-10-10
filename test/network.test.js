import { deepStrictEqual, strictEqual } from 'assert'
import mocha from 'mocha'
import { hostsOf, list } from '../lib/network.js'

const { describe, it } = mocha

describe('network', () => {
  describe('hostsOf', () => {
    it('should be a function', () => {
      strictEqual(typeof hostsOf, 'function')
    })

    it('should return an array of all hosts in the given network', () => {
      const expected = [
        '127.0.0.1',
        '127.0.0.2',
        '127.0.0.3',
        '127.0.0.4',
        '127.0.0.5',
        '127.0.0.6'
      ]
      const hosts = hostsOf('127.0.0.1/29')

      deepStrictEqual(hosts, expected)
    })
  })

  describe('list', () => {
    it('should be a function', () => {
      strictEqual(typeof list, 'function')
    })

    it('should list the networks in CIDR notation', () => {
      const networks = list({ internal: true, ipv4: true, ipv6: true })

      strictEqual(networks.includes('127.0.0.1/8'), true)
      strictEqual(networks.includes('::1/128'), true)
    })
  })
})
