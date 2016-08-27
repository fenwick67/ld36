var mongoose = require('mongoose');

// Define survey response model schema
var SurveyResponseSchema = new mongoose.Schema({
    // phone number of participant
    phone: String,

    // status of the participant's current survey response
    complete: {
        type: Boolean,
        default: false
    },

    // record of answers
    responses: [mongoose.Schema.Types.Mixed],
    next:{
        type:String,
        default:''
    }
});

// For the given phone number and survey, advance the survey to the next
// question
SurveyResponseSchema.statics.advanceSurvey = function(args, cb) {
    var phone = args.phone;
    var input = args.input;
    var surveyResponse;

    // Find current incomplete survey
    SurveyResponse.findOne({
        phone: phone
        }, function(err, doc) {
        surveyResponse = doc || new SurveyResponse({
            phone: phone
        });
        processInput();
    });

    // fill in any answer to the current question, and determine next question
    // to ask
    function processInput() {

        // if there's a problem with the input, we can re-ask the same question
        function reask() {
            cb.call(surveyResponse, null, surveyResponse, setNext);
        }

        // If we have no input, ask the current question again
        if (!input) return reask();
        
        // Otherwise use the input to answer the current question
        var questionResponse = {};
        if (input.indexOf('http') === 0) {
            // input is a recording URL
            questionResponse.recordingUrl = input;
        } else {
            // otherwise store raw value
            questionResponse.answer = input;
        }

        surveyResponse.responses.push(questionResponse);

        function setNext(str,cb){
            surveyResponse.next = str;
            surveyResponse.save(cb);
        }

        // Save response
        surveyResponse.save(function(err) {
            if (err) {
                reask();
            } else {
                cb.call(surveyResponse, err, surveyResponse, setNext);
            }
        });
    }
};

// Export model
var SurveyResponse = mongoose.model('SurveyResponse', SurveyResponseSchema);
module.exports = SurveyResponse;
