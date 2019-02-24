const express = require('express')
const users = require('./users')

const router = express.Router()

router.route('/users').get(users.getUsers)

exports.router = router
