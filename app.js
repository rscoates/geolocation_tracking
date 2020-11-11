'use strict'

// Required modules.
const path = require('path')
const express = require('express')
const http = require('http')
const bbt = require('beebotte')

const app = express()

const PORT = process.env.PORT || 8080
const apiKey = process.env.API_KEY || 'YOUR_API_KEY'
const secretKey = process.env.SECRET_KEY || 'YOUR_SECRET_KEY'

let lastLat = '51.506916'
let lastLong = '-0.09729'

// Replace by your ACCESS and SECRET Keys
const bclient = new bbt.Connector({
  apiKey,
  secretKey,
})

// configure Express
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res, next) {
  res.redirect('/monitor.html')
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
