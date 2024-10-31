const isAunthenticated = (req, res, next) =>{

    console.log(req.session.user)
    if (req.session.user  == undefined){

        return res.status(401).json("You are not authorized")
    }
    next(); 
}

module.exports = {isAunthenticated}