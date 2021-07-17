const { createServer, plugins } = require('restify')
const { BadRequestError } = require('restify-errors')
const SerialPort = require('serialport')

const writeInterval = 150
const httpPort = 8080
const serialPortName = process.env.SERIAL_PORT || '/dev/ttyUSB0'

const directions = {
  event_cover_open: 1,
  event_cover_close: 2,
  event_cover_stop: 0
}

// extracted for better readability
const method = '<methodName>selve.GW.iveo.commandManual</methodName>'

const serial = new SerialPort(serialPortName, { baudRate: 115200 })

const writeQueue = []

const server = createServer()
server.use(plugins.acceptParser(server.acceptable))
server.use(plugins.bodyParser({ mapParams: true }))
server.listen(httpPort, err => {
  if (err) {
    console.error('Unable to start HTTP server')
    console.error(err)
    process.exit(1)
    return
  }

  console.log(`listening on port ${httpPort}`)

  setInterval(() => {
    if (writeQueue.length) {
      const { int, base64 } = writeQueue.shift()
      const msg = `<methodCall>${method}<array><base64>${base64}</base64><int>${int}</int></array></methodCall>`
      serial.write(msg, err => err ? console.error(err) : console.log('successfully sent message'))
    }
  }, writeInterval)

  server.post('/cover', (req, res, next) => {
    if (!req.body) {
      return next(new BadRequestError('no body given'))
    } else if (!req.body.event) {
      return next(new BadRequestError('no event given'))
    } else if (!req.body.event_type) {
      return next(new BadRequestError('no event_type given'))
    } else if (!req.body.event.base64) {
      return next(new BadRequestError('no base64 given'))
    } else {
      const int = directions[req.body.event_type]
      const base64 = req.body.event.base64
      writeQueue.push({ int, base64 })
      writeQueue.push({ int, base64 }) // add twice to ensure the transmission is doubled
      res.send({ OK: true })
    }
  })
})
