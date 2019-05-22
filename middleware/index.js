const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const Sentry = require('@sentry/node');

module.exports = server => {
  Sentry.init({ dsn: 'https://444c4e81e56d452082815b0dc0467ded@sentry.io/1461440' });

  // The request handler must be the first middleware on the app
  server.use(Sentry.Handlers.requestHandler());

  server.use(helmet());
  server.use(compression());
  server.use(cors());
  server.use(express.json());

  // The error handler must be before any other error middleware
  server.use(Sentry.Handlers.errorHandler());
};
