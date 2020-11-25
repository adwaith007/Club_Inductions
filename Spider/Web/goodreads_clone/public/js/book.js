
function addlistenersbook(){
    var likebtn=document.getElementById("like-btn"),
    unlikebtn=document.getElementById("unlike-btn"),
    favouritebtn=document.getElementById("favourite-btn"),
    unfavouritebtn=document.getElementById("unfavourite-btn"),
    addshelfbtn=document.getElementById("add-shelf-btn"),
    bookstatus=document.getElementById("bookstatus"),
    revlikebtns=document.querySelectorAll(".rev-like-btn"),
    revunlikebtns=document.querySelectorAll(".rev-unlike-btn"),
    booklikes_modal_body=document.getElementById("booklikes-modal-body");

    if(likebtn){
        likebtn.addEventListener("click", function(e){
            var request = new XMLHttpRequest();
        	request.onreadystatechange = function() {
        	    console.log(this.readyState);
        	    console.log(this.statusText);
        		if (this.readyState == 4 && this.status == 200) {
        			var targetelement=e.target.parentElement;
        			var booklikes=JSON.parse(this.responseText);
        			var htmlvar="<button class=' btn btn-default' id='unlike-btn'>Unlike</button> <span class='badge' data-toggle='modal' data-target='#booklikes-modal'>"+booklikes.length+"</span>";
        			targetelement.innerHTML=htmlvar;
        			htmlvar="";
        			booklikes.forEach(function(likeduser){
        			    htmlvar+="<li><a href='/profile/"+likeduser._id+"'>";
        			    htmlvar+="<img class='img-rounded img-responsive' style='width:50px; height: 50px; display: inline;' src='"+likeduser.picture+"'>"+likeduser.name+"</a></li>";
        			})
        			booklikes_modal_body.innerHTML=htmlvar;
        			addlistenersbook();
        			
        	    }
        	  };
        	request.open("POST", window.location.pathname+ "/like", true);
        	request.send();
        })
    }
    
    if(unlikebtn){
        unlikebtn.addEventListener("click", function(e){
            var request = new XMLHttpRequest();
        	request.onreadystatechange = function() {
        		if (this.readyState == 4 && this.status == 200) {
        			var targetelement=e.target.parentElement;
        			var booklikes=JSON.parse(this.responseText);
        			var htmlvar="<button class=' btn btn-primary' id='like-btn' >Like</button> <span  class='badge' data-toggle='modal' data-target='#booklikes-modal'>"+booklikes.length+"</span>";
        			targetelement.innerHTML=htmlvar;
        			htmlvar="";
        			booklikes.forEach(function(likeduser){
        			    htmlvar+="<li><a href='/profile/"+likeduser._id+"'>";
        			    htmlvar+="<img class='img-rounded img-responsive' style='width:50px; height: 50px; display: inline;' src='"+likeduser.picture+"'>"+likeduser.name+"</a></li>";
        			})
        			booklikes_modal_body.innerHTML=htmlvar;
        			addlistenersbook();
        			
        	    }
        	  };
        	request.open("POST",window.location.pathname+ "/unlike", true);
        	request.send();
        })
    }
    if(favouritebtn){
        favouritebtn.addEventListener("click", function(e){
            var request = new XMLHttpRequest();
        	request.onreadystatechange = function() {
        		if (this.readyState == 4 && this.status == 200) {
        			var targetelement=e.target.parentElement;
        			var htmlvar="<button class=' btn btn-default' id='unfavourite-btn'>Remove from favourites</button>";
        			targetelement.innerHTML=htmlvar;
        			addlistenersbook();
        			
        	    }
        	  };
        	request.open("POST",window.location.pathname+ "/favourite/add", true);
        	request.send();
        })
    }
    if(unfavouritebtn){
        unfavouritebtn.addEventListener("click", function(e){
            var request = new XMLHttpRequest();
        	request.onreadystatechange = function() {
        		if (this.readyState == 4 && this.status == 200) {
        			var targetelement=e.target.parentElement;
        			var htmlvar="<button class='btn btn-primary' id='favourite-btn'>Add to favourites</button>";
        			targetelement.innerHTML=htmlvar;
        			addlistenersbook();
        			
        	    }
        	  };
        	request.open("POST",window.location.pathname+ "/favourite/remove", true);
        	request.send();
        })
    }
    if(addshelfbtn){
        addshelfbtn.addEventListener("click", function(e){
            var request = new XMLHttpRequest();
        	request.onreadystatechange = function() {
        		if (this.readyState == 4 && this.status == 200) {
        			var targetelement=e.target.parentElement;
        			var htmlvar="<select class='form-control' id='bookstatus' name='bookstatus'><option value='Just a book in my shelf'>Just a book in my shelf</option><option value='Want to read'>Want to read</option><option value='Currently Reading'>Currently Reading</option><option value='Finished Reading'>Finished Reading</option></select>" ;
        			targetelement.innerHTML=htmlvar;
        			addlistenersbook();
        			
        	    }
        	  };
        	request.open("POST",window.location.pathname+ "/addtoshelf", true);
        	request.send();
        })
    }
    if(bookstatus){
        bookstatus.addEventListener("change", function(e){
            var request = new XMLHttpRequest();
        	request.onreadystatechange = function() {
        		if (this.readyState == 4 && this.status == 200) {
        			addlistenersbook();
        	    }
        	  };
        	request.open("POST",window.location.pathname+ "/changestatus?currentstatus="+bookstatus.value, true);
        	request.send();
        })
    }
    
    revlikebtns.forEach(function(revlikebtn){
        revlikebtn.addEventListener("click", function(e){
            var request = new XMLHttpRequest();
            var targetelement=e.target.parentElement;
            var revlikemodal=document.getElementById("revmodbody"+e.target.dataset.reviewid);
            var htmlvar="";
            
        	request.onreadystatechange = function() {
        		if (this.readyState == 4 && this.status == 200) {
        		    var likes=JSON.parse(this.responseText);
        		    targetelement.innerHTML="<a data-reviewid='"+ e.target.dataset.reviewid +"' class='rev-unlike-btn'>Unlike</a> <span class='badge' data-toggle='modal' data-target='#revmod"+e.target.dataset.reviewid+"'>"+ likes.length +"</span>"
        			addlistenersbook();
        			likes.forEach(function(likeduser){
        			    htmlvar+="<li><a href='/profile/"+likeduser._id+"'>";
        			    htmlvar+="<img class='img-rounded img-responsive' style='width:50px; height: 50px; display: inline;' src='"+likeduser.picture+"'>"+likeduser.name+"</a></li>";
        			})
        			revlikemodal.innerHTML=htmlvar;
        			addlistenersbook();
        	    }
        	  };
        	request.open("POST","/review/"+e.target.dataset.reviewid+"/like", true);
        	request.send();
            
        })
    })
    
    revunlikebtns.forEach(function(revunlikebtn){
        revunlikebtn.addEventListener("click", function(e){
            var request = new XMLHttpRequest();
            var targetelement=e.target.parentElement;
            var revlikemodal=document.getElementById("revmodbody"+e.target.dataset.reviewid);
            var htmlvar="";
        	request.onreadystatechange = function() {
        		if (this.readyState == 4 && this.status == 200) {
        		    var likes=JSON.parse(this.responseText);
        		    targetelement.innerHTML="<a data-reviewid='"+ e.target.dataset.reviewid +"' class='rev-like-btn'>Like</a> <span class='badge' data-toggle='modal' data-target='#revmod"+e.target.dataset.reviewid+"'>"+ likes.length +"</span>"
        			addlistenersbook();
        			likes.forEach(function(likeduser){
        			    htmlvar+="<li><a href='/profile/"+likeduser._id+"'>";
        			    htmlvar+="<img class='img-rounded img-responsive' style='width:50px; height: 50px; display: inline;' src='"+likeduser.picture+"'>"+likeduser.name+"</a></li>";
        			})
        			revlikemodal.innerHTML=htmlvar;
        			addlistenersbook();
        	    }
        	    
        	  };
        	request.open("POST","/review/"+e.target.dataset.reviewid+"/unlike", true);
        	request.send();
            
        })
    })
    
}

addlistenersbook();