import ping from 'ping'
import withTimeout from './withTimeout.js'

async function isAlive (host, { timeout = 2000 } = {}) {
  timeout = Math.ceil(timeout / 1000)

  return withTimeout(async () => {
    return (await ping.promise.probe(host, { timeout })).alive
  }, timeout * 1000, false)
}

export default isAlive
