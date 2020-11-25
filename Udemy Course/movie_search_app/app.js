var express=require("express");
var app=express();
var request=require("request");
app.set("view engine","ejs");
var bodyparser= require("body-parser");

app.use(express.static("public"));
var recentqueries=[];

app.get("/results",function(req,res){
   var name=req.query.name;
   var year=req.query.year;
   var ty=req.query.ty; 
   var p=req.query.p;
   var url;
   if(!p){
       p=1;
       url = "http://www.omdbapi.com/?apikey=thewdb&s="+name+"&y="+year+"&type="+ty+"&page=1";
       
       for (var i = recentqueries.length - 1; i >= 0; --i) {
            if (recentqueries[i]["name"] == name && recentqueries[i]["year"] == year && recentqueries[i]["ty"] == ty) {
                recentqueries.splice(i,1);
            }
        }
        recentqueries.push({name:name, year: year, ty:ty});
    }
    else{
        url = "http://www.omdbapi.com/?apikey=thewdb&s="+name+"&y="+year+"&type="+ty+"&page="+p;
    }
        
    var recent={name:name, year:year, ty:ty}

    
    console.log(recentqueries);
    if(recentqueries.length>=6)
    {
        recentqueries.shift();
    }
    request(url+"&p="+p,function(error,response,body){
        if(!error&&response.statusCode==200){
            var data=JSON.parse(body);
            if(typeof data["Search"]==="undefined"||data["Response"]=='False')
            {
                res.redirect("/no_movies");
            }
            else{
                res.render("results",{data: data,p:p,recent:recent});
            }
            
        }
        else
        {
            res.redirect("/error");
        }
    });
})
app.get("/", function(req,res){
    res.redirect("/movies");
});
app.get("/error", function(req,res){
    res.render("error");
});
app.get("/no_movies", function(req,res){
    res.render("no_movies");
});
app.get("/movies", function(req,res){
    res.render("search",{recent: recentqueries});
});
app.get("/movies/:id", function(req,res){
    var id=req.params.id;
    // var url = "http://www.omdbapi.com/?apikey=thewdb&s="+name;
    var url = "http://www.omdbapi.com/?apikey=thewdb&i="+id;
    console.log(url);
    request(url,function(error,response,body){
        if(!error&&response.statusCode==200){
            var data=JSON.parse(body);
            console.log(data);
            
            res.render("show",{data: data});
        }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Movie app has started!!");
})