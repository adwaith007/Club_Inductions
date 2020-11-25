var mongoose=require("mongoose");
var bcrypt= require("bcrypt");
var Schema = mongoose.Schema;
var crypto=require("crypto");

var userSchema = new Schema({
    username: String,
    email: String,
    name: String,
    password: String,
    appointments: [
      {
         title: String,
         desc: String,
         start: Date,
         end: Date,
         ismeeting: {type: Boolean, default: false}
      }
     ],
     question: String,
     answer: String,
     
     meetingo:[{type:mongoose.Schema.Types.ObjectId, ref: "Meeting"}],
     meetingi:[{type:mongoose.Schema.Types.ObjectId, ref: "Meeting"}],
     picture: String
    
});

//hashing password

userSchema.pre("save", function(next){
    var user=this;
    if(!user.isModified('password')&&!user.isModified('answer')) return next();
        bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(user.password, salt, function(err,hash){
            if(err) return next(err);
            console.log(user.password);
            console.log(hash);
            user.password=hash;
            bcrypt.hash(user.answer, salt, function(err,hash){
                if(err) return next(err);
                user.answer=hash;
                next();
            })
            
            })
        })
    
})

userSchema.methods.comparePassword= function(password){
    return bcrypt.compareSync(password, this.password);
}
userSchema.methods.compareSecurityAnswer= function(answer){
    return bcrypt.compareSync(answer, this.answer);
}
userSchema.methods.gravatar=function(){
    if(!this.email) return 'https://gravatar.com/avatat/?s=200&d=retro';
    var md5= crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/'+md5+'?s=200&d=retro';
}

module.exports= mongoose.model("User", userSchema);