// call the middleware express
const express = require("express"); 
const app = express()
const mongoDb = require("./database/connection")
const routes = require("./routes")
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cors = require("cors"); 


app.use(bodyParser.json())
    .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    next();
   })
   .use(cors({ 
      origin: "*", 
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"] 
   }))  // Un solo uso de cors es suficiente
   .use("/", routes);





mongoDb.initDB((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    }
});