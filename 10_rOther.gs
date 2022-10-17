function fOther() {

  //editCategories();
  //editTags()

  //const vFile = SpreadsheetApp.openById(fID[vCat]);
  //const vSheet = vFile.getSheetByName('wV');
  //const cFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
  //const cSheet = cFile.getSheetByName('wC');;
  //deleteData(sheet, url);
}

//■■■■ 変数 ■■■■
const apiKey = 'AIzaSyBWiGrLeScNunJ1mY5QBACE4zrYGwZpO1E';
const rFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
const fSheet = rFile.getSheetByName('F');
const tSheet = rFile.getSheetByName('T');
const pSheet = rFile.getSheetByName('P');

const cNo = [1,2,10,15,17,20,22,23,24,25,26,28];
const cName = [
  '映画とアニメ',
  '自動車と乗り物',
  '音楽',
  'ペットと動物',
  'スポーツ',
  'ゲーム',
  'ブログ',
  'お笑い',
  'エンタメ',
  'ニュースと政治',
  'ハウツーとスタイル',
  '科学と技術'
];

const sURL = 'https://ratio100.com';
const vURL = sURL + '/wp-json/ratio-zid/zid/video/';
const cURL = sURL + '/wp-json/ratio-zid/zid/channel/';
const oURL = sURL + '/wp-json/wp/v2/posts/';
const pURL = sURL + '/wp-json/wp/v2/pages/';
const rURL = sURL + '/wp-json/wp/v2/categories/';
const tURL = sURL + '/wp-json/wp/v2/tags/';

const authUser = 'syo-zid';
const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';

const rCol = {jp:2};

//■■■■ SS関数 ■■■■
function ssData(sheet) {
  const sRow = sheet.getLastRow();
  const sCol = sheet.getLastColumn();
  return sheet.getRange(1, 1, sRow, sCol).getValues();
}
function ssWrite(sheet, src) {
  sheet.getRange(1, 1, src.length, src[0].length).setValues(src);
}
function ssStart(flag) { rFile.insertSheet(flag) }
function ssEnd(flag) { rFile.deleteSheet(rFile.getSheetByName(flag)) }

//■■■■ YT関数 ■■■■
function ytPopular(nextPageToken) {

  const part = 'snippet,contentDetails,statistics';
  const vfields = 'items(id,snippet(title,description,publishedAt,thumbnails(medium(url),default(url)),tags,channelId,channelTitle),contentDetails(duration),statistics(viewCount,likeCount,commentCount)),nextPageToken';
  const filter = '?part='+part+'&chart=mostPopular&regionCode='+rc+'&maxResults=50&videoCategoryId='+cat+'&fields='+vfields+'&key='+apiKey;
  const token = (nextPageToken)? '&pageToken='+nextPageToken: '';

  const url = 'https://youtube.googleapis.com/youtube/v3/videos' + filter + token;

  const options = {"muteHttpExceptions" : true,};
  const resJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());

  return resJson
}

function ytVideo(id) {

  const part = 'snippet,contentDetails,statistics';
  const vfields = 'items(id,snippet(title,description,publishedAt,thumbnails(medium(url),default(url)),tags,channelId,channelTitle),contentDetails(duration),statistics(viewCount,likeCount,commentCount))';
  const filter = '?part='+part+'&id='+id+'&maxResults=50&fields='+vfields+'&key='+apiKey;

  const url = 'https://youtube.googleapis.com/youtube/v3/videos' + filter;

  const options = {"muteHttpExceptions" : true,};
  const resJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());

  return resJson
}

function ytChannel(id) {

  const part = 'snippet,statistics';
  const cfields = 'items(id,snippet(title,description,publishedAt,thumbnails(medium(url),default(url)),customUrl),statistics(viewCount,subscriberCount,videoCount))';
  const filter = '?part='+part+'&id='+id+'&maxResults=50&fields='+cfields+'&key='+apiKey;

  const url = 'https://youtube.googleapis.com/youtube/v3/channels' + filter;

  const options = {"muteHttpExceptions" : true,};
  const resJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());

  return resJson
}

function ytActivities(id) {

  const aPart = 'contentDetails';
  const aFields = 'items(contentDetails(upload(videoId)))';
  const aFilter = '?part='+aPart+'&channelId='+id+'&maxResults=50&fields='+aFields+'&key='+apiKey;
  let url = 'https://youtube.googleapis.com/youtube/v3/activities' + aFilter;
  const options = {"muteHttpExceptions" : true,};
  const aJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());

  let vID = [];
  aJson.items.forEach(x => {
    if (x.contentDetails.upload !== undefined && x.contentDetails.upload.videoId !== undefined) {
        vID.push(x.contentDetails.upload.videoId)
    }
  });
  vID = vID.join();

  const resJson = ytVideo(vID);

  return resJson
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

function wpAPI(url, arguments) {

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

//■■■■ 編集用関数 ■■■■

function editCategories() {

  let tData = ssData(tSheet);
  tData = tData.filter(x => x[1]==='C')
  const len = tData.length;

  for (let i=0; i<len; i++) {
    const url = rURL + tData[i][2];
    let arg = {
      slug: tData[i][0],
      name: tData[i][5],
      description: tData[i][6]
    };
    if (tData[i][3] !== ''){ arg.parent = tData[i][3] }
    wpEdit(url, arg)
  }
}
rt_ah
function editTags() {

  let tData = ssData(tSheet);
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

function editPost() {

  let pData = ssData(pSheet);
  let wArg = [...Array(pData.length-1)].map(()=>({id:0}));
  for (let i=0; i<pData.length-1; i++) {
    for (let j=0; j<pData[0].length; j++) {
      if (pData[0][j]==='date') {
        wArg[i][pData[0][j]] = Utilities.formatDate(new Date(pData[i+1][j]),'JST','yyyy-MM-dd HH:mm:ss');
      } else if (pData[0][j]==='meta') {
        wArg[i][pData[0][j]] = [];
      } else {wArg[i][pData[0][j]] = pData[i+1][j];}
    }
  }

  let res = {message:{}};
  for (let i=0; i<wArg.length; i++) {
    const url = ((wArg[i]['type']==='post')? oURL: pURL) + wArg[i]['id'];
    const r = wpEdit(url, wArg[i]);
    res.message[wArg[i]['id']] = ('messsage' in r)? r.message: '200';
    res[wArg[i]['id']] = r;
  }
  console.log(res.message);
  return res
}