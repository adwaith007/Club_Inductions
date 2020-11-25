var User= require("../models/user.js");
var session= require("express-session");
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
            user.password=req.body.password;
            user.question=req.body.question;
            user.answer=req.body.answer;
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
                        User.findById(req.session.user._id).populate("todos").populate("notes").exec( function(err,user){
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(req.query.label){
                                user.notes=user.notes.filter(note=>note.label==req.query.label);
                                user.todos=user.todos.filter(todo=>todo.label==req.query.label);
                            }
                            if(req.query.sortkey=="date"){
                                console.log("date");
                                let dsort = function(a,b){
                                    if(a.created>b.created) return -1;
                                    else if(b.created>a.created) return 1;
                                    else return 0;
                                }
                                user.todos.sort(dsort);
                                user.notes.sort(dsort);
                                res.render("show", {user: user, errors: req.flash("errors"), label: req.query.label});
                            }
                            else if(req.query.sortkey=="importance"){
                                console.log("imp");
                                let isort = function(a,b){
                                    if(a.importance>b.importance) return -1;
                                    else if(b.importance>a.importance) return 1;
                                    else return 0;
                                }
                                user.todos.sort(isort);
                                user.notes.sort(isort);
                                res.render("show", {user: user, errors: req.flash("errors"), label: req.query.label});
                            }
                            else if(req.query.sortkey=="modified"){
                                console.log("mod");
                                let msort = function(a,b){
                                    if(a.lastEdit>b.lastEdit) return -1;
                                    else if(b.lastEdit>a.lastEdit) return 1;
                                    else return 0;
                                }
                                user.todos.sort(msort);
                                user.notes.sort(msort);
                                res.render("show", {user: user, errors: req.flash("errors"), label: req.query.label});
                            }
                            else{
                               res.render("show", {user: user, errors: req.flash("errors"), label: req.query.label}); 
                            }
                            
                        }            
                     });
        })
        
        //add new content route//
        app.get("/profile/new",isAuthenticated, function(req,res){
                res.render("new", {userid: req.session.userid});
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
                res.render("changepwd", {user:req.session.user});
        })
        app.post("/changepwd",isAuthenticated, function(req,res){
            User.findById(req.session.user._id, function(err, user){
                if(err){
                    console.log(err);
                }
                user.password=req.body.password;
                user.save();
            })
            res.redirect("/profile/");
        })
}