import { networkInterfaces } from 'os'
import ip from 'ip'

function hostsOf (network) {
  const { firstAddress, lastAddress } = ip.cidrSubnet(network)
  const start = ip.toLong(firstAddress)
  const end = ip.toLong(lastAddress)
  const hosts = []

  for (let i = start; i <= end; i++) {
    hosts.push(ip.fromLong(i))
  }

  return hosts
}

function list ({ internal, ipv4, ipv6 } = {}) {
  return Object.values(networkInterfaces())
    .reduce((all, networks) => all.concat(networks), [])
    .filter(network => {
      if (typeof internal === 'boolean' && network.internal !== internal) {
        return false
      }

      if (ipv4 === false && network.family === 'IPv4') {
        return false
      }

      if (ipv6 === false && network.family === 'IPv6') {
        return false
      }

      return true
    })
    .map(network => network.cidr)
}

export {
  hostsOf,
  list
}
