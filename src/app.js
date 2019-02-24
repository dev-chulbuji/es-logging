const express = require('express')
const app = express()
const accessMiddleware = require('./middlewares/access')
const errorMiddleware = require('./middlewares/error')
const port = 4000

app.use(accessMiddleware.access)

require('./routes').routes(app)
app.use((req, res, next) => next({code: 404, msg: 'uri is not found'}))  // not exists in router and static folder
app.use(errorMiddleware.logging)

app.listen(port, () => console.log(`server is running on ${port} port`))
