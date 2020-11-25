var mongoose=require("mongoose");
var Schema = mongoose.Schema;

var reviewSchema= new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    ofBook: {type: Schema.Types.ObjectId, ref:"Book"},
    desc: String,
    rating: Number,
    likes: [{type: Schema.Types.ObjectId, ref:"User"}]
})

module.exports=mongoose.model("Review", reviewSchema);