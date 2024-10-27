const route = require("express").Router();
const ties = require("./ties");
const user = require("./user"); 
const swagger = require("./swagger"); 


// Ruta raíz
route.get("/", (req, res) => {
    res.send("Backend running...");
});

// Rutas de corbatas
route.use("/tie", ties);
route.use("/user", user)
route.use("/swagger", swagger); 

module.exports = route;