const route = require("express").Router();
const orderController = require("../controllers/order");
const validate = require("../util/validation")

const auth = require("../util/authenticate")



route.get("/", auth.isAunthenticated, orderController.getAllOrders);
route.get("/:id", auth.isAunthenticated, orderController.getOrderById);
route.post("/", auth.isAunthenticated, validate.orderRules(), validate.checkValidation, orderController.createOrder);
route.put("/:id", auth.isAunthenticated, validate.orderRules(), validate.checkValidation,  orderController.updateOrder);
route.delete("/:id",auth.isAunthenticated,  orderController.deleteOrder);

module.exports = route;
