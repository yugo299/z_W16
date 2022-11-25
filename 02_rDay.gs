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
  '科学とテクノロジー'
];
const tName = { jp: {D:'24時間', W:'週間', M:'月間', Y:'年間'} };

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
const rURL = sURL + '/wp-json/ratio-zid/zid/result/';
const authUser = 'syo-zid';
const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';
const msKey = 'daa6fb4c178945a499f80cacc5c16410';

const CONSUMER_KEY = 'TaaTCR2HJ3hr5Tor5rDGfkhBs';
const CONSUMER_SECRET = 'XfrWXBSiF0YCvLTN3JGXyK41wv8fo5PWdRhsG7RpIdWokRoIuv';
const client = TwitterClient2.getInstance(CONSUMER_KEY, CONSUMER_SECRET);

const rFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
const fSheet = rFile.getSheetByName('F');
const rCol = {jp:2};
let data = ssData();

let d = new Date(Utilities.formatDate(new Date(), 'Etc/GMT'+'-4', 'yyyy-MM-dd HH:mm:ss'));
const tHour = d.getHours();
const tDate = d.getDate();
const tDay = d.getDay();
const bDate = new Date(Utilities.formatDate(new Date(), 'Etc/GMT'+(Number('-4')-1), 'yyyy-MM-dd')).getDate() - 1;

d = new Date(new Date(Utilities.formatDate(new Date(), 'Etc/GMT'+(Number('-4')-1), 'yyyy-MM-dd')).getTime() - 86400000);
const day = d.getDay()+60;
const tID = Utilities.formatDate(d, 'Etc/GMT'+'-4', 'yyMMdd');
const today = Utilities.formatDate(d, 'Etc/GMT'+'-4', 'yyyy年M月d日');
const publish = Utilities.formatDate(new Date(), 'Etc/GMT'+'-4', 'yyyy-MM-dd') + 'T05:30:00';
const middle = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd') + 'T04:00:00';
const now = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss').replace(' ','T');

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
let time = 0;
let rc = 'jp';

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

/** ■■■■ SS/WP/MS関数 ■■■■ */
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

function strAdd(f, str, label) {
  let j = 0;
  arr = str.split(',');
  if (f==='D') { j = arr.length-1-((tHour+23-4)%24+1) }
  else if (f==='W') { j = arr.length-1-7 }
  else if (f==='M') { j = arr.length-1-bDate }

  for (let i=j; i<arr.length-1; i++) {
    if (arr[i]!=='') { j = i; break; }
    if (i===arr.length-1) { j = arr.length-1 }
  }

  const t = (label)? Math.round((time-new Date(label).getTime())/(1000*60*60)): 0;
  val = (arr.length-1-t>j)? (arr[arr.length-1-t]-arr[j]): 0;
  if (val<arr[arr.length-1-t]*(-10)) {
    val = (arr.length-1-t>j+1)? (arr[arr.length-1-t]-arr[j+1]): 0;
    console.log({'エラー':arr[arr.length-1-t], f:f, label:label, now:arr[arr.length-1-t], before:arr[j+1], spare:arr[j+1], val:val, str:str});
  }
  return val
}

function strMin(f, str) {
  let j = 0;
  const arr = str.split(',').map(x => Number(x));
  if (f==='D') { j = arr.length-1-((tHour+23-4)%24+1); }
  else if (f==='W') { j = arr.length-1-7; }
  else if (f==='M') { j = arr.length-1-tDate; }

  val = 100;
  for (let i=j; i<arr.length-1; i++) {
    if (!arr[i]) { continue; }
    else if (arr[i]<val) { val = arr[i]; }
  }

  return val
}

function strLen(str, len) {
  str = Array(len).join() + str.replace(/(undefined|null|NULL|NaN)/g, '');
  let arr = str.split(',').map(x=>(x==='')? x: Number(x));
  return arr.slice(arr.length-len).join()
}

function strLast(str, val, f = true) {
  let arr = str.split(',');
  if (f) { arr[arr.length-1] = val; }
  else {
    if (!arr[arr.length-1] && !val) { arr[arr.length-1] = ''; }
    else if (!arr[arr.length-1]) { arr[arr.length-1] = val; }
    else if (arr[arr.length-1] && val) { arr[arr.length-1] = Math.min(val, arr[arr.length-1]); }
  }
  return arr.join();
}

function strSub(f, str) {
  let j = 0;
  const arr = str.split(',');
  if (f==='D') { j = arr.length-1-24 }
  else if (f==='W') { j = arr.length-1-7 }
  else {f==='M'} { j = arr.length-1-bDate }

  for (let i=j; i<arr.length; i++) {
    if (arr[i]!=='') { j = i; break; }
    if (i===arr.length-1) { j = arr.length-1 }
  }

  return arr[arr.length-1] - arr[j];
}

