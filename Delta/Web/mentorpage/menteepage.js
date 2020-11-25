// $(".fa-plus").click(function(){
// 	$("#newmentee").fadeToggle();
// });
var namearea= document.querySelector("#name");
var ratingarea= document.querySelector("#rating");
var commentarea= document.querySelector("#comment");
var rollnoarea = document.querySelector("#rollno");
var storage;
var e=0;
namearea.value="";
ratingarea.value="";
commentarea.value="";
rollnoarea.value="";


//toggle add panel
document.querySelector(".addtoggle").addEventListener("click",function(){
  document.querySelector("#newmentee").classList.toggle("hidden_h");

});
storage = JSON.parse(localStorage.getItem("storage"));


//for debugging purpose

// storage = [{name:"Adwaith D", rating: 3,rollno:106117007, comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos sit iste quaerat libero quas eligendi quidem obcaecati officia eaque consequuntur."},
// {name:"Preetam", rating: 3,rollno:106117001, comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos sit iste quaerat libero quas eligendi quidem obcaecati officia eaque consequuntur."},
// {name:"Raghul", rating: 5,rollno:106117002, comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos sit iste quaerat libero quas eligendi quidem obcaecati officia eaque consequuntur."},
// {name:"Adwaith D", rating: 3,rollno:106117003, comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos sit iste quaerat libero quas eligendi quidem obcaecati officia eaque consequuntur."},
// {name:"Preetam", rating: 1,rollno:106117004, comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos sit iste quaerat libero quas eligendi quidem obcaecati officia eaque consequuntur."},
// {name:"Raghul", rating: 3,rollno:106117005, comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos sit iste quaerat libero quas eligendi quidem obcaecati officia eaque consequuntur."}];
// localStorage.setItem("storage", JSON.stringify(storage));



//initial page setup
if(storage==null){
  storage=[];
}
  for(var i=0; i<storage.length;i++)
  {
    var addcontent = "<div class='mentee'><h2>" + storage[i]["name"] + "<i class='fa fa-trash'></i></h2><div class='rating'>Rating: "+storage[i]["rating"]+ "<i class='fa fa-code'></i></div><div class='comment hidden'>"+storage[i]["comment"]+"</div><div class='rollbox hidden'>"+storage[i]["rollno"]+"</div><div class='edit_btn'><i class='fa fa-pencil'></i>Edit Profile</div></div>";
    document.querySelector(".mentee_box").innerHTML += addcontent;
  }





//delete mechanism
var deletelist = document.querySelectorAll(".fa-trash");//Deletion of mentee
for(var i=0; i<deletelist.length;i++)
{
  deletelist[i].addEventListener("click", function(){
    var k=this;
    var temp = storage.filter(function(el) { return el.rollno != k.parentElement.parentElement.childNodes[3].textContent; });
    storage=temp;
    // console.log(this.parentElement.parentElement.childNodes[3]);
    localStorage.setItem("storage", JSON.stringify(storage));
    this.parentElement.parentElement.remove();
  })
}


//togglecomments
var commentlist = document.querySelectorAll(".fa-code");
for(var i=0; i<commentlist.length;i++)
{
  commentlist[i].addEventListener("click", function(){
    for(var j=0; j<commentlist.length;j++)
    {
      if(commentlist[j]===this){continue;}
      commentlist[j].parentElement.parentElement.childNodes[2].classList.add("hidden");
      commentlist[j].parentElement.parentElement.childNodes[3].classList.add("hidden");
    }
    this.parentElement.parentElement.childNodes[2].classList.toggle("hidden");
    this.parentElement.parentElement.childNodes[3].classList.toggle("hidden");

  })
}

//edit mechanism
var editlist = document.querySelectorAll(".edit_btn");//Deletion of mentee
for(var i=0; i<editlist.length;i++)
{
  editlist[i].addEventListener("click", function(){
    namearea.value=this.parentElement.childNodes[0].textContent;
    var ratingedit = this.parentElement.childNodes[1].textContent;
    ratingarea.value=parseInt(this.parentElement.childNodes[1].textContent[8]);
    commentarea.value=this.parentElement.childNodes[2].textContent;
    rollnoarea.value=this.parentElement.childNodes[3].textContent;
    document.querySelector("#newmentee").classList.remove("hidden_h");
    e=1;
    rollnoarea.disabled=true;
    window.scrollTo(0,0);

  })
}

//addnewmentee
document.querySelector(".addbtn").addEventListener("click",function(){

  var name=namearea.value;
  var rating=ratingarea.value;
  var comment=commentarea.value;
  var rollno=rollnoarea.value;
  namearea.value="";
  ratingarea.value="";
  commentarea.value="";
  rollnoarea.value="";
  if(e==1){
    e=0;
    for(var i=0; i<storage.length;i++)
    {
      if(storage[i].rollno==rollno)
      {
        storage[i].name=name;
        storage[i].rating=rating;
        storage[i].comment=comment;
        localStorage.setItem("storage", JSON.stringify(storage));
        window.location.reload();
      }
    }
  }
  else {
    storage.push({name:name, rating: parseFloat(rating),rollno:rollno, comment: comment});
    localStorage.setItem("storage", JSON.stringify(storage));
    window.location.reload();
  }



});

//rating bg setup
var ratinglist = document.querySelectorAll(".rating");//Deletion of mentee
for(var i=0; i<ratinglist.length;i++)
{
  var red =(5.0- parseFloat(ratinglist[i].textContent[8]))*255/5;
  var green =(parseFloat(ratinglist[i].textContent[8]))*255/5;
  var color = "rgb("+red+", "+green+", 0)";
  ratinglist[i].style.background=color;

}


//sort mechanism

var sortbtn = document.querySelector(".sortbtn");

function compare(a,b) {
  if (a.rating < b.rating)
    return 1;
  if (a.rating > b.rating)
    return -1;
  return 0;
}

sortbtn.addEventListener("click",function(){
  storage.sort(compare);
  localStorage.setItem("storage", JSON.stringify(storage));
  window.location.reload();

})
