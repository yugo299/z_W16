//■■■■ 変数 ■■■■
const sURL = 'https://ratio100.com';
const cURL = sURL + '/wp-json/wp/v2/channel/';

const authUser = 'syo-zid';
const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';

//■■■■ ファイルID ■■■■
const cNo = [1,2,10,15,17,20,22,23,24,25,26,28];
const fID = ['1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4',
  '1Jgg1ISdFbD6L-Wnms-agEJeNfmWVcj98Qcx-SakJ0TI', '10rDUtAcuqA7X2QAnXxwmKZ8UKhpwYY4Ex171gB_w-LM',,,,,,,, '1XGTWfktIBwiGZ7ORnsOG_eP5WYiRZQmBT8_-0AIvcEI',
  ,,,, '1svOoIcvFaQConiFQAsrYNzNbplk_ZyBPhESu-2Vspaw',, '1oCBfZ_dmYhlsT7WQr7XeHSGfeHjfG2ryfBYhor1mrvI',,, '1ktpsp4VchGcuMZKLOfC-KPU5O6hSy-oQxa99Yi4cvKE',
  , '1WCbGiSilCue5PCJ8gqfJqagTrOvDKNAlBeAFcwJw1OI', '1_u4rBFd9b8E_8ZGTshlRM324hAuEcmbMUDGDLpsWBSs', '10ef4mrSCp4DeEBu2Sx2BjTyEcI7HLGc3iEOcqoYoUPw', '1lP3VcCsM1xb7it7Z4rI2jIK4cd5ZMaDE83xdag3ixMw', '1rCmCefSyw6FWhsyKQrOoW3uk5v4h-1Sb8rTHU4nrDZM',, '1uq0Xxln0r-z2OWDxuKZCoQzK6VnYK8Eoeff84NViLfo',,
];

