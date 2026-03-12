import { app } from 'mu';

import express, { Request, ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';

import { sparqlRouter } from './routes/sparql';
import { HttpError } from './util/http-error';

app.use(
  bodyParser.json({
    limit: '500mb',
    type: function (req: Request) {
      return /^application\/json/.test(req.get('content-type') as string);
    },
  }),
);

app.use(express.urlencoded({ extended: true }));

app.get('/', async (_req, res) => {
  res.send({ status: 'ok' });
});

app.use('/', sparqlRouter);

const errorHandler: ErrorRequestHandler = function (err, _req, res, _next) {
  const errorResponse = HttpError.caughtErrorJsonResponse(err);
  res.status(errorResponse.status);
  res.json({
    errors: [errorResponse],
  });
};

app.use(errorHandler);
