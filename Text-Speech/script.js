
let voiceSelect = document.getElementById('select');

const loadVoices = (voices) => {
    voices.forEach(voice => {
        voiceSelect.innerHTML += "<option>" + voice.name + "</option>";
    });
}


const OS = navigator.userAgent.toLowerCase();
let osOptions = ['windows', 'mac', 'linux'];
for(let i in osOptions){
    if(OS.includes(osOptions[i])){
        console.log(`Operating System: ${osOptions[i].toUpperCase()}`);
        break;
    };
};

// Creating an instance of speechSynthesisUtterance to speak

const utterance = new SpeechSynthesisUtterance();
    
// speechSynthesis.addEventListener('voiceschanged', () => {
//    console.log(speechSynthesis.getVoices());
// });

let voices;
speechSynthesis.onvoiceschanged = () => {
    // var
    voices = speechSynthesis.getVoices();
    // Load voices to dropDown
    loadVoices(voices);
    // Don't add more 
    speechSynthesis.onvoiceschanged = null;
}
// variable declaration
let playButton  = document.getElementById('play');
let pauseButton = document.getElementById('pause');
let stopButton  = document.getElementById('stop');
let inputText   = document.getElementById('inputField');
let inputSpeed  = document.getElementById('speed');
let deleteText = document.getElementById('clear');

// watch delete button
deleteText.addEventListener('click', () => {
    if(speechSynthesis.speaking) stopSpeech();
    // To clear The input
    inputText.value = "";
})
// watch voice change
voiceSelect.addEventListener('change',() => {
    console.log(voiceSelect.value);
    if(voiceSelect.value == "Default"){
        utterance.voice = voices[0];
        console.log(voices[0].name);
    }else{
        voices.forEach(voice => {
            if (voice.name == voiceSelect.value){
                utterance.voice = voice;
                console.log(voice.name);
            }
        })
    }
})
// watch play button click
playButton.addEventListener('click', () => {
    playSpeech(inputText.value, inputSpeed.value);
});
// watch stop button click
stopButton.addEventListener('click', stopSpeech = () => {
    // To resume any paused speech
    speechSynthesis.resume()
    // To cancel/stop speech completely
    speechSynthesis.cancel();
    // To enable the input field
    inputText.disabled = false;
})
// watch pause button click
pauseButton.addEventListener('click', () => {
    if(speechSynthesis.speaking){
        // To pause speech
        speechSynthesis.pause();
    }
})
// Globle variable for current word spoken
let currentChar;
// watch input to speed
inputSpeed.addEventListener('input', () => {
    if(inputText.value == "" || inputText.value == " ") return
    // To stop speech completely
    stopSpeech();
    // From where to start
    let text = utterance.text.substring(currentChar);
    // Restart speech with new speed
    playSpeech(text, inputSpeed.value);
})
// Utterance instance creates at top
// Calculating index of current word
utterance.addEventListener('boundary', word => {
    currentChar = word.charIndex;
})
// To enable inputField after speech is ended
utterance.addEventListener('end', () => {
    inputText.disabled = false;
})
// Play
const playSpeech = (text, rate) => {
    if(!text) return
    // To restrict any change in text
    if(!speechSynthesis.speaking ){
        inputText.disabled = true;
        utterance.text = text;
        utterance.rate = rate || 1;
        speechSynthesis.speak(utterance);
    }else if(speechSynthesis.paused){
        speechSynthesis.resume();
    }

}

