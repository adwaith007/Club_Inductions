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
var User = require("./models/user"),
    Todo = require("./models/todo"),
    Note = require("./models/note");

//middlewares//
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/public",express.static("public"));
app.use(methodOverride("_method"));
app.use(session({secret: secret.secretKey, resave: true, saveUninitialized: true,save: new MongoStore({url: secret.database, autoReconnect: true})}));
app.use(flash());



//routes go here//
app.get("/", function(req,res){
    res.redirect("/login");
})



var userController= require("./controllers/users");
userController(app);

var noteController= require("./controllers/notes");
noteController(app);

var todoController= require("./controllers/todos");
todoController(app);


//server setup
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");
})