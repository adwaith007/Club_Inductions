var mongoose=require("mongoose");


var noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    picture: String,
    created: {type: Date, default: Date.now},
    lastEdit: {type: Date, default: Date.now},
    importance: Number,
    label:String,
    collaborators: [String]
    
});




module.exports= mongoose.model("Note", noteSchema);