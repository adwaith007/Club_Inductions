var User= require("../models/user.js");
var session= require("express-session");
var Meeting= require("../models/meeting.js");
var addappt=require("./addappt.js");
var isAuthenticated=require("../controllers/authenticated");

module.exports=function(app){
    
    
        //login route//
        app.get("/login", function(req,res){
            if(req.session.user){
                res.redirect("/profile");
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
                        res.redirect("/profile");
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
                            return res.redirect("/profile");
                        }
                        
                        
                    });
                    
                }
            })
        })
        
        //logout route//
        app.get("/logout", function(req,res){
            req.session.user=undefined;
            req.session.flash=undefined;
            res.redirect("/login");
        })
        
        
        //show all content route/ profile route//
        app.get("/profile",isAuthenticated, function(req,res){

            res.render("show", {errors: req.flash("errors")});
        });
        
        //add new content route//
        app.get("/profile/new",isAuthenticated, function(req,res){
            res.render("new");
        });
        
        app.post("/profile/new/appointment",isAuthenticated, function(req,res){
                    User.findById(req.session.user._id, function(err,user){
                        if(err){
                            console.log(err);
                        }
                        else{
                            addappt(user,{title:req.body.title, desc: req.body.desc, start: req.body.start, end: req.body.end}, req);
                            user.save();
                        }
                        res.redirect("/profile");
                    })
        });
        app.get("/profile/date/:date", isAuthenticated, function(req,res){
            let d= req.params.date;
            d=d.replace(/-/g, " ");
            res.render("date",{date: d,errors: req.flash("errors")});
        })
        
        //edit routes
        app.put("/profile/appointment/:id", isAuthenticated, function(req,res,next){
            var date;
            User.findById(req.session.user._id, function(err,user){
                if(err) return next(err);
                date=user.appointments[req.params.id].start.toDateString();
                if(!user.appointments[req.params.id].ismeeting){
                    user.appointments.splice(req.params.id,1);
                    user.save(function(err,user){
                        if(err) return next(err);
                        addappt(user,{title:req.body.title, desc: req.body.desc, start: req.body.start, end: req.body.end}, req);
                        user.save();
                    });
                }
                else{
                    req.flash("errors", "Meeting can't be Modified");
                }
                    res.redirect("/profile/date/"+date.replace(/\ /g, "-"));
                
            })
        })
        
        app.delete("/profile/appointment/:id", isAuthenticated, function(req,res,next){
            var date;
            User.findById(req.session.user._id, function(err,user){
                if(err) return next(err);
                date=user.appointments[req.params.id].start.toDateString();
                if(!user.appointments[req.params.id].ismeeting){
                    user.appointments.splice(req.params.id,1);
                    user.save();
                }
                else{
                    req.flash("errors", "Meeting can't be Modified");
                }
                
                res.redirect("/profile/date/"+date.replace(/\ /g, "-"));
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
            res.redirect("/profile");
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
        
        app.get("/meetingrefresh",isAuthenticated, function(req,res,next){
            User.findById(req.session.user._id).populate("meetingi").populate("meetingo").exec(function(err,user){
                if(err) return next(err);
                res.send(JSON.stringify(user));
            });
        })
}