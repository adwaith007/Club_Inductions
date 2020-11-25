
    function textAreaAdjust(o) {
      o.style.height = "1px";
      o.style.height = (25+o.scrollHeight)+"px";
    }

    var descareas=document.querySelectorAll(".descarea");
    descareas.forEach(function(descarea){
      textAreaAdjust(descarea);
    })


