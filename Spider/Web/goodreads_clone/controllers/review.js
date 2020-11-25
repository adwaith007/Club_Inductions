var User= require("../models/user.js");
var Activity= require("../models/activity.js");
var Request= require("../models/request.js");
var Review= require("../models/review.js");
var isAuthenticated=require("../controllers/authenticated");
var request=require("request");
var Book=require("../models/book.js");


module.exports=function(app){
    app.post("/review/:id/like", isAuthenticated, function(req,res,next){
        Review.findById(req.params.id).populate("likes").exec(function(err,review){
            if(err) return next(err);
            User.findById(req.session.user._id, function(err,user){
                if(err) return next(err);
                review.likes.push(user);
                user.reviewlikes.push(review);
                user.save();
                review.save(function(err){
                    if(err) return next(err);
                });
                res.json(review.likes);
            })
        })
    })
    
    app.post("/review/:id/unlike", isAuthenticated, function(req,res,next){
            Review.findById(req.params.id).populate("likes").exec(function(err,review){
            if(err) return next(err);
            User.findById(req.session.user._id, function(err,user){
                if(err) return next(err);
                review.likes=review.likes.filter(function(like){
                    return like._id.toString()!=user._id.toString();
                });
                user.reviewlikes=user.reviewlikes.filter(function(like){
                    return like.toString()!=review._id.toString();
                });
                user.save();
                review.save(function(err){
                    if(err) return next(err);
                });
                res.json(review.likes);
            })
        })
    })
    
        app.post("/book/:id/review",isAuthenticated, function(req,res,next){
        User.findById(req.session.user._id).populate({path:'reviews',
            populate:{
                path: 'ofBook',
                model: 'Book'
            }
        }).exec(function(err,user){
            if(err) return next(err);
            var review;
            var refbook;
            user.reviews.forEach(function(rev){
                if(rev.ofBook.bookid==req.params.id){
                    refbook=rev.ofBook;
                    review=rev;
                }
            })
            if(!review){
                var activity= new Activity();
                review = new Review();
                Book.findOne({bookid:req.params.id}, function(err,book){
                    if(err) return next(err);
                    review.ofBook=book;
                    review.owner=user;
                    review.desc=req.body.desc;
                    review.rating=req.body.rating;
                    review.save();
                    user.reviews.push(review);
                    book.reviews.push(review);
                    book.save();
                    activity.owner=user;
                    activity.desc=user.name+" has reviewed the book "+ book.title;
                    activity.privacy=user.privacyType;
                    activity.save();
                    user.activities.push(activity);
                    user.save();
                    res.redirect("/book/"+req.params.id);
                })
            }
            else{
                review.desc=req.body.desc;
                review.rating=req.body.rating;
                review.save(function(err,review){
                    if(err) return next(err);
                    review.ofBook.save();
                }); 
                var activity= new Activity();
                activity.owner=user;
                activity.desc=user.name+" has edited his review on the book "+ refbook.title;
                activity.privacy=user.privacyType;
                activity.save();
                user.activities.push(activity);
                user.save();
                res.redirect("/book/"+req.params.id);
            }
        })
    })
    
    app.delete("/book/:id/review", isAuthenticated, function(req,res,next){
        User.findById(req.session.user._id).populate({path:'reviews',
            populate: {
                path: 'ofBook',
                model: 'Book'
            }
        })
        .exec(function(err, user) {
            if(err) return next(err);
            user.reviews=user.reviews.filter(function(review){
                if(review.ofBook.bookid.toString()==req.params.id.toString()){
                    review.ofBook.reviews=review.ofBook.reviews.filter(function(rev){
                        return rev._id.toString()!=review._id.toString();
                    })
                    console.log("here");
                    review.ofBook.save();
                    Review.findByIdAndRemove(review._id);
                }
                return review.ofBook.bookid.toString()!=req.params.id.toString();
            })
            user.save();
            res.redirect("/book/"+req.params.id);
            
        })
    })
}