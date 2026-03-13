import { Parser } from '@traqula/parser-sparql-1-1';
import { Request } from 'express';
import { HttpError } from './http-error';

export function validateHeaders(request: Request) {
  if (!request.headers['accept']?.includes('application/sparql-results+json')) {
    throw new HttpError(
      'Incorrect accept header',
      406,
      `The endpoint received a request with an incorrect ACCEPT header. Change it to 'application/sparql-results+json'.`,
      request.headers,
    );
  }
}

export function validateQuery(queryString: string) {
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
