var User= require("../models/user.js");
var session= require("express-session");
var Meeting= require("../models/meeting.js");
var isAuthenticated=require("../controllers/authenticated");
var addappt=require("./addappt.js");

module.exports=function(app){
        app.get("/profile/meetings",isAuthenticated, function(req,res){
                    User.findById(req.session.user._id).populate("meetingo").populate("meetingi").exec(function(err,user){
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.render("meetings",{user:user,errors: req.flash("errors")});
                        }
                    })
        })
    
        app.post("/profile/meetings/new",isAuthenticated, function(req,res){
                    User.findById(req.session.user._id, function(err,user1){
                        if(err){
                            console.log(err);
                        }
                        else{
                            User.findOne({username:req.body.username}, function(err,user2){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    if(user2){
                                        var meeting = new Meeting();
                                        meeting.start=req.body.start;
                                        meeting.end=req.body.end;
                                        meeting.user1=user1;
                                        meeting.user2=user2;
                                        meeting.save();
                                        user1.meetingo.push(meeting);
                                        user2.meetingi.push(meeting);
                                        user1.save();
                                        user2.save();
                                    }
                                    else{
                                        req.flash("errors", "User not found!!");
                                    }
                                    res.redirect("/profile/meetings");
                                }
                            })
                        }
                    })

        })
        
        app.put("/meeting/:id/confirm", function(req,res){
            Meeting.findById(req.params.id, function(err, meeting){
                if(err){
                    console.log(err);
                }
                if(meeting&&(meeting.user2._id==req.session.user._id)){
                    User.findById(meeting.user1, function(err, user1){
                        if(err){
                            console.log(err);
                        }
                        else{
                                user1.meetingo=user1.meetingo.filter(function(meetid){
                                    return meetid.valueOf()!=meeting._id;
                                })
                        }
                        User.findById(meeting.user2, function(err, user2){
                            if(err){
                                console.log(err);
                            }
                            else{
                        
                                user2.meetingi=user2.meetingi.filter(function(meetid){
                                    return meetid.valueOf()!=meeting._id;
                                })
                                
                            }
                            user1.appointments.push({title:"Meeting", desc: "Meeting with " + user2.name, start: meeting.start, end: meeting.end, ismeeting: true});
                            user2.appointments.push({title:"Meeting", desc: "Meeting with " + user1.name, start: meeting.start, end: meeting.end, ismeeting: true});
                            user1.save();
                            user2.save();
                            Meeting.findByIdAndRemove(meeting._id);
                            res.redirect("/profile/meetings");
                        })
                    })

                }
                else{
                    res.redirect("/profile/meetings");
                }
            })
        })
        
    app.put("/meeting/:id/reject", function(req,res){
        Meeting.findById(req.params.id, function(err,meeting){
            if(err){
                console.log(err)
            }
            else if(meeting&&meeting.user2._id==req.session.user._id){
                User.findById(meeting.user1, function(err, user1){
                        if(err){
                            console.log(err);
                        }
                        else{
                                user1.meetingo=user1.meetingo.filter(function(meetid){
                                    return meetid.valueOf()!=meeting._id;
                                })
                        }
                        User.findById(meeting.user2, function(err, user2){
                            if(err){
                                console.log(err);
                            }
                            else{
                        
                                user2.meetingi=user2.meetingi.filter(function(meetid){
                                    return meetid.valueOf()!=meeting._id;
                                })
                                
                            }
                            user1.save();
                            user2.save();
                            Meeting.findByIdAndRemove(meeting._id);
                            res.redirect("/profile/meetings");
                        })
                })
            }
        })
    })
        
    
}