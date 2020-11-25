var User= require("../models/user.js");
var Activity= require("../models/activity.js");
var Request= require("../models/request.js");
var Review= require("../models/review.js");
var isAuthenticated=require("../controllers/authenticated");
var request=require("request");
var Book=require("../models/book.js");

module.exports=function(app){
    app.get("/book/:id",isAuthenticated, function(req,res,next){
        var book;
        var url="https://www.googleapis.com/books/v1/volumes/"+req.params.id;
        request(url, function(err,response,body){
            if(err) return next(err);
            if(!err&&response.statusCode==200){
                var gbook=JSON.parse(body);
                Book.findOne({bookid: gbook.id}).populate({path:"reviews", populate:{path:"owner likes", model:"User"}}).populate("likes").exec(function(err,book){
                    if(err) return next(err);
                    if(book) {
                        // res.send("book added");
                        res.render("book", {book:book});
                    }
                    else{
                        var book=new Book();
                        book.bookid=gbook.id;
                        book.link=gbook.selfLink;
                        book.title=gbook.volumeInfo.title;
                        gbook.volumeInfo.authors.forEach(function(author){
                            book.authors.push(author);
                        })
                        book.publisher=gbook.volumeInfo.publisher;
                        book.publishedDate=gbook.volumeInfo.publishedDate;
                        book.desc=gbook.volumeInfo.description;
                        book.pageCount=gbook.volumeInfo.pageCount;
                        book.averageGoogleRating=gbook.volumeInfo.averageRating;
                        book.ratingGoogleCount=gbook.volumeInfo.ratingCount;
                        if(gbook.volumeInfo.imageLinks){
                            book.picture=gbook.volumeInfo.imageLinks.thumbnail;
                        }
                        else
                        {
                            book.picture="http://via.placeholder.com/200x200";
                        }
                        
                        
                        book.save(function(err, book){
                            if(err) return next(err);
                            // res.send("book added");
                            res.redirect("/book/"+book.bookid);
                        })
                    }
                })
            }
        })
    })

    
    app.post("/book/:id/addtoshelf",isAuthenticated,function(req,res,next){
        Book.findOne({bookid: req.params.id}, function(err,book){
            if(err) return next(err);
            User.findById(req.session.user._id, function(err, user){
                if(err) return next(err);
                user.bookshelf.push({book:book});
                var activity= new Activity();
                activity.owner=user;
                activity.desc=user.name+" has added the book "+ book.title+" to his shelf.";
                activity.privacy=user.privacyType;
                activity.save();
                user.activities.push(activity);
                user.save();
                res.json(true);
            })
        })
    })
    
    app.post("/book/:id/changestatus",isAuthenticated, function(req,res,next){
        User.findById(req.session.user._id).populate("bookshelf.book").exec(function(err, user) {
            if(err) return next(err);
            user.bookshelf.forEach(function(bk){
                if(bk.book.bookid.toString()==req.params.id.toString()){
                    bk.currentstatus=req.query.currentstatus;
                    if(req.query.currentstatus!= "Add status"){
                        var activity= new Activity();
                        activity.owner=user;
                        if(req.query.currentstatus=="Want to read"){
                            activity.desc=user.name+" wants to read the book "+ bk.book.title;
                        }
                        else if(req.query.currentstatus=="Currently Reading"){
                            activity.desc=user.name+" is currently reading the book "+ bk.book.title;
                        }
                        else if(req.query.currentstatus=="Finished Reading"){
                            activity.desc=user.name+" has finished reading the book "+ bk.book.title;
                        }
                        activity.privacy=user.privacyType;
                        activity.save();
                        user.activities.push(activity);
                    }
                    user.save();
                    res.json(true);
                }
            })
        })
    })
    
    app.post("/book/:id/like",isAuthenticated, function(req,res,next){
        User.findById(req.session.user._id).populate({path:'booklikes',
            populate:{path: 'likes', model: "User"}
        }).exec(function(err,user) {
            console.log("in like route");
            if(err) return next(err);
            Book.findOne({bookid:req.params.id}, function(err, book) {
                if(err) return next(err);
                user.booklikes.push(book);
                book.likes.push(user);
                var activity= new Activity();
                activity.owner=user;
                activity.desc=user.name+" has liked the book "+ book.title;
                activity.privacy=user.privacyType;
                activity.save();
                user.activities.push(activity);
                user.save();
                book.save(function(err){
                    if(err) return next(err);
                });
                res.json(book.likes);
                
            })
        })
    })
    
    app.post("/book/:id/unlike",isAuthenticated, function(req, res, next) {
        User.findById(req.session.user._id).populate({path:'booklikes',
            populate:{path: 'likes', model: "User"}
        }).exec(function(err,user){
            if(err) return next(err);
            user.booklikes=user.booklikes.filter(function(book){
                if(book.bookid==req.params.id){
                    book.likes=book.likes.filter(function(like){
                        return like._id.toString()!=user._id.toString();
                    })
                    book.save(function(err,book){
                    if(err) return next(err);
                    });
                    res.json(book.likes);
                }
                return book.bookid!=req.params.id;
            })

            user.save();
        })
    })
    
    app.post("/book/:id/favourite/add",isAuthenticated, function(req,res,next){
        Book.findOne({bookid: req.params.id}, function(err,book){
            if(err) return next(err);
            User.findById(req.session.user._id,function(err,user){
                if(err) return next(err);
                user.favourites.push(book);
                user.save();
                res.json(true);
            })
        })
    })
    app.post("/book/:id/favourite/remove", isAuthenticated, function(req,res,next){
        User.findById(req.session.user._id).populate("favourites").exec(function(err,user){
            if(err) return next(err);
            user.favourites=user.favourites.filter(function(fav){
                return fav.bookid!=req.params.id;
            })
            user.save();
            res.json(true);
        })
    })
    
    app.get("/searchbooks", isAuthenticated, function(req,res,next){
        var url="https://www.googleapis.com/books/v1/volumes?";
        var searchkey=req.query.searchkey;
        console.log(searchkey);
        searchkey=searchkey.replace(/\ /g, "%20");
        console.log(searchkey);
        console.log(req.query.parameter);
        if(req.query.parameter=="title"){
            url+="q="+searchkey;
        }
        else if(req.query.parameter=="author"){
            url+="q=''+inauthor:"+searchkey;
        }
        else if(req.query.parameter=="publisher"){
            url+="q=''+inpublisher:"+searchkey;
        }
        else if(req.query.parameter=="ISBN"){
            url+="q=''+isbn:"+searchkey;
        }
        else if(req.query.parameter=="subject"){
            url+="q=''+subject:"+searchkey;
        }
        url+="&startIndex="+(req.query.pg-1)*10;
        request(url,function(err,response,body){
            if(!err&&response.statusCode==200){
                res.json(JSON.parse(body));
            }
        })
    })
    
    app.get("/book/:id/refreshlikes",isAuthenticated, function(req,res,next){
        Book.findOne({bookid: req.params.id}).populate("likes").exec(function(err,book){
            if(err) return next(err);
            res.json(book.likes);
        })
    })
    
}