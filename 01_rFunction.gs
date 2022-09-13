//■■■■ 変数 ■■■■
const sURL = 'https://ratio100.com';
const oURL = sURL + '/wp-json/wp/v2/posts/';
const vURL = sURL + '/wp-json/wp/v2/video/';
const cURL = sURL + '/wp-json/wp/v2/channel/';
const pURL = sURL + '/wp-json/wp/v2/pages/';
const rURL = sURL + '/wp-json/wp/v2/categories/';
const tURL = sURL + '/wp-json/wp/v2/tags/';

const apiKey = 'AIzaSyCMgNyHWJRWDrOZO9EWnL0LP0H_HJ-0gCM';
const authUser = 'syo-zid';
const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';

const rFile = SpreadsheetApp.openById('1RfQm5kCOdYX4cnjYXcfMPNB4KE0Z17tF32v9PHnBUak');
const fSheet = rFile.getSheetByName('F');
const cSheet = rFile.getSheetByName('wC');
const vSheet = rFile.getSheetByName(vCat);
const rSheet = rFile.getSheetByName('wR');
const tSheet = rFile.getSheetByName('wT');

const date = new Date(Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm'));
const tHour = date.getHours();
let ts = date.getTime() - (1000 * 60 * 60);
ts = new Date(ts);
const bHour = ts.getHours();

let List = [];
let Data = [];
let step = 0;
let eFlag = true;

function rFunction() {

  const done = vSheet.getRange('A1').getValue();
  switch (done) {

    case tHour: return console.log('実施済み')

    case bHour: //■■■■ doVideo ■■■■
      try {
        setFlag('f'+vCat);
        eFlag = false;
        doVideo();
      } catch(e) {
        console.log('【VIdeo】エラー内容：'+e.message+'\nステップ：'+step);
        if (!eFlag) { doHourly() }
        if (eFlag && step) { console.log('【Video-連続】エラー内容：'+e.message+'\nステップ：'+step) }
      } finally {
        deleteFlag('f'+vCat);
      }

    case 'R': //■■■■ doReset ■■■■
      try {
        setFlag('f'+vCat);
        step = 0;
        eFlag = false;
        doReset(vSheet);
      } catch(e) {
        if (!eFlag) { doReset(vSheet) }
        console.log('【Reset】エラー内容：'+e.message+'\n行：'+step);
        if (eFlag && step) { console.log('【Reset-連続】エラー内容：'+e.message+'\n行：'+step) }
      } finally {
        deleteFlag('f'+vCat);
      }

    case 'F': //■■■■ doFlash ■■■■
      try {
        setFlag('f'+vCat);
        doFlash();
      } catch(e) {
        console.log('【Flash】エラー内容：'+e.message);
      } finally {
        deleteFlag('f'+vCat);
      }
      return;

      //■■■■ updateChannel ■■■■

      //■■■■ updateVideo ■■■■

      //■■■■ createResult ■■■■
  }

  return console.log('エラー：switch')
}

//■■■■ 単発編集 ■■■■
  function editCategories() {

    let tData = getData(tSheet);
    tData = tData.filter(x => x[1]==='C')
    const len = tData.length;

    for (let i=0; i<len; i++) {
      const url = rURL + tData[i][2];
      let arg = {
        slug: tData[i][0],
        name: tData[i][5],
        description: tData[i][6],
        cf: { child: tData[i][4].split(',')}
      };
      if (tData[i][3] !== ''){ arg.parent = tData[i][3] }
      wpEdit(url, arg)
    }
  }

  function editTags() {

    let tData = getData(tSheet);
    tData = tData.filter(x => x[1]==='T')
    const len = tData.length;

    for (let i=0; i<len; i++) {
      const url = tURL + tData[i][2];
      let arg = {
        slug: tData[i][0],
        name: tData[i][5],
        description: tData[i][6],
      };
      wpEdit(url, arg)
    }
  }

  function deleteData() {
    const sheet = vSheet;
    const url = vURL;

    let src = getData(sheet);
    let id = [];

    src = src.filter(function(x){
      if (x[1]==='X') {
        id.push(x[3])
        return false;
      }
      else { return true }
    })
    const len = id.length
    if (!len) { return }

    sheet.clearContents();
    writeData(sheet, src);

    for (let i=0; i<len; i++) {
      wpDelete(url+id[i]);
    }
  }

//■■■■ WP関数 ■■■■
function wpView(url) {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Utilities.base64Encode(authUser + ":" + authPass)
  };
  const options = {
    'muteHttpExceptions': true,
    'headers': headers,
  };

  const resJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
  return resJson
}

