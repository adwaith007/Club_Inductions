function requests_refresh(){
	let requests = new XMLHttpRequest();
	requests.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var requestlist=JSON.parse(this.responseText);
			var request_target=document.getElementById("request-target");
			var htmlvar="";
			requestlist.forEach(function(request){
				htmlvar+="<li>"+request.user1.name+"<button class='btn btn-success accept-btn'>Accept</button><button class='btn btn-danger reject-btn'>Reject</button></li>";
			})
			if(requestlist.length==0){
			    htmlvar="<li><p class='meta'>No Requests Yet</p></li>";
			}
			request_target.innerHTML=htmlvar;
			
	    }
	  };
	requests.open("GET", "/ajax/requests", true);
	requests.send();	
}

setInterval(requests_refresh, 5000);

function accept(id,parentelement){
    var acptrequest = new XMLHttpRequest();
	acptrequest.onreadystatechange = function() {
		console.log(this.readyState);
		console.log(id);
		if (this.readyState == 4 && this.status == 200) {
			if(JSON.parse(this.responseText)){
			    let htmlvar="This request was accepted";
			    parentelement.innerHTML=htmlvar;
			    addlistener();
	        }
		}
	  };
	acptrequest.open("GET", "/home/requests/"+id+"/confirm", true);
	acptrequest.send();
}
function reject(id,parentelement){
    var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		console.log(this.readyState);
		if (this.readyState == 4 && this.status == 200) {
			if(JSON.parse(this.responseText)){
			    let htmlvar="This request was rejected";
			    parentelement.innerHTML=htmlvar;
			    addlistener();
	        }
		}
	  };
	request.open("GET", "/home/requests/"+id+"/reject", true);
	request.send();
}

function privacyfn(){
    var request = new XMLHttpRequest();
    var parentelement=document.getElementById("privacy-modal");
    var value=document.getElementById("privacy-value");
	request.onreadystatechange = function() {
		console.log(this.readyState);
		if (this.readyState == 4 && this.status == 200) {
			if(JSON.parse(this.responseText)){
			    let htmlvar="Settings saved successfully!!";
			    parentelement.innerHTML=htmlvar;
			    addlistener();
	        }
		}
	  };
	request.open("GET", "/changeprivacy/"+value.value, true);
	request.send();
}

function addlistener(){
	var acceptbtns=document.querySelectorAll(".accept-btn");
	var rejectbtns=document.querySelectorAll(".reject-btn");
	if(document.getElementById("save-privacy")){
		document.getElementById("save-privacy").addEventListener("click", privacyfn);
	}
	
	
	acceptbtns.forEach(function(btn){
	    console.log(btn.dataset.reqid);
	    btn.addEventListener("click", function(e){
	    	console.log(e.target);
	    	accept(e.target.dataset.reqid.toString(),e.target.parentElement)}
	    	)
	})
	rejectbtns.forEach(function(btn){
	    btn.addEventListener("click",function(e){
	    	reject(e.target.dataset.reqid.toString(),e.target.parentElement)
	    	})
	})
	
	var pagenos= document.querySelectorAll(".pageno");
	pagenos.forEach(function(pageno){
		pageno.addEventListener("click", function(e){
			e.preventDefault();
			pagenos.forEach(function(pg){
				pg.classList.remove("active");
			})
			e.target.parentNode.classList.add("active");
			console.log(Array.prototype.indexOf.call(e.target.parentNode.parentNode.children,e.target.parentNode));
				findbooks(Array.prototype.indexOf.call(e.target.parentNode.parentNode.children,e.target.parentNode));
		})
	})
	
	
	
	
}

addlistener();


var userTimer;
var search_bar=document.getElementById("name-search");
search_bar.addEventListener("keyup", function(e){
clearTimeout(userTimer);
			userTimer=setTimeout(function(){
				searchforusers();
			},1000);
})






function searchforusers(){
	var request= new XMLHttpRequest;
	var users;
	var userlist= document.getElementById("userlist-target");
	request.onreadystatechange=function(){
		if(this.readyState==4&&this.status==200){
			users=JSON.parse(this.responseText);
			console.log(users);
			var htmlvar="";
			users.forEach(function(user){
				htmlvar+="<li>"+"<a href='/profile/"+user._id+"'><img class='img-rounded img-responsive' style='width:50px; height: 50px; display: inline;' src='"+user.picture+"'>"+user.name+"</a></li>";
			})
			userlist.innerHTML=htmlvar;
		}
	}
	request.open("GET","/user/search?user="+search_bar.value);
	request.send();
}



var book_search=document.getElementById("bookkey");
var book_parameter=document.getElementById("search-parameter");
var bookTimer;
book_search.addEventListener("keyup", function(e){
	clearTimeout(bookTimer);
			bookTimer=setTimeout(function(){
				findbooks(1);
			},1000);
})


function findbooks(pg){

	var request= new XMLHttpRequest();
	var books;
	var htmlvar="<div class='well row'><div class='container'>";
	var book_list=document.getElementById("booklist-target");
	request.onreadystatechange=function(){
		console.log("serachbook "+this.readyState);
		if(this.readyState==4&&this.status==200){
			books=JSON.parse(this.responseText);
			console.log(books.items.length);
			console.log(books);
			books.items.forEach(function(book){
				var bookl;
				if(book.volumeInfo.imageLinks){
					bookl=book.volumeInfo.imageLinks.thumbnail;
				}
				else{
					bookl="http://via.placeholder.com/128x198";
				}
				htmlvar+="<div class=' col-md-6 col-sm-12 clearfix' style='overflow:hidden;'>"
				htmlvar+="<a href='/book/"+book.id+"'>"
				htmlvar+="<div class='container'>"
				htmlvar+="<img class='img-rounded thumbnail img-responsive' src='"+bookl+"'>"
				htmlvar+="<div class='h4' >"+book.volumeInfo.title+"</div>"
				htmlvar+="</div></a></div>"
			})
			htmlvar+="</div></div>";
			book_list.classList.add("container");
			book_list.innerHTML=htmlvar;
			if(pg==1){
					
						var pagtar= document.getElementById("pagination-target");
						var pagehtml=""
						pagehtml="<nav aria-label='Page navigation'>";
						pagehtml+="<ul class='pagination'>";
					    pagehtml+="<li class='active pageno'><a href='#'>1</a></li>";
					    for(let k=2;k<=Math.ceil(books.totalItems/10);k++){
					    pagehtml+="<li class='pageno'><a href='#'>"+k+"</a></li>";
					    }
					    pagehtml+="</ul></nav>";
					    pagtar.innerHTML=pagehtml;
					    addlistener();
			}
		}
		
	}
	request.open("GET","/searchbooks?"+"&searchkey="+book_search.value+"&parameter="+book_parameter.value+"&pg="+pg,true);
	request.send();
}


