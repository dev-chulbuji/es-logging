const winston = require('winston')
const fs = require('fs')

const getLogDir = () => {
  return 'logs'
}

const jsonFormatter = (logEntry) => {
  const MESSAGE = Symbol.for('message')
  const base = { timestamp: new Date() }
  const json = Object.assign(base, logEntry.message)
  logEntry[MESSAGE] = JSON.stringify(json)
  return logEntry
}

exports.getLogger = (options) => {
  if (typeof options === 'string') options = { filename: options }

  const level = options.filename === 'error.log' ? 'error' : 'info'

  if (!fs.existsSync(getLogDir())) {
    fs.mkdirSync(getLogDir())
  }
  const transports = [
    new (winston.transports.File)({
      filename: `${getLogDir()}/${options.filename}`,
      format: winston.format(jsonFormatter)(),
      maxsize: 1024 * 1024 * 100,
      tailable: true,
      json: true,
      level
    })
  ]

  if (options.console) {
    transports.push(new (winston.transports.Console)({
      format: winston.format(jsonFormatter)(),
      colorize: true,
      level
    }))
  }

  return winston.createLogger({
    transports,
    exitOnError: false
  })
}