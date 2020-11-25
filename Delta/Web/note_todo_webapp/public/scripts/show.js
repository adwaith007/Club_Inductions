var addbtns= document.querySelectorAll(".addmore-btn");
    addbtns.forEach(function(addbtn){
        addbtn.addEventListener("click", function(){
            console.log(addbtn.parentElement.previousElementSibling.children[3]);
            let t=addbtn.parentElement.previousElementSibling.children[3].childElementCount;
            addbtn.parentElement.previousElementSibling.children[3].innerHTML+="<div class='todo-item'><input type='checkbox' class='check' name=items["+ t +"][state] onclick='checker()' value=true><input type='text' name=items["+ t +"][content] placeholder='Item'></div>";
            checker();
        })

    })
    function textAreaAdjust(o) {
      o.style.height = "1px";
      o.style.height = (25+o.scrollHeight)+"px";
    }

    var noteareas=document.querySelectorAll(".note-area");
    noteareas.forEach(function(notearea){
      textAreaAdjust(notearea);
    })


    function checker(){
        var checkboxes = document.querySelectorAll(".check");
        checkboxes.forEach(function(checkbox){
        if(checkbox.checked){
            checkbox.nextElementSibling.style.textDecoration="line-through";
        }
        else{
            checkbox.nextElementSibling.style.textDecoration="none";
        }

    })
    }
    checker();
