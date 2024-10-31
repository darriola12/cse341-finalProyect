const route = require("express").Router();
const tieController = require("../controllers/ties");
const validate = require("../util/validation")



route.get("/", tieController.getAllTies);

route.get("/:id", tieController.getTieById);
route.post("/", validate.tieRules(), validate.checkValidation, tieController.createTie);
route.put("/:id",validate.tieRules(), validate.checkValidation,  tieController.updateTie);
route.delete("/:id", tieController.deleteTie);

module.exports = route;




