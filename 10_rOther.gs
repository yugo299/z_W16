function fOther() {

  //let a = {status:'future',date:'2022-10-20T16:00:00'}
  //let a = {video_y: {idddd:'QNqD-vWkea0'}}
  //let id = 'UCzy1nQFnKpacpu1E3uRMMVw';

  let r = wpAPI(pURL+11);
  //r.unshift(['id','rc','cat','flag','rn','num']);
  //ssWrite(xSheet,r);

  //msSubmit()
  //editCategories();
  //editTags()
  //rDate('jp');
  //ytVideo();
  //ytChannel();
  //ytActivities();
  //ytPopular();
  //wpScreenshot();
  //r = wpImage();

  //r = ytChannel(id)

  console.log(r);
}

//■■■■ 変数 ■■■■
const apiKey = 'AIzaSyBWiGrLeScNunJ1mY5QBACE4zrYGwZpO1E';
const msKey = 'cb4064ed957644f485ca6ebe1ec96ce5';
const gglKey = '768432540662-e3ojid05lncv56houo6bvimmhhckq6ut.apps.googleusercontent.com';
const rFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
const fSheet = rFile.getSheetByName('F');
const tSheet = rFile.getSheetByName('T');
const pSheet = rFile.getSheetByName('P');
const tFile = SpreadsheetApp.openById('1lsmIYC2KOgEPgBDB6n9ADwWCyTH1dec1C_dmiZL7reQ');
const xSheet = tFile.getSheetByName('X');
const ySheet = tFile.getSheetByName('Y');
const zSheet = tFile.getSheetByName('Z');

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
const cSlug = [
  'movie-anime',
  'car-bike-train',
  'music',
  'pets-animals',
  'sports',
  'game',
  'blog',
  'comedy',
  'entame',
  'news-politics',
  'howto-style',
  'science-tech'
];

const sURL = 'https://ratio100.com';
const aURL = sURL + '/wp-json/ratio-zid/zid/a/';
const iURL = sURL + '/wp-json/ratio-zid/zid/image';
const vURL = sURL + '/wp-json/ratio-zid/zid/video/';
const cURL = sURL + '/wp-json/ratio-zid/zid/channel/';
const oURL = sURL + '/wp-json/wp/v2/posts/';
const pURL = sURL + '/wp-json/wp/v2/pages/';
const rURL = sURL + '/wp-json/wp/v2/categories/';
const tURL = sURL + '/wp-json/wp/v2/tags/';
const zURL = sURL + '/wp-json/ratio-zid/zzz/';

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
function ytPopular(rc, cat, nextPageToken) {

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

function wpImage() {
  const x = 7;
  let meta = null;
  const dNo = [11,12,13,14];
  const dName = ['朝','昼','夕方','夜'];
  const dSlug = ['morning','afternoon','evening','night'];
  const date = '2022-10-25 00:00:00';
  const text = 'YouTube急上昇ランキング:';
  let wA = {zr_posts:[],zr_postmeta:[]};
  let a = {};

  for (let i=0; i<dNo.length; i++) {

    const id = (100*(x%11)) + dNo[i];
    const slug = dSlug[i]+'-'+x;

    a = {
      ID: id,
      post_author: 1,
      post_date: date,
      post_date_gmt: date,
      post_content: 'レシオ！ - '+text+dName[i],
      post_title: slug,
      post_excerpt: 'レシオ！ - '+text+dName[i],
      post_status: 'inherit',
      comment_status: 'open',
      ping_status: 'closed',
      post_name: slug,
      post_modified: date,
      post_modified_gmt: date,
      guid: 'https://ratio100.com/img/'+slug+'.jpg',
      post_type: 'attachment',
      post_mime_type: 'image/jpeg'
    };
    wA.zr_posts.push(a);

    a = {
      meta_id: meta++,
      post_id: id,
      meta_key: '_wp_attached_file',
      meta_value: slug+'.jpg'
    }
    wA.zr_postmeta.push(a);
  }
  return wpAPI(vURL, wA);
}

function wpPage() {

  function pArguments(id, slug) {
    a = {
      ID: id,
      post_author: 1,
      post_date: date,
      post_content: '',
      post_title: id,
      post_excerpt: '',
      post_status: 'private',
      comment_status: 'open',
      ping_status: 'open',
      post_name: slug,
      post_parent: parent,
      menu_order: (Number(slug)<70)? Number(slug)+100: Number(slug),
      post_type: 'page',
    };
    wA.zr_posts.push(a);
  }

  let y = new Date().getFullYear() - 2000;
  const e = y + 2;
  const date = '20' + e + '/10/10 00:00'

  let ts = new Date('20' + y + '/12/31 12:00');
  let m = 0;
  let d = 0;
  let w = 0;

  let wA = {zr_posts:[]};

  const s = 50;
  let slug = y + 1;
  let id = Number(slug+'00'+s);
  let parent = 4;
  pArguments(id, slug);

  while (y < e) {
    ts.setDate(ts.getDate() + 1);
    y = ts.getFullYear() - 2000;
    if (y === e) { break; }

    if (m < ts.getMonth()+1) {
      w = 0;
      m = ts.getMonth()+1;
      slug = (m < 10)? ('0'+m): String(m);
      id = Number(y+slug)+s;
      parent = y+'00'+s;
      pArguments(id, slug);
      parent = id;
    };
    d = ts.getDate();

    if (ts.getDay()===0) {
      slug = String(70 + (++w));
      id = Number(y + ((m<10)? ('0'+m): String(m)) + slug) + s;
      pArguments(id, slug);
    }

    slug = (d < 10)? ('0'+d): String(d);
    id = Number(y + ((m<10)? ('0'+m): String(m)) + slug) + s;
    pArguments(id, slug);
  }
  console.log(wpAPI(vURL, wA));
}

//■■■■ MS関数 ■■■■
function msSubmit(list) {

  const arguments = {siteUrl: sURL, urlList: list}
  const url = 'https://www.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=' + msKey;
  const headers = {
    'Content-Type': 'application/json',
    };
  const options = {
    'method': 'POST',
    'muteHttpExceptions': true,
    'headers': headers,
    'payload': JSON.stringify(arguments)
  };
  const Json = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());

  return {list:arguments.urlList.length, res:Json}
}

