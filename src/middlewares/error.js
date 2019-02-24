const logger = require('../util/utils').getLogger({filename: 'error.log', console: true})

const getErrorObj = (err) => {
  const {code} = err
  let customCode = 5002

  switch (true) {
    case !isNaN(err): {
      customCode = err
      break
    }

    case !isNaN(code): {
      customCode = code
      break
    }
  }

  const statusCode = customCode
  //return { statusCode, body: utils.responseFormat({ code: customCode }) }
  return {
    statusCode,
    body: {
      meta: {
        code: customCode,
        message: err.msg || 'Internal Server Error'
      },
      data: {}
    }
  }
}

exports.logging = (err, req, res, next) => {
  if (!err) return next()

  const e = getErrorObj(err)

  console.log(e)

  if (e.statusCode >= 500) {
    if (req.body) {
      delete req.body['Authorization']
      if (req.body.password) req.body.password = 'XXXXXXXX'
    }

    const log = {
      __uuid: req.headers['x-request-id'],
      status: e.statusCode,
      custom_status: e.body.meta.code,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      method: req.method,
      url: req.originalUrl || req.url,
      body: req.body,
      duration: req.duration,
      user_agent: req.headers['user-agent'],
      e,
      error: err
    }

    if (err instanceof Error) log['stack'] = JSON.stringify(err.stack)
    if (err.err instanceof Error) log['stack'] = JSON.stringify(err.err.stack)

    logger.error(log)

    // if (config.isProd()) {
    //   utils.sendToSlack({
    //     msg: JSON.stringify(log)
    //   }).catch(err => logger.error(err))
    // }
  }

  res.status(e.statusCode).json(e.body)
}
