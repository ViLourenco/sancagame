var myGameArea;
var myCar;
var myObstacles = [];
var myscore;

function restartGame() {
    document.getElementById("myfilter").style.display = "none";
    document.getElementById("myrestartbutton").style.display = "none";
    myGameArea.stop();
    myGameArea.clear();
    myGameArea = {};
    myCar = {};
    myObstacles = [];
    myscore = {};
    document.getElementById("canvascontainer").innerHTML = "";
    startGame();
}

function startGame() {
    myGameArea = new gamearea();
    myCar = new component(80, 50, "black", 10, 75, 'image', 'img/car.png');
    myscore = new component("15px", "Consolas", "black", 220, 25, "text");
    myGameArea.start();
}

function gamearea() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 320;
    this.canvas.height = 180;    
    document.getElementById("canvascontainer").appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");
    this.pause = false;
    this.frameNo = 0;
    this.start = function() {
        this.interval = setInterval(updateGameArea, 30);
    }
    this.stop = function() {
        clearInterval(this.interval);
        this.pause = true;
    }
    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type, img) {

    this.type = type;
    if (type == "text") {
        this.text = color;
    }
    this.score = 0;    
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;  
    this.img = img;

    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }else if(this.type == "image") {
            ctx = myGameArea.context;
            this.image = new Image();
            // This is async, so you need to pass your drawImage inside a callback function
            this.image.onload = function() {
              ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }.bind(this); // Bind the "this" to the callback
            this.image.src = this.img; // This is valid, just unfortunate to name it color.
        }else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, y, min, max, height, gap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myCar.crashWith(myObstacles[i])) {
            myGameArea.stop();
            document.getElementById("myfilter").style.display = "block";
            document.getElementById("myrestartbutton").style.display = "block";
            return;
        } 
    }
    if (myGameArea.pause == false) {
        myGameArea.clear();
        myGameArea.frameNo += 1;
        myscore.score +=1;  
        //console.log(myGameArea.frameNo);      
        if (myGameArea.frameNo == 1 || everyinterval(150)) {
        	//aumentando a intervalo 
        	//this.interval = setInterval(updateGameArea, 50);
            x = myGameArea.canvas.width;
            y = myGameArea.canvas.height - 100;
            min = 20;
            max = 100;
            height = Math.floor(Math.random()*(max-min+1)+min);
            min = 50;
            max = 100;
            gap = Math.floor(Math.random()*(max-min+3)+min);
            myObstacles.push(new component(10, height, "green", x, 0));
            myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += -1;
            myObstacles[i].update();
        }
        myscore.text="Pontos: " + myscore.score;        
        myscore.update();
        myCar.x += myCar.speedX;
        myCar.y += myCar.speedY;    
        myCar.update();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function moveup(e) {
    myCar.speedY = -1; 
}

function movedown() {
    myCar.speedY = 1; 
}

function moveleft() {
    myCar.speedX = -1; 
}

function moveright() {
    myCar.speedX = 1; 
}

function clearmove(e) {
    myCar.speedX = 0; 
    myCar.speedY = 0; 
}

var lastDownTarget, canvas;
window.onload = function() {
    canvas = document.getElementById('canvas');
    
    document.addEventListener('mousedown', function(event) {
        lastDownTarget = event.target;
        //alert('mousedown');
    }, false);
    
    document.addEventListener('keydown', function(event) {
        if(lastDownTarget == canvas) {
            //alert('keydown' + event.keyCode);
        }
        if( event.keyCode == 38 ){
            moveup(); 
        }else if( event.keyCode == 40 ){
        	movedown();
        }else if( event.keyCode == 39 ){
            moveright();
        }else if( event.keyCode == 37 ){
            moveleft();
        }
    }, false);
}

startGame();
