//fb part////////////
window.fbAsyncInit = function() {
FB.init({appId: '809276472615424', status: true, cookie: true,
xfbml: true});
};
(function() {
var e = document.createElement('script'); e.async = true;
e.src = document.location.protocol +
'//connect.facebook.net/en_US/all.js';
document.getElementById('fb-root').appendChild(e);
}());



function postToFb(desc){
		FB.ui({
	    method: 'feed',
	    link: window.location.hostname,
	    quote: desc + " on Bookogram"
	   }, function(response){});
	}
	


/////////////////////////
function newsfeed_refresh(){
	var newsfeed = new XMLHttpRequest();
	newsfeed.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var activities=JSON.parse(this.responseText);
			var newsfeed_list=document.getElementById("newsfeed-list");
			var htmlvar="";
			activities.reverse().forEach(function(activity){
				htmlvar+="<li class=' text-center list-group-item'>"+activity.desc+" on "+ new Date(activity.date).toDateString()+"</li>";
			})
			if(activities.length==0){
			    htmlvar="<li class='text-center list-group-item'>Nothing to show</li>";
			}
			newsfeed_list.innerHTML=htmlvar;
			
	    }
	  };
	newsfeed.open("GET", "/ajax/newsfeed", true);
	newsfeed.send();	
}

 setInterval(newsfeed_refresh, 5000);

var activity_privacies=document.querySelectorAll(".activity-privacy");
activity_privacies.forEach(function(activity_privacy){
	activity_privacy.addEventListener("change", function(e){
		var request= new XMLHttpRequest();
		request.onreadystatechange=function(){
			if(this.readyState==4&&this.status==200){
				console.log("Upadated Succesfully");
			}
		}
		request.open("GET", "/activity/"+e.target.dataset.actid.toString()+"/changeprivacy?p="+e.target.value);
		request.send();
	})
})

setTimeout(function(){
	var request= new XMLHttpRequest();
		request.onreadystatechange=function(){
			if(this.readyState==4&&this.status==200){
				var randomBooks=JSON.parse(this.responseText);
				var htmlvar="";
				var bookl;
				var suggestion=document.getElementById("suggestion");
				for(let i=0;i<3;i++){
					if(randomBooks[i].volumeInfo.imageLinks){
						bookl=randomBooks[i].volumeInfo.imageLinks.thumbnail;
					}
					else{
						bookl="http://via.placeholder.com/150x200";
					}
					htmlvar+="<div class='col-lg-4 col-md-6 col-sm-12'>";
					htmlvar+="<a href='/book/"+ randomBooks[i].id +"'><img src='"+bookl+"' class='img-thumbnail' style='width:150px; height:200px;'></a></div>";
						
				}
				suggestion.innerHTML=htmlvar;
			}
		}
		request.open("GET", "/fetchbooks");
		request.send();
},1000);
