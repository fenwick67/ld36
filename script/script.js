// this contains the tree for the phone dialogue

// next is a callback with (nextScriptEntry <String>, redirect <Boolean>)
// redirect causes twilio to hit the endpoint again, which means it won't hang up.


exports[''] = function(args,surveyResponse,twiml,next){
    // https://twilio.github.io/twilio-node/#twimlNesting
    
    twiml.gather({
        timeout: 10,
        finishOnKey: '#'
    },function(){
        this.say('Thank you for calling the support hotline for Call of the Ancients.  Please enter your error code or ticket number, followed by the pound, or hash sign.');
    });
    
    next('ticket');
}

exports.ticket = function(args,surveyResponse,twiml,next){
    var ticketn;
    try {
        ticketn  = Number(args.input);
        if (!ticketn || args.input.length !== 5){
            twiml.say('That\'s not a valid number.  Please try again.'); 
            return next('',true);
        }
    }catch(e){
        return next('');
    }
    //got ticketn


    function playWav(file){
        twiml.play('/recordings/'+file+'.wav');
    }
    
    if (ticketn === 85238){
        twiml.say('An error has occurred.  The ticket console password for the "Admin" account has been reset to its default, which is password, one.  '+
        'Once again, the password for the admin account has been reset to, P.,A.,S.,S.,W.,O.,R.,D., one.  Thank you, and goodbye.');
        return next('');
    }

    twiml.say('Please wait while we redirect your call.  An operator will be with you shortly.  Current wait time is approximately, 2, minutes.');
    playWav('hold');
    twiml.say('Your call is important to us.  Please stay on the line for the next available operator.');
    playWav('hold');
    playWav('greeting');
    
    var browser = Number(args.input[0]);//first digit
    
    if (browser === 1){
        playWav('chrome');
    }else if (browser === 2){
        playWav('ie');
    }else if (browser === 3){
        playWav('edge');
    }else if (browser === 4){
        playWav('firefox');
    }else{
        playWav('otherbrowser');
    }
    playWav('ticketpage');
    return next('');
}

