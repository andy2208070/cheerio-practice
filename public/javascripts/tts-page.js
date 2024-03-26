// reference: https://bobbyhadz.com/blog/javascript-syntaxerror-cannot-use-import-statement-outside-module
import { datasSearch } from '/javascripts/utils/fuzzy-search.js';

// tts
const msg = new SpeechSynthesisUtterance();
msg.text = document.querySelector('[name="text"]').value;
let originVoices = [],
  currentSelected = {
    vocieObj: null,
    voice: '',
    lang: '',
  };
const voicesListElm = document.querySelector('#voicesList'),
  voiceSearchBarElm = document.querySelector('#voiceSearchBar'),
  voiceLanListElm = document.querySelector('#voiceLanList'),
  vocieDropWrap = document.querySelector('.voice-drop-wrap'),
  currentVoiceElm = document.querySelector('#currentVoiceElm'),
  options = document.querySelectorAll('[type="range"], [name="text"]'),
  speakButton = document.querySelector('#playBtn'),
  stopButton = document.querySelector('#stopBtn');
// console.log(msg)

function filterVoices(){
  const { lang:langStr, voice: voiceStr } = currentSelected;
  const newArr =  originVoices
  .filter(voice => langStr?(voice?.lang===langStr):true);
  return newArr;
}

function populateVoices(){ // choose language
  originVoices = this.getVoices();
  // console.log(voices)
  renderVoiceItems(filterVoices());
  renderVoiceLangs(originVoices);
}

function renderVoiceLangs(voiceArr){
  const voiceLans = Array.from(new Set(voiceArr.map(voice=>voice?.lang)));
  voiceLanListElm.innerHTML = `<option value="">All</option>`;
  voiceLanListElm.innerHTML += voiceLans
  .sort()
  .map(voice => `
    <option value="${voice}">${voice.toUpperCase()}</option>
  `).join('');
  voiceLanListElm.value = currentSelected.lang;
  // console.log(voiceArr)
}

function renderVoiceItems(voiceArr){
  const { voice: currentVoice } = currentSelected;
  const btnClass = `bg-blue-100`;
  voicesListElm.innerHTML = voiceArr
  .sort()
  .map(voice => `<li class="">
    <button type="button" value="${voice?.voiceURI || voice?.name}"
    class="w-full text-left mb-2 p-2 border border-gray-300 rounded-m 
    ${(currentVoice===voice?.voiceURI || currentVoice===voice?.name)?btnClass:''}">
      ${voice.name} <br/> <small class="block text-right">${voice.lang}</small>
    </button>
  </li>`)
  .join("");
  
  const btns = voicesListElm.querySelectorAll('button');
  const btnStyleHandler = (btnValue = null) => {
    btns.forEach(btn => {
      btn.classList.remove(btnClass);
      if(btn.value===btnValue){
        btn.classList.add(btnClass);
      }
    });
  }
  btns.forEach(button => 
    button.addEventListener('click', function(e){
      const value = e.target.value;
      if(!value) return ;
      btnStyleHandler(value);
      setVoice(value);
    })  
  );
}

function setVoice(inputVoice){
  // // msg是語音Web API，預設voice是null
  // // 目前我只有語言名字(this.value)，我要從物件(voices)找這個語言名字所以用「.find()」
  const currentVoice = filterVoices().find(voice => voice?.voiceURI=== inputVoice || voice?.name  === inputVoice);
  msg.voice = currentVoice;

  currentSelected.vocieObj = currentVoice;
  currentSelected.voice = inputVoice;
  currentVoiceElm.innerHTML = `
    <div class="w-full text-left mb-2">
      ${currentVoice?.name} <br/> <small class="block text-right">${currentVoice?.lang}</small>
    </div>
  `;
  // // msg.voice = voices.find(function(item){return item.name===e.target.value})
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


speechSynthesis.addEventListener('voiceschanged',populateVoices)
// voicesList.addEventListener('change',setVoice)
options.forEach(option => option.addEventListener('change',setOption))
speakButton.addEventListener('click',toggle)
stopButton.addEventListener('click',toggle.bind(null,false))
voiceSearchBarElm.addEventListener('input', function(e){
  const renderVoices = datasSearch(filterVoices(), e.target.value);
  renderVoiceItems(renderVoices);
});
voiceLanListElm.addEventListener('change', function(e){
  const lang = e.target.value || '';
  currentSelected.lang = lang;
  renderVoiceItems(filterVoices());
});