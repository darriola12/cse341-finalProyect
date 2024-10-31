const route = require("express").Router();
const userController = require("../controllers/user");
const validate = require("../util/validation")
const passport = require("passport");



route.post("/register", validate.userRules(), validate.categoryRules, userController.register); 
route.post("/login",validate.userRules(), validate.categoryRules, userController.login); 
route.get("/login", passport.authenticate("github"), (req, res) => {})

route.get("/logout", function(req, res, next){

    req.logOut(function(err){
        if(err){
            return next(err)
        }
        res.redirect("/")
    })
})


module.exports = route; 
