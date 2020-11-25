var User= require("../models/user");
var Note= require("../models/note");
var mongoose= require("mongoose");
var fs= require("fs");
var multer=require("multer");
var path=require("path");
const storage = multer.diskStorage({
  destination: './public/imagestore/',
  filename: function(req, file, cb){
    cb(null,req.session.user._id + '-' + Date.now() + path.extname(file.originalname));
  }
});
var isAuthenticated=require("../controllers/authenticated");
function authenticatenote(useremail,noteid){
    return new Promise(function(resolve, reject) {
            Note.findById(noteid, function(err,note){
            if(err){
                console.log(err);
            }
            else{
                note.collaborators.forEach(function(collaborator){
                    if(useremail==collaborator){
                        resolve(true);
                    }
                })
                resolve(false);
            }
        });
    });

}

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('picture');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

module.exports= function(app){
    
    app.post("/profile/notes",isAuthenticated, function(req,res){
                var newnote= new Note();
                console.log(req);
                newnote.title=req.body.title;
                newnote.content=req.body.content;
                newnote.importance=req.body.importance;
                newnote.label=req.body.label;
                newnote.collaborators.push(req.session.user.email);
                newnote.save(function(err, note){
                if(err) throw err;
                User.findById(req.session.user._id, function(err,user){
                    if(err) throw err;
                    user.notes.push(newnote);
                    user.save();
                    res.redirect("/profile");
                })
                    
            })
    })
    
    app.put("/notes/:id/picture",isAuthenticated,function(req,res){
        authenticatenote(req.session.user.email,req.params.id).then(function(value){
            if(value){
                upload(req,res,function(err){
                    if(err) throw err;
                    Note.findById(req.params.id, function(err,note){
                        if(err) throw err;
                        note.picture=req.file.path.toString();
                        note.save();
                        res.redirect("/profile");
                    })
                })            
            }
        })
        
    })
    
    app.delete("/notes/:id/picture",isAuthenticated, function(req,res){
        authenticatenote(req.session.user.email,req.params.id).then(function(value){
            if(value){
                Note.findById(req.params.id, function(err, note){
                    if (err) throw err;
                    fs.unlink("./"+note.picture);
                    note.picture=undefined;
                    note.save();
                    res.redirect("/profile");
                }) 
            }})
    })
    
    app.put("/notes/:id",isAuthenticated, function(req,res){
        authenticatenote(req.session.user.email,req.params.id).then(function(value){
            if(value){
                Note.findById(req.params.id, function(err, note){
                    if(err) throw err;
                    if(note){
                        note.title=req.body.title;
                        note.content=req.body.content;
                        note.picture=req.body.picture;
                        note.importance=req.body.importance;
                        note.label=req.body.label;
                        note.lastEdit= Date.now();
                        note.save();
                        res.redirect("/profile");
                    }
                })
            }})
    })
    
    app.delete("/notes/:id",isAuthenticated, function(req,res){
        authenticatenote(req.session.user.email,req.params.id).then(function(value){
            if(value){
                User.findById(req.session.user._id, function(err,user){
                    if(err) throw err;
                    user.notes=user.notes.filter(noteid=>req.params.id!=noteid.valueOf());
                    user.save();
                    req.session.user=user;
                    req.session.save();
                })
                Note.findById(req.params.id, function(err, note){
                    if(err) throw err;
                    if(note.picture){
                        fs.unlink("./"+note.picture, function(err){
                            console.log(err);
                            
                        });
                    }
                    Note.findByIdAndRemove(note._id, function(err){
                        if(err){
                            console.log(err);
                        }
                        res.redirect("/profile");
                    });
                });
            }})
        
    })
    
    //add collaborator//
    app.post("/notes/:id/add",isAuthenticated, function(req,res){
        authenticatenote(req.session.user.email,req.params.id).then(function(value){
            if(value){
                User.findOne({email: req.body.email}, function(err,user){
                    if(err) throw err;
                    if(!user){
                        req.flash("errors", "User does not exists");
                    }
                    else{
                        user.notes.push(new mongoose.Types.ObjectId(req.params.id));
                        user.save();
                    
                        Note.findById(req.params.id,function(err,note){
                            if(err) throw err;
                            note.collaborators.push(req.body.email);
                            note.save();
                            res.redirect("/profile");
                        })
                    }
                }) 
            }})
        

    })
    
    //remove collaborator//
    app.post("/notes/:id/remove",isAuthenticated, function(req,res){
        authenticatenote(req.session.user.email,req.params.id).then(function(value){
            if(value){
                User.findOne({email:req.body.email}, function(err,user){
                    if(err) throw err;
                    if(user){
                        user.notes = user.notes.filter(note=>req.params.id!=note.valueOf());
                        user.save();
                        Note.findById(req.params.id,function(err,note){
                            if(err) throw err;
                            note.collaborators = note.collaborators.filter(function(collaborator) { 
                                return collaborator != req.body.email;
                            })
                            note.save();
                            res.redirect("/profile");
                        })
                    }
                })
            }})
        
    })
}