/** ■■■■ rs関数 ■■■■ */
function rsRange(f, id) {
  let range = [];
  id = String(id);

  if (f==='W') {
    d = new Date('20'+id.slice(0,2)+'-'+id.slice(2,4)+'-'+((bDate<10)? '0'+bDate: bDate));
    const mon = (d.getDay()+6) % 7;
    d = d.getTime() - 86400000 * mon;
    for (let i=0; i<7; i++) {
      range.push(Number(Utilities.formatDate(new Date(d + 86400000 * i), 'Etc/GMT'+(Number('-4')-1), 'yyMMdd')));
    }
  }
  else if (f==='M') {
    const mm = Number(id.slice(2,4));
    const first = new Date('20'+id.slice(0,2)+'-'+id.slice(2,4)+'-01').getTime();
    let i = 0;
    do {
      range.push(Number(Utilities.formatDate(new Date(first + 86400000 * i), 'Etc/GMT'+'-4', 'yyMMdd')));
      d = new Date(first + 86400000 * (++i)).getMonth()+1;
    } while (d===mm)
  }
  else if (f==='Y') {
    const yy = Number('20'+id.slice(0,2));
    const first = new Date('20'+id.slice(0,2)+'-01-01').getTime();
    let i = 0;
    do {
      range.push(Number(Utilities.formatDate(new Date(first + 86400000 * i), 'Etc/GMT'+'-4', 'yyMMdd')));
      d = new Date(first + 86400000 * (++i)).getFullYear();
    } while (d===yy)
  }
  return range.reverse();
}

function rsSummarize(array) {
  let list = [];
  array.forEach(arr => {
    arr.forEach(a => {
      const i = list.findIndex(l => l.vd===a.vd)
      let arg = {};
      if (~i) {
        arg = list[i];
        arg.rt = (Math.round(arg.rt + a.rt)*10000)/10000;
        arg.rn = Math.min(arg.rn, a.rn);
        arg.vw += a.vw;
        arg.lk += a.lk;
        arg.pd++;
        list[i] = arg;
      } else {
        arg = {
          rt: a.rt,
          vd: a.vd,
          t_v: a.t_v,
          t_c: a.t_c,
          vw: a.vw,
          lk: a.lk,
          ch: a.ch,
          pd: 1
        }
        list.push(arg);
      }
    });
  });

  list.sort((a,b) => (a.rt<b.rt)? 1: -1);
  Top.push(list[0].t_c.replace(/(チャンネル|ちゃんねる|channel|Channel)/g, ''));
  return list.slice(0,200);
}

function rsPublish(f, id) {
  let dd = now;
  id = String(id);
  if (f==='W') {
    d = new Date('20'+id.slice(0,2)+'-'+id.slice(2,4)+'-'+((bDate<10)? '0'+bDate: bDate));
    let mon = (d.getDay()+6) % 7;
    d = d.getTime() - 86400000 * mon;
    dd = Utilities.formatDate(new Date(d), 'Etc/GMT'+(Number('-4')-1), 'yyyy-MM-dd 04:30:07').replace(' ','T');
  } else if (f==='M') {
    dd = '20'+id.slice(0,2)+'-'+id.slice(2,4)+'-01T04:30:12'
  } else if (f==='Y') {
    dd = '20'+id.slice(0,2)+'-01-01T04:30:01'
  }
  return dd
}

function rsTitle(f, id) {
  id = String(id);
  if (f==='W') { return '第' + id.slice(5) + '週'; }
  else if (f==='M') { return Number(id.slice(2, 4)) + '月'; }
  else if (f==='Y') { return '20' + id.slice(0, 2) + '年'; }
}

function rsTerm(f, id) {
  id = String(id);
  if (f==='W') { return id.slice(2,4) + '月第' + id.slice(5) + '週'; }
  else if (f==='M') { return '20' + id.slice(0,2) + '年' + Number(id.slice(2,4)) + '月'; }
  else if (f==='Y') { return '20' + id.slice(0,2) + '年'; }
}