//■■■■ GG関数 ■■■■
function ggSubmit(list) {

  const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
  const headers = {'Content-Type': 'application/json'};

  list.forEach(url => {
    const arguments = {url: url, type: 'URL_UPDATED'}
    const options = {
      method: 'POST',
      muteHttpExceptions: true,
      headers: headers,
      payload: JSON.stringify(arguments)
    };
    const Json = JSON.parse(UrlFetchApp.fetch(endpoint, options).getContentText());
    console.log(Json);
  })
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
      } else if (pData[0][j]==='categories' || pData[0][j]==='tags') {
        wArg[i][pData[0][j]] = pData[i+1][j].split(',');
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

/** ■■■■ テスト ■■■■ */

function wpScreenshot() {

  const ts = new Date();
  const date = Utilities.formatDate(ts, 'JST', 'M月d日H:00');
  const hour = ts.getHours();
  let list = Array(cNo.length);
  let arg = {};

  for (let i=0; i<cNo.length; i++) {

    const t1 = 'レシオ！';
    const t2 = 'YouTube急上昇ランキング';
    const t3 = 'カテゴリ：' + cName[i];
    const t4 = '【速報】'+ date +'【集計】';
    const t5 = '- ratio100.com -';

    const wURL  = 'https://ratio100.com/featured-media/' + cNo[i] + '/' + t1 + '/' + t2 + '/' + t3 + '/' + t4 + '/' + t5;
    const width  = 1200;
    const height = 630;
    const url = 'https://s.wordpress.com/mshots/v1/' + wURL + '?w=' + width + '&h=' + height;

    UrlFetchApp.fetch(url);
    list[i] = url;
  }
  Utilities.sleep(1000 * 60);

  for (let i=0; i<cNo.length; i++) {
    const image = UrlFetchApp.fetch(list[i]).getBlob();
    arg[cSlug[i] + '-' + hour + '.jpg'] = Utilities.base64Encode(image.getBytes());
    console.log({name:(cSlug[i] + '-' + hour + '.jpg'), length:arg[cSlug[i] + '-' + hour + '.jpg'].length})
  }
  return wpAPI(iURL, arg);
}

