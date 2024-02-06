import express from'express';
import axios from "axios";
import cheerio from "cheerio";
import fetch from "node-fetch";
const router = express.Router();


let options = {
  // url: 'https://www.realmeye.com/forum/',
  headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
  }
};


router.post('/', async(req, res, next) => {
  const { type, query, url, contents } = req.body;
  let result ;
  const contentHandler = ($) => {
    const obj = {};
    contents.forEach(({ key, query: q, type: t }) => {
        const value = $?.(q)?.[t]?.() || null;
        obj[key] = value;
        if(!value) console.log(key, q,t)
    });
    return obj;
  }
  switch (type) {
    case "single":
      const $ = await cheerSingleHandler(url);
      const singoleResult = contentHandler($);
      result = singoleResult;
      break;
    case "multiple":
        result = [];
        const $arr = await cheerMultipleHandler(url, query);
        console.log($arr?.length)
        $arr.forEach($=>{
          const multipleOneResult = contentHandler($);
          result.push(multipleOneResult);
        });
      break;
    default: break;
  }
  res.send(result);
});

async function cheerSingleHandler(url) {
    // return await axios
    //   .get(url, /*{ headers }*/)
    //   .then((response) => {
    //     // 使用 Cheerio 加載網頁內容
    //     // console.log(response.data)
    //     const $ = cheerio.load(response.data);
    //     return $;
    //   })
    //   .catch((error) => {
    //     // console.error("發生錯誤:", error);
    //     console.error("發生錯誤:");
    //   });

    return await fetch(url)
    .then((response)=>response.text())
    .then((data)=> {
      const $ = cheerio.load(data)
      return $;
    })
}

async function cheerMultipleHandler(url, listquery){
  const urlList = 
  // await axios
  // .get(url)
  // .then((response) => {
  //   const $ = cheerio.load(response.data);
  //   const chapterList = $(listquery);

  //   let list = [];
  //   chapterList.each((index, element) => {
  //     const href = $(element).attr("href");
  //     list.push(href);
  //   });
  //   return list;
  // })
  // .catch((error) => {
  //   console.error("Error fetching data:", error);
  //   return [];
  //  });

   await fetch(url)
   .then((response)=>response.text())
   .then((data)=> {
     const $ = cheerio.load(data)
     const chapterList = $(listquery);
     let list = [];
    chapterList.each((index, element) => {
      const href = $(element).attr("href");
      list.push(href);
    });
    return list;
   })

  //  console.log(urlList)

  const result = [];
  const requests = urlList.map((url) =>{
    // 為什麼要換 fetch? 因為 axios 終究是他人的服務，一次 call 太多會 block ，服務Error 429 掛掉
    const newUrl = url?.includes('https:')?url: `https:${url}`;
    return fetch(newUrl).then(response => {
      return response.text()
    })
  });

  await Promise.all(requests)
  .then(
    (htmlContents) => {
    return htmlContents.forEach((content, index) => {
      if (content) {
          const $ = cheerio.load(content);
          result.push($);
      }  else {console.log(content)}
    });
  }

  )
  .catch((error) => {
      console.error(`Error fetching data from ${url}: ${error}`);
    });
  return result;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('cheer io test success');
});

export default router;