function wpEmbed(url, arguments) {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Utilities.base64Encode(authUser + ":" + authPass)
  };
  const options = {
    'method': 'POST',
    'muteHttpExceptions': true,
    'headers': headers,
    'payload': JSON.stringify(arguments)
  };

  const resJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
  return resJson
}

function wpEdit(url, arguments) {

  const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Basic ' + Utilities.base64Encode(authUser + ":" + authPass)
  };
  const options = {
    'method': 'POST',
    'muteHttpExceptions': true,
    'headers': headers,
    'payload': JSON.stringify(arguments)
  };

  const resJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
  return resJson
}

function wpDelete(url) {

  const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Basic ' + Utilities.base64Encode(authUser + ":" + authPass)
  };
  const options = {
    'method': 'DELETE',
    'muteHttpExceptions': true,
    'headers': headers,
    'payload': JSON.stringify(arguments)
  };

  const resJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
  return resJson
}

//■■■■ SS関数 ■■■■
function getData(sheet) {

  const row = sheet.getLastRow();
  const col = sheet.getLastColumn();
  const src = sheet.getRange(1, 1, row, col).getValues();
  return src
}

function writeData(sheet, src) {

  sheet.getRange(1, 1, src.length, src[0].length).setValues(src);
}

function setFlag(flag) { rFile.insertSheet(flag) }

function deleteFlag(flag) { rFile.deleteSheet(rFile.getSheetByName(flag)) }

function deleteRows(sheet, src) {

  sheet.getRange(1, 1, src.length, src[0].length).setValues(src);
}

//■■■■ YT関数 ■■■■
function getPopular(nextPageToken) {

  const part = 'snippet,contentDetails,statistics';
  const vfields = 'items(id,snippet(title,description,publishedAt,thumbnails(medium(url)),tags,channelId,channelTitle),contentDetails(duration),statistics(viewCount,likeCount,commentCount)),nextPageToken';
  const options = {chart: 'mostPopular', regionCode: 'jp', videoCategoryId: vCat, maxResults: 50, fields: vfields, pageToken: nextPageToken};

  const resJson = YouTube.Videos.list(part, options);
  return resJson
}

function getChannel(cID, nextPageToken) {

  const part = 'snippet,statistics';
  const cfields = 'items(id,snippet(title,description,publishedAt,thumbnails(medium(url)),customUrl),statistics(viewCount,subscriberCount,videoCount)),nextPageToken';
  const options = {id: cID, fields: cfields, pageToken: nextPageToken};

  const resJson = YouTube.Channels.list(part, options);
  return resJson
}

function getActivities(cID, nextPageToken) {

  const part = 'id,snippet'
  const afields = 'items(id,snippet(title,description,publishedAt,thumbnails(medium(url))))';
  const options = {channelId: cID, fields: afields, maxResults: 10, pageToken: nextPageToken};

  const resJson = YouTube.Activities.list(part, options);
  return resJson
}

