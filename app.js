'use strict';

const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const morgan = require('morgan');
module.exports = app; // for testing

const config = {
  appRoot: __dirname // required config
};

app.use(morgan('dev'));

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  app.use(swaggerExpress.runner.swaggerTools.swaggerUi());

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server is listening on port ${port}...`));
});