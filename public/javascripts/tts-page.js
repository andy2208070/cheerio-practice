// reference: https://bobbyhadz.com/blog/javascript-syntaxerror-cannot-use-import-statement-outside-module
import { datasSearch } from '/javascripts/utils/fuzzy-search.js';

// tts
const msg = new SpeechSynthesisUtterance();
msg.text = document.querySelector('[name="text"]').value;
let originVoices = [],
  filterVoices = [],
  currentVoice = null,
  currentVoiceLang = '';
const voicesList = document.querySelector('#voicesList'),
  voiceSearchBar = document.querySelector('#voiceSearchBar'),
  voiceLanList = document.querySelector('#voiceLanList'),
  voiceDropdownBtn = document.querySelector('#voiceDropdownBtn'),
  options = document.querySelectorAll('[type="range"], [name="text"]'),
  speakButton = document.querySelector('#playBtn'),
  dropMask = document.querySelector('.drap-mask'),
  vocieDropWrap = document.querySelector('.voice-drop-wrap'),
  stopButton = document.querySelector('#stopBtn');
// console.log(msg)

function populateVoices(){ // choose language
  originVoices = this.getVoices();
  filterVoices = this.getVoices();
  // console.log(voices)
  renderVoiceItems(originVoices);
  renderVoiceLangs(originVoices);
}

function renderVoiceLangs(voiceArr){
  const voiceLans = Array.from(new Set(voiceArr.map(voice=>voice?.lang)));
  voiceLanList.innerHTML += voiceLans
  .sort()
  .map(voice => `
    <option value="${voice}">${voice.toUpperCase()}</option>
  `).join('');
  voiceLanList.value = currentVoiceLang;
  // console.log(voiceArr)
}

function renderVoiceItems(voiceArr){
  voicesList.innerHTML = voiceArr
  .map(voice => `<li class="">
    <button type="button" value="${voice?.voiceURI || voice?.name}"
    class="w-full text-left mb-2 p-2 border border-gray-300 rounded-md">
      ${voice.name} <br/> <small class="block text-right">${voice.lang}</small>
    </button>
  </li>`)
  .join("");

  voicesList.querySelectorAll('button').forEach(button => 
    button.addEventListener('click', function(e){
      const value = e.target.value;
      if(!value) return  ;
      setVoice(value);
    })  
  );
}

function setVoice(inputVoice){
  // // msg是語音Web API，預設voice是null
  // // 目前我只有語言名字(this.value)，我要從物件(voices)找這個語言名字所以用「.find()」
  currentVoice = originVoices.find(voice => voice?.voiceURI=== inputVoice || voice?.name  === inputVoice);
  msg.voice = currentVoice;
  voiceDropdownBtn.innerHTML = `
    <div class="w-full text-left mb-2">
      ${currentVoice?.name} <br/> <small class="block text-right">${currentVoice?.lang}</small>
    </div>
  `;
  vocieDropWrapOnHidden();
  // // msg.voice = voices.find(function(item){return item.name===e.target.value})
  // toggle()
}

function setOption(){
  msg[this.name] = this.value;
}

function toggle(startOver = true){
  speechSynthesis.cancel()
  if(startOver){
    speechSynthesis.speak(msg)
  }
}

function vocieDropWrapOnShow(){
  dropMask.classList.remove('hidden');
  vocieDropWrap.classList.remove('hidden');
}
function vocieDropWrapOnHidden(){
  dropMask.classList.add('hidden');
  vocieDropWrap.classList.add('hidden');
}

speechSynthesis.addEventListener('voiceschanged',populateVoices)
// voicesList.addEventListener('change',setVoice)
voiceDropdownBtn.addEventListener('click', () => vocieDropWrapOnShow());
dropMask.addEventListener('click', () => vocieDropWrapOnHidden())
options.forEach(option => option.addEventListener('change',setOption))
speakButton.addEventListener('click',toggle)
stopButton.addEventListener('click',toggle.bind(null,false))
voiceSearchBar.addEventListener('input', function(e){
  const renderVoices = datasSearch(filterVoices, e.target.value);
  renderVoiceItems(renderVoices);
});
voiceLanList.addEventListener('change', function(e){
  currentVoiceLang = e.target.value || '';
  filterVoices = originVoices.filter(voice=> voice?.lang === e.target.value);
  renderVoiceItems(filterVoices);
});