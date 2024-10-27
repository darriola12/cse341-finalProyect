const route = require("express").Router();
const tieController = require("../controllers/ties");


route.get("/", tieController.getAllTies);

route.get("/:id", tieController.getTieById);
route.post("/", tieController.createTie);
route.put("/:id", tieController.updateTie);
route.delete("/:id", tieController.deleteTie);

module.exports = route;




