var twilio = require('twilio');
var SurveyResponse = require('../models/SurveyResponse');
//var survey = require('../survey_data');

// Main interview loop
exports.interview = function(request, response) {
    var phone = request.body.From;
    var input = request.body.RecordingUrl || request.body.Digits;
    var twiml = new twilio.TwimlResponse();

    // helper to append a new "Say" verb with alice voice
    function say(text) {
        twiml.say(text, { voice: 'alice'});
    }

    // respond with the current TwiML content
    function respond() {
        response.type('text/xml');
        response.send(twiml.toString());
    }

    // Find an in-progess survey if one exists, otherwise create one
    SurveyResponse.advanceSurvey({
        phone: phone,
        input: input
    }, function(err, surveyResponse, setNext) {
        
        function setNextThenRespond(next){
            setNext(next,function(er){
                if(er){
                    say('Terribly sorry, but an error has occurred. Goodbye.');
                    return respond();
                }else{
                    return respond();
                }
            })
        }

        if (err || !surveyResponse) {
            say('Terribly sorry, but an error has occurred. Goodbye.');
            return respond();
        }
        // Add a greeting if this is the first question
        else if (surveyResponse.next == '') {
            say('Thank you for calling the support hotline for Call of the Ancients.  Please enter your error code or ticket number, followed by the pound, or hash sign.');
            twiml.gather({
                timeout: 10,
                finishOnKey: '#'
            });
            setNextThenRespond('ticket');
        }else if (surveyResponse.next == 'ticket'){//got ticket no
            var ticketn;
            try {
                ticketn  = Number(input);
                if (!ticketn){
                    say('That\'s not a valid number.  Please try again.'); 
                    setNextThenRespond('');
                }
            }catch(e){
                setNextThenRespond('');
            }
                say('you inputted '+ticketn+'.  Sweet huh?');
                setNextThenRespond('');
        }else{
            say('cannot do this: '+surveyResponse.next);
            setNextThenRespond('');
        }

    });
};


























// Transcripton callback - called by Twilio with transcript of recording
// Will update survey response outside the interview call flow
exports.transcription = function(request, response) {
    var responseId = request.params.responseId;
    var questionIndex = request.params.questionIndex;
    var transcript = request.body.TranscriptionText;

    SurveyResponse.findById(responseId, function(err, surveyResponse) {
        if (err || !surveyResponse || 
            !surveyResponse.responses[questionIndex]) 
            return response.status(500).end();

        // Update appropriate answer field
        surveyResponse.responses[questionIndex].answer = transcript;
        surveyResponse.markModified('responses');
        surveyResponse.save(function(err, doc) {
            return response.status(err ? 500 : 200).end();
        });
    });
};
