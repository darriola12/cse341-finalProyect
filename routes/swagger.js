const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const express = require("express");
const route = express.Router(); 

route.use("/api-docs", swaggerUi.serve); 
route.get("/api-docs", swaggerUi.setup(swaggerDocument));



module.exports = route