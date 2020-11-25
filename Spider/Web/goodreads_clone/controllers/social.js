var User= require("../models/user.js");
var Activity= require("../models/activity.js");
var Request= require("../models/request.js");
var isAuthenticated=require("../controllers/authenticated");
var request=require("request");

module.exports=function(app){
    
    app.get("/home",isAuthenticated, function(req,res,next){
        res.render("home",{errors: req.flash("errors")});
    })
    
    
    app.get("/profile/:id",isAuthenticated, function(req,res, next){
        User.findById(req.params.id).populate("activities").populate("bookshelf.book").populate("booklikes").populate("reviews")
    .populate("reviewlikes").populate("following").populate("followers").populate("favourites").populate("requesti")
    .populate("requesto").populate("reviewlikes").exec(function(err, foundUser){
            if(err) return next(err);
            res.render("profile", {errors:req.flash("errors"),profileUser: foundUser});
        })
    })
    
    //ajax follow request routes
    app.get("/profile/:id/follow",isAuthenticated, function(req,res,next){
        User.findById(req.session.user._id, function(err, user1){
            if(err) return next(err);
            User.findById(req.params.id, function(err,user2){
                if(err) return next(err);
                var request = new Request();
                request.user1=user1;
                request.user2=user2;
                request.save(function(err,request){
                    if(err) return next(err);
                    user1.requesto.push(request);
                    user2.requesti.push(request);
                    user1.save();
                    user2.save();
                    res.json(true);
                })
            })
        })
    })
    
    app.get("/profile/:id/cancelrequest",isAuthenticated, function(req,res,next){
        User.findById(req.session.user._id).populate({path:"requesto", populate:{path:"user1 user2", model:"User"}}).exec(function(err, user1){
            if(err) return next(err);
            User.findById(req.params.id).populate({path:"requesti", populate:{path:"user1 user2", model:"User"}}).exec(function(err,user2){
                if(err) return next(err);
                user1.requesto=user1.requesto.filter(function(request){
                    
                    if(request.user2._id.toString()==user2._id.toString()){
                        Request.findByIdAndRemove(request._id);
                    }
                    return request.user2._id.toString()!=user2._id.toString();
                })
                user1.save();
                user2.requesti=user2.requesti.filter(function(request){
                    return request.user1._id.toString()!=user1._id.toString();
                })
                user2.save();
                res.json(true);
                
            })
        })
    })
    
    app.get("/home/requests/:id/confirm",isAuthenticated, function(req,res,next){
        Request.findById(req.params.id).populate({path:'user1',populate:{path:"requesto requesti", model:"Request"}}).populate({path:'user2',populate:{path:"requesto requesti", model:"Request"}}).exec(function(err, request){
            if(err) return next(err);
            
            if(request.user2._id==req.session.user._id){
                console.log(request);
                request.user1.following.push(request.user2);
                request.user1.requesto=request.user1.requesto.filter(function(foundrequest){
                    return foundrequest.user2.toString()!=request.user2._id.toString();
                })
                var activity=new Activity();
                activity.owner=request.user1;
                activity.desc=request.user1.name+" is now following "+request.user2.username;
                activity.privacy=request.user1.privacyType;
                activity.save(function(err,activity){
                    if(err) return next(err);
                    request.user1.activities.push(activity);
                    request.user2.requesti=request.user2.requesti.filter(function(foundrequest){
                        return foundrequest.user1.toString()!=request.user1._id.toString();
                    })
                    request.user2.followers.push(request.user1);
                    request.user1.save(function(){
                    request.user2.save(function(){
                        Request.findByIdAndRemove(request._id);
                    });
                });
                })
                
                res.json(true);
                
                
            }
        })
    })
    
    app.get("/home/requests/:id/reject", isAuthenticated, function(req,res,next){
        Request.findById(req.params.id).populate({path:'user1',populate:{path:"requesto requesti", model:"Request"}}).populate({path:'user2',populate:{path:"requesto requesti", model:"Request"}}).exec(function(err, request){
            if(err) return next(err);
            if(request.user2._id==req.session.user._id){
                request.user1.requesto=request.user1.requesto.filter(function(foundrequest){
                    return foundrequest.user2.toString()!=request.user2._id.toString();
                })
                request.user2.requesti=request.user2.requesti.filter(function(foundrequest){
                    return foundrequest.user1.toString()!=request.user1._id.toString();
                })
                request.user1.save();
                request.user2.save();
                Request.findByIdAndRemove(request._id);
                
                res.json(true);
                
            }
        })
    })
    
    app.get("/profile/:id/unfollow",isAuthenticated,function(req,res,next){
        User.findById(req.params.id, function(err,user2){
            if(err) return next(err);
            user2.followers=user2.followers.filter(function(follower){
                return follower.toString()!=req.session.user._id.toString();
            })
            user2.save();
            User.findById(req.session.user._id, function(err,user1){
                if(err) return next(err);
                user1.following=user1.following.filter(function(follower){
                    return follower.toString()!=user2._id.toString();
                })
                var activity = new Activity();
                activity.owner=user1;
                activity.desc=user1.name+" has stopped following "+user2.username;
                activity.privacy=user1.privacyType;
                activity.save(function(err,activity){
                    if(err) return next(err);
                    user1.activities.push(activity);
                    user1.save();
                    res.json(true);
                })
            })
            
        })
    })
    
    //ajax serach user routes
    app.get("/user/search", isAuthenticated, function(req,res,next){
        User.find({name: new RegExp('^'+req.query.user, "i")}, function(err, foundUsers){
            if(err) return next(err);
            res.json(foundUsers);
        })
    })
    
    
    //ajax news feed routes
    app.get("/ajax/newsfeed", isAuthenticated, function(req,res,next){
        var activities=[];
        User.findById(req.session.user._id).populate({path:"following",
            populate:{path: "activities",
                model: "Activity"
            }
        }).exec(function(err,user){
            if(err) return next(err);
            user.following.forEach(function(friend){
                for(let i=0;i<friend.activities.length;i++){
                    if(friend.activities[i].privacy=="Public"){
                        activities.push(friend.activities[i]);
                    }
                }
            })
            
                activities.sort(function(a,b){
                    if(a.date>b.date) return 1;
                    else if(a.date<b.date) return -1;
                    else return 0;
                });
                res.json(activities);
        })
    })
    
    app.get("/ajax/activeusers", isAuthenticated, function(req,res,next){
        User.findById(req.session.user._id).populate("following").exec(function(err,user){
            if(err) return next(err);
            res.json(user.following);
        })
    })
    
    app.get("/ajax/requests", isAuthenticated, function(req,res,next){
        User.findById(req.session.user._id).populate({path:"requesti", populate:{path:"user1 user2", model:"User"}}).exec(function(err,user){
            if(err) return next(err);
            res.json(user.requesti);
        })
    })
    
    app.get("/changeprivacy/:type",isAuthenticated, function(req,res,next){
        User.findById(req.session.user._id, function(err, user) {
            if(err) return next(err);
            user.privacyType=req.params.type.toString();
            user.save();
            res.json(true);
        })
    })
    
    app.get("/activity/:id/changeprivacy",isAuthenticated, function(req,res,next){
        Activity.findById(req.params.id).populate("owner").exec(function(err,activity){
            if(err) return next(err)
            if(req.session.user._id==activity.owner._id){
                activity.privacy=req.query.p;
            }
            activity.save();
            res.json(true);
        })
    })
    
    // app.get("/fbshare/:id", function(req,res,next){
    //     Activity.findById(req.params.id).populate("owner").exec(function(err,activity){
    //         if(err) return next(err);
    //         var htmlvar="";
    //         htmlvar+="<meta property='og:title' content='Bookgrm'/>";
    //         htmlvar+="<meta property='og:url' content='"+req.hostname+"'/>";
    //         htmlvar+="<meta property='og:description' content='"+activity.desc+"'/>";
    //         htmlvar+="<meta property='og:site_name' content='Bookgrm'/>";
    //         htmlvar+="<meta property='og:image' content='"+activity.owner.picture+"'/>";
    //         res.send(htmlvar);
    //     })
    // })
    
    app.get("/fetchbooks",isAuthenticated, function(req,res,next){
        var url="https://www.googleapis.com/books/v1/volumes?";
        url+="q="+Math.random().toString(36).substring(2,3);
        request(url,function(err,response,body){
            if(!err&&response.statusCode==200){
                res.json(JSON.parse(body).items);
            }
        })
    })
}