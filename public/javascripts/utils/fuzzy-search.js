// export function multipleSearch(datas, keyword){
//   let inputarr = keyword
// 	.replace(/[\,\s\/\\]/g, '/')
//   .split('/')
//   .map(w=> w.replace(/\W/g, ''))
//   .filter(w => w);
  
//   const setArr = new Set();
//   inputarr.forEach(value => {
//     datasSearch(datas, value)
//     .forEach(result => setArr.add(result) );
//   });
//   return Array.from(setArr); 
// }

export function datasSearch( datas , keyword = '') {
// const removeWord = new RegExp('\W', 'g');
// keyword = Array.from(keyword.toString()).map(item => item.replace(removeWord, `\\${item}`)).join('').trim();
  
// keyword
const regExp = new RegExp(`${keyword}`, 'ig');

const returnData = datas.filter((data) => {
  let ifindIt = false;

  
  const checkObjKey = (kaka) => {
    for(const key in data){
      // if is an obj { } re-call function
      if (  typeof kaka[key] === 'object' && kaka[key] !== null) {
        checkObjKey(kaka[key]);
      } else { // if is not an obj{ } do below
  
        if (!Array.isArray(kaka[key])) { // 如果不是陣列
          if (kaka[key] && kaka[key].toString().match(regExp)) {
            ifindIt = true;
          } else { ifindIt = false; }
        } else { // if is an array
          kaka.forEach(item => {checkObjKey(item); });
        }
  
      }
      if (ifindIt) {  return; }
    }
  };

  checkObjKey(data);
  return ifindIt ? data : false;
});
return returnData;
}