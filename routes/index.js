const route = require("express").Router();
const ties = require("./ties");
const user = require("./user"); 
const swagger = require("./swagger"); 
const order = require("./order")
const category = require("./category")
const authenticate = require("../util/validation")


// Ruta raíz
route.get("/", (req, res) => {
    res.send("Backend running...");
});

// Rutas de corbatas
route.use("/tie", ties);
route.use("/user", user)
route.use("/order", order)
route.use("/category", category)
route.use("/swagger", swagger); 


module.exports = route;