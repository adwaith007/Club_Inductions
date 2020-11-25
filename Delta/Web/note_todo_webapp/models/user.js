var mongoose=require("mongoose");
var bcrypt= require("bcrypt");
var Schema = mongoose.Schema;


var userSchema = new Schema({
    email: String,
    name: String,
    password: String,
    todos: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Todo"
      }
     ],
    notes: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Note"
      }
     ],
     question: String,
     answer: String,
    
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


module.exports= mongoose.model("User", userSchema);