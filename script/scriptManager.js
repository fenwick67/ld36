
var script = require('./script');

// massive signatrure but oh well :)
exports.process = function(args,surveyResponse,twiml,scriptKey,setNext,done){
    
    function setNextThenRespond(next,redirect){
        if (next === null){//means an error happened
            twiml.say('Terribly sorry, but an error has occurred. Goodbye.');
            return done();
        }else{
           setNext(next,function(er){
                if(er){
                    twiml.say('Terribly sorry, but an error has occurred. Goodbye.');
                    return done();
                }else{
                    if (redirect){
                        // redirect to this same route
                        twiml.redirect('./',{method:"POST"});
                    }
                    return done();
                }
            })
        }
    }
    
    if (typeof script[scriptKey] == 'function'){
        script[scriptKey](args,surveyResponse,twiml,setNextThenRespond);
    }else{
        twiml.say('Terribly sorry, but an error has occurred.  Let\'s start over.');
        setNextThenRespond('',true);  
    }
}