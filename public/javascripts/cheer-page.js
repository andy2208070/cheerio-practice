
// https://codepen.io/amirhafizovic/pen/gZLwzb
// https://stackoverflow.com/a/30800715
// https://github.com/thgh/vercel-sapper/issues/61#issuecomment-1820345113
// const apiUrl = `http://localhost:3456/api/cheerio`;
// const apiUrl = `https://95783854-b6e7-49c6-b179-78d53e968ea0-00-3s8hk5zsml3z7.sisko.replit.dev/cheerio`
const apiUrl = `https://cheerio-practice.vercel.app/api/cheerio`;
const form = document.getElementById('dynamicForm');
const typeInput = document.getElementById('type');
const queryInput = document.getElementById('query');
const groupFields = document.getElementById('groupFields');
const addGroupButton = document.getElementById('addGroupButton');
const jsontreeArea = document.getElementById('jsontree');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
let RESULT = `🐇`;

function hiddenHandler(cond, dom) {
  if (cond) {
    dom.classList.remove('hidden');
  } else {
    dom.classList.add('hidden');
  }
}

function addGroupInputs(){
  const now = Date.now();
  const groupContainer = document.createElement('div');
  groupContainer.classList.add('group-container', 'flex', 'w-full');

  const keyInput = createInput('text', `key-${now}`, 'Key');
  const queryInput = createInput('text', `query-${now}`, 'Query');
  const typeSelect = createSelect(`type-${now}`, ['text', 'html', 'val', 'attr']);
  const attrNameInput = createInput('text', `attrName-${now}`, 'Attribute Name');
  attrNameInput.classList.add('hidden');
  typeSelect.addEventListener('change', function(event) {
    const value = this.value;
    hiddenHandler(value === 'attr', attrNameInput)
  });

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.classList.add('removeButton', 'bg-red-500', 'text-white', 'p-2', 'rounded-md');
  removeButton.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
  removeButton.addEventListener('click', () => {
    groupFields.removeChild(groupContainer);
  });

  groupContainer.appendChild(keyInput);
  groupContainer.appendChild(queryInput);
  groupContainer.appendChild(typeSelect);
  groupContainer.appendChild(attrNameInput);
  groupContainer.appendChild(removeButton);

  groupFields.appendChild(groupContainer);
}
typeInput.addEventListener('change', function(){
  const value = this.value;
  hiddenHandler(value==='multiple', queryInput);
})
addGroupButton.addEventListener('click', () => addGroupInputs() );
addGroupInputs();

// Helper function to create input fields
function createInput(type, name, placeholder) {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.placeholder = placeholder;
  input.classList.add('flex-grow', 'border', 'rounded-md', 'p-2');
  return input;
}

// Helper function to create select dropdowns
function createSelect(name, options) {
  const select = document.createElement('select');
  select.name = name;
  select.classList.add('flex-grow', 'border', 'rounded-md', 'p-2');
  options.forEach(optionValue => {
    const option = document.createElement('option');
    option.value = optionValue;
    option.textContent = optionValue.charAt(0).toUpperCase() + optionValue.slice(1);
    select.appendChild(option);
  });
  return select;
}

// Event listener to handle form submission
function submitHandler(){
  // Get all groups
  const groupContainers = document.querySelectorAll('.group-container');

  // Prepare an array to store group data
  const formDataArray = [];

  // Loop through each group
  groupContainers.forEach(groupContainer => {
    const formData = {};
    const groupFields = groupContainer.querySelectorAll('[name]');

    // Loop through each field in the group
    groupFields.forEach(field => {
      const value = field.value;
      if (!value) return
      const name = field.name.split('-')[0]; 
      formData[name] = value;
    });

    formDataArray.push(formData);
  });

  // Combine with other form fields
  const otherFormData = new FormData(form);
  const {url, type, query} = Object.fromEntries(otherFormData);

  // Combine group data with other form fields
  const finalFormData = { url, type, contents: formDataArray };
  if(typeInput.value==='multiple'){
    finalFormData.query = query;
  }

  // Handle form data submission as needed
  console.log(finalFormData);
  return finalFormData;
}
async function callcheerio(data){

  return await axios.post(apiUrl, data).then((response)=>response.data)
    .catch((e)=>{console.log(e); return null});
}
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = submitHandler();
  const result = await callcheerio(data);
  RESULT= result;
  jsontreeArea.innerHTML = ``;
  jsonTree.create(result, jsontreeArea);
  // console.log(result)
});

function duplicate(){
  navigator.clipboard.writeText(JSON.stringify(RESULT));
}
copyBtn.addEventListener('click', ()=>duplicate());

function downloadObjectAsJson(exportObj=RESULT, exportName="download"){
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".txt");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

downloadBtn.addEventListener('click', ()=>downloadObjectAsJson());