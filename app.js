'use strict'

// Required modules.
const path = require('path')
const express = require('express')
const http = require('http')
const bbt = require('beebotte')

const app = express()

const PORT = process.env.PORT || 8080

// Replace by your ACCESS and SECRET Keys
const bclient = new bbt.Connector({
  apiKey: 'YOUR_API_KEY',
  secretKey: 'YOUR_SECRET_KEY',
})

// configure Express
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res, next) {
  res.redirect('/track.html')
})

app.get( '/auth', function (req, res, next) {

  const channel = req.query.channel
  const resource = req.query.resource || '*'
  const ttl = req.query.ttl || 0
  const read = req.query.read === 'true'
  const write = req.query.write === 'true'
  const sid = req.query.sid

  if (!sid || !channel) {
    return res.status(403).send('Unauthorized')
  }

  const retval = bclient.sign(
    // string to sign
    `${sid}:${channel}.${resource}:ttl=${ttl}:read=${read}:write=${write}`
  )

  return res.send(retval)
})

const server = app.listen(PORT, function () {

  const host = server.address().address
  const port = server.address().port

  console.log('presentit listening at http://%s:%s', host, port)
})
