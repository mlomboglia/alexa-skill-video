const Alexa = require('ask-sdk-core');

const HELP_MESSAGE = 'This is a simple demo. Just open the skill to see the video.';
const ERROR_MESSAGE = 'Sorry, an error occurred in the demo. Please check the logs.';
const STOP_MESSAGE = 'Goodbye!';

//const VIDEO_URL = 'https://alexa-skll-video-src.s3.eu-west-1.amazonaws.com/free-video.mp4';
const VIDEO_URL = 'https://alexa-skll-video-src.s3.eu-west-1.amazonaws.com/burning-fireplace.mp4';

const TITLE = 'Fireplace';
const TEXT = `Loading your video now, please give me a moment ...`;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        let responseBuilder = handlerInput.responseBuilder;
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['VideoApp']) {
          handlerInput.responseBuilder
            .addDirective({
              "type": "VideoApp.Launch",
              "version": "1.0",
              "videoItem": {
                "source": VIDEO_URL,
                "metadata": {
                  "title": TITLE
                }
              }
    
            })
            .speak(TEXT)
        } else {
          handlerInput.responseBuilder
            .speak("The video cannot be played on your device. To watch this video, try launching this skill from an echo show device.");
        }
        return handlerInput.responseBuilder.getResponse();
    }
  };

const HelpIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.stack}`);

    return handlerInput.responseBuilder
      .speak(ERROR_MESSAGE)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    ExitHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
