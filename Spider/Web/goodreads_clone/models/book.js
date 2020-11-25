var mongoose=require("mongoose");
var Schema = mongoose.Schema;

var bookSchema= new Schema({
    bookid: String,
    link: String,
    title: String,
    authors: [String],
    publisher: String,
    publishedDate: String,
    desc: String,
    pageCount: Number,
    printType: String,
    averageGoogleRating: Number,
    ratingGoogleCount: Number,
    textSnippet: String,
    reviews: [{type: Schema.Types.ObjectId, ref:"Review"}],
    averageRating: Number,
    ratingCount: Number,
    picture: String,
    likes:[{type: Schema.Types.ObjectId, ref:"User"}],
    
});

bookSchema.pre("save", function(next){
    var book=this;
    var t=0;
    book.populate("reviews",function(err){
        if(err) return next(err);
        for(let i=0;i<book.reviews.length;i++){
            t+=book.reviews[i].rating;
        }
        if(book.reviews.length!=0){
            t=parseFloat(t)/book.reviews.length;
        }
        else{
            t=0;
        }
        
        book.averageRating=t;
        book.ratingCount=book.reviews.length;
        return next();
    })
})


module.exports= mongoose.model("Book", bookSchema);