function rsOpen(f, id) {

  let tContent = wpAPI(rURL, id)[0];
  if (!(tContent==='' || !tContent)) { tContent = JSON.parse(tContent); }
  else { tContent = {}; }

  let sContent = wpAPI(rURL, id)[0];
  if (!(sContent==='' || !sContent)) { sContent = JSON.parse(sContent); }
  else { sContent = {}; }

  let arg = {};
  for (let i=0; i<cNo.length; i++) { arg[cNo[i]] = []; }

  const tExcerpt = 'YouTube急上昇ランキング '+tName[rc][f]+'まとめ【'+rsTerm(f, id)+'】準備中';
  const sExcerpt = 'YouTube急上昇ランキング '+tName[rc][f]+'ヒートマップ【'+rsTerm(f, id)+'】準備中';

  tContent[rc] = { title: tExcerpt, des: tExcerpt, ranking: arg };
  sContent[rc] = { title: sExcerpt, des: sExcerpt };

  let term = 56;
  if (f==='M') { term = 55; }
  else if (f==='Y') { term = 53; }

  d = rsPublish(f, id)

  const tArg = {
    date: d,
    status: (d<now)? 'publish': 'future',
    title: rsTitle(f, id),
    content: JSON.stringify(tContent),
    excerpt: excerpt,
    adfgsfdfeatured_media: 107,
    comment_status: 'open',
    ping_status: 'open',
    sticky: false,
    categories: [4],
    tags: [70,73,74,78,79,59,term]
  };

  let sArg = tArg;
  sArg.content = JSON.stringify(sContent)
  sArg.categories = [6];

  return {trending: wpAPI(pURL+id, tArg), stats: wpAPI(pURL+(id+50), sArg)};
}

/** ■■■■ Arg関数 ■■■■ */
function vArguments(f) {
  const wJ = data[w];
  const yJ = todo[y];
  let a = {};

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
    return done[2]++;
  }

  //video_y
  if (!~wD.findIndex(x => x.id===wJ.id)) {
    a = {
      id: yJ.id,
      ch: yJ.snippet.channelId,
      title: yJ.snippet.title,
      dur: yJ.contentDetails.duration,
      des: yJ.snippet.description,
      tags: (yJ.snippet.tags)? yJ.snippet.tags.join(): '',
      img: imgVideo(yJ.snippet.thumbnails.medium.url),
      vw: yJ.statistics.viewCount,
      lk: yJ.statistics.likeCount,
      cm: yJ.statistics.commentCount
    }
    done[0]++;
    a.vw_h = strLen(wJ.vw_h +','+ Array(24).fill(a.vw).join(), hLen);
    a.lk_h = strLen(wJ.lk_h +','+ Array(24).fill(a.lk).join(), hLen);
    a.cm_h = strLen(wJ.cm_h +','+ Array(24).fill(a.cm).join(), hLen);
    a.vw_d = strLen(wJ.vw_d +','+ ((a.vw==null)? '': a.vw), dLen);
    a.lk_d = strLen(wJ.lk_d +','+ ((a.lk==null)? '': a.lk), dLen);
    a.cm_d = strLen(wJ.cm_d +','+ ((a.cm==null)? '': a.cm), dLen);
    if (tDay === 1) {
      a.vw_w = strLen(wJ.vw_w +','+ ((a.vw==null)? '': a.vw), wLen);
      a.lk_w = strLen(wJ.lk_w +','+ ((a.lk==null)? '': a.lk), wLen);
      a.cm_w = strLen(wJ.cm_w +','+ ((a.cm==null)? '': a.cm), wLen);
    } else {
      a.vw_w = (a.vw==null)? wJ.vw_w: strLast(wJ.vw_w, a.vw);
      a.lk_w = (a.lk==null)? wJ.lk_w: strLast(wJ.lk_w, a.lk);
      a.cm_w = (a.cm==null)? wJ.cm_w: strLast(wJ.cm_w, a.cm);
    }
    if (tDate === 1) {
      a.vw_m = strLen(wJ.vw_m +','+ ((a.vw==null)? '': a.vw), mLen);
      a.lk_m = strLen(wJ.lk_m +','+ ((a.lk==null)? '': a.lk), mLen);
      a.cm_m = strLen(wJ.cm_m +','+ ((a.cm==null)? '': a.cm), mLen);
    } else {
      a.vw_m = (a.vw==null)? wJ.vw_m: strLast(wJ.vw_m, a.vw);
      a.lk_m = (a.lk==null)? wJ.lk_m: strLast(wJ.lk_m, a.lk);
      a.cm_m = (a.cm==null)? wJ.cm_m: strLast(wJ.cm_m, a.cm);
    }
    a.vw_ad = null;
    a.lk_ad = null;
    a.cm_ad = null;
    a.vw_ad = (a.vw==null)? null: strSub('D', a.vw_h);
    a.lk_ad = (a.lk==null)? null: strSub('D', a.lk_h);
    a.cm_ad = (a.cm==null)? null: strSub('D', a.cm_h);
    a.vw_aw = (a.vw==null)? null: strSub('W', a.vw_d);
    a.lk_aw = (a.lk==null)? null: strSub('W', a.lk_d);
    a.cm_aw = (a.cm==null)? null: strSub('W', a.cm_d);
    a.vw_am = (a.vw==null)? null: strSub('M', a.vw_d);
    a.lk_am = (a.lk==null)? null: strSub('M', a.lk_d);
    a.cm_am = (a.cm==null)? null: strSub('M', a.cm_d);

    wY.video_y.push(a);
  }

  //video_z
  a = {
    id: wJ.id,
    rc: wJ.rc,
    cat: wJ.cat,
    flag: (f==='D')? 30: 70,
    rn: null,
    rt: wJ.rt
  }
  a.rn_h = strLen(wJ.rn_h +','+ Array(24), hLen);
  a.rt_h = strLen(wJ.rt_h +','+ Array(24).fill(a.rt), hLen);
  a.rn_d = strLen(wJ.rn_d +',', dLen);
  a.rt_d = strLen(wJ.rt_d +','+ a.rt, dLen);
  if (tDay === 1) {
    a.rn_w = strLen(wJ.rn_w +',', wLen);
    a.rt_w = strLen(wJ.rt_w +','+ a.rt, wLen);
  } else {
    a.rn_w = strLast(wJ.rn_w, a.rn, false);
    a.rt_w = strLast(wJ.rt_w, a.rt);
  }
  if (tDate === 1) {
    a.rn_m = strLen(wJ.rn_m +',', mLen);
    a.rt_m = strLen(wJ.rt_m +','+ a.rt, mLen);
  } else {
    a.rn_m = strLast(wJ.rn_m, a.rn, false);
    a.rt_m = strLast(wJ.rt_m, a.rt);
  }
  a.rt_ad = strSub('D', a.rt_h);
  a.rt_aw = strSub('W', a.rt_d);
  a.rt_am = strSub('M', a.rt_d);
  a.rt_ad = (a.rt_ad)? a.rt_ad: null;
  a.rt_aw = (a.rt_aw)? a.rt_aw: null;
  a.rt_am = (a.rt_am)? a.rt_am: null;

  wZ.video_z.push(a);
}

