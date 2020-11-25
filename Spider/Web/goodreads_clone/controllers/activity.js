var User= require("../models/user.js");
var Activity= require("../models/activity.js");
var Request= require("../models/request.js");
var Review= require("../models/review.js");
var isAuthenticated=require("../controllers/authenticated");
var request=require("request");
var Book=require("../models/book.js");


module.exports=function(app){
    app.post("/actvity/:id",isAuthenticated, function(req,res,next){
        Activity.findById(req.params.id, function(err,activity){
            if(err) return next(err);
            activity.privacy=req.body.privacy;
            activity.save();
            res.json(true);
        })
    })
}