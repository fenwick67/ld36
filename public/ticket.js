var number = '(844) 293-0481';
var magic = '85238';

$(function() {
    $('#ticketbutton').on('click',function(){
        handleTicket($('#ticket').val())
    });
});

function handleTicket(text){
    if (text.length < 2){return;}
    
    if (!validates(text)){
       var h = '<p class="bg-danger">Sorry, that looks like an <b>Invalid / Nonexistent ticket number</b></p>';
        
        $('#tickets').html(h);
        return;
    }
    // look up ticket
    var h = [
        '<table class="table table-bordered"> ',
            '<tr><th>Ticket Number</th><th>Date Submitted</th><th>Status</th></tr>',
            '<tr><td>'+text+'</td><td>'+new Date().toDateString() + '</td><td>Open</td></tr>',
        '</table>'
    ].join('\n');
    
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