function cArguments(f) {

  done[0]++;
  const wJ = data[w];
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
    des: yJ.snippet.description,
    img: imgChannel(yJ.snippet.thumbnails.medium.url),
    handle: yJ.snippet.customUrl,
    vw: yJ.statistics.viewCount,
    sb: yJ.statistics.subscriberCount,
    vc: yJ.statistics.videoCount,
  }
  a.vw_h = strLen(wJ.vw_h +','+ Array(24).fill(a.vw).join(), hLen);
  a.sb_h = strLen(wJ.sb_h +','+ Array(24).fill(a.sb).join(), hLen);
  a.vc_h = strLen(wJ.vc_h +','+ Array(24).fill(a.vc).join(), hLen);
  a.vw_d = strLen(wJ.vw_d +','+ ((a.vw==null)? '': a.vw), dLen);
  a.sb_d = strLen(wJ.sb_d +','+ ((a.sb==null)? '': a.sb), dLen);
  a.vc_d = strLen(wJ.vc_d +','+ ((a.vc==null)? '': a.vc), dLen);

  if (tDay === 1) {
    a.vw_w = strLen(wJ.vw_w +','+ ((a.vw==null)? '': a.vw), wLen);
    a.sb_w = strLen(wJ.sb_w +','+ ((a.sb==null)? '': a.sb), wLen);
    a.vc_w = strLen(wJ.vc_w +','+ ((a.vc==null)? '': a.vc), wLen);
  } else {
    a.vw_w = (a.vw==null)? wJ.vw_w: strLast(wJ.vw_w, a.vw);
    a.sb_w = (a.sb==null)? wJ.sb_w: strLast(wJ.sb_w, a.sb);
    a.vc_w = (a.vc==null)? wJ.vc_w: strLast(wJ.vc_w, a.vc);
  }
  if (tDate === 1) {
    a.vw_m = strLen(wJ.vw_m +','+ ((a.vw==null)? '': a.vw), mLen);
    a.sb_m = strLen(wJ.sb_m +','+ ((a.sb==null)? '': a.sb), mLen);
    a.vc_m = strLen(wJ.vc_m +','+ ((a.vc==null)? '': a.vc), mLen);
  } else {
    a.vw_m = (a.vw==null)? wJ.vw_m: strLast(wJ.vw_m, a.vw);
    a.sb_m = (a.sb==null)? wJ.sb_m: strLast(wJ.sb_m, a.sb);
    a.vc_m = (a.vc==null)? wJ.vc_m: strLast(wJ.vc_m, a.vc);
  }
  a.vw_ad = null;
  a.sb_ad = null;
  a.vc_ad = null;
  a.vw_ad = (a.vw==null)? null: strSub('D', a.vw_h);
  a.sb_ad = (a.sb==null)? null: strSub('D', a.sb_h);
  a.vc_ad = (a.vc==null)? null: strSub('D', a.vc_h);
  a.vw_aw = (a.vw==null)? null: strSub('W', a.vw_d);
  a.sb_aw = (a.sb==null)? null: strSub('W', a.sb_d);
  a.vc_aw = (a.vc==null)? null: strSub('W', a.vc_d);
  a.vw_am = (a.vw==null)? null: strSub('M', a.vw_d);
  a.sb_am = (a.sb==null)? null: strSub('M', a.sb_d);
  a.vc_am = (a.vc==null)? null: strSub('M', a.vc_d);

  wY.channel_y.push(a);

  //channel_z
  a = {
    id: wJ.id,
    rc: wJ.rc,
    rn: null,
    rt: wJ.rt
  }
  a.rn_h = strLen(wJ.rn_h +','+ Array(24), hLen);
  a.rt_h = strLen(wJ.rt_h +','+ Array(24).fill(a.rt), hLen);
  a.rn_d = strLen(wJ.rn_d +',', dLen);
  a.rt_d = strLen(wJ.rt_d +',', dLen);
  if (tDay === 1) {
    a.rn_w = strLen(wJ.rn_w +',', wLen);
    a.rt_w = strLen(wJ.rt_w +','+ a.rt, wLen);
  } else {
    a.rn_w = strLast(wJ.rn_w, a.rn, false);
    a.rt_w = strLast(wJ.rt_w, a.rt);
  }
  if (tDate === 1) {
    a.rn_m = strLen(wJ.rn_m +',', mLen);
    a.rt_m = strLen(wJ.rt_m +','+ a.rt, mLen);
  } else {
    a.rn_m = strLast(wJ.rn_m, a.rn, false);
    a.rt_m = strLast(wJ.rt_m, a.rt);
  }
  wZ.channel_z.push(a);
}

