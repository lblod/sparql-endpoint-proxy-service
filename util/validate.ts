import { Parser } from '@traqula/parser-sparql-1-1';

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
