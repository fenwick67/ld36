var number = '(844) 293-0481';
var magic = '85238';

$(function() {
    $('#ticketbutton').on('click',function(){
        handleTicket($('#ticket').val())
    });
});

function handleTicket(text){
    if (text.length < 2){return;}
    
    if (text.replace(/\D/ig,'') === magic){
        var h = '<p class="bg-danger"><b>ERROR DISPLAYING TICKET</b> please use <a href="./console.html">Admin Console</a> and / or call the support line</p>'
        $('#tickets').html(h);
        return;
    }
    
    if (!validates(text)){
        $('#tickets').html('');
        
        setTimeout(function(){
         var h = '<p class="bg-danger">Sorry, that looks like an <b>Invalid / Nonexistent ticket number</b></p>';
        
        $('#tickets').html(h);   
        },500);
        
        return;
    }
    // look up ticket
    var t = window.ticketLookup(text);
    
    
    var h = '<table class="table table-bordered">';
    for(var i = 0; i < t.length; i ++){
        var rowEl = 'td' 
        if (i == 0){
            rowEl = 'th';
        }
        
        h = h + '<tr>';
        for (var j = 0; j < t[i].length; j ++){
            h = h + '<' + rowEl + '>' + t[i][j] + '</' + rowEl + '>';
        }
        h = h + '</tr>';
        
    }
    h = h + '</table>';
    
    
    $('#tickets').html(h);
}

function validates(s){
    //validate ticket no
    if (/\D/.test(s)){
        return false;
    }
    if (s.length != 5){
        return false;
    }
    if (!/8652/.test(s)){
        return false;
    }
    return true;
}

function browserForCode(code){
    var browser = Number(code.toString()[0]);//first digit
    
    if (browser === 1){
        return 'Google Chrome';
    }else if (browser === 2){
        return 'Internet Explorer';
    }else if (browser === 3){
        return 'Microsoft Edge';
    }else if (browser === 4){
        return 'Mozilla Firefox';
    }else{
        return 'an unsupported browser';
    }
}

window.ticketLookup = function(text){
     if (validates(text)){
        return [
            ['Ticket Number','Date Submitted','Status','Support Comments'],
            [text,new Date().toDateString(),'Open','User called with issues using '+browserForCode(text)+'. Same issue as other tickets.  Should resolve shortly.']
        ];
    }else if (text == magic){
        return [
            ['Ticket Number','Date Submitted','Status','Support Comments'],
            [text,new Date('2016-08-27').toDateString(),'Closed','Issues playing the game, eventually resolved.  View notes for more details.']
        ];
    }else{
        return false;
    }
}

window.browserForTicket = function(ticket){
    if (!validates(ticket)) return false;
    else return browserForCode(ticket);
};