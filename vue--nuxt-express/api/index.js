// imports
const express = require('express')
// app instance
const app = express()
// use api routes
app.use('/hello', require('./routes/api/hello'))
app.use('/auth', require('./routes/api/auth'))
// export app
module.exports = app
