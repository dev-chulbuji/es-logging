const logger = require('../util/utils').getLogger({ filename: `access.log`, console: false })
const uuidv4 = require('uuid/v4')

const getUUID = () => uuidv4()

const logging = exports.logging = (req, res) => {
  const url = req.originalUrl || req.url

  if (req.body) {
    delete req.body['Authorization']
    if (req.body.password) req.body.password = 'XXXXXXXX'
  }

  logger.info({
    __uuid: req.headers['x-request-id'],
    status: res.statusCode,
    method: req.method,
    url,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    user_id: req.token ? req.token.user_id : '-',
    username: req.token ? req.token.username : '-',
    body: req.body,
    duration: req.duration,
    user_agent: req.headers['user-agent']
  })
}

exports.access = (req, res, next) => {
  const start = Date.now()

  req.headers['x-request-id'] = getUUID()
  req.headers['Connection'] = 'keep-alive'

  res.once('finish', () => {
    req.duration = Date.now() - start
    logging(req, res)
  })

  next()
}