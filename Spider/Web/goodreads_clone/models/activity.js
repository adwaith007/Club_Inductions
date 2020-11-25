var mongoose=require("mongoose");
var Schema = mongoose.Schema;

var activitySchema= new Schema({
    desc: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: {type: Date, default: Date.now()},
    privacy: String
})

module.exports= mongoose.model("Activity", activitySchema);