var try_again = document.querySelector(".try_again");
var state=0;
var textarea= document.querySelector(".txtarea");
var starttime;
var ref= document.querySelector(".reftext").textContent;
var num= document.querySelector(".num");
textarea.value="";
var freeze=0;



try_again.addEventListener("click", function(){
    window.location.reload();

});
var vc=-1;

textarea.addEventListener("click", function(){
  if(!state)
  {
    starttime=Date.now();
    state=1;
    console.log(starttime);
  }
  textarea.style.background="#007E33";
  textarea.style.color="#ffffff";
})



textarea.addEventListener("keydown", function(e)
{
  if(e.key=='Backspace')
  {
    if(vc!=-1){
      vc=vc-1;
    }
    freeze=0;
    textarea.style.background="#007E33";
  }
  else{
    vc=vc+1;
    if(freeze){
      vc=vc-1;
      e.preventDefault();
    }
    else if(!(e.key==ref[vc])){
      freeze=1;
      textarea.style.background="#CC0000";
    }
  }
})

textarea.addEventListener("keyup", function(e)
{
  if(textarea.value.length==ref.length&&!freeze)
  {
    console.log("fn2");
    num.textContent=(parseFloat(ref.length)*1000/(Date.now()-starttime)).toFixed(2);
    console.log(num.textContent);

    textarea.setAttribute("disabled",true);

  }
})
