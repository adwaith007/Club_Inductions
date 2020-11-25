var User= require("../models/user.js");
var Book= require("../models/book.js");
var Request= require("../models/request.js");
var Review= require("../models/review.js");
var Actvity= require("../models/activity.js");
var session= require("express-session");
var isAuthenticated=require("../controllers/authenticated");
var mongoose=require("mongoose");

module.exports=function(app){
    
    
        //login route//
        app.get("/login", function(req,res){
            if(req.session.user){
                res.redirect("/home");
            }
            else{
               res.render("login", {errors: req.flash("errors")}); 
            }
        })
    
    
        app.post("/login", function(req,res){
            User.findOne({email: req.body.email}, function(err, user){
                
                if(err) throw err;
                if(user){
                    if(user.comparePassword(req.body.password)){
                        req.session.user=user;
                        req.session.save();
                        user.state=true;
                        user.save();
                        res.redirect("/home");
                    }
                    else{
                        req.flash("errors", "Password Mismatch");
                        res.redirect("/login");
                    }
                }
                else{
                    req.flash("errors", "User does not exists");
                    res.redirect("/login");
                }
                
            })
            
        })
        
        //signup route//
        
        app.get("/signup", function(req,res){
            res.render("signup",{errors: req.flash("errors")});
        })
        
        app.post("/signup", function(req,res,next){
            console.log("rute begin");
            var user = new User();
            user.name=req.body.name;
            user.email=req.body.email;
            user.username=req.body.username;
            user.password=req.body.password;
            user.question=req.body.question;
            user.answer=req.body.answer;
            user.picture=user.gravatar();
            User.findOne({email: req.body.email}, function(err, existingUser){
                console.log("findone");
                if(err) return next(err);
                if(existingUser){
                    console.log("existing user");
                    req.flash("errors", "An account with this email already exists!!");
                    res.redirect("/signup");
                }
                else{
                    console.log("save");
                    user.save(function(err,user){
                        if(err){
                            console.log("err");
                          return next(err);  
                        } 
                        else{
                            console.log("redirect");
                            return res.redirect("/home");
                        }
                        
                        
                    });
                    
                }
            })
        })
        
        //logout route//
        app.get("/logout", function(req,res,next){
            
            User.findById(req.session.user._id, function(err, user) {
                if(err) return next(err);
                user.state=false;
                user.save();
            })
            req.session.user=undefined;
            req.session.flash=undefined;
            res.redirect("/login");
        })
        
        //edit privacy settings
        app.post("/privacy", isAuthenticated, function(req,res,next){
            User.findById(req.session.user._id, function(err,user){
                if(err) return next(err);
                user.privacyType=req.body.privacy;
                user.save();
            })
        })
  

        //forgot password and edit//
        app.get("/forgot", function(req,res){
            res.render("forgot",{errors: req.flash("errors")});
        })
        app.post("/forgot", function(req,res){
            User.findOne({email:req.body.email}, function(err,user){
                if(err){
                    console.log(err);
                }
                if(user){
                    res.redirect("/"+user._id+"/question");
                }
                else{
                    req.flash("errors", "User does not exists");
                    res.redirect("/forgot") ;
                }
            })
        })
        app.get("/:id/question", function(req,res){
            User.findById(req.params.id, function(err, user){
                if(err){
                    console.log(err);
                }
                res.render("security", {user: user, errors: req.flash("errors")});
            })
        })
        app.post("/:id/question", function(req,res){
            User.findById(req.params.id, function(err,user){
                if(err) throw err;
                if(user.compareSecurityAnswer(req.body.answer)){
                    req.session.user=user;
                    req.session.save();
                    res.redirect("/changepwd");
                }
                else{
                    req.flash("errors", "Wrong Answer");
                    res.redirect("/"+req.params.id+"/question");
                }
            })
        })
        app.get("/changepwd",isAuthenticated,function(req,res){
            if(req.session.user){
                res.render("changepwd", {user:req.session.user});
            }
            else{
                res.redirect("/login");
            }
            
        })
        app.post("/changepwd", function(req,res){
            User.findById(req.session.user._id, function(err, user){
                if(err){
                    console.log(err);
                }
                user.password=req.body.password;
                user.save();
            })
            res.redirect("/home");
        })
        
        
        //ajax routes
        app.get("/usercheck", function(req,res){
            User.findOne({username: req.query.username}, function(err,user){
                if(err){
                    console.log(err);
                }
                if(user){
                    res.send("0");
                }
                else{
                    res.send("1");
                }
            })
        })
        
}