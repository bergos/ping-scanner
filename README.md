# ping-scanner

A `ping` based network scanner.

## Usage

The package exports a `Scanner` class that can be imported like this:

```javascript
import Scanner from 'ping-scanner'
```

### Scanner({ networks, hosts, concurrent, timeout })

Creates a new `Scanner` instance.
The following arguments are supported:

- `networks`: An iterable object that contains strings of networks in CIDR notation that should be scanned.
 By default, all known ipv4 networks are used.
- `hosts`: An iterable object that contains strings of IP addresses that should be scanned.
 By default, the list of hosts is derived from the `networks` argument.
- `concurrent`: The number of pings that run in parallel.
  The default value is `32`.
- `timeout`: Timeout for each ping scan in milliseconds.
  The value is rounded to the next higher full second value.
  The default value is `2000`.

### async scan()

Starts a scan as defined by the constructor arguments.
It returns a `Map` with the host as key and a boolean alive value.

### Event: start

This event is emitted before a new scan.

### Event: end

This event is emitted after a scan.

### Event: scan(host)

This event is emitted for each host before pinging the host.

### Event: alive(host)

This event is emitted if the host is alive.

### Event: timeout(host)

This event is emitted if the host could not be reached.
