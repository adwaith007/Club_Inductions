var express= require("express"),
    app= express();
app.set("view engine","ejs");
var bodyParser=require("body-parser");
var mongoose= require("mongoose");
var session= require("express-session");
var bcrypt=require("bcrypt");
var secret=require("./config/secret");
var flash=require("express-flash");
var MongoStore=require("connect-mongo")(session);
var morgan=require("morgan");
var methodOverride=require("method-override");



//connect to database//
mongoose.connect(secret.database, function(err){
  if(err){
    console.log(err);
  }
  else{
    console.log("connected to database");
  }
});
var multer=require("multer");
var path=require("path");
app.use(morgan('dev'));

//link user models//
var User = require("./models/user");

//middlewares//
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/public",express.static("public"));
app.use(methodOverride("_method"));
app.use(session({secret: secret.secretKey, resave: true, saveUninitialized: true,save: new MongoStore({url: secret.database, autoReconnect: true})}));
app.use(flash());
app.use(function(req,res,next){

    if(req.session.user){
        User.findById(req.session.user._id).populate({path: "activities", populate:{path:"owner" , model:"User"}})
    .populate("bookshelf.book").populate("booklikes").populate("reviews")
    .populate("reviewlikes").populate("following").populate("followers").populate("favourites")
    .populate({path:"requesti", populate:{path:"user1 user2", model:"User"}})
    .populate({path:"requesto", populate:{path:"user1 user2", model:"User"}})
    .populate("reviewlikes").exec( function(err,user){
            if(err) return next(err);
            res.locals.user=user;
            next()
        })
    }
    else{
        next();
    }

});


//routes go here//
app.get("/", function(req,res){
    res.redirect("/login");
})



var userController= require("./controllers/users");
userController(app);

var activityController= require("./controllers/activity");
activityController(app);

var bookController= require("./controllers/books");
bookController(app);

var mainController= require("./controllers/main");
mainController(app);

var reviewController= require("./controllers/review");
reviewController(app);

var socialController= require("./controllers/social");
socialController(app);





//server setup
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");})