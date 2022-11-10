/** ■■■■ 変数 ■■■■ */
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

const hLen = 72;
const dLen = 35;
const wLen = 28;
const mLen = 60;

const sURL = 'https://ratio100.com';
const pURL = sURL + '/wp-json/wp/v2/pages/';
const aURL = sURL + '/wp-json/ratio-zid/zid/a/';
const iURL = sURL + '/wp-json/ratio-zid/zid/image/';
const vURL = sURL + '/wp-json/ratio-zid/zid/video/';
const cURL = sURL + '/wp-json/ratio-zid/zid/channel/';
const authUser = 'syo-zid';
const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';
const msKey = 'cb4064ed957644f485ca6ebe1ec96ce5';

const CONSUMER_KEY = 'TaaTCR2HJ3hr5Tor5rDGfkhBs';
const CONSUMER_SECRET = 'XfrWXBSiF0YCvLTN3JGXyK41wv8fo5PWdRhsG7RpIdWokRoIuv';
const client = TwitterClient2.getInstance(CONSUMER_KEY, CONSUMER_SECRET);

const rFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
const fSheet = rFile.getSheetByName('F');
const rCol = {jp:2};
let data = ssData();

let d = new Date(Utilities.formatDate(new Date(), 'Etc/GMT-4', 'yyyy-MM-dd HH:mm:ss'));
const tHour = d.getHours();
const tDate = d.getDate();
const tDay = d.getDay();
d = new Date(Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd'));
const nDate = d.getDate();

let wY = {};
let wZ = {};
let w = 0;
let y = 0;
let todo = [];
let done = [];
let wD = [];
let Ranking = {};
let Drop = {video_z:[]}
let Channel = [];
let Video = [];
let Top = [];
let r = 0;
d = 0;
let t = 0;

/** ■■■■ Twitter関数 ■■■■ */

/**認証実行
 */
function authorize () {
  client.authorize();
}

/**認証を削除したい時はこれを実行する
 */
function reset () {
  client.reset()
}

/**Twitterの developer portal に登録するURLを取得する
 */
function getCallbackUrl () {
  client.getCallbackUrl();
}

/**authorizeでTwitterでの認証後に実行される処理
 * ※手動で実行はしません
 */
function authCallback (request) {
  return client.authCallback(request)
}

/** ■■■■ 関数 ■■■■ */
function ssData() {
  const sRow = fSheet.getLastRow();
  const sCol = fSheet.getLastColumn();
  return fSheet.getRange(1, 1, sRow, sCol).getValues();
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

function vArguments(f) {
  const wJ = data[w];
  const yJ = todo[y];
  let a = {};

  if (f==='D' && yJ.rn!=null) {console.log({m:'エラー',id:{id:wJ.id,b:(wJ.id===yJ.id)},cat:{cat:wJ.cat,b:(wJ.cat===yJ.cat)},rn:yJ.rn})}

  if (wJ && wJ.flag==tHour) { //実施済み判定
    wY.video_y.unshift( { id:wJ.id } );
    wZ.video_z.unshift( { id:wJ.id, rc:wJ.rc, cat: wJ.cat} );
    done[2]++;
    return
  }

  if (wJ.ban!=null) { //非公開化 or BAN
    a = {
      id: wJ.id,
      img: wJ.img,
      vw: null,
      lk: null,
      cm: null,
      vw_h: strLen(wJ.vw_h +','),
      vw_d: strLen(wJ.vw_d +','),
      vw_w: strLen(wJ.vw_w +','),
      vw_m: strLen(wJ.vw_m +','),
      lk_h: strLen(wJ.lk_h +','),
      lk_d: strLen(wJ.lk_d +','),
      lk_w: strLen(wJ.lk_w +','),
      lk_m: strLen(wJ.lk_m +','),
      cm_h: strLen(wJ.cm_h +','),
      cm_d: strLen(wJ.cm_d +','),
      cm_w: strLen(wJ.cm_w +','),
      cm_m: strLen(wJ.cm_m +','),
      vw_ah: null,
      vw_ad: null,
      vw_aw: null,
      vw_am: null,
      lk_ah: null,
      lk_ad: null,
      lk_aw: null,
      lk_am: null,
      cm_ah: null,
      cm_ad: null,
      cm_aw: null,
      cm_am: null,
    }
    wY.video_y.push(a);
    a = {
      id: wJ.id,
      rc: wJ.rc,
      cat: wJ.cat,
      flag: 24,
      rn: null,
      rt: wJ.rt,
      rn_b: wJ.rn_b,
      rn_t: wJ.rn_t,
      rn_h: strLen(wJ.rn_h +','),
      rn_d: strLen(wJ.rn_d +','),
      rn_w: strLen(wJ.rn_w +','),
      rn_m: strLen(wJ.rn_m +','),
      rt_h: strLen(wJ.rt_h +','),
      rt_d: strLen(wJ.rt_d +','),
      rt_w: strLen(wJ.rt_w +','),
      rt_m: strLen(wJ.rt_m +','),
      rt_ah: null,
      rt_ad: null,
      rt_aw: null,
      rt_am: null,
    }
    wZ.video_z.push(a);
    return done[0]++;
  }

  //video_y
  a = {
    id: yJ.id,
    ch: yJ.snippet.channelId,
    title: yJ.snippet.title,
    dur: convertTime(yJ.contentDetails.duration),
    des: textToLink(yJ.snippet.description, yJ.id),
    tags: (yJ.snippet.tags)? yJ.snippet.tags.join(): '',
    img: imgVideo(yJ.snippet.thumbnails.medium.url),
    vw: yJ.statistics.viewCount,
    lk: yJ.statistics.likeCount,
    cm: yJ.statistics.commentCount
  }
  done[0]++;
  a.vw_h = strLen(wJ.vw_h + Array(25).join(), hLen);
  a.lk_h = strLen(wJ.lk_h + Array(25).join(), hLen);
  a.cm_h = strLen(wJ.cm_h + Array(25).join(), hLen);
  a.vw_d = strLen(wJ.vw_d +','+ ((a.vw==null)? '': a.vw), dLen);
  a.lk_d = strLen(wJ.lk_d +','+ ((a.lk==null)? '': a.lk), dLen);
  a.cm_d = strLen(wJ.cm_d +','+ ((a.cm==null)? '': a.cm), dLen);
  a.vw_ad = (a.vw==null || wJ.vw==null)? null: a.vw - Number(wJ.vw);
  a.lk_ad = (a.lk==null || wJ.lk==null)? null: a.lk - Number(wJ.lk);
  a.cm_ad = (a.cm==null || wJ.cm==null)? null: a.cm - Number(wJ.cm);

  if (tDay === 0) {
    a.vw_w = strLen(wJ.vw_w +','+ ((a.vw==null)? '': a.vw), wLen);
    a.lk_w = strLen(wJ.lk_w +','+ ((a.lk==null)? '': a.lk), wLen);
    a.cm_w = strLen(wJ.cm_w +','+ ((a.cm==null)? '': a.cm), wLen);
    const sub = strSub('W', a.vw_d, a.lk_d, a.cm_d);
    a.vw_aw = (a.vw==null)? null: a.vw - sub[0];
    a.lk_aw = (a.lk==null)? null: a.lk - sub[1];
    a.cm_aw = (a.cm==null)? null: a.cm - sub[2];
  }
  if (nDate === 1) {
    a.vw_m = strLen(wJ.vw_m +','+ ((a.vw==null)? '': a.vw), mLen);
    a.lk_m = strLen(wJ.lk_m +','+ ((a.lk==null)? '': a.lk), mLen);
    a.cm_m = strLen(wJ.cm_m +','+ ((a.cm==null)? '': a.cm), mLen);
    const sub = strSub('M', a.vw_d, a.lk_d, a.cm_d);
    a.vw_am = (a.vw==null)? null: a.vw - sub[0];
    a.lk_am = (a.lk==null)? null: a.lk - sub[1];
    a.cm_am = (a.cm==null)? null: a.cm - sub[2];
  }
  wY.video_y.push(a);

  //video_z
  a = {
    id: wJ.id,
    rc: wJ.rc,
    cat: wJ.cat,
    flag: (f==='D')? 30: 70
  }
  a.rn_h = strLen(wJ.rn_h + Array(25), hLen);
  a.rt_h = strLen(wJ.rt_h + Array(25), hLen);
  a.rn_d = strLen(wJ.rn_d +',', dLen);
  a.rt_d = strLen(wJ.rt_d +',', dLen);
  if (tDay === 0) {
    const sub = strSub('W', a.rt_d, a.rt_d, a.rt_d);
    a.rn_w = strLen(wJ.rn_w +',', wLen);
    a.rt_w = strLen(wJ.rt_w +',', wLen);
  }
  if (nDate === 1) {
    const sub = strSub('M', a.rt_d, a.rt_d, a.rt_d);
    a.rn_m = strLen(wJ.rn_m +',', mLen);
    a.rt_m = strLen(wJ.rt_m +',', mLen);
  }
  wZ.video_z.push(a);

}

function cArguments(f) {

  const wJ = wD[w];
  const yJ = todo[y];
  let a = {};

  if (!f) { //非公開化 or BAN
    a = {
      id: wJ.id,
      img: wJ.img,
      vw: null,
      sb: null,
      vc: null,
      vw_h: strLen(wJ.vw_h +','),
      vw_d: strLen(wJ.vw_d +','),
      vw_w: strLen(wJ.vw_w +','),
      vw_m: strLen(wJ.vw_m +','),
      sb_h: strLen(wJ.sb_h +','),
      sb_d: strLen(wJ.sb_d +','),
      sb_w: strLen(wJ.sb_w +','),
      sb_m: strLen(wJ.sb_m +','),
      vc_h: strLen(wJ.vc_h +','),
      vc_d: strLen(wJ.vc_d +','),
      vc_w: strLen(wJ.vc_w +','),
      vc_m: strLen(wJ.vc_m +','),
      vw_ah: null,
      vw_ad: null,
      vw_aw: null,
      vw_am: null,
      sb_ah: null,
      sb_ad: null,
      sb_aw: null,
      sb_am: null,
      vc_ah: null,
      vc_ad: null,
      vc_aw: null,
      vc_am: null,
    }
    wY.channel_y.push(a);
    a = {
      id: wJ.id,
      rc: rc,
      rn_b: wJ.rn_b,
      rn_t: wJ.rn_t,
      rn_h: strLen(wJ.rn_h +','),
      rn_d: strLen(wJ.rn_d +','),
      rn_w: strLen(wJ.rn_w +','),
      rn_m: strLen(wJ.rn_m +','),
      rt_h: strLen(wJ.rt_h +','),
      rt_d: strLen(wJ.rt_d +','),
      rt_w: strLen(wJ.rt_w +','),
      rt_m: strLen(wJ.rt_m +',')
    }
    wZ.channel_z.push(a);
    return done[0]++
  }

  //channel_y
  a = {
    id: yJ.id,
    title: yJ.snippet.title,
    des: textToLink(yJ.snippet.description, yJ.id),
    img: imgChannel(yJ.snippet.thumbnails.medium.url),
    handle: yJ.snippet.customUrl,
    vw: yJ.statistics.viewCount,
    sb: yJ.statistics.subscriberCount,
    vc: yJ.statistics.videoCount,
  }
  a.vw_h = strLen(wJ.vw_h + Array(25).join(), hLen);
  a.sb_h = strLen(wJ.sb_h + Array(25).join(), hLen);
  a.vc_h = strLen(wJ.vc_h + Array(25).join(), hLen);
  a.vw_d = strLen(wJ.vw_d +','+ ((a.vw==null)? '': a.vw), dLen);
  a.sb_d = strLen(wJ.sb_d +','+ ((a.sb==null)? '': a.sb), dLen);
  a.vc_d = strLen(wJ.vc_d +','+ ((a.vc==null)? '': a.vc), dLen);
  a.vw_ad = (a.vw==null || wJ.vw==null)? null: a.vw - Number(wJ.vw);
  a.sb_ad = (a.sb==null || wJ.sb==null)? null: a.sb - Number(wJ.sb);
  a.vc_ad = (a.vc==null || wJ.vc==null)? null: a.vc - Number(wJ.vc);

  if (tDay === 0) {
    a.vw_w = strLen(wJ.vw_w +','+ ((a.vw==null)? '': a.vw), wLen);
    a.sb_w = strLen(wJ.sb_w +','+ ((a.sb==null)? '': a.sb), wLen);
    a.vc_w = strLen(wJ.vc_w +','+ ((a.vc==null)? '': a.vc), wLen);
    const sub = strSub('W', a.vw_d, a.sb_d, a.vc_d);
    a.vw_aw = (a.vw==null)? null: a.vw - sub[0];
    a.sb_aw = (a.sb==null)? null: a.sb - sub[1];
    a.vc_aw = (a.vc==null)? null: a.vc - sub[2];
  }
  if (nDate === 1) {
    a.vw_m = strLen(wJ.vw_m +','+ ((a.vw==null)? '': a.vw), mLen);
    a.sb_m = strLen(wJ.sb_m +','+ ((a.sb==null)? '': a.sb), mLen);
    a.vc_m = strLen(wJ.vc_m +','+ ((a.vc==null)? '': a.vc), mLen);
    const sub = strSub('M', a.vw_d, a.sb_d, a.vc_d);
    a.vw_am = (a.vw==null)? null: a.vw - sub[0];
    a.sb_am = (a.sb==null)? null: a.sb - sub[1];
    a.vc_am = (a.vc==null)? null: a.vc - sub[2];
  }
  wY.channel_y.push(a);

  //channel_z
  a = {
    id: wJ.id,
    rc: wJ.rc
  }
  a.rn_h = strLen(wJ.rn_h + Array(25), hLen);
  a.rt_h = strLen(wJ.rt_h + Array(25), hLen);
  a.rn_d = strLen(wJ.rn_d +',', dLen);
  a.rt_d = strLen(wJ.rt_d +',', dLen);
  done[0]++;

  if (tHour === 4 && tDay === 0) {
    a.rn_w = strLen(wJ.rn_w +','+ strMin('W', a.rn_d), wLen);
    a.rt_w = strLen(wJ.rt_w +','+ a.rt, wLen);
  }
  if (tHour === 4 && nDate === 1) {
    a.rn_m = strLen(wJ.rn_m +','+ strMin('M', a.rn_m), mLen);
    a.rt_m = strLen(wJ.rt_m +','+ a.rt, mLen);
  }
  wZ.channel_z.push(a);
}

function dArguments(i) {
  const wJ = wD[i];
  if (wJ.flag==='24') {
    let a = {
      id: wJ.id,
      rc: wJ.rc,
      cat: wJ.cat,
      flag: 30
    };
    Drop.video_z.push(a);
    d++;
  }

  let a = {
    rt_ad: Math.round(strDrop('D', wJ.rt_h, wJ.pd_l)*10000)/10000,
    t_v: wJ.title,
    rn: strMin('D', wJ.rn_h),
    t_c: wJ.t_c,
    vw_ad: strDrop('D', wJ.vw_h, wJ.pd_l),
    lk_ad: strDrop('D', wJ.lk_h, wJ.pd_l),
    vd: wJ.id,
    rc: wJ.rc,
    ch: wJ.ch,
    vw: Number(wJ.vw),
    lk: Number(wJ.lk),
    cm: Number(wJ.cm),
    cm_ad: strDrop('D', wJ.cm_h, wJ.pd_l),
    rn_i: wJ.rn_i,
    rt: wJ.rt,
    pd: Number(wJ.pd)
  }

  Ranking[wJ.cat].push(a);
  r++;
}

/** ■■■■ YouTube関数 ■■■■ */
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

/** ■■■■ 文字列,数値操作 ■■■■ */
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

function textToLink(str, id) {
  const regexp = /(htt)(ps|p)(:\/)([\w/:%#\$&\?\(\)~\.=\+\-\@ぁ-んァ-ヶ亜-熙Ａ-Ｚａ-ｚ]+)/g;
  str = str.replace(regexp, '<a class="external" href="/link/'+id+'/$2$4" title="外部リンク"></a> ');
  return str
}

function imgVideo(str) {
  const regexp = /(.*\/vi\/)([\w\_\-]+)(.*)/;
  str = str.replace(regexp, '$2');
  return str
}

function imgChannel(str) {
  const regexp = /(.*\.com\/)([\w\/\_\-\_]+)(=s.*)/;
  str = str.replace(regexp, '$2');
  return str
}

function strDrop(f, str, label) {
  let j = 0;
  arr = str.split(',');
  if (f==='D') { j = arr.length-1-24 }
  else if (f==='W') { j = arr.length-1-7 }
  else if (f==='M') { j = arr.length-1-date }

  for (let i=j; i<arr.length-1; i++) {
    if (arr[i]!=='') { j = i; break; }
    if (i===arr.length-1) { j = arr.length-1 }
  }

  const t = (label)? Math.ceil((time-new Date(label).getTime())/(1000*60)): 0;
  val = (arr.length-1-t>j)? (arr[arr.length-1-t]-arr[j]): 0;
  return val
}

function strMin(f, str) {
  let j = 0;
  arr = str.split(',');
  if (f==='D') { j = arr.length-1-24 }
  else if (f==='W') { j = arr.length-1-7 }
  else if (f==='M') { j = arr.length-1-tDate }

  val = 100;
  for (let i=j; i<arr.length-1; i++) {
    if (Number(arr[i])==='') { continue; }
    else if (Number(arr[i])<val) { val = Number(arr[i]) }
  }

  return val
}

function strLen(str, len) {
  str = Array(len).join() + str.replace(/(undefined|null|NULL|NaN)/g, '');
  let arr = str.split(',').map(x=>(x==='')? x: Number(x));
  return arr.slice(arr.length-len).join()
}

function strSub(f, x, y, z) {
  let j = 0;
  x = x.split(',');
  y = y.split(',');
  z = z.split(',');
  if (f==='D') { j = x.length-1-24 }
  else if (f==='W') { j = x.length-1-7 }
  else {f==='M'} { j = x.length-1-tDate }

  for (let i=j; i<x.length-1; i++) {
    if (x[i]!=='') { j = i; break; }
    if (i===x.length-1) { j = x.length-1 }
  }
  return [x[j], y[j], z[j]];
}

function rDay(rc) {

  /** ■■■■ 実行判定 ■■■■ */
  const f1 = data[2][rCol[rc]-1];
  const f2 = data[1][rCol[rc]-1];

  if (f1 ==='Go') { wpResult(rc); }
  else if (f2 ===7 || f2 ===12 || f2 ===16 || f2 ===20) { wpFlash(rc); }
  else { console.log('実施対象外'); }
}

function wpResult(rc) {

  /** ■■■■ 変数 ■■■■ */
  time = new Date(Utilities.formatDate(new Date(), 'Etc/GMT-5', 'yyyy-MM-dd HH:mm'));
  const date = time.getDate() - 1;
  time = new Date(Utilities.formatDate(new Date(), 'Etc/GMT+14', 'yyyy-MM-dd'));
  const day = time.getDay()+60;
  const id = Utilities.formatDate(new Date(), 'Etc/GMT+14', 'yyMMdd');
  const today = Utilities.formatDate(new Date(), 'Etc/GMT+14', 'yyyy年M月d日');
  const publish = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd') + 'T05:30:00';
  const now = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss').replace(' ','T');

  time = Utilities.formatDate(new Date(),'JST','yyyy-MM-dd HH:') + '00:00';
  time = new Date(time).getTime();

  function step_va() { //vArguments
    err = {};
    try {
      data = wpAPI(vURL+'25/'+rc).sort((a,b) => {
        if (a.id === b.id) { return (a.cat > b.cat)? 1: -1 }
        else { return (a.id > b.id)? 1: -1 }
      })

      wY = {video_y:[]};
      wZ = {video_z:[]};
      done = [];
      todo = [].concat(data);
      console.log('30_todo : '+todo.length);
      while (todo.length) {
        let vID = todo.splice(0,50).map(x => x.id);
        done = done.concat(ytVideo(vID.join()).items);
      }
      todo = [].concat(done).sort((a, b) => (a.id > b.id)? 1: -1);

      done = [0,0,0];
      w = 0; y = 0;
      while (w < data.length || y < todo.length) {
        let f = false;
        if (w === data.length) { throw new Error('vDrop : エラー (真偽判定ミスの可能性あり)'); }
        if (y === todo.length) { f='B'; }
        if (!f && data[w].id > todo[y].id) { throw new Error('vDrop : エラー (真偽判定ミスの可能性あり)'); }
        if (!f && data[w].id < todo[y].id) { f='B'; }
        if (!f && data[w].id===todo[y].id) { f='D'; }
        if (!f) { throw new Error('cArg エラー : 振り分け判定漏れ\n'+ data[w].id +' : '+ todo[y].id); }
        if (f==='B') { data[w].ban = true; }

        cat = data[w].cat;
        if (!cat) {console.log('Drop動画のArg作成 : カテゴリ『0』エラー\nid : '+data[w].id)}
        vArguments('D');
        w++;
        if (f==='D') { y++; }
      }

      const wSum = data.length;
      const ySum = todo.length;
      console.log('WP動画情報取得 : YT動画情報取得 = ' + wSum + ' : ' + ySum + '\n');

    } catch (e) {
      console.log('vArguments\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_va() }
    }
  }
  t = 0;
  step_va();
  if (t===3) {
    /*ssEnd('doing_'+rc);
    return*/ console.log('【途中終了】エラー回数超過\nvArguments')
  }

  function step_ca() { //cArguments
    err = {};
    try {
      data =  wpAPI(cURL+'24/'+rc).sort((a, b) => (a.id > b.id)? 1: -1);
      todo = [];
      while (data.length) {
        let vID = data.splice(0,50).map(x => x.id);
        todo = todo.concat(ytChannel(vID.join()).items);
      }
      todo = todo.sort((a, b) => (a.id > b.id)? 1: -1);

      let wSum = data.length;
      let ySum = todo.length;
      console.log('チャンネル情報取得（WP,YT）\nWP(channel_24) : ' + wSum + '\nYT : ' + ySum);

      wY = {channel_y:[]};
      wZ = {channel_z:[]};
      done = [0,0,0];

      w = 0; y = 0;
      while (w < data.length || y < todo.length) {
        let f = false;
        if (w === data.length) { throw new Error('cArg : エラー (真偽判定ミスの可能性あり)'); }
        if (y === todo.length) { f='B'; }
        if (!f && data[w].id > todo[y].id) { throw new Error('cArg : エラー (真偽判定ミスの可能性あり)'); }
        if (!f && data[w].id < todo[y].id) { f='B'; }
        if (!f && data[w].id===todo[y].id) { f='S'; }
        if (!f) {
          throw new Error('cArg エラー : 振り分け判定漏れ\n'+ data[w].id +' : '+ todo[y].id);
        }
        cArguments(((f==='S')? true: false));
        w++;
        if (f==='S') { y++; }
      }

      ySum = wY.channel_y.length;
      let zSum = wZ.channel_z.length;
      console.log('cArg (channel_y:channel_z) : '+ySum+' = '+zSum+'\n'+(done[0]+done[1]+done[2])+' ( Still : New : Done = '+done[0]+' : '+done[1]+' : '+done[2]+' )');
      done = [];
    } catch (e) {
      console.log('cArg\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_ca() }
    }
  }
  t = 0;
  step_ca();
  if (t===3) {
    /*ssEnd('doing_'+rc);
    return*/  console.log('【途中終了】エラー回数超過\ncArg')
  }

  function step_da() { //dArguments
    err = {};
    try {
      wD = wpAPI(vURL +'25/'+rc);
      Ranking = {};
      Top = [];
      Drop = {video_z:[]};
      r = 0;
      d = 0;
      for (let i=0; i<cNo.length; i++) { Ranking[cNo[i]] = []; }
      for (let i=0; i<wD.length; i++) { dArguments(i); }
      for (let i=0; i<cNo.length; i++) {
        Ranking[cNo[i]].sort((a, b) => (a.rt_ad < b.rt_ad)? 1: -1);
        Top.push(Ranking[cNo[i]][0].t_c.replace(/(チャンネル|ちゃんねる|channel|Channel)/g, ''));
      }
      console.log({ranking:r,drop:d});
    } catch (e) {
      console.log('dArguments\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_da() }
    }
  }
  t = 0;
  step_da();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\narg : dArguments')
  }

  function step_dr() { //Dropアップデート
    err = {};
    try {
      const resD = wpAPI(vURL, Drop);
      console.log({m:'Dropアップデート',res:resD});
    } catch (e) {
      console.log('Dropアップデート\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_dr() }
    }
  }
  t = 0;
  step_dr();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\narg : Dropアップデート')
  }

  function step_ar() { //arg : デイリーランキング
    err = {};
    try {
      data = JSON.parse(wpAPI(pURL+id).content.raw);
      data.ranking = Ranking;

      const prefix = 'YouTube急上昇ランキング デイリーまとめ【'+today+'】各カテゴリのレシオ1位のチャンネルはこちら［';
      const suffix = '］『レシオ！』ではYouTube急上昇ランキングをリアルタイム集計、1時間ごとに最新情報をお届け。';
      data.des = prefix + Top.join() + suffix

      const excerpt = 'YouTube急上昇 レシオ！デイリーランキング ' + today;

      arg = {
        date: publish,
        status: (publish<now)? 'publish': 'future',
        title: date+'日',
        content: JSON.stringify(data),
        excerpt: excerpt,
        //featured_media: 0,
        comment_status: 'open',
        ping_status: 'open',
        sticky: false,
        categories: [4],
        tags: [70,73,74,78,79,52,57,day]
      };

      console.log('arg : デイリーランキング\n' + excerpt);
    } catch (e) {
      console.log('arg : デイリーランキング\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_ar() }
    }
  }
  t = 0;
  step_ar();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\narg : デイリーランキング')
  }

  function step_rn() { //デイリーランキング更新
    err = {};
    try {
      const resR = wpAPI(pURL+id, arg);
      console.log({m:'デイリーランキング更新', resR:resR});
    } catch (e) {
      console.log('デイリーランキング更新\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_rn() }
    }
  }
  t = 0;
  step_rn();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\nデイリーランキング更新')
  }

  function step_ms() { //IndexNow送信
    err = {};
    try {
      Channel = [];
      Video = [];
      for (let i=0; i<cNo.length; i++) {
        for (let j=0; j<7; j++) {
          let url = 'https://ratio100.com/youtube/channel/' + Ranking[cNo[i]][j].ch;
          Channel.push(url);
          url = 'https://ratio100.com/youtube/video/' + Ranking[cNo[i]][j].vd;
          Video.push(url);
        }
      }
      msSubmit(Channel);
      console.log('IndexNow送信 : '+Channel.length+'件');
      console.log(Channel.join('\n'));
      console.log('Google Indexing用 : '+Video.length+'件');
      console.log(Video.join('\n'));
    } catch (e) {
      console.log('IndexNow送信\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_ms() }
    }
  }
  t = 0;
  step_ms();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\nIndexNow送信')
  }

  function step_e() { //終了処理
    err = {};
    try {
      fSheet.getRange(3, rCol[rc]).setValue(date);
      console.log('■■■■■■■■■■ 実行完了 : rDay ■■■■■■■■■■');
    } catch (e) {
      console.log('終了処理\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_e() }
    }
  }
  t = 0;
  step_e();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\n終了処理')
  }

}

function wpFlash(rc) {

  /** ■■■■ 変数 ■■■■ */
  const zone = {'11':'朝', '12':'昼', '13':'夕方', '14':'夜'};
  const slug = {'11':'morning', '12':'afternoon', '13':'evening', '14':'night'};
  const time = new Date();
  let hour = time.getHours();
  let id = 0;
  if (hour===7) { id = 11; }
  else if (hour===12) { id = 12; }
  else if (hour===16) { id = 13; }
  else if (hour===20) { id = 14; }
  else { return console.log('実施対象外') }
  const fm = 100 + id;
  if (hour===7) { hour = '07';}

  const p1 = Utilities.formatDate(time, 'JST', 'yyyy-MM-dd') +'T'+'00:00:10';
  const p2 = Utilities.formatDate(time, 'JST', 'yyyy-MM-dd') +'T'+hour+':00:10';
  const now = Utilities.formatDate(time, 'JST', 'yyyy-MM-dd HH:mm:ss').replace(' ','T');
  const parent = Utilities.formatDate(time, 'Etc/GMT-4', 'yyMMdd');
  const date = Utilities.formatDate(time, 'JST', 'M月d日');
  const day = time.getDay()+60;

  let Ranking = {};
  let Title = '';
  let Excerpt = [];
  let err = {};
  let t = 0;

  /** ■■■■ 実施判定 ■■■■ */
  const flag = wpAPI(pURL+(id+20)).content.raw.slice(0,6);
  if (flag == parent) { return console.log('実施済み : '+date+' '+zone[id])}

  const wD = wpAPI(aURL+'11/'+rc);

  function step_1() { //速報（11～15）
    err = {};
    try {
      Title = '';
      Excerpt = [];
      Channel = [];
      for (let i=0; i<cNo.length; i++) { Ranking[cNo[i]] = []; }
      for (let i=0; i<wD.length; i++) {
        if (wD[i].rn > 20) { break; }
        const wJ = wD[i];
        const a = {
          rn: wJ.rn,
          t_c: wJ.t_c,
          t_v: wJ.t_v,
          rt: wJ.rt,
          vw: wJ.vw,
          lk: wJ.lk,
          vd: wJ.vd,
          ch: wJ.ch,
          rc: wJ.rc,
          pd: wJ.pd
        }
        Ranking[wD[i].cat].push(a);
        if (a.rn === '1') {
          const t_c = a.t_c.replace(/(チャンネル|ちゃんねる|channel|Channel)/g, '');
          Excerpt.push(t_c);
          Channel.push('#'+cName[cNo.findIndex(x=>x==wD[i].cat)]+'\n◆ '+t_c+' ◆\nyoutu.be/'+wJ.vd);
        }
      }

      const prefix = 'YouTube急上昇ランキング動画まとめ【'+date+':'+zone[id]+'】各カテゴリでランキング1位にランクインしたチャンネルはこちら［';
      const suffix = '］『レシオ！』ではYouTube急上昇ランキングをリアルタイム集計、1時間ごとに最新情報をお届け。';
      Excerpt = prefix + Array.from(new Set(Excerpt)).join() + suffix;
      Title = '【速報】YouTube急上昇ランキングまとめ【'+date+':'+zone[id]+'】';

      const arg = {
        status: 'publish',
        title: Title,
        content: JSON.stringify(Ranking),
        excerpt: Excerpt,
        featured_media: fm,
        comment_status: 'open',
        ping_status: 'open',
        sticky: false,
        parent: 4,
        categories: [4],
        tags: [70,73,74,78,51,day]
      }
      if (!time.getHours()) { arg.date = p1; }

      let res = wpAPI(pURL+id, arg);
      res.content = res.content.raw.length;
      msSubmit([res.link]);
      console.log(res)

    } catch (e) {
      console.log('速報（11～15）\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_1() }
    }
  }
  t = 0;
  step_1();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\n速報（11～15）')
  }

  function step_2() { //速報（31～35,Twitter）
    err = {};
    try {
      const arg = {
        date: p2,
        status: 'publish',
        title: Title,
        content: parent + '【' + zone[id] + '】',
        excerpt: Excerpt,
        featured_media: fm,
        comment_status: 'open',
        ping_status: 'open',
        sticky: false,
        parent: parent,
        categories: [4],
        tags: [70,73,74,78,51,day]
      }

      let res = wpAPI(pURL+(id+20), arg);
      console.log(res);

      let tw = Array(4);
      let url = Utilities.formatDate(time, 'Etc/GMT-4', 'dd/');
      url = 'ratio100.com/' + url + slug[id];
      tweet = '#YouTube #急上昇 #まとめサイト\n『レシオ！』の速報\n'+url+'\n\n▼各カテゴリ急上昇ランキング1位は▼\n▼以下のチャンネルの動画です！▼';

      Channel.sort(() => Math.random() - 0.5);
      let tID = null;
      for (let i=0; i<tw.length; i++) {
        if (i!==0) { tweet = Channel.slice((i-1)*4,i*4).join('\n\n'); }
        const res = client.postTweet(tweet, tID);
        tID = res.data.id;
        console.log(res);
      }

    } catch (e) {
      console.log('速報（31～35,Twitter）\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_2() }
    }
  }
  t = 0;
  step_2();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\n速報（31～35,Twitter）')
  }

  function step_fm() { //アイキャッチ画像
    err = {};
    try {
      const t1 = 'レシオ！';
      const t2 = 'YouTube急上昇ランキング';
      const t4 = '【速報】'+ date +':'+ zone[id] +'【集計】';
      const t5 = '- ratio100.com -';

      const wURL  = 'https://ratio100.com/featured-media/' + 0 + '/' + t1 + '/' + t2 + '/' + t4 + '/' + t5;
      const width  = 1200;
      const height = 630;
      const url = 'https://s.wordpress.com/mshots/v1/' + wURL + '?w=' + width + '&h=' + height;

      UrlFetchApp.fetch(url);
      Utilities.sleep(1000 * 60);

      const image = UrlFetchApp.fetch(url).getBlob();
      let arg = {};
      arg[slug[id] + '-i.jpg'] = Utilities.base64Encode(image.getBytes());
      console.log({name:(slug[id] + '-i.jpg'), length:arg[slug[id] + '-i.jpg'].length})

      res = wpAPI(iURL, arg);
      console.log(res);

    } catch (e) {
      console.log('アイキャッチ画像\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_fm() }
    }
  }
  t = 0;
  step_fm();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\nアイキャッチ画像')
  }

}
