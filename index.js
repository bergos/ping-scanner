import { EventEmitter } from 'events'
import Promise from 'bluebird'
import isAlive from './lib/isAlive.js'
import { hostsOf as hostsOfNetwork, list as listNetworks } from './lib/network.js'

class Scanner extends EventEmitter {
  constructor ({ networks, hosts, concurrent = 32, timeout = 2000 } = {}) {
    super()

    this.networks = networks || listNetworks({ internal: false, ipv4: true, ipv6: false })
    this.hosts = hosts || [...this.networks].reduce((hosts, network) => hosts.concat(hostsOfNetwork(network)), [])
    this.concurrent = concurrent
    this.timeout = timeout
  }

  async scan () {
    this.emit('start')

    const results = new Map()

    await Promise.map([...this.hosts], async host => {
      this.emit('scan', host)

      const alive = await isAlive(host, { timeout: this.timeout })

      results.set(host, alive)

      if (alive) {
        this.emit('alive', host)
      } else {
        this.emit('timeout', host)
      }
    }, { concurrency: this.concurrent })

    this.emit('end')

    return results
  }
}

export default Scanner
