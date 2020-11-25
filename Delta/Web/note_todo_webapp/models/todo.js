var mongoose=require("mongoose");


var todoSchema = new mongoose.Schema({
    title: String,
    items: [{content: String, state: Boolean}],
    created: {type: Date, default: Date.now},
    lastEdit: {type: Date, default: Date.now},
    importance: Number,
    label: String,
    collaborators: [String]
   
});




module.exports= mongoose.model("Todo", todoSchema);