//■■■■ 文字列操作 ■■■■
  function strFromArr(arr) {
    if (typeof(arr)) { str = arr.join() }
    else if (typeof(arr)==='undefined') { str = '' }
    else { str = arr }
    return str
  }

  function strCount(str) {
    let cnt = 0;
    for (let i = 0; i < str.length; i++) {
        if (escape(str[i]).charAt(0) === "%") {
            if (escape(str[i]).charAt(1) === "u") {
              cnt++;
            }
        }
        cnt++;
    }
    return cnt;
  }

  function strSlice(str, len) {
    const sLen = str.length
    if (sLen*2 <= len) { return str }
    let cnt = 0;
    for (let i = 0; i < sLen-1; i++) {
      cnt = (escape(str[i]).charAt(0) === '%' && escape(str[i]).charAt(1) === 'u')? cnt+2: cnt+1;
      if (cnt === len*2-4) {
        if (escape(str[i+1]).charAt(0) === '%' && escape(str[i+1]).charAt(1) === 'u') {
          return str.slice(0, i+2)+'…';
        }
        else if (escape(str[i+2]).charAt(0) === '%' && escape(str[i+2]).charAt(1) === 'u') {
          return str.slice(0, i+2)+'…';
        }
        else { return str.slice(0, i+3)+'…' }
      }
      if (cnt === len*2-3) {
        if (escape(str[i+1]).charAt(0) === '%' && escape(str[i+1]).charAt(1) === 'u') {
          return str.slice(0, i+1)+'…';
        }
        else { return str.slice(0, i+2)+'…' }
      }
    }
    return str
  }

  function strView(num) {
    if (num >= 100000) { return String(Math.floor(num/10000)) }
    else { return String(Math.floor(num/1000)/10) }
  }

