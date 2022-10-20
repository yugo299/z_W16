function rHour(rc) {

  //■■■■ 実施判定用変数 ■■■■
  const rFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
  const rSheet = rFile.getSheetByName('F');
  const rCol = {jp:2};

  //■■■■ SS関数 ■■■■
  function ssData() {
    const sRow = rSheet.getLastRow();
    const sCol = rSheet.getLastColumn();
    return rSheet.getRange(1, 1, sRow, sCol).getValues();
  }
  function ssWrite(sheet, src) {
    sheet.getRange(1, 1, src.length, src[0].length).setValues(src);
  }
  function ssStart(flag) { rFile.insertSheet(flag) }
  function ssEnd(flag) { rFile.deleteSheet(rFile.getSheetByName(flag)) }

  //■■■■ WP関数 ■■■■
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

  //■■■■ 実施判定１ ■■■■
  let data = ssData();
  const fHour  = data[1][rCol[rc]-1];
  let ts = new Date(Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm'));
  const tHour = ts.getHours();
  if (fHour===tHour) { return console.log('実施済み') }

  //■■■■ 変数 ■■■■
  const ratio = [,
    0.1,0.0955,0.091,0.088,0.085,0.082,0.0805,0.079,0.0775,0.076,
    0.0745,0.0735,0.0725,0.0715,0.0705,0.0695,0.0685,0.0675,0.0665,0.0655,
    0.0645,0.0635,0.0625,0.0615,0.0605,0.0595,0.0585,0.0575,0.0565,0.0555,
    0.0545,0.0535,0.0525,0.0515,0.0505,0.0495,0.0485,0.0475,0.0465,0.0455,
    0.0445,0.0435,0.0425,0.0415,0.0405,0.0395,0.0385,0.0375,0.0365,0.0355,
    0.0345,0.034,0.0335,0.033,0.0325,0.032,0.0315,0.031,0.0305,0.03,
    0.0295,0.029,0.0285,0.028,0.0275,0.027,0.0265,0.026,0.0255,0.025,
    0.0245,0.024,0.0235,0.023,0.0225,0.022,0.0215,0.021,0.0205,0.02,
    0.0195,0.019,0.0185,0.018,0.0175,0.017,0.0165,0.016,0.0155,0.015,
    0.0145,0.014,0.0135,0.013,0.0125,0.012,0.0115,0.011,0.0105,0.01
  ];

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
  const vURL = sURL + '/wp-json/ratio-zid/zid/video/';
  const cURL = sURL + '/wp-json/ratio-zid/zid/channel/';

  const authUser = 'syo-zid';
  const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';

  ts = new Date(ts.getTime() - (1000 * 60 * 60));
  const bHour = ts.getHours();

  const today = Utilities.formatDate(new Date(), 'Etc/GMT-4', 'yyyy-MM-dd');
  const tDate = new Date(today).getDate();
  const tDay = new Date(today).getDay();
  const tomottow = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd');
  const nDate = new Date(tomottow).getDate();

  const tLabel = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:') + '00:00';
  ts = new Date(tLabel).getTime() - (1000 * 60 * 60);
  const bLabel = Utilities.formatDate(new Date(ts), 'JST', 'yyyy-MM-dd HH:mm:ss');

  data = [];
  let err = {};
  let t = 0;
  let w = 0;
  let y = 0;

  let yV = [];  //YTの動画データ
  let yC = [];  //YTのチャンネルデータ

  let wD = [];  //WPの既存の動画,チャンネルデータ
  let wY = {};  //WPの Y 動画,チャンネルPOSTデータ
  let wZ = {};  //WPの Z 動画,チャンネルPOSTデータ

  let SS = [];  //SSデバッグ用でデータ

  let Total = [];
  let Still = [];
  let New   = [];
  let Drop  = [];

  let todo  = [];
  let done  = [];

  let cat   = 0;
  let rn  = 0;

  //■■■■ 文字列,数値操作 ■■■■
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
    const regexp_url = /(htt)(ps|p)(:\/)([\w/:%#\$&\?\(\)~\.=\+\-\@ぁ-んァ-ヶ亜-熙Ａ-Ｚａ-ｚ]+)/g;
    str = str.replace(regexp_url, '<a class="external" href="/link/$2$4" title="外部リンク"></a> ');
    return str
  }

  function strLast(str) {
    let arr = str.split(',');
    return Number(arr[arr.length-1])
  }

  function strLen(str, len) {
    str = str.replace(/^(?:(undefined)?)\,/, '');
    let arr = str.split(',').map(x=>(x==='')? x: Number(x));
    return (arr.length<len)? str: arr.slice(arr.length-len).join()
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

  function numR(num) {
    return Math.round(num * 10000) / 10000;
  }

  //■■■■ 関数 ■■■■
  function vSetData() {
    rn = 0;
    data.forEach(d => {
      d.rc = rc;
      d.cat = cat;
      d.rn = ++rn;
      d.rt = ratio[rn];
      yV.push(d);
    });
    Total[cat] = rn;
  }

  function vArguments(f) {

    const wJ = (f==='N')? false: data[w];
    const yJ = (f==='D')? todo[y]: yV[y];

    if (wJ && wJ.flag==tHour) {
      wY.video_y.unshift( { id:yJ.id } );
      wZ.video_z.unshift( { id:yJ.id, rc:rc, cat: cat} );
      console.log('実施済み判定\nid：'+yJ.id+'\ncat：'+cat);
      return
    }

    let a = {};
    //video_y
    a = {
      id: yJ.id,
      ch: yJ.snippet.channelId,
      title: yJ.snippet.title,
      date: Utilities.formatDate(new Date(yJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'),
      dur: convertTime(yJ.contentDetails.duration),
      des: textToLink(yJ.snippet.description),
      tags: (yJ.snippet.tags)? yJ.snippet.tags.join(): '',
      link: 'https://youtu.be/'+yJ.id,
      img_m: yJ.snippet.thumbnails.medium.url,
      img_s: yJ.snippet.thumbnails.default.url,
      vw: yJ.statistics.viewCount,
      lk: yJ.statistics.likeCount,
      cm: yJ.statistics.commentCount,
    }
    if (wJ) {
      done[0]++;
      a.vw_h = strLen(wJ.vw_h +','+ ((a.vw==null)? '': a.vw), hLen);
      a.lk_h = strLen(wJ.lk_h +','+ ((a.lk==null)? '': a.lk), hLen);
      a.cm_h = strLen(wJ.cm_h +','+ ((a.cm==null)? '': a.cm), hLen);
      a.vw_ah = (a.vw==null || wJ.vw==null)? null: a.vw - Number(wJ.vw);
      a.lk_ah = (a.lk==null || wJ.lk==null)? null: a.lk - Number(wJ.lk);
      a.cm_ah = (a.cm==null || wJ.cm==null)? null: a.cm - Number(wJ.cm);
    } else {
      done[1]++;
      a.vw_h = Array(hLen).join() + ((a.vw==null)? '': a.vw);
      a.vw_d = Array(dLen).join();
      a.vw_w = Array(wLen).join();
      a.vw_m = Array(mLen).join();
      a.lk_h = Array(hLen).join() + ((a.lk==null)? '': a.lk);
      a.lk_d = Array(dLen).join();
      a.lk_w = Array(wLen).join();
      a.lk_m = Array(mLen).join();
      a.cm_h = Array(hLen).join() + ((a.cm==null)? '': a.cm);
      a.cm_d = Array(dLen).join();
      a.cm_w = Array(wLen).join();
      a.cm_m = Array(mLen).join();
    }
    if (tHour === 4) {
      a.vw_d = strLen(wJ.vw_d +','+ ((a.vw==null)? '': a.vw), dLen);
      a.lk_d = strLen(wJ.lk_d +','+ ((a.lk==null)? '': a.lk), dLen);
      a.cm_d = strLen(wJ.cm_d +','+ ((a.cm==null)? '': a.cm), dLen);
      const sub = strSub('D', a.vw_h, a.lk_h, a.cm_h);
      a.vw_ad = (a.vw==null)? null: a.vw - sub[0];
      a.lk_ad = (a.lk==null)? null: a.lk - sub[1];
      a.cm_ad = (a.cm==null)? null: a.cm - sub[2];
    }
    if (tHour === 4 && tDay === 0) {
      a.vw_w = strLen(wJ.vw_w +','+ ((a.vw==null)? '': a.vw), wLen);
      a.lk_w = strLen(wJ.lk_w +','+ ((a.lk==null)? '': a.lk), wLen);
      a.cm_w = strLen(wJ.cm_w +','+ ((a.cm==null)? '': a.cm), wLen);
      const sub = strSub('W', a.vw_d, a.lk_d, a.cm_d);
      a.vw_aw = (a.vw==null)? null: a.vw - sub[0];
      a.lk_aw = (a.lk==null)? null: a.lk - sub[1];
      a.cm_aw = (a.cm==null)? null: a.cm - sub[2];
    }
    if (tHour === 4 && nDate === 1) {
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
      id: yJ.id,
      rc: rc,
      cat: cat,
      flag: (f==='D')? 24: tHour,
      rn: (f==='D')? null: yJ.rn,
      rt_ah: (f==='D')? null: yJ.rt
    }
    if (wJ) {
      a.rn_i = wJ.rn_i;
      a.rn_b = wJ.rn_b;
      a.rn_t = wJ.rn_t;
      a.pd   = wJ.pd;
      a.pd_f = wJ.pd_f;
      a.pd_l = wJ.pd_l;
      a.pd_b = wJ.pd_b;
      a.pd_s = wJ.pd_s;
      a.pd_e = wJ.pd_e;
      a.rt = (yJ.rt==null)? Number(wJ.rt): numR(Number(wJ.rt) + yJ.rt);
      a.rn_h = strLen(wJ.rn_h +','+ ((yJ.rn==null)? '': yJ.rn), hLen);
      a.rt_h = strLen(wJ.rt_h +','+ a.rt, hLen);
      if (!(yJ.rn >= wJ.rn_b) && f==='S') {
        a.rn_b = yJ.rn;
        a.rn_t = tLabel;
      }
      if (wJ.pd_l === bLabel && f==='S') {
        a.pd = Number(wJ.pd) + 1;
        a.pd_l = tLabel;
      }
      else if (f==='S') {
        a.pd = 0;
        a.pd_f = tLabel;
      }
      else {
        a.pd = null;
        a.pd_f = null;
        a.pd_l = null;
      }
      if (!(a.pd < Number(wJ.pd_b)) && a.pd!==0) {
        a.pd_b = a.pd;
        a.pd_s = wJ.pd_f;
        a.pd_e = tLabel
      }
    } else {
      a.rt   = yJ.rt;
      a.rn_i = tLabel;
      a.rn_b = yJ.rn;
      a.rn_t = tLabel;
      a.rn_h = Array(hLen).join() + yJ.rn;
      a.rn_d = Array(dLen).join();
      a.rn_w = Array(wLen).join();
      a.rn_m = Array(mLen).join();
      a.rt_h = Array(hLen).join() + yJ.rt;
      a.rt_d = Array(dLen).join();
      a.rt_w = Array(wLen).join();
      a.rt_m = Array(mLen).join();
      a.pd   = 0;
      a.pd_f = tLabel;
      a.pd_l = tLabel;
      a.pd_b = 0;
      a.pd_s = tLabel;
      a.pd_e = tLabel;
    }
    if (tHour === 4) {
      const sub = strSub('D', a.rt_h, a.rt_h, a.rt_h);
      a.rn_d = strLen(wJ.rn_d +','+ a.rn, dLen);
      a.rt_d = strLen(wJ.rt_d +','+ a.rt, dLen);
      a.rt_ad = (a.rt === sub)? null: numR(a.rt - sub[0]);
    }
    if (tHour === 4 && tDay === 0) {
      const sub = strSub('W', a.rt_d, a.rt_d, a.rt_d);
      a.rn_w = strLen(wJ.rn_w +','+ a.rn, wLen);
      a.rt_w = strLen(wJ.rt_w +','+ a.rt, wLen);
      a.rt_aw = (a.rt === sub)? null: numR(a.rt - sub[0]);
    }
    if (tHour === 4 && nDate === 1) {
      const sub = strSub('M', a.rt_d, a.rt_d, a.rt_d);
      a.rn_m = strLen(wJ.rn_m +','+ a.rn, mLen);
      a.rt_m = strLen(wJ.rt_m +','+ a.rt, mLen);
      a.rt_am = (a.rt === sub)? null: numR(a.rt - sub[0]);
    }
    wZ.video_z.push(a);

    SS.push([a.id, a.cat, a.rt, a.rn, a.rn_i, a.rn_b, a.rn_t, a.pd, a.pd_f, a.pd_l, a.pd_b, a.pd_s, a.pd_e]);

    if (a.flag!==tHour && a.flag!==24) { console.log(a); }
  }

  function cArguments(i) {

    const wJ = wD[i];
    const yJ = yC[i];

    let a = {};
    //channel_y
    a = {
      id: yJ.id,
      title: yJ.snippet.title,
      date: Utilities.formatDate(new Date(yJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'),
      des: textToLink(yJ.snippet.description),
      link: 'https://youtube.com/channel/'+yJ.id,
      img_m: yJ.snippet.thumbnails.medium.url,
      img_s: yJ.snippet.thumbnails.default.url,
      vw: yJ.statistics.viewCount,
      sb: yJ.statistics.subscriberCount,
      vc: yJ.statistics.videoCount,
    }
    if (wJ.date) {
      a.vw_h = strLen(wJ.vw_h +','+ ((a.vw==null)? '': a.vw), hLen);
      a.sb_h = strLen(wJ.sb_h +','+ ((a.sb==null)? '': a.sb), hLen);
      a.vc_h = strLen(wJ.vc_h +','+ ((a.vc==null)? '': a.vc), hLen);
      a.vw_ah = (a.vw==null || wJ.vw==null)? null: a.vw - Number(wJ.vw);
      a.sb_ah = (a.sb==null || wJ.sb==null)? null: a.sb - Number(wJ.sb);
      a.vc_ah = (a.vc==null || wJ.vc==null)? null: a.vc - Number(wJ.vc);
    } else {
      a.vw_h = Array(hLen).join() + ((a.vw==null)? '': a.vw);
      a.vw_d = Array(dLen).join();
      a.vw_w = Array(wLen).join();
      a.vw_m = Array(mLen).join();
      a.sb_h = Array(hLen).join() + ((a.sb==null)? '': a.sb);
      a.sb_d = Array(dLen).join();
      a.sb_w = Array(wLen).join();
      a.sb_m = Array(mLen).join();
      a.vc_h = Array(hLen).join() + ((a.vc==null)? '': a.vc);
      a.vc_d = Array(dLen).join();
      a.vc_w = Array(wLen).join();
      a.vc_m = Array(mLen).join();
    }
    if (tHour === 4) {
      a.vw_d = strLen(wJ.vw_d +','+ ((a.vw==null)? '': a.vw), dLen);
      a.sb_d = strLen(wJ.sb_d +','+ ((a.sb==null)? '': a.sb), dLen);
      a.vc_d = strLen(wJ.vc_d +','+ ((a.vc==null)? '': a.vc), dLen);
      const sub = strSub('D', a.vw_h, a.sb_h, a.vc_h);
      a.vw_ad = (a.vw==null)? null: a.vw - sub[0];
      a.sb_ad = (a.sb==null)? null: a.sb - sub[1];
      a.vc_ad = (a.vc==null)? null: a.vc - sub[2];
    }
    if (tHour === 4 && tDay === 0) {
      a.vw_w = strLen(wJ.vw_w +','+ ((a.vw==null)? '': a.vw), wLen);
      a.sb_w = strLen(wJ.sb_w +','+ ((a.sb==null)? '': a.sb), wLen);
      a.vc_w = strLen(wJ.vc_w +','+ ((a.vc==null)? '': a.vc), wLen);
      const sub = strSub('W', a.vw_d, a.sb_d, a.vc_d);
      a.vw_aw = (a.vw==null)? null: a.vw - sub[0];
      a.sb_aw = (a.sb==null)? null: a.sb - sub[1];
      a.vc_aw = (a.vc==null)? null: a.vc - sub[2];
    }
    if (tHour === 4 && nDate === 1) {
      a.vw_m = strLen(wJ.vw_m +','+ ((a.vw==null)? '': a.vw), mLen);
      a.sb_m = strLen(wJ.sb_m +','+ ((a.sb==null)? '': a.sb), mLen);
      a.vc_m = strLen(wJ.vc_m +','+ ((a.vc==null)? '': a.vc), mLen);
      const sub = strSub('M', a.vw_d, a.sb_d, a.vc_d);
      a.vw_am = (a.vw==null)? null: a.vw - sub[0];
      a.sb_am = (a.sb==null)? null: a.sb - sub[0];
      a.vc_am = (a.vc==null)? null: a.vc - sub[0];
    }
    wY.channel_y.push(a);

    //channel_z
    rt = (wJ.rt_v==null)? null: numR(Number(wJ.rt_v));
    a = {
      id: yJ.id,
      rc: rc,
      rt_ah: (wJ.rt_v==null)? null: rt,
      pd_l: tLabel
    }
    if (wJ.date) {
      a.rt = (rt==null)? Number(wJ.rt): numR(wJ.rt + rt);
      a.rn_h = strLen(wJ.rn_h +','+ ((wJ.rn_v==null)? '': wJ.rn_v), hLen);
      a.rt_h = strLen(wJ.rt_h +','+ a.rt, hLen);
      if (!(Number(wJ.rn_v) > Number(wJ.rn_b)) && rt) {
        a.rn_b = Number(wJ.rn_v);
        a.rn_t = tLabel;
      }
      if (wJ.pd_l === bLabel && rt) {
        a.pd = Number(wJ.pd) + 1;
      } else if (rt) {
        a.pd = 0;
        a.pd_f = tLabel;
      } else {
        a.pd = null;
        a.pd_f = null;
        a.pd_l = null;
      }
      if (!(a.pd < Number(wJ.pd_b)) && a.pd!==0) {
        a.pd_b = a.pd;
        a.pd_s = wJ.pd_f;
        a.pd_e = tLabel
      }
    } else {
      a.rn   = Number(wJ.rn_v);
      a.rn_b = Number(wJ.rn_v);
      a.rn_t = tLabel;
      a.rn_h = Array(hLen).join() + wJ.rn_v;
      a.rn_d = Array(dLen).join();
      a.rn_w = Array(wLen).join();
      a.rn_m = Array(mLen).join();
      a.rt   = wJ.rt_v;
      a.rt_h = Array(hLen).join() + rt;
      a.rt_d = Array(dLen).join();
      a.rt_w = Array(wLen).join();
      a.rt_m = Array(mLen).join();
      a.pd   = 0;
      a.pd_f = tLabel;
      a.pd_b = 0;
      a.pd_s = tLabel;
      a.pd_e = tLabel;
    }
    if (tHour === 4) {
      const sub = strSub('D', a.rt_h, a.rt_h, a.rt_h);
      a.rn_d = strLen(wJ.rn_d +','+ a.rn, dLen);
      a.rt_d = strLen(wJ.rt_d +','+ a.rt, dLen);
      a.rt_ad = (a.rt === sub)? null: numR(a.rt - sub[0]);
    }
    if (tHour === 4 && tDay === 0) {
      const sub = strSub('W', a.rt_d, a.rt_d, a.rt_d);
      a.rn_w = strLen(wJ.rn_w +','+ a.rn, wLen);
      a.rt_w = strLen(wJ.rt_w +','+ a.rt, wLen);
      a.rt_aw = (a.rt === sub)? null: numR(a.rt - sub[0]);
    }
    if (tHour === 4 && nDate === 1) {
      const sub = strSub('M', a.rt_d, a.rt_d, a.rt_d);
      a.rn_m = strLen(wJ.rn_m +','+ a.rn, mLen);
      a.rt_m = strLen(wJ.rt_m +','+ a.rt, mLen);
      a.rt_am = (a.rt === sub)? null: numR(a.rt - sub[0]);
    }
    wZ.channel_z.push(a);
  }

  //■■■■ 実施判定２ ■■■■
  try { ssStart('doing_'+rc) }
  catch(e) {
    ssEnd('doing_'+rc);
    return console.log('実施中')
  }

  function step_vg() { //動画情報取得（WP,YT）
    err = {};
    try {
      wD = wpAPI(vURL+'24/'+rc);
      yV = [];
      Total = Array(30).fill(0);
      for (let i=0; i<cNo.length; i++) {
        cat = cNo[i];
        let vJ = ytPopular();
        data = vJ.items;
        if (vJ.nextPageToken !== undefined) { data = data.concat(ytPopular(vJ.nextPageToken).items) }
        vSetData();
      }
      data = [];
      yV.sort((a,b) => {
        if (a.id === b.id) { return (a.cat > b.cat)? 1: -1 }
        else { return (a.id > b.id)? 1: -1 }
      })
      const wSum = wD.length;
      const ySum = Total.reduce((sum, x) => sum + x, 0);
      console.log('WP動画情報取得 : ' + wSum + '\nYT動画情報取得 : ' + ySum);

    } catch (e) {
      console.log('情報取得 (WP,YT)\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_vg() }
    }
  }
  t = 0;
  step_vg();
  if (t===3) {
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\n情報取得 (WP,YT)')
  }

  function step_va() { //vArg
    err = {};
    try {
      wY = {video_y:[]};
      wZ = {video_z:[]};
      yC = {};
      Still = Array(30).fill(0);
      New = Array(30).fill(0);
      Drop = Array(30).fill(0);
      SS = [].push(['id', 'cat', 'rt', 'rn', 'rn_i', 'rn_b', 'rn_t', 'pd', 'pd_f', 'pd_l', 'pd_b', 'pd_s', 'pd_e']);

      //ランクイン動画(Still,New)のArg作成
      todo = [];
      data = [].concat(wD);
      w = 0;
      y = 0;
      done = [0,0];
      while (w < wD.length || y < yV.length) {
        let f = false;
        if (w === wD.length) {f ='N';}
        if (y === yV.length) {f ='D';}
        if (!f && wD[w].id > yV[y].id) {f ='N';}
        if (!f && wD[w].id < yV[y].id) {f ='D';}
        if (!f && wD[w].id > yV[y].cat) {f ='N';}
        if (!f && wD[w].id < yV[y].cat) {f ='D';}
        if (!f && wD[w].id === yV[y].id && wD[w].cat === yV[y].cat) {f ='S';}
        if (!f) {
          console.log('判定漏れ\n' + wD[w].id +' : '+ yV[y].id +'\n'+ wD[w].cat +' : '+ yV[y].cat);
          throw new Error('エラー');
        }

        cat = yV[y].cat;
        if (f ==='S') {
          vArguments('S');
          Still[cat]++;
          w++; y++;
        }
        if (f === 'N') {
          vArguments('N');
          rn = true;
          y++;
          New[cat]++
        }
        if (f === 'D') {
          todo.push(wD[w]);
          Drop[cat]++;
          w++;
        }
      }
      console.log(done);

      data = [].concat(todo);
      done = []
      while (todo.length) {
        let vID = todo.splice(0,50).map(x => x.id);
        done = done.concat(ytVideo(vID.join()).items);
      }
      todo = [].concat(done);

      //Drop動画のArg作成
      done = [0,0];
      w = 0;
      y = 0;
      while (w < todo.length) { vArguments('D'); w++; y++; }
      data = [];
      todo = [];

      const dSheet = rFile.getSheetByName('D')
      ssWrite(dSheet, SS);
      SS = [];

      const ySum = wY.video_y.length;
      const zSum = wZ.video_z.length;
      const sSum = Still.reduce((sum, x) => sum + x, 0);
      const nSum = New.reduce((sum, x) => sum + x, 0);
      const dSum = Drop.reduce((sum, x) => sum + x, 0);
      console.log('vArg (video_y:video_z) : ' + ySum + ' = ' + zSum + '\nStill : ' + sSum + '\nNew : ' + nSum + '\nDrop : ' + dSum + ' = ' + done);

    } catch (e) {
      console.log('vArg\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_va() }
    }
  }
  t = 0;
  step_va();
  if (t===3) {
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\nvArg')
  }

  function step_vp() { //vPost
    err = {};
    try {
      yV = [];
      wD = [];
      let rY = wpAPI(vURL, wY);
      let rZ = wpAPI(vURL, wZ);
      console.log('vPost\nvideo_y : ' + rY.y  + '\nvideo_z : ' + rZ.z);
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
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\nvPost')
  }

  function step_cg() { //チャンネル情報取得（WP,YT）
    err = {};
    try {
      wY = {};
      wZ = {};
      wD = wpAPI(cURL+'24/'+rc);

      data = [].concat(wD);
      yC = [];
      while (data.length) {
        let vID = data.splice(0,50).map(x => x.id);
        yC = yC.concat(ytChannel(vID.join()).items);
      }

      const wSum = wD.length;
      const ySum = yC.length;
      console.log('チャンネル情報取得（WP,YT）\nWP(channel_24) : ' + wSum + '\nYT : ' + ySum);

    } catch (e) {
      console.log('cArg\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_cg() }
    }
  }
  t = 0;
  step_cg();
  if (t===3) {
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\ncArg')
  }

  function step_ca() { //cArg
    err = {};
    try {
      wY = {channel_y:[]};
      wZ = {channel_z:[]};
      for (let i=0; i<wD.length; i++) { cArguments(i); }

      const ySum = wY.channel_y.length;
      const zSum = wZ.channel_z.length;
      console.log('cArg (channel_y:channel_z) : ' + ySum + ' = ' + zSum);

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
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\ncArg')
  }

  function step_cp() { //cPost
    err = {};
    try {
      wD = [];
      let rY = wpAPI(cURL, wY);
      let rZ = wpAPI(cURL, wZ);
      console.log('cPost\nchannel_y : ' + rY.y  + '\nchannel_z : ' + rZ.z);
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
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\ncPost')
  }

/*
  function step_f() { //Flash
    err = {};
    try {
      List = List.filter(x => typeof(x[1]) === 'number').sort((a, b) => (a[1] > b[1])? 1: -1).map(x => x[3]);
      arg = { cf: {child: List } }
      wpEdit(oURL+vCat, arg);
      console.log('Flash完了 : '+List.length+'件');
    } catch (e) {
      console.log('Flash\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_f() }
    }
  }
  t = 0;
  step_f();
*/

  function step_e() { //終了処理
    err = {};
    try {
      rSheet.getRange(2, rCol[rc]).setValue(tHour);
      console.log('■■■■■■■■■■ 実行完了 : rHour ■■■■■■■■■■');
      ssEnd('doing_'+rc);
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
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\n終了処理')
  }
}