
var canvas = document.querySelector("canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
var angle1=0,angle2=Math.PI,gravity=0.1,player1=0, player2=0,tank1,tank2,mtheight=canvas.height*0.6, mtwidth=500;
var mountainpieces=[],pbar1,pbar2,shots1=[2,2,2], shots2=[2,2,2], b1=1, b2=1, health1=100,health2=100,paused=false,turn=1;
var tank1img,tank2img,piston1img,piston2img,blastimg,blasts;

var ctrl=document.querySelector(".ctrl");
ctrl.addEventListener("click", function(){
  paused=!paused;
  if(paused){
    ctrl.textContent="Resume";
  }
  else{
    ctrl.textContent="Pause";
  }
})

var restart=document.querySelector(".restart");
restart.addEventListener("click", function(){
window.location.reload();
})



var c= canvas.getContext("2d");
init();

window.addEventListener("resize", function(){
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  init();
  animate();
})

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

//keypress listeners
window.addEventListener("keydown", function(e){
  if(!paused){

    if(e.key=='a'||e.key=='A'){
      angle1-=0.01*Math.PI;
    }
    else if(e.key=='d'||e.key=='D'){
      angle1+=0.01*Math.PI;
    }
    else if(e.keyCode==37) {
      angle2-=0.01*Math.PI;
    }
    else if(e.keyCode==39){
      angle2+=0.01*Math.PI;
    }
    else if(e.keyCode==40){
      b2=(b2%3)+1;
    }
    else if(e.key=="s"||e.key=="S"){
      b1=(b1%3)+1;
    }
    else if (e.key=="z"||e.key=="Z") {
      if(tank1.x>0){
        tank1.x--;
        shiftTerrainRight();
      }

    }
    else if(e.key=="x"||e.key=="X"){
      if(tank1.x+60<(canvas.width/2-250)){
        tank1.x++;
        shiftTerrainLeft();
      }
    }
    else if (e.key=="n"||e.key=="N") {
      if(tank2.x>(canvas.width/2+250+10)){
        tank2.x--;
        shiftTerrainRight();
      }
    }
    else if(e.key=="m"||e.key=="M"){
      if(tank2.x<(canvas.width-50)){
        tank2.x++;
        shiftTerrainLeft();
      }
    }
  }

});


//Utility functions
function RandomInRange(min, max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

function calcSlope(x){
  let dy=terrainpts[x+50]-terrainpts[x];
  let slope=dy/50;
  return Math.atan(slope);
}
const colors = ['#709fb0', '#FF8800', '#CC0000'];
function randomColor(){
  return colors[Math.floor(Math.random()*colors.length)];
}

function Distance(x1,y1,x2,y2){
  const xDist = x2 - x1;
  const yDist = y2 - y1;
  return Math.sqrt(Math.pow(xDist,2)+Math.pow(yDist,2));
}

//background terrain generation
//==================================================================
function terrain(width, height, displace, roughness){
    var points = [],
        // Gives us a power of 2 based on our width
        power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

    // Set the initial left point
    points[0] = height*(1/2);
    // set the initial right point
    points[power] = points[0];
    displace *= roughness;

    // Increase the number of segments
    for(var i = 1; i < power; i *=2){
        // Iterate through each segment calculating the center point
        for(var j = (power/i)/2; j < power; j+= power/i){
            points[j] = ((points[j - (power / i) / 2] + points[j + (power / i) / 2]) / 2);
            points[j] += (Math.random()*displace*2) - displace
        }
        // reduce our random range
        displace *= roughness;
    }
    return points;
}


var terrainpts =terrain(canvas.width, canvas.height*(5/3), canvas.height/4, 0.5);

function drawterrain(terrainseeds, color){
  c.save();
  c.fillStyle=color;
  c.strokeStle=color;
  c.beginPath();
  c.moveTo(0,terrainseeds[0]);
  for(var i=1;i<terrainseeds.length;i++){
    c.lineTo(i,terrainseeds[i]);
  }
  c.lineTo(canvas.width,canvas.height);
  c.lineTo(0,canvas.height);
  c.closePath();
  c.fill();
  c.restore();
}

function shiftTerrainRight(){
  var  t= terrainpts.pop();
  terrainpts.unshift(t);
}
function shiftTerrainLeft(){
  var t= terrainpts.shift();
  terrainpts.push(t);
}
function drawMoon(){
  c.save();
  c.beginPath()
  c.fillStyle="rgba(255,255,255,0.7)";
  c.arc(100,130,30,0,2*Math.PI);
  c.fill();
  c.closePath();
  c.beginPath();
  c.fillStyle="#232323";
  c.arc(115,145,0.5,0,2*Math.PI);
  c.fill();
  c.closePath();
  c.restore();
}
//==================================================================
//objects

function MountainPiece(x,y,length,width){
  this.x=x;
  this.y=y;
  this.length=length;
  this.width=width;

  this.draw=()=>{
    c.save();
    c.fillStyle="rgba(27,94,0.8)";
    c.fillRect(this.x,this.y,this.length,this.width);
    c.restore();
  }
}

function init(){
  mountainpieces=[];
  tank1={x:canvas.width*0.05,y:canvas.height*0.8,tx:50,ty:30};
  tank2={x:canvas.width*0.95-50,y:canvas.height*0.8,tx:50,ty:30};
  pbar1={x:tank1.x, y:tank1.y+tank1.ty+15,width:0,height:10, state:0, angle:0};
  pbar2={x:tank2.x, y:tank2.y+tank2.ty+15,width:0,height:10, state:0, angle:0};
  hbar1={x:tank1.x, y:pbar1.y+pbar1.height+15,width:50,height:10};
  hbar2={x:tank2.x, y:pbar2.y+pbar2.height+15,width:50,height:10};
  tank1img=new Image();
  tank2img= new Image();
  piston1img=new Image();
  piston2img=new Image();
  blastimg=new Image();
  blasts=[];
  blastimg.src="sprites/blast.png";
  tank1img.src="sprites/redtank.png";
  tank2img.src="sprites/yellowtank.png";
  piston1img.src="sprites/piston1.png";
  piston2img.src="sprites/piston2.png";


  var STEP_MAX= 4.0;
  var STEP_CHANGE=1.0;
  var HEIGHT_MAX=mtheight;
  var HEIGHT_MIN=canvas.height*0.4;

  var height=0;
  var slope =Math.random()*STEP_MAX*2-STEP_MAX;
  for(var i=0;i<=mtwidth/2;i+=1){
    height+=slope;

    slope+=Math.random()*STEP_CHANGE*2-STEP_CHANGE;

    if(slope>STEP_MAX){
      slope=STEP_MAX;
    }
    if(slope<-STEP_MAX){
      slope=STEP_MAX;
    }
    if(height>HEIGHT_MAX){
      height=HEIGHT_MAX;
      slope*=-1;
    }
    if(height>mtheight){
      height=mtheight;
      slope*=-1;
    }
    mountainpieces.push(new MountainPiece(canvas.width/2-mtwidth/2+i,canvas.height-height,1,height ));
    mountainpieces.push(new MountainPiece(canvas.width/2+mtwidth/2-i,canvas.height-height,1,height ));

  }
  mountainpieces.pop();
}

function Blast(x,y){
  this.x=x;
  this.y=y;
  this.state=1;
  this.radius=0;

  this.update=()=>{
    this.radius+=1;
    this.state-=0.01;
    this.draw();
  }
  this.draw=()=>{
    if(this.state>0){
      c.drawImage(blastimg,this.x-this.radius/2,this.y-this.radius/2,this.radius,this.radius);
    }
  }
}




function Bullet(x,y,v,team,angle,type){
  this.x =x;
  this.y =y;
  this.dx=v*Math.cos(angle);
  this.dy=v*Math.sin(angle);
  this.radius =type*4;
  this.team=team;
  this.state=1.0;
  this.type=type;

  this.update=()=>{
    this.x+=this.dx;
    this.y+=this.dy;
    this.dy+=gravity;
    if((this.x+this.radius>tank1.x)&&(this.x-this.radius<(tank1.x+tank1.tx))&&(this.y+this.radius>tank1.y)&&(this.y-this.radius<(tank1.y+tank1.ty))&&this.team==2&&this.state==1)
    {
        if(this.type==1){
          hbar1.width-=12.5;
          player2+=1;
        }
        else if(this.type==2){
          hbar1.width-=25;
          player2+=2;
        }
        else if(this.type==3){
          hbar1.width-=50;
          player2+=4;
        }
        if(hbar1.width==0){
          checkwinner();
        }
        this.state=0;;

    }
    else if((this.x+this.radius>tank2.x)&&(this.x-this.radius<(tank2.x+tank2.tx))&&(this.y+this.radius>tank2.y)&&(this.y-this.radius<(tank2.y+tank2.ty))&&this.team==1&&this.state==1)
    {
        if(this.type==1){
          hbar2.width-=12.5;
          player1+=1;
        }
        else if(this.type==2){
          hbar2.width-=25;
          player1+=2;
        }
        else if(this.type==3){
          hbar2.width-=50;
          player1+=4;
        }
        if(hbar2.width==0){
          checkwinner();
        }
        this.state=0;

    }
    for(let i=0; i<mountainpieces.length;i++){
      if((this.x+this.radius>mountainpieces[i].x)&&(this.x-this.radius<(mountainpieces[i].x+mountainpieces[i].length))&&(this.y+this.radius>mountainpieces[i].y)&&(this.y-this.radius<(mountainpieces[i].y+mountainpieces[i].width))&&this.state!=0)
      {
        blasts.push(new Blast(mountainpieces[i].x,mountainpieces[i].y));
        this.state=0;
      }
    }
    for(let i=0;i<terrainpts.length;i++){
      if((this.y+this.radius>=terrainpts[parseInt(this.x)])&&this.state==1){
        blasts.push(new Blast(this.x,this.y));
        this.state=0;
        let ref={x:this.x, y:terrainpts[parseInt(this.x)]};
        for(let j=0;j<terrainpts.length;j++){
          if(Distance(j,terrainpts[j],ref.x,ref.y)<=this.type*10){
            // let afactor=Math.abs(Math.atan((ref.y-terrainpts[j])/(ref.x-j)));// uncomment for non-circular destruction
            let afactor=Math.abs(Math.acos((ref.x-j)/(this.type*10)));
            terrainpts[j]=ref.y+this.type*10*Math.sin(afactor);
          }
        }
      }
    }


    this.draw();

  };

  this.draw=()=>{
    if(this.state!=0){
      c.save();
      c.fillStyle=colors[this.type-1];
      c.beginPath();
      c.arc(this.x,this.y,this.type*4,0,Math.PI*2, false);
      c.fill();
      c.closePath();
      c.restore();
    }


  };
}

function checkwinner(){
  if(player1>player2){
    alert("Game over!! Player 1 wins!!");
    window.location.reload();
  }
  else if(player2>player1)
  {
    alert("Game over!! Player 2 wins!!");
    window.location.reload();
  }
  else{
    alert("Game over!! No one wins!!");
    window.location.reload();
  }
}

//implementation
let bullets1=[];
let bullets2=[];
window.addEventListener("keyup", function(e){
  if(!paused){

    if(e.key=="w"||e.key=="W"){
      if(shots1[b1-1]>0&&turn==1&&pbar1.width>=5)
      {
        turn=2;
        bullets1.push(new Bullet(tank1.x+25, tank1.y, pbar1.width,1,angle1,b1));
        shots1[b1-1]-=1;
      }
      pbar1.state=0;
      pbar1.width=0;
    }
    else if(e.keyCode==38){

      if(shots2[b2-1]>0&&turn==2&&pbar2.width>=5)
      {
        turn=1;
        bullets2.push(new Bullet(tank2.x+25, tank2.y, pbar2.width,2,angle2,b2));
        shots2[b2-1]-=1;
      }

        pbar2.state=0;
        pbar2.width=0;
      }
    }
});
window.addEventListener("keydown", function(e){
  if((e.key=="w"||e.key=="W")&&pbar1.width<50&&turn==1){
    pbar1.state=1;
    pbar1.width+=0.5;
  }
  else if(e.keyCode==38&&pbar2.width<50&&turn==2){
    pbar2.state=1;
    pbar2.width+=0.5;
    }

    if((shots1[0]==0&&shots1[1]==0&&shots1[2]==0)&&(shots2[0]==0&&shots2[1]==0&&shots2[2]==0))
    {
        checkwinner();
    }
});





//drawing
function drawScore() {
    c.save();
    c.font = "800 16px Arial";
    c.fillStyle="rgba(255,255,255,0.8)";
    c.fillText("Player1: "+player1, 15, 20);
    c.fillText("Bullet Type:" +b1, 15, 40);
    c.fillText("[1]:"+shots1[0]+"/2 [2]:"+shots1[1]+"/2 [3]:"+shots1[2]+"/2",15,60);
    if(turn==1){
      c.fillText("YOUR TURN", 15, 80);
    }
    else {
      c.fillText("YOUR TURN", canvas.width*0.87, 80);
    }
    c.fillText("Player2: "+player2, canvas.width*0.87, 20);
    c.fillText("Bullet Type:" +b2, canvas.width*0.87, 40);
    c.fillText("[1]:"+shots2[0]+"/2 [2]:"+shots2[1]+"/2 [3]:"+shots2[2]+"/2",canvas.width*0.87,60);
    c.restore();
}
function drawpiston1(){
  c.save();
  c.translate( (tank1.x+25),  (tank1.y) );
  c.rotate( angle1+tank1.angle );
  c.translate( -(tank1.x+25), -(tank1.y));
  c.drawImage(piston1img, tank1.x+25, tank1.y, 50,5);
  c.restore();
}
function drawpiston2(){
  c.save();
  c.translate( (tank2.x+25),  (tank2.y));
  c.rotate( angle2 - Math.PI+tank2.angle );
  c.translate( -(tank2.x+25), -(tank2.y));
  c.drawImage(piston2img,tank2.x-25, tank2.y,50,5);
  c.restore();
}
function drawphbar(){

  pbar1.x=tank1.x;pbar1.y=tank1.y+tank1.ty+15;
  pbar2.x=tank2.x;pbar2.y=tank2.y+tank2.ty+15;
  hbar1.x=tank1.x;hbar1.y=pbar1.y+pbar1.height+15;
  hbar2.x=tank2.x;hbar2.y=pbar2.y+pbar2.height+15;

  if(pbar1.state==1){
    c.save();
    c.fillStyle="rgb("+parseFloat(pbar1.width)*255.0/50+", "+parseFloat(50.0-pbar1.width)*255.0/50+", 0)";
    c.fillRect(pbar1.x,pbar1.y, pbar1.width, pbar1.height);
    c.restore();
  }
  if(pbar2.state==1){
    c.save();
    c.fillStyle="rgb("+parseFloat(pbar2.width)*255.0/50+", "+parseFloat(50.0-pbar2.width)*255.0/50+", 0)";
    c.fillRect(pbar2.x,pbar2.y, pbar2.width, pbar2.height);
    c.restore();
  }
  c.save();
  c.fillStyle="rgb("+parseFloat(50.0-hbar1.width)*255.0/50+", "+parseFloat(hbar1.width)*255.0/50+", 0)";
  c.fillRect(hbar1.x,hbar1.y, hbar1.width, hbar1.height);
  c.fillStyle="rgb("+parseFloat(50.0-hbar2.width)*255.0/50+", "+parseFloat(hbar2.width)*255.0/50+", 0)";
  c.fillRect(hbar2.x,hbar2.y, hbar2.width, hbar2.height);
  c.restore();

}

function drawpaused(){
  c.save();
  c.font="800 30px Arial";
  c.fillStyle="#cc0000";
  c.fillText("GAME PAUSED!!!", canvas.width/2-130, canvas.height/2-20);
  c.restore();
}
function drawTanks(){
  c.save();
  tank1.y=terrainpts[parseInt(tank1.x+25)]-tank1.ty;
  tank1.angle=calcSlope(parseInt(tank1.x));
  c.translate( (tank1.x),  (tank1.y));
  c.rotate( tank1.angle );
  c.translate( -(tank1.x), -(tank1.y));
  c.drawImage(tank1img,tank1.x,tank1.y,tank1.tx,tank1.ty);
  c.restore();
  c.save();
  tank2.y=terrainpts[parseInt(tank2.x+25)]-tank2.ty;
  tank2.angle=calcSlope(parseInt(tank2.x));
  c.translate( (tank2.x),  (tank2.y));
  c.rotate( tank2.angle );
  c.translate( -(tank2.x), -(tank2.y));
  c.drawImage(tank2img,tank2.x,tank2.y,tank2.tx,tank2.ty);
  c.restore();

}
//animation
function animate(){
  requestAnimationFrame(animate)
  if(!paused){
    c.clearRect(0,0,canvas.width,canvas.height);
    drawMoon();
    // drawterrain(terrainpts2, "#726a95");
    drawterrain(terrainpts, "#4b3832");


    drawTanks();
    drawpiston1();
    drawpiston2();
    drawScore();
    drawphbar();


    mountainpieces.forEach(MountainPiece =>{
      MountainPiece.draw();
  });
  bullets1.forEach(Bullet =>{
    Bullet.update();
  });
  bullets2.forEach(Bullet =>{
    Bullet.update();
  });
  blasts.forEach(Blast =>{
    Blast.update();
  });
  }
  else {
    c.clearRect(0,0,canvas.width,canvas.height);
    drawpaused();
  }
}
animate();
