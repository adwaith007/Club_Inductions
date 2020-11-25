var colors=generateRandomColors(6);
var pickedColor= pickColor();
var h1= document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var easyBtn= document.querySelector("#easyBtn");
var hardBtn= document.querySelector("#hardBtn");

easyBtn.addEventListener("click", function(){
	easyBtn.classList.add("selected");
	hardBtn.classList.remove("selected");
	colors=generateRandomColors(3);
	pickedColor= pickColor();
	for(var i=0;i<squares.length;i++)
	{
		if(colors[i])
		{
			squares[i].style.backgroundColor=colors[i];
		}
		else
			squares[i].style.display="none";
		
	}
	colorDisplay.textContent=pickedColor;
	h1.style.backgroundColor="steelblue";
	resetButton.textContent="New Colors";
	message.textContent="";
})

hardBtn.addEventListener("click", function(){
	hardBtn.classList.add("selected");
	easyBtn.classList.remove("selected");
	colors=generateRandomColors(6);
	pickedColor= pickColor();
	for(var i=0;i<squares.length;i++)
	{
			squares[i].style.backgroundColor=colors[i];
		
			squares[i].style.display="block";
		
	}
	colorDisplay.textContent=pickedColor;
	h1.style.backgroundColor="steelblue";
	resetButton.textContent="New Colors";
	message.textContent="";

})

resetButton.addEventListener("click",function(){
	colors=generateRandomColors(colors.length);
	pickedColor= pickColor();
	for(var i=0;i<squares.length;i++)
	{
		squares[i].style.backgroundColor=colors[i];
	}
	colorDisplay.textContent=pickedColor;
	h1.style.backgroundColor="steelblue";
	resetButton.textContent="New Colors";
	message.textContent="";
})

var squares=document.querySelectorAll(".square");
var colorDisplay=document.getElementById("colorDisplay");
var message=document.getElementById("message");
colorDisplay.textContent=pickedColor;
for(var i=0;i<squares.length;i++)
{
	squares[i].style.backgroundColor=colors[i];
	squares[i].addEventListener("click", function(){
		if(this.style.backgroundColor===pickedColor){
			changeColor(this.style.backgroundColor);
			message.textContent="Correct!!!";
			h1.style.backgroundColor=this.style.backgroundColor;
			resetButton.textContent="Play Again?";

		}
		else{
			this.style.backgroundColor="#232323";
			message.textContent="Try Again!!!";
		}
	});
}

function changeColor(color)
{
	for(var i=0;i<squares.length;i++)
	{
		squares[i].style.backgroundColor=color;
	}
}
function pickColor()
{
	var random = Math.floor(Math.random()*colors.length);
	return colors[random];
}

function generateRandomColors(num)
{
	var arr=[];
	for(var i=0;i<num;i++)
		arr.push(randomColor());
	return arr;
}
function randomColor()
{
	var r= Math.floor(Math.random()*256);
	var g= Math.floor(Math.random()*256);
	var b= Math.floor(Math.random()*256);

	return "rgb("+ r + ", " + g + ", " + b + ")";
}