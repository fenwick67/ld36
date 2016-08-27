var floor;
var pyramid;
var number = '(844) 293-0481';
var myAudio;

$(function() {
    
    floor = new Image();
    pyramid = new Image();
    
    var images = [floor,pyramid];
    images.forEach(function(image){image.onload = maybeGo});
    
    pyramid.src = 'pyramid.png';
    floor.src = 'floor.png';
    
    var calls = 0;
    function maybeGo(){
        calls ++;
        if (calls >= images.length){
            go();
            calls = -10000000000;
        }
    }
    
    function go(){
        canvas = $('#canvas')[0];
        ctx = canvas.getContext('2d');
        playMusic();
        //kick off ticks
        requestAnimationFrame(tick);
        $('#canvas').on('click tap',startGame);
    }
    $('#mute').on('click tap',function(){
        var $this = $(this);
        var i = $this.find('i');
        if (myAudio){
            if (myAudio.muted){
                 i.removeClass('fa-volume-off');
                i.addClass('fa-volume-up');
                myAudio.muted = false;
            }else{
                i.removeClass('fa-volume-up');
                i.addClass('fa-volume-off');
                myAudio.muted = true;
            }
            
        }
    });
});

var canvas;
var ctx;
var t0;
function tick(t){
    requestAnimationFrame(tick);
    if (!t0) {
        t0 = t;
        return 
    }
    var dt = t - t0;
    
    //dt is time
    
    update(dt,t);
    render(dt,t);
    
}
    
var game = {
    started:false,
    beatable:false,
    character:{
        position:{
            x:0,
            y:0
        }
    }
};
    
function update(dt,time){
    //update game params
    if (game.started && !game.beatable && !game.alerted){
        //throw alert & return
        var msg = getErrorMessage();
        game.error = msg;
        alert(msg);
        console.log(msg);
        game.alerted = true;
    }
}

function render(dt,time){
    
    if (game.error){
        //show error screen
        ctx.fillStyle = "#e71616";
        ctx.fillRect(0,0,640,480);
        drawButton(100,50,game.error.toString(),10 )
        return;
    }
    
    //draw bg
    ctx.fillStyle = "#477a80";
    ctx.fillRect(0,0,640,480);
    ctx.setTransform(1,0,0,1,0,0);
    
    //draw pyramid
    ctx.drawImage(pyramid,200,100 + Math.sin(time/500)*50 );
    
    //draw floor tiles
    
    var offset = (time/10 % 64);
    for (var w = 0 - offset; w < canvas.width; w += floor.width) {
        ctx.drawImage(floor, w, 480-64);
    }
    
        ctx.setTransform(1,0,0,1,0,0);


    drawButton(50,50,'Click / Tap to Play!')
    
    function drawButton(x,y,text,size){
        text = text.toString();
        var size = size || 20;
        var lines = text.split('\n');
        var height = lines.length * size * 2;
        var width = text.length * size;
        
        ctx.fillStyle = '#1f6770';
        ctx.fillRect(x,y,width, height);
  
        ctx.font = size*1.4+"px monospace";
        ctx.fillStyle = '#b4eff6';
        ctx.textStyle = '#b4eff6';
        for (var i = 0; i < lines.length; i ++){
            ctx.fillText(lines[i],x+size*1.4,y+size*1.4*(i+1));
        }
        
    }
    
}

function startGame(){
    game.started = true;
    game.beatable = beatable();
}

function beatable(){
    //check if game is beatable
    if (window.localStorage.beatable){
        return true;
    }
    return false;
}
function getErrorMessage(){
    return 'Please call '+number + ' with your error code\nto chat with an associate.\nError code: \n'+errorCode();
}

function errorCode(){
    function uaDigit(){
        var ua = navigator.userAgent.toLowerCase();
        
        //error code:
        var map = {
            'chrome':1,
            'msie':2,
            'edge':3,
            'firefox':4,
        };
        
        for (var s in map){
           if (ua.indexOf(s) > -1){
               return map[s];
           } 
        }
        
        return 0;
    }
    return uaDigit() + '' + 8652;
}

function playMusic(){
    myAudio = new Audio('./recordings/ancients.wav'); 
    if (typeof myAudio.loop === 'boolean')
    {
        myAudio.loop = true;
    }
    else
    {
        myAudio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    }
    myAudio.play();
}

window.getUserErrorCode = errorCode;