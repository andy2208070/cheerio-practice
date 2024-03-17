// tts
const msg = new SpeechSynthesisUtterance();
msg.text = document.querySelector('[name="text"]').value;
let voices = [];
const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll('[type="range"], [name="text"]');
const speakButton = document.querySelector('#playBtn');
const stopButton = document.querySelector('#stopBtn');
console.log(msg)

function populateVoices(){ // choose language
  voices = this.getVoices()
  voicesDropdown.innerHTML = voices
    .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
    .join("");
  // console.log(voices)
}

function setVoice(){
  // msg是語音Web API，預設voice是null
  // 目前我只有語言名字(this.value)，我要從物件(voices)找這個語言名字所以用「.find()」
  msg.voice = voices.find(voice => voice.name === this.value)
  // msg.voice = voices.find(function(item){return item.name===e.target.value})
  toggle()
}

function setOption(){
  msg[this.name] = this.value
  toggle();
}

function toggle(startOver = true){
  speechSynthesis.cancel()
  if(startOver){
    speechSynthesis.speak(msg)
  }
}

speechSynthesis.addEventListener('voiceschanged',populateVoices)
voicesDropdown.addEventListener('change',setVoice)
options.forEach(option => option.addEventListener('change',setOption))
speakButton.addEventListener('click',toggle)
stopButton.addEventListener('click',toggle.bind(null,false))