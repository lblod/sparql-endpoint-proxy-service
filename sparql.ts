import Router from 'express-promise-router';

import { query, update } from 'mu';
import { Request, Response } from 'express';
import { Parser } from '@traqula/parser-sparql-1-1';

import { HttpError } from './http-error';

export const sparqlRouter = Router();

sparqlRouter.post('/', async (req: Request, res: Response) => {
  const queryString = req.body.query ?? req.body.update;

  if (!queryString) {
    console.log('No query string found in the request body.', req.body);
    throw new HttpError(
      'No query value was found.',
      400,
      `The endpoint received a body without the property 'query' or 'body'.`,
      req.body,
    );
  }

  const queryValidationResult = validateQuery(queryString);
  if (!queryValidationResult.isValid) {
    console.log(
      'Query did not pass the validation',
      queryValidationResult.message,
    );
    throw new HttpError(
      queryValidationResult.message,
      422,
      queryValidationResult.description,
    );
  }
  let queryMethod = query;
  if (req.body.update) {
    queryMethod = update;
  }

  try {
    const result = await queryMethod(queryString);
    res.status(200).send(result);
  } catch (error) {
    throw new HttpError(
      'Something went wrong while executing the query.',
      500,
      `For more details check the logs.`,
      error,
    );
  }
});

function validateQuery(queryString: string) {
  const parser = new Parser();

  try {
    const result = parser.parse(queryString);
    return {
      isValid: true,
      queryType: result.type,
    };
  } catch (error: any) {
    return {
      isValid: false,
      message: 'Invalid SPARQL Syntax',
      description: error.message,
    };
  }
}
