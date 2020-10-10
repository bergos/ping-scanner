import Scanner from '../index.js'

async function main () {
  // scan the local network with 64 concurrent pings
  const scanner = new Scanner({ networks: ['192.168.1.0/24'], concurrent: 64 })

  // listen and log all events to the console
  scanner.on('start', () => console.log('scan started'))
  scanner.on('end', () => console.log('scan finished'))
  scanner.on('scan', host => console.log(`scan ${host}`))
  scanner.on('alive', host => console.log(`alive ${host}`))
  scanner.on('timeout', host => console.log(`timeout ${host}`))

  // start the scan
  const result = await scanner.scan()

  // the result is Map with the host as string key and alive as boolean value
  console.log(`scanned hosts: ${result.size}`)
  console.log(`hosts alive: ${[...result.values()].filter(Boolean).length}`)
}

main()
