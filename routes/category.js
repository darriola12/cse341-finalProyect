const route = require("express").Router();
const categoryController = require("../controllers/category");
const validate = require("../util/validation")

route.get("/", categoryController.getAllCategories);
route.get("/:id", categoryController.getCategoryById);
route.post("/", validate.categoryRules(), validate.checkValidation, categoryController.createCategory);
route.put("/:id",validate.categoryRules(), validate.checkValidation, categoryController.updateCategory);
route.delete("/:id", categoryController.deleteCategory);

module.exports = route;