function dArguments(i) {
  const wJ = wD[i];
  let a = {
    rt: Math.round(strAdd('D', wJ.rt_h, wJ.pd_l)*10000)/10000,
    vd: wJ.id,
    t_v: wJ.title,
    t_c: wJ.t_c,
    rn: strMin('D', wJ.rn_h),
    vw: strAdd('D', wJ.vw_h, wJ.pd_l),
    lk: strAdd('D', wJ.lk_h, wJ.pd_l),
    ch: wJ.ch
  }

  if (a.vd==='Kdwk1ova5TQ') {
    console.log({'Kdwk1ova5TQ':'vw_h', before:wJ.vw_h, after:a.vw});
    console.log({'Kdwk1ova5TQ':'rt_h', before:wJ.rt_h, after:a.rt});
  }

  Ranking[wJ.cat].push(a);
  r++;
}

function rArguments(f, id) {
  Top = [];
  for (let i=0; i<cNo.length; i++) { Ranking[cNo[i]] = []; }

  const range = rsRange(f, id);
  let cnt = 0;
  if (f!=='Y') { console.log({term:f,range:range}); }
  wpAPI(rURL, range).forEach(arg => {
    if (!(arg==='' || !arg)) {
      const a = JSON.parse(arg);
      if (a[rc] && a[rc].ranking) {
        for (let i=0; i<cNo.length; i++) { Ranking[cNo[i]].push(a[rc].ranking[cNo[i]]); }
      }
    }
  });
  for (let i=0; i<cNo.length; i++) { Ranking[cNo[i]] = rsSummarize(Ranking[cNo[i]]); }
  Top.sort(() => Math.random()-0.5);

  const prefix = 'YouTube急上昇ランキング '+tName[rc][f]+'まとめ【'+rsTerm(f, id)+'】各カテゴリのレシオ1位のチャンネルはこちら［';
  const suffix = '］『レシオ！』ではYouTube急上昇ランキングをリアルタイム集計';
  const excerpt = 'YouTube急上昇 ' + tName[rc][f] + 'ランキング ' + rsTerm(f, id);

  let content = wpAPI(rURL, id)[0];
  content = (content)? JSON.parse(content): {};
  content[rc] = { title: excerpt, des: prefix + Top.join() + suffix, ranking: Ranking }

  const step = (range[range.length-1]===tID)? 52: 59;
  let term = 56;
  if (f==='M') { term = 55; }
  else if (f==='Y') { term = 53; }

  let arg = {
    title: rsTitle(f, id),
    content: JSON.stringify(content),
    excerpt: excerpt,
    //adfgsfdfeatured_media: 107,
    //comment_status: 'open',
    //ping_status: 'open',
    //sticky: false,
    //categories: [4],
    tags: [70,73,74,78,79,step,term]
  };

  return wpAPI(pURL+id, arg);
}

