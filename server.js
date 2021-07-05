const express = require("express");
const server = express();
const morgan = require("morgan");
const router = require("./src/routes/index");
require("./src/config/bd");
const expressOasGenerator = require('express-oas-generator');
expressOasGenerator.init(server, {});
// require("./src/config/swagger");
server.use(morgan("dev"));


server.use("/api/v1/", router);


const hostname = '127.0.0.1';
const port = 3000;
server.listen(port, () => {
  console.log(`Serving running at http://${hostname}:${port}/`);
});