function doVideo() {

  //■■■■ 変数 ■■■■
  if (!eFlag) { List = getData(vSheet) }
  let rank = 0;
  let row = 0;
  let start = 1;

  const today = Utilities.formatDate(new Date(), 'Etc/GMT-4', 'yyyy-MM-dd');
  const tDay = new Date(today).getDay();
  const tDate = new Date(today).getDate();

  const lb_n = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:') + '00';
  ts = new Date(lb_n).getTime() - (1000 * 60 * 60);
  const lb_b = Utilities.formatDate(new Date(ts), 'JST', 'yyyy-MM-dd HH:') + '00';

  const ratio = [
    0.113,0.1,0.0995,0.099,0.0985,0.086,0.0855,0.085,0.0845,0.084,
    0.0705,0.07,0.0695,0.069,0.0685,0.068,0.0675,0.067,0.0665,0.066,
    0.0655,0.065,0.0645,0.0525,0.052,0.0515,0.051,0.0505,0.05,0.0495,
    0.049,0.0485,0.048,0.0475,0.047,0.0465,0.046,0.0455,0.045,0.0445,
    0.044,0.0435,0.043,0.0425,0.042,0.0415,0.041,0.0405,0.04,0.0395,
    0.0345,0.034,0.0335,0.033,0.0325,0.032,0.0315,0.031,0.0305,0.03,
    0.0295,0.029,0.0285,0.028,0.0275,0.027,0.0265,0.026,0.0255,0.025,
    0.0245,0.024,0.0235,0.023,0.0225,0.022,0.0215,0.021,0.0205,0.02,
    0.0195,0.019,0.0185,0.018,0.0175,0.017,0.0165,0.016,0.0155,0.015,
    0.0145,0.014,0.0135,0.013,0.0125,0.012,0.0115,0.011,0.0105,0.01
  ];

  const cat = [,
    '映画とアニメ','自動車と乗り物',,,,,,,,'音楽',
    ,,,,'ペットと動物',,'スポーツ',,,'ゲーム',
    ,'ブログ','お笑い','エンタメ','ニュースと政治','ハウツーとスタイル',,'科学と技術',
  ]

  //■■■■ BS_C ■■■■
  function CbsMin(col, target, from, to) {
    while (from <= to) {
      const middle = from + Math.floor((to - from) / 2);
      if (cList[middle][col] < target) {
        from = middle + 1;
      } else {
        to = middle - 1;
      }
    }
    return from;
  }

  function CbsMax(col, target, from, to) {
    while (from !== to) {
      const middle = from + Math.ceil((to - from) / 2);
      if (cList[middle][col] > target) {
        to = middle - 1;
      } else {
        from = middle;
      }
    }
    if (cList[from][col] === target) {
      return from;
    } else {
      return 0;
    }
  }

  function CbsRange(col, target) {
    const from = CbsMin(col, target, 0, cList.length - 1);
    const to = CbsMax(col, target, from, cList.length - 1);
    return { from: from, to: to };
  }

  //■■■■ BS_V ■■■■
  function VbsMin(col, target, from, to) {
    while (from <= to) {
      const middle = from + Math.floor((to - from) / 2);
      if (List[middle][col] < target) {
        from = middle + 1;
      } else {
        to = middle - 1;
      }
    }
    return from;
  }

  function VbsMax(col, target, from, to) {
    while (from !== to) {
      const middle = from + Math.ceil((to - from) / 2);
      if (List[middle][col] > target) {
        to = middle - 1;
      } else {
        from = middle;
      }
    }
    if (List[from][col] === target) {
      return from;
    } else {
      return 0;
    }
  }

  function VbsRange(col, target) {
    const from = VbsMin(col, target, 0, List.length - 1);
    const to = VbsMax(col, target, from, List.length - 1);
    return { from: from, to: to };
  }

  //■■■■ convertTime ■■■■
  function convertTime(duration) {

    if (duration === '' || duration === 'P0D' || duration.slice(0,2) === 'P1') { return }
    var reg = new RegExp('^PT([0-9]*H)?([0-9]*M)?([0-9]*S)?');
    var regResult = duration.match(reg);

    var hour = regResult[1];
    var minutes = regResult[2];
    var sec = regResult[3];

    if(hour == undefined) {hour = '00';}
    else {
      hour = hour.split('H')[0];
      if(hour.length == 1){hour = '0' + hour;}
    }

    if(minutes == undefined) {minutes = '00';}
    else {
      minutes = minutes.split('M')[0];
      if(minutes.length == 1){minutes = '0' + minutes;}
    }

    if(sec == undefined) {sec = '00';}
    else {
      sec = sec.split('S')[0];
      if(sec.length == 1){sec = '0' + sec;}
    }

    return hour + ":" + minutes + ":" + sec
  }

  function vReset() {
    List = List.map(function(x){
      if (x[1]===bHour) {x[1] = 'R'}
      return x
    });
    writeData(vSheet, List);
  }

  function vSetData(json) {
    json.items.forEach((j) => {
      const src = [j.id, j, ++rank];
      Data.push(src);
    });
  }

  function vArguments(i) {
    const wpJ = (row) ? wpView(vURL+List[row][3]): {};
    const ytJ = Data[i][1];

    //■■■■ 各種項目 ■■■■
    function vTitle(str) {
      return 'YouTubeチャンネル[' + strSlice(str, 7) + ']の動画が急上昇⤴'
    }

    function vContent(i) {
      return ''
    }

    function vExcerpt(i) {
      return '【視聴数' + strView(ytJ.statistics.viewCount) + '万|' + cat[vCat] + '#' + Data[i][2] + '位】YouTube急上昇ランキングを集計！"' + ytJ.snippet.channelTitle + '"のバズり動画⇒' + ytJ.snippet.title
    }

    let a = {};
    if (row) {
      a = {
        slug: 'v-'+List[row][3],
//        status: 'private',
        title: vTitle(ytJ.snippet.channelTitle),
//        content: vContent(i),
        excerpt: vExcerpt(i),
//        featured_media: 0,
        cf: {
          name: ytJ.snippet.title,
          desc: ytJ.snippet.description,
          thmb: ytJ.snippet.thumbnails.medium.url,
          lb_n: lb_n,
          lb24: wpJ.cf.lb24.concat(lb_n),
          rn_n: Data[i][2],
          rn24: wpJ.cf.rn24.concat(Data[i][2]),
          rt_n: Number(wpJ.cf.rt_n) + ratio[Data[i][2]],
          rt24: wpJ.cf.rt24.concat(Number(wpJ.cf.rt_n) + ratio[Data[i][2]]),
          vw_n: ytJ.statistics.viewCount,
          vw24: wpJ.cf.vw24.concat(ytJ.statistics.viewCount),
          lk_n: ytJ.statistics.likeCount,
          lk24: wpJ.cf.lk24.concat(ytJ.statistics.likeCount),
          cm_n: ytJ.statistics.commentCount,
          cm24: wpJ.cf.cm24.concat(ytJ.statistics.commentCount),
        }
      }
      if (a.cf.rn_n <= wpJ.rn_n) {
        a.cf.rn_b = a.cf.rn_n;
        a.cf.rn_d = lb_n;
        a.tags = wpJ.tags.filter(x => x > 300).concat(a.cf.rn_n+100, a.cf.rn_n+200);
      } else {
        a.tags = wpJ.tags.filter(x => x > 200).concat(a.cf.rn_n+100);
      }
      if (wpJ.cf.pd_l === lb_b) {
        a.cf.pd_n = wpJ.pd_n + 1;
        a.cf.pd_l = lb_n;
      } else {
        a.cf.pd_n = 0;
        a.cf.pd_f = lb_n;
        a.cf.pd_l = lb_n;
      }
      if (a.cf.pd_n >= a.cf.pd_b) {
        a.cf.pd_b = a.cf.pd_n;
        a.cf.pd_s = wpJ.pd_f;
        a.cf.pd_e = lb_n;
      }
      if (wpJ.cf.lb7[wpJ.cf.lb7.length-1] !== today &&  tDay === 1) {
        a.cf.lb7 = wpJ.cf.lb7.concat(today);
        a.cf.rn7 = wpJ.cf.rn7.concat(a.cf.rn_n);
        a.cf.rt7 = wpJ.cf.rt7.concat(a.cf.rt_n);
        a.cf.vw7 = wpJ.cf.vw7.concat(a.cf.vw_n);
        a.cf.lk7 = wpJ.cf.lk7.concat(a.cf.lk_n);
        a.cf.cm7 = wpJ.cf.cm7.concat(a.cf.cm_n)
      } else {
        a.cf.lb7 = wpJ.cf.lb7.slice(0,-1).concat(today);
        a.cf.rn7 = wpJ.cf.rn7.slice(0,-1).concat(a.cf.rn_n);
        a.cf.rt7 = wpJ.cf.rt7.slice(0,-1).concat(a.cf.rt_n);
        a.cf.vw7 = wpJ.cf.vw7.slice(0,-1).concat(a.cf.vw_n);
        a.cf.lk7 = wpJ.cf.lk7.slice(0,-1).concat(a.cf.lk_n);
        a.cf.cm7 = wpJ.cf.cm7.slice(0,-1).concat(a.cf.cm_n)
      }
      if (wpJ.cf.lb12[wpJ.cf.lb12.length-1] !== today &&  tDate === 1) {
        a.cf.lb12 = wpJ.cf.lb12.concat(today);
        a.cf.rn12 = wpJ.cf.rn12.concat(a.cf.rn_n);
        a.cf.rt12 = wpJ.cf.rt12.concat(a.cf.rt_n);
        a.cf.vw12 = wpJ.cf.vw12.concat(a.cf.vw_n);
        a.cf.lk12 = wpJ.cf.lk12.concat(a.cf.lk_n);
        a.cf.cm12 = wpJ.cf.cm12.concat(a.cf.cm_n)
      } else {
        a.cf.lb12 = wpJ.cf.lb12.slice(0,-1).concat(today);
        a.cf.rn12 = wpJ.cf.rn12.slice(0,-1).concat(a.cf.rn_n);
        a.cf.rt12 = wpJ.cf.rt12.slice(0,-1).concat(a.cf.rt_n);
        a.cf.vw12 = wpJ.cf.vw12.slice(0,-1).concat(a.cf.vw_n);
        a.cf.lk12 = wpJ.cf.lk12.slice(0,-1).concat(a.cf.lk_n);
        a.cf.cm12 = wpJ.cf.cm12.slice(0,-1).concat(a.cf.cm_n)
      }
    } else {
      a = {
        date: Utilities.formatDate(new Date(ytJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'),
        slug: 'v-'+ytJ.statistics.viewCount,
        status: 'private',
        title: vTitle(ytJ.snippet.channelTitle),
        content: vContent(i),
        excerpt: vExcerpt(i),
        featured_media: 0,
        categories: [vCat],
        tags: [Data[i][2]+100, Data[i][2]+200],
        cf: {
          name: ytJ.snippet.title,
          desc: ytJ.snippet.description,
          link: 'https://youtube.com/watch?v='+ytJ.id,
          thmb: ytJ.snippet.thumbnails.medium.url,
          dur: convertTime(ytJ.contentDetails.duration),
          yt: ytJ.id,
          channel: ytJ.snippet.channelId,
          rn_b: Data[i][2],
          rn_d: lb_n,
          pd_b: 0,
          pd_s: lb_n,
          pd_e: lb_n,
          lb_n: lb_n,
          lb24: [lb_n],
          lb7: [today],
          lb12: [today],
          pd_n: 0,
          pd_f: lb_n,
          pd_l: lb_n,
          rn_n: Data[i][2],
          rn24: [Data[i][2]],
          rn7: [Data[i][2]],
          rn12: [Data[i][2]],
          rt_n: ratio[Data[i][2]],
          rt24: [ratio[Data[i][2]]],
          rt7: [ratio[Data[i][2]]],
          rt12: [ratio[Data[i][2]]],
          vw_n: ytJ.statistics.viewCount,
          vw24: [ytJ.statistics.viewCount],
          vw7: [ytJ.statistics.viewCount],
          vw12: [ytJ.statistics.viewCount],
          lk_n: ytJ.statistics.likeCount,
          lk24: [ytJ.statistics.likeCount],
          lk7: [ytJ.statistics.likeCount],
          lk12: [ytJ.statistics.likeCount],
          cm_n: ytJ.statistics.commentCount,
          cm24: [ytJ.statistics.commentCount],
          cm7: [ytJ.statistics.commentCount],
          cm12: [ytJ.statistics.commentCount]
        }
      }
    }
    return a
  }

  function vUpdate(json) {
    return [today, json.cf.rn_n, json.cf.yt, json.id, json.cf.channel]
  }

  function vPost() {

    for (let i=step; i<DataL; i++) {
      row = (ListL) ? VbsMax(2, Data[i][0], start, ListL): 0;
      if (row) {
        const url = vURL + List[row][3];
        const vJson = wpEdit(url, vArguments(i));
        List[row] = vUpdate(vJson);
      }
      else {
        const url = vURL;
        const vJson = wpEmbed(url, vArguments(i));
        row = VbsMin(2, Data[i][0], start, ListL++);
        List.splice(row, 0, vUpdate(vJson));
      }
      start = (row<ListL) ? row + 1: row;
      step++;
      eFlag = false;
    }
  }

  //■■■■ 処理開始 ■■■■
  if (!eFlag) {
    vReset();
    const vJson1 = getPopular();
    const vJson2 = (typeof(vJson1.nextPageToken)==='undefined') ? {}: getPopular(vJson1.nextPageToken);
    vSetData(vJson1);
    vSetData(vJson2);
    Data = Data.sort((a, b) => (a > b)? 1: -1);
  }

  const DataL = Data.length;
  let ListL = List.length - 1;

  vPost(step);
  writeData(vSheet, List);
  vSheet.getRange('A1').setValue('R');
}

function doReset(sheet) {
  List = getData(sheet);
  const ListL = List.length;
  const url = (sheet === vSheet)? vURL: cURL;

  for (let i=step; i<ListL; i++) {
    if (List[i][1]==='R') {
      const tags = wpView(url+List[i][3]).tags.filter(x => x > 300);
      const arg = { tags: tags };
      wpEdit(url+List[i][3], arg);
      List[i][1] = 'D';
      step++;
      eFlag = false;
    }
  }
  writeData(sheet, List)
  sheet.getRange('A1').setValue((sheet === vSheet)? 'F': tHour);
}

function doFlash() {
  Data = getData(vSheet);
  Data = Data.filter(x => typeof(x[1]) === 'number').sort((a, b) => (a[1] > b[1])? 1: -1).map(x => x[3]);
  arg = { child: Data }
  wpEdit(oURL+vCat, arg);
  vSheet.getRange('A1').setValue(tHour);
}

function doChannel() {

}