const date = new Date(Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm'));
const tHour = date.getHours();
let ts = date.getTime() - (1000 * 60 * 60);
ts = new Date(ts);
const bHour = ts.getHours();
const tMinute = ts.getMinutes();

//const vFile = SpreadsheetApp.openById(fID[vCat]);
//const vSheet = vFile.getSheetByName('wV');

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

function setFlag(vCat, flag) {
  const vFile = SpreadsheetApp.openById(fID[vCat]);
  const vSheet = vFile.getSheetByName('wV');
  vFile.insertSheet(flag);
}

function deleteFlag(vCat, flag) {
  const vFile = SpreadsheetApp.openById(fID[vCat]);
  const vSheet = vFile.getSheetByName('wV');
  vFile.deleteSheet(vFile.getSheetByName(flag));
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

function fActivities() {

  //■■■■ 変数 ■■■■
  const today = Utilities.formatDate(new Date(), 'Etc/GMT-4', 'yyyy-MM-dd');
  const tDay = new Date(today).getDay();

  let cData = [];
  let yID = [];
  let yData = [];
  let aData = [];
  let cL = 0;
  let yL = 0;
  let aL = 0;
  let err = {};

  //■■■■ 実施判定 ■■■■
  if (tDay===1 || tMinute<20) { return console.log('実施不要：月曜日or時間帯') }

  function getActivities(cID) {

    const aPart = 'contentDetails';
    const aFields = 'items(contentDetails(upload(videoId)))';
    const aFilter = '?part='+aPart+'&channelId='+cID+'&maxResults=50&fields='+aFields+'&key='+apiKey;
    let url = 'https://youtube.googleapis.com/youtube/v3/activities' + aFilter;
    const options = {"muteHttpExceptions" : true,};
    const aJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());

    let vID = [];
    aJson.items.forEach(x => {
      if (x.contentDetails.upload !== undefined) {
        if (x.contentDetails.upload.videoId !== undefined) {
          vID.push(x.contentDetails.upload.videoId)
        }
      }
    });
    vID = vID.join();

    const vPart = 'snippet,contentDetails,statistics';
    const vFields = 'items(id,snippet(title,description,publishedAt,thumbnails(medium(url)),tags,channelId,channelTitle),contentDetails(duration),statistics(viewCount,likeCount,commentCount)),nextPageToken';
    const vFilter = '?part='+vPart+'&maxResults=50&id='+vID+'&fields='+vFields+'&key='+apiKey;

    url = 'https://youtube.googleapis.com/youtube/v3/videos' + vFilter;

    const vJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());

    return vJson
  }

  function vArguments(i) {

    //■■■■ 変数 ■■■■
    const yJson = yData[i][1];
    let arr = [];

    function convertTime(duration) {

      if (duration === '' || duration.slice(0,2) !== 'PT') { return }
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

    function textToLink(str) {
      const regexp_url = /(https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-\@]+)/g;
      str = str.replace(regexp_url, '<a class="external" href="$1" target="_blank" rel="noreferrer"></a> ');
      return str
    }

    if (yJson.items===undefined) { return [] }

    yJson.items.forEach((yJ) => {
      const a = {
        name: yJ.snippet.title,
        date: Utilities.formatDate(new Date(yJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'),
        desc: textToLink(yJ.snippet.description),
        link: 'https://youtu.be/'+yJ.id,
        thmb: yJ.snippet.thumbnails.medium.url,
        dur: convertTime(yJ.contentDetails.duration),
        yt: yJ.id,
        yt_t: yJ.snippet.tags,
        ch_i: yData[i][0],
        ch_y: yJ.snippet.channelId,
        ch_n: yJ.snippet.channelTitle,
        vw_n: yJ.statistics.viewCount,
        lk_n: yJ.statistics.likeCount,
        cm_n: yJ.statistics.commentCount
      }
      arr.push(a);
    })

    const arg = {
      content: JSON.stringify(arr),
      tags: yData[i][2].filter(x => x > 100).concat(tDay+60)
    }

    return [[yData[i][0], arg]]
  }

  let filter = '?per_page=20&tags_exclude=';
  switch (tDay) {
    case 0: filter += '62+64+66+60'; break
    case 2: filter += '60+63+65+62'; break
    case 3: filter += '62+64+66+63'; break
    case 4: filter += '60+63+65+64'; break
    case 5: filter += '62+64+66+65'; break
    case 6: filter += '60+63+65+66'; break
  }

  do { //WPチャンネル情報取得
    err = {};

    try {
      cData = wpView(cURL+filter);
      cL = cData.length;
      if (!cL) { return console.log('実施不要：対象０件') }

      yID = [];
      for (let i=0; i<cL; i++) { yID.push([cData[i].id, cData[i].cf.yt, cData[i].tags]) }
      yL = yID.length;

      console.log('cData : ' + cL + '\nyID : ' + yL);
    } catch (e) {
      console.log('WPチャンネル情報取得\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //getActivities
    err = {};

    try {
      yData = Array(yL);
      for (let i=0; i<yL; i++) { yData[i] = [yID[i][0], getActivities(yID[i][1]), yID[i][2]] }
      yL = yData.length;

      console.log('getActivities yData : ' + yL);
    } catch (e) {
      console.log('getActivities\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //Arg
    err = {};
    try {
      aData = [];
      for (let i=0; i<yL; i++) { aData = aData.concat(vArguments(i)) }
      aL = aData.length;
      console.log('Arg vData : ' + aL);
    } catch (e) {
      console.log('Arg\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //Post
    err = {};
    try {
      for (let i=0; i<aL; i++) { wpEdit(cURL+aData[i][0], aData[i][1]) }
      console.log('Post : ' + aL + '\n' + aData.map(x =>x[0]).join());
    } catch (e) {
      console.log('Post\n' + e.message);
      err = e;
    }
  } while (!'message' in err);
}

function fLink() {

  //フラグ取得
  const cFile = SpreadsheetApp.openById(fID[0]);
  const fSheet = cFile.getSheetByName('F');
  let done = getData(fSheet);
  for (let i=1; i<13; i++) {
    if (done[i][1]==='Done') { done[i][1] = 'Finish' }
    else if (done[i][1]==='Finish') { return console.log('実行済み : fLink') }
    else { return console.log('実行不要 : fLink') }
  }

  //■■■■ BS ■■■■
  function bsMin(col, target, from, to) {
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

  function bsMax(col, target, from, to) {
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

  //■■■■ 変数 ■■■■
  let vList = Array(30);
  const cSheet = cFile.getSheetByName('wC');
  const cList = getData(cSheet);
  const cL = cList.length;

  function fEachSheet(i) {
    const sheet = SpreadsheetApp.openById(fID[cNo[i]]).getSheetByName('wV');
    const List = getData(sheet);
    const lL = List.length;
    for (let j=1; j<lL; j++) {
      if (List[j][5] !== '') { continue }
      row = bsMax(2, List[j][4], 1, cL-1);
      if (row) { List[j][5] = cList[row][3] }
      else { console.log('エラー : 該当なし\n動画 : '+List[j][3]+'\nチャンネル : '+List[j][4]) }
    }
    vList[cNo[i]] = List;
  }

  for (let i=0; i<cNo.length; i++) { fEachSheet(i) }

  for (let i=0; i<cNo.length; i++) {
    const sheet = SpreadsheetApp.openById(fID[cNo[i]]).getSheetByName('wV');
    writeData(sheet, vList[cNo[i]]);
    console.log('チャンネル投稿ID更新完了 : '+cNo[i]);
  }

  writeData(fSheet, done);
  console.log('完了 : fLink')
}