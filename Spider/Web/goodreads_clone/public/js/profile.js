var profileid= document.getElementById("profileid").innerHTML;
var button_wrap=document.getElementById("button-wrap");

function sendrequest(){
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if(JSON.parse(this.responseText)){
			var htmlvar="<button class='btn btn-default' id='cancel-btn'>Cancel Request</button>";
			button_wrap.innerHTML=htmlvar;
			addlistenerprofile();
			}
	    }
	  };
	request.open("GET", "/profile/"+profileid+"/follow", true);
	request.send();	
}

function cancelrequest(){
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if(JSON.parse(this.responseText)){
			var htmlvar="<button class='btn btn-default' id='send-btn'>Send Request</button>";
			button_wrap.innerHTML=htmlvar;
			addlistenerprofile();
			}
	    }
	  };
	request.open("GET", "/profile/"+profileid+"/cancelrequest", true);
	request.send();	
}

function unfollow(){
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if(JSON.parse(this.responseText)){
			var htmlvar="<button class='btn btn-default' id='send-btn'>Send Request</button>";
			button_wrap.innerHTML=htmlvar;
			addlistenerprofile();
			}
	    }
	  };
	request.open("GET", "/profile/"+profileid+"/unfollow", true);
	request.send();	
}

function addlistenerprofile(){
	if(document.getElementById("send-btn")){
	document.getElementById("send-btn").addEventListener("click", sendrequest);
	}
	if(document.getElementById("cancel-btn")){
		document.getElementById("cancel-btn").addEventListener("click", cancelrequest);
	}
	if(document.getElementById("unfollow-btn")){
		document.getElementById("unfollow-btn").addEventListener("click", unfollow);
	}
}

addlistenerprofile();
