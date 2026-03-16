import { app, query, update } from 'mu'

import express from 'express'
import bodyParser from 'body-parser'

app.use(
  bodyParser.json({
    limit: '500mb',
    type: function (req) {
      return /^application\/json/.test(req.get('content-type'))
    },
  }),
)

app.use(express.urlencoded({ extended: true }))

app.post('/', async (req, res) => {
  const queryString = req.body.query ?? req.body.update
  if (!queryString) {
    const error = new Error('No query value was found.')
    error.status = 400
    error.description = `The endpoint received a body without the property 'query' or 'body'.`
    console.log('[ERROR] ' + error.description)
    console.log(JSON.stringify(req.body))

    throw error
  }

  let queryMethod = query
  if (req.body.update) {
    queryMethod = update
  }

  try {
    const result = await queryMethod(queryString)
    res.status(200).send(result)
  } catch (error) {
    console.log('[ERROR] ' + error)
    throw new Error('Something went wrong while executing the query.')
  }
})

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
