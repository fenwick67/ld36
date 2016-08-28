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
        if (!canvas){
            return;//no canvas
        }
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
    enemyHealth:100,
    attackDamage:10,
    attack:false,
    enemyHealthBarVisible:false
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
    }else if (!game.started){
        return;
    }
    
    //attack
    if (game.attack && !game.won){
        game.attackTime = time;
        game.attack = false;
        game.enemyHealth = Math.max(game.enemyHealth - game.attackDamage,0);
        if (game.enemyHealth <= 0){
            win();
        }
    }
    
    function win(){
        if (!game.won){
            game.won = true;
            game.winTime = time;
        }
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
    
    var pyramidOffset = Math.sin(time/500)*50;
    if (game.won){
       pyramidOffset = pyramidOffset - ( game.winTime - time )/5;
    }
    
    //draw pyramid
    ctx.drawImage(pyramid,200,100  + pyramidOffset);
    
    //draw floor tiles
    
    var offset = (time/10 % 64);
    for (var w = 0 - offset; w < canvas.width; w += floor.width) {
        ctx.drawImage(floor, w, 480-64);
    }
    
        ctx.setTransform(1,0,0,1,0,0);


    if (!game.started){
        drawButton(50,50,'Click/Tap to Start/Attack')
    }
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
    
    
    //sugar foot sugar foot
    if (game.enemyHealthBarVisible){
        //draw health bar
        ctx.fillStyle= '#1f6770';
        ctx.fillRect(20,350,600,30);
        ctx.fillStyle= '#f99';
        ctx.fillRect(20,350,600 * game.enemyHealth/100,30);
    }
    
    
    if (game.attackTime){
        drawAttack(time - game.attackTime);
    }
    function drawAttack(dt){
        //draw flash
        var flashDuration = 500;
        if (dt > flashDuration){
            return;
        }
        var intensity = (flashDuration - dt)/flashDuration;
        ctx.fillStyle = 'rgba(253,229,113,'+intensity+')';
        ctx.fillRect(0,0,640,480);
    }
    
    if (game.won){
        showCredits();   
    }
    function showCredits(){
        var creditDuration = 3000;
        var credits = [
            'WINNER',
            "",
            "Congratulations!",
            "",
            "Credits: ",
            "Sound: Fenwick",
            "Programming: Fenwick",
            "Voice: Fenwick",
            ""
        ].join('\n');
        var creditTime = time - game.winTime;
        var tp = Math.min(1,creditTime / creditDuration);
        ctx.fillStyle = 'rgba(0,0,0,'+tp+')';
        ctx.fillRect(0,0,640,480);
        
        if (creditTime > creditDuration){
            drawButton(0,100,credits,10);
        }
        
        
    }
    
}

function startGame(){
    if (!game.started){
        game.started = true;
        game.beatable = beatable();
        game.enemyHealthBarVisible = true;
        return;
    }
    game.attack = true;
    
}

function beatable(){
    //check if game is beatable
    if (window.localStorage.beatable){
        return true;
    }
    return false;
}

window.beatable = beatable;

function getErrorMessage(){
    return 'RUNTIME ERROR \nPlease call '+number + ' with your error code\nto chat with an associate.\nError code: \n'+errorCode();
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

