var mongoose=require("mongoose");
var Schema = mongoose.Schema;
var User= require("./user.js");

var meetingSchema= new Schema({
    user1: User.schema,
    user2: User.schema,
    start: Date,
    end: Date
})

module.exports= mongoose.model("Meeting", meetingSchema);