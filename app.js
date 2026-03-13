import { app } from 'mu'

import express from 'express'
import bodyParser from 'body-parser'

import { sparqlRouter } from './sparql'

app.use(
  bodyParser.json({
    limit: '500mb',
    type: function (req) {
      return /^application\/json/.test(req.get('content-type'))
    },
  }),
)

app.use(express.urlencoded({ extended: true }))

app.use('/', sparqlRouter)

const errorHandler = function (err, _req, res, _next) {
  res.status(err.status)
  res.json({
    errors: [
      {
        status: err.status,
        message: err.message,
        description: err.description,
      },
    ],
  })
}

app.use(errorHandler)
