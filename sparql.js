import Router from 'express-promise-router'

import { query, update } from 'mu'
import { Parser } from '@traqula/parser-sparql-1-1'

export const sparqlRouter = Router()

sparqlRouter.post('/', async (req, res) => {
  const queryString = req.body.query ?? req.body.update

  if (!queryString) {
    const error = new Error('No query value was found.')
    error.status = 400
    error.description = `The endpoint received a body without the property 'query' or 'body'.`
    console.log('[ERROR] ' + error.description)
    console.log(JSON.stringify(req.body))

    throw error
  }

  const queryValidationResult = validateQuery(queryString)
  if (!queryValidationResult.isValid) {
    const error = new Error(queryValidationResult.message)
    error.status = 422
    error.description = queryValidationResult.description
    console.log('[ERROR] ' + error.message)
    console.log(JSON.stringify(queryValidationResult))

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
    throw new Error('Something went wrong while executing the query.')
  }
})

function validateQuery(queryString) {
  const parser = new Parser()

  try {
    const result = parser.parse(queryString)
    return {
      isValid: true,
      queryType: result.type,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Invalid SPARQL Syntax',
      description: error.message,
    }
  }
}
