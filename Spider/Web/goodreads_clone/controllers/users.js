var User=require("../models/user.js");
var isAuthenticated=require("../controllers/authenticated");


module.exports= function(app){
    
    app.get("/home",isAuthenticated,function(req,res,next){
        res.render("home", {errors:req.flash("errors")});
    })
}