/** ■■■■ メイン関数 ■■■■ */
function rDay(rc) {

  /** ■■■■ 実行判定 ■■■■ */
  const f1 = data[1][rCol[rc]-1];
  const f2 = data[2][rCol[rc]-1];
  console.log({rc:rc,f1:f1,f2:f2,});
  console.log({'!(f1*10%10)':!(f1*10%10),'!(f2*10%10)':!(f2*10%10)})

  if (f1===7 || f1===12 || f1===16 || f1===20) { wpFlash(rc); }
  else if (!(f1*10%10)) { wpDay(rc, f1); }
  else if (f2==='Go') { wpDrop(rc); }
  else if (!(f2*10%10)) { wpResult(rc, f2); }
  else { console.log('実施対象外'); }
}

function wpDrop(rc) {

  /** ■■■■ 変数 ■■■■ */
  time = new Date(Utilities.formatDate(new Date(), 'Etc/GMT+14', 'yyyy-MM-dd'));
  if (time.getDay()!==0) { time = new Date(time.getTime() + (7-time.getDay()) * (1000*60*60*24)); }
  let week = Number(Utilities.formatDate(time, 'Etc/GMT+14', 'yyMM') + '40');

  time = Utilities.formatDate(new Date(),'JST','yyyy-MM-dd HH:') + '00:00';
  time = new Date(time).getTime();

  function step_va() { //vArguments
    err = {};
    try {
      data = wpAPI(vURL+'30/'+rc).sort((a,b) => {
        if (a.id === b.id) { return (a.cat > b.cat)? 1: -1 }
        else { return (a.id > b.id)? 1: -1 }
      });
      wD = wpAPI(vURL+'24/'+rc);

      wY = {video_y:[]};
      wZ = {video_z:[]};
      done = [];
      todo = [].concat(data);
      console.log('vArguments\n30_todo : '+todo.length);
      while (todo.length) {
        let vID = todo.splice(0,50).map(x => x.id);
        done = done.concat(ytVideo(vID.join()).items);
      }
      todo = [].concat(done).sort((a, b) => (a.id > b.id)? 1: -1);
      console.log('WP動画情報取得 : YT動画情報取得 = ' + data.length + ' : ' + todo.length + '\n');

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

      const ySum = wY.video_y.length;
      const zSum = wZ.video_z.length;
      console.log('vArg (video_y:video_z) : '+ySum+' = '+zSum+'\n'+(done[0]+done[1]+done[2])+' ( Still : Ban = '+done[0]+' : '+done[2]+' )');
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
    return console.log('【途中終了】エラー回数超過\nvArguments')
  }

  function step_vp() { //vPost
    err = {};
    try {
      let rY = wpAPI(vURL, wY);
      let rZ = wpAPI(vURL, wZ);
      console.log('vPost（処理結果）\nvideo_y : '+rY.y+' = '+(rY.t+rY.u+rY.f)+'（正常/変更なし/エラー：'+rY.t+' / '+rY.u+' / '+rY.f+'）\nvideo_z : '+rZ.z+' = '+(rZ.t+rZ.u+rZ.f)+'（正常/変更なし/エラー：'+rZ.t+' / '+rZ.u+' / '+rZ.f+'）');
    } catch (e) {
      console.log('vPost\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_vp() }
    }
  }
  t = 0;
  step_vp();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\nvPost')
  }

  function step_ca() { //cArguments
    err = {};
    try {
      data =  wpAPI(cURL+'30/'+rc).sort((a, b) => (a.id > b.id)? 1: -1);
      done = [];
      todo = [].concat(data);
      while (todo.length) {
        let vID = todo.splice(0,50).map(x => x.id);
        done = done.concat(ytChannel(vID.join()).items);
      }
      todo = [].concat(done).sort((a, b) => (a.id > b.id)? 1: -1);
      console.log('vArguments\n30_todo : '+todo.length);
      console.log('WPチャンネル情報取得 : YTチャンネル情報取得 = ' + data.length + ' : ' + todo.length + '\n');

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

      const ySum = wY.channel_y.length;
      const zSum = wZ.channel_z.length;
      console.log('cArg (channel_y:channel_z) : '+ySum+' = '+zSum+'\n'+(done[0]+done[1]+done[2])+' ( Still : Done = '+done[0]+' : '+done[2]+' )');
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
    return console.log('【途中終了】エラー回数超過\ncArg')
  }

  function step_cp() { //cPost
    err = {};
    try {
      let rY = wpAPI(cURL, wY);
      let rZ = wpAPI(cURL, wZ);
      console.log('cPost（処理結果）\nchannel_y : '+rY.y+' = '+(rY.t+rY.u+rY.f)+'（正常/変更なし/エラー：'+rY.t+' / '+rY.u+' / '+rY.f+'）\nchannel_z : '+rZ.z+' = '+(rZ.t+rZ.u+rZ.f)+'（正常/変更なし/エラー：'+rZ.t+' / '+rZ.u+' / '+rZ.f+'）');
    } catch (e) {
      console.log('cPost\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_cp() }
    }
  }
  t = 0;
  step_cp();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\ncPost')
  }

  function step_dr() { //Dropアップデート
    err = {};
    try {
      Drop = {video_z:[]};
      d = 0;
      wpAPI(vURL +'25/'+rc).forEach(wJ => {
        if (wJ.flag==='24') {
          const a = {
            id: wJ.id,
            rc: wJ.rc,
            cat: wJ.cat,
            flag: 30
          };
          Drop.video_z.push(a);
          d++;
        }
      });
      const resD = wpAPI(vURL, Drop);
      console.log({'Dropアップデート':d+'件', res:resD});

      wD = wpAPI(vURL +'25/'+rc);
      d = 0;
      wpAPI(vURL +'25/'+rc).forEach(wJ => { if (wJ.flag === '24') { d++; } });
      if (d) console.log('■■■■ Dropアップデート漏れ ■■■■/n'+d+'件');

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

  function step_e() { //終了処理
    err = {};
    try {
      fSheet.getRange(3, rCol[rc]).setValue(tDate);
      console.log('■■■■■■■■■■ 実行完了 : wpDay ■■■■■■■■■■');
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

function wpDay(rc, f) {

  function step_da() { //WP情報取得, Ranking作成(dArguments)
    err = {};
    try {
      wD = wpAPI(vURL +'25/'+rc);
      Ranking = {};
      Top = [];
      Drop = {video_z:[]};
      r = 0;
      for (let i=0; i<cNo.length; i++) { Ranking[cNo[i]] = []; }
      for (let i=0; i<wD.length; i++) { dArguments(i); }
      for (let i=0; i<cNo.length; i++) {
        Ranking[cNo[i]].sort((a, b) => {
          if (!a.rt) { return 1; }
          else if (!b.rt) { return -1; }
          else { return (a.rt < b.rt)? 1: -1; }
        });
        Top.push(Ranking[cNo[i]][0].t_c.replace(/(チャンネル|ちゃんねる|channel|Channel)/g, ''));
      }
      console.log({ranking:r,drop:d});
    } catch (e) {
      console.log('WP情報取得, Ranking作成(dArguments)\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_da() }
    }
  }
  t = 0;
  step_da();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\nWP情報取得, Ranking作成(dArguments)')
  }

  function step_ar() { //arg : デイリーランキング
    err = {};
    try {
      const prefix = 'YouTube急上昇ランキング デイリーまとめ【'+today+'】各カテゴリのレシオ1位のチャンネルはこちら［';
      const suffix = '］『レシオ！』ではYouTube急上昇ランキングをリアルタイム集計、1時間ごとに最新情報をお届け。';
      const excerpt = 'YouTube急上昇 レシオ！デイリーランキング ' + today + ((tHour!==4)? '(集計中)': '');

      let content = wpAPI(rURL, tID)[0];
      content = (content)? JSON.parse(content): {};
      content[rc] = { title: excerpt, des: prefix + Top.join() + suffix, ranking: Ranking }

      arg = {
        date: publish,
        status: (publish<now)? 'publish': 'future',
        title: bDate+'日',
        content: JSON.stringify(content),
        excerpt: excerpt,
        featured_media: 107,
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
      const resR = wpAPI(pURL+tID, arg);
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
  if (f===4) { step_ms(); }
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\nIndexNow送信')
  }

  function step_e() { //終了処理
    err = {};
    try {
      fSheet.getRange(2, rCol[rc]).setValue(f+0.1);
      console.log('■■■■■■■■■■ 実行完了 : wpDay ■■■■■■■■■■');
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

function wpResult(rc, f) {

  let list = JSON.parse(wpAPI(pURL+5).content.raw);

  function step_w() { //週間ランキングの更新
    err = {};
    try {
      let res = rArguments('W', list[rc].w.n);
      const r = res.content.raw;
      console.log(JSON.parse(r));
      res.content = '文字数 ( 全体 : ' + rc + ' ) = ( ' + r.length + ' : ' + JSON.stringify(JSON.parse(r)[rc]).length + ' )';
      console.log({'完了':'週間ランキングの更新（'+rc+'）', res:res});
    } catch (e) {
      console.log('週間ランキングの更新\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_w() }
    }
  }
  t = 0;
  step_w();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\n週間ランキングの更新')
  }

  function step_m() { //月間ランキングの更新
    err = {};
    try {
      let res = rArguments('M', list[rc].m.n);
      const r = res.content.raw;
      console.log(JSON.parse(r));
      res.content = '文字数 ( 全体 : ' + rc + ' ) = ( ' + r.length + ' : ' + JSON.stringify(JSON.parse(r)[rc]).length + ' )';
      console.log({'完了':'月間ランキングの更新（'+rc+'）', res:res});
    } catch (e) {
      console.log('月間ランキングの更新\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_m() }
    }
  }
  t = 0;
  step_m();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\n月間ランキングの更新')
  }

  function step_y() { //年間ランキングの更新
    err = {};
    try {
      let res = rArguments('Y', list[rc].y.n);
      const r = res.content.raw;
      console.log(JSON.parse(r));
      res.content = '文字数 ( 全体 : ' + rc + ' ) = ( ' + r.length + ' : ' + JSON.stringify(JSON.parse(r)[rc]).length + ' )';
      console.log({'完了':'年間ランキングの更新（'+rc+'）', res:res});
    } catch (e) {
      console.log('年間ランキングの更新\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_y() }
    }
  }
  t = 0;
  step_y();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\n年間ランキングの更新')
  }

  function step_id() { //期間別集計記事IDの更新, 新規分記事公開
    err = {};
    try {
      list = JSON.parse(wpAPI(pURL+5).content.raw);

      list[rc].d.b = list[rc].d.n;
      list[rc].d.n = Utilities.formatDate(new Date(), 'Etc/GMT'+(Number('-4')-1), 'yyMMdd');
      if (tDay === 1) {
        ts = new Date(Utilities.formatDate(new Date(), 'Etc/GMT'+'-4', 'yyyy-MM-dd'));
        ts = Utilities.formatDate(new Date(ts.getTime() + (7-ts.getDay()) * (1000*60*60*24)), 'Etc/GMT'+'-4', 'yyMM');
        ts = Number(ts + '40');
        do { done = wpAPI(pURL+(++ts)); } while (done.tags.includes(52));
        list[rc].w.b = list[rc].w.n;
        list[rc].w.n = ts;
        console.log({'記事公開':list[rc].w.n, res:rsOpen('W',list[rc].w.n)});
      }
      if (tDate === 1) {
        list[rc].m.b = list[rc].m.n;
        list[rc].m.n = Utilities.formatDate(new Date(), 'Etc/GMT'+'-4', 'yyMM00');
        console.log({'記事公開':list[rc].m.n, res:rsOpen('M',list[rc].m.n)});
        if (tMonth === 1) {
          list[rc].y.b = list[rc].y.n;
          list[rc].y.n = Utilities.formatDate(new Date(), 'Etc/GMT'+'-4', 'yy0000');
          console.log({'記事公開':list[rc].y.n, res:rsOpen('Y',list[rc].y.n)});
        }
      }
      arg = {content: list};
      console.log({'期間別集計記事IDの更新':'before（'+rc+'）',arg:arg});
      console.log({'期間別集計記事IDの更新':'after（'+rc+'）', res:JSON.stringify(JSON.parse(wpAPI(pURL+5, arg).content.raw))});
    } catch (e) {
      console.log('arg : 期間別集計記事IDの更新\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_id() }
    }
  }
  t = 0;
  step_id();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\n期間別集計記事IDの更新')
  }

  function step_e() { //終了処理
    err = {};
    try {
      fSheet.getRange(3, rCol[rc]).setValue(f+0.1);
      console.log('■■■■■■■■■■ 実行完了 : wpResult ■■■■■■■■■■');
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
  const parent = Utilities.formatDate(time, 'Etc/GMT'+'-4', 'yyMMdd');
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

      /*
      let tw = Array(4);
      let url = Utilities.formatDate(time, 'Etc/GMT'+'-4', 'dd/');
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
      */

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
