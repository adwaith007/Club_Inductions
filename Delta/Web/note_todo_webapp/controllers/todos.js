var User= require("../models/user");
var Todo= require("../models/todo");
var mongoose=require("mongoose");
var isAuthenticated=require("../controllers/authenticated");
function authenticatetodo(useremail,todoid){
    return new Promise(function(resolve, reject) {
            Todo.findById(todoid, function(err,todo){
            if(err){
                console.log(err);
            }
            else{
                todo.collaborators.forEach(function(collaborator){
                    if(useremail==collaborator){
                        resolve(true);
                    }
                })
                resolve(false);
            }
        });
    });

}

module.exports=function(app){
    
        //new post route
        app.post("/profile/todos",isAuthenticated, function(req,res){
                var newtodo= new Todo();
                newtodo.title=req.body.title;
                console.log(req.body.items);
                req.body.items.forEach(function(item){
                    if(item){
                        newtodo.items.push({content: item, state: false});
                    }
                    
                })
                newtodo.importance=req.body.importance;
                newtodo.label=req.body.label;
                newtodo.collaborators.push(req.session.user.email);
                newtodo.save(function(err, todo){
                    if(err) throw err;
                    console.log(todo);
                    User.findById(req.session.user._id, function(err,user){
                        console.log("todo pushed");
                        if(err) throw err;
                        user.todos.push(todo);
                        user.save();
                        res.redirect("/profile");
                    })
                })
                
        })
        
        app.put("/todos/:id",isAuthenticated, function(req,res){
                authenticatetodo(req.session.user.email,req.params.id).then(function(value){
                    if(value){
                        Todo.findById(req.params.id, function(err,todo){
                        if(err) throw err;
                        if(todo){
                            todo.title=req.body.title;
                            console.log(req.body.items);
                            todo.items=[];
                            req.body.items.forEach(function(item){
                                if(item.content){
                                    if(item.state){
                                        todo.items.push({content: item.content, state:true });
                                    }
                                    else{
                                        todo.items.push({content: item.content, state:false });
                                    }
                                }
                            })
                            todo.importance=req.body.importance;
                            todo.lastEdit= Date.now();
                            todo.label=req.body.label;
                            console.log(todo);
                            todo.save();
                            res.redirect("/profile");
                            }
                        })
                    }})
        })
        
        
        //delete route//
        app.delete("/todos/:id",isAuthenticated, function(req,res){
            authenticatetodo(req.session.user.email,req.params.id).then(function(value){
                if(value){
                    User.findById(req.session.user._id, function(err,user){
                        if(err) throw err;
                        user.todos=user.todos.filter(todoid=>req.params.id!=todoid.valueOf());
                        user.save();
                        req.session.user=user;
                        req.session.save();
                    })
                    Todo.findByIdAndRemove(req.params.id, function(err){
                        if(err){
                            console.log(err);
                        }
                        res.redirect("/profile");
                    });                    
                }})
        })
        
    //add collaborator//
    app.post("/todos/:id/add",isAuthenticated, function(req,res){
            authenticatetodo(req.session.user.email,req.params.id).then(function(value){
                if(value){
                    User.findOne({email: req.body.email}, function(err,user){
                        if(err) throw err;
                        if(!user){
                            req.flash("errors", "User does not exists");
                        }
                        else{
                            user.todos.push(new mongoose.Types.ObjectId(req.params.id));
                            user.save();
                        
                             Todo.findById(req.params.id,function(err,todo){
                                if(err) throw err;
                                todo.collaborators.push(req.body.email);
                                todo.save();
                                res.redirect("/profile");
                            })
                        }
                    })     
                }
                else{
                    res.redirect("/profile");
                }
            })
        
    })
    
    //remove collaborator//
    app.post("/todos/:id/remove",isAuthenticated, function(req,res){
        authenticatetodo(req.session.user.email,req.params.id).then(function(value){
            if(value){
                User.findOne({email:req.body.email}, function(err,user){
                    if(err) throw err;
                    if(user){
                        user.todos = user.todos.forEach(todo=>req.params.id!=todo.valueOf());
                        user.save();
                        Todo.findById(req.params.id,function(err,todo){
                            if(err) throw err;
                            todo.collaborators = todo.collaborators.filter(function(collaborator) { 
                                return collaborator != req.body.email;
                            })
                            todo.save();
                            res.redirect("/profile");
                        })
                    }
                }) 
            }
            else{
                res.redirect("/profile");
            }
        })

    })
}

