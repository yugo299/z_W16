function rHour(rc) {

  //■■■■ 実施判定用変数 ■■■■
  const rFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
  const fSheet = rFile.getSheetByName('F');
  const rCol = {jp:2};

  //■■■■ SS関数 ■■■■
  function ssData() {
    const sRow = fSheet.getLastRow();
    const sCol = fSheet.getLastColumn();
    return fSheet.getRange(1, 1, sRow, sCol).getValues();
  }
  function ssWrite(sheet, src) {
    if (!src.length || !src[0].length) { return }
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
  const cTitle = [
    '映画とアニメ',
    '自動車と乗り物',
    'カテゴリ:音楽',
    'ペットと動物',
    'カテゴリ:スポーツ',
    'カテゴリ:ゲーム',
    'カテゴリ:ブログ',
    'カテゴリ:お笑い',
    'カテゴリ:エンタメ',
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

  const hLen = 72;
  const dLen = 35;
  const wLen = 28;
  const mLen = 60;

  const sURL = 'https://ratio100.com';
  const vURL = sURL + '/wp-json/ratio-zid/zid/video/';
  const cURL = sURL + '/wp-json/ratio-zid/zid/channel/';
  const iURL = sURL + '/wp-json/ratio-zid/zid/image';
  const oURL = sURL + '/wp-json/wp/v2/posts/';
  const pURL = sURL + '/wp-json/wp/v2/pages/';

  const tFile = SpreadsheetApp.openById('1lsmIYC2KOgEPgBDB6n9ADwWCyTH1dec1C_dmiZL7reQ');
  const xSheet = tFile.getSheetByName('X');
  const ySheet = tFile.getSheetByName('Y');
  const zSheet = tFile.getSheetByName('Z');

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

  let Total = [];
  let Still = [];
  let New   = [];
  let Drop  = [];

  let Top  = [];  //カテゴリ別記事用トップ10チャンネルリスト
  let Eye = [];  //カテゴリ別記事用アイキャッチ画像取得URLリスト

  let todo  = [];
  let done  = [];

  let cat   = 0;
  let rn  = 0;

  let Rank = [];

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

  function strLast(str) {
    let arr = str.split(',');
    return Number(arr[arr.length-1])
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

  function strMin(f, str) {
    let j = 0;
    arr = str.split(',');
    if (f==='D') { j = arr.length-1-24 }
    else if (f==='W') { j = arr.length-1-7 }
    else if (f==='M') { j = arr.length-1-tDate }

    val = 101;
    for (let i=j; i<arr.length-1; i++) {
      if (arr[i]==='') { continue; }
      else if (arr[i]<val) { val = arr[i] }
    }
    if (val === 101) { val = ''; }
    return val
  }

  function strHandle() {
    if (!str) { return }
    else if (str.slice(0,6) === '@user-') { return }
    else if (str.slice(0,1) != '@') { return }
    return str.slice(1)
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
      if (rn<=10) { Top[cat] = Top[cat].concat(d.snippet.channelTitle.replace(/(チャンネル|ちゃんねる|channel|Channel)/g, '')); }
    });
    Total[cat] = rn;
  }

  function vArguments(f) {

    const wJ = (f==='N')? false: data[w];
    const yJ = (f==='D')? todo[y]: yV[y];
    let a = {};

    if (f==='D' && yJ.rn!=null) {console.log({m:'エラー',id:{id:wJ.id,b:(wJ.id===yJ.id)},cat:{cat:wJ.cat,b:(wJ.cat===yJ.cat)},rn:yJ.rn})}

    //実施済み判定
    if (wJ && wJ.flag==tHour) {
      wY.video_y.unshift( { id:yJ.id } );
      wZ.video_z.unshift( { id:yJ.id, rc:rc, cat: cat} );
      done[2]++;
      return
    }

    if (wJ.ban!=null) { //非公開化 or BAN
      a = {
        id: wJ.id,
        img_m: wJ.img_m,
        img_s: wJ.img_s,
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
        pd  : null,
        pd_f: null,
        pd_l: null,
      }
      wZ.video_z.push(a);
      return done[0]++;
    }

    //video_y
    a = {
      id: yJ.id,
      ch: yJ.snippet.channelId,
      title: yJ.snippet.title,
      date: Utilities.formatDate(new Date(yJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'),
      dur: convertTime(yJ.contentDetails.duration),
      des: textToLink(yJ.snippet.description, yJ.id),
      tags: (yJ.snippet.tags)? yJ.snippet.tags.join(): '',
      img: imgVideo(yJ.snippet.thumbnails.medium.url),
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
      a.rn_d = strLen(wJ.rn_d +','+ strMin('D', a.rn_h), dLen);
      a.rt_d = strLen(wJ.rt_d +','+ a.rt, dLen);
      a.rt_ad = (a.rt === sub)? null: numR(a.rt - sub[0]);
    }
    if (tHour === 4 && tDay === 0) {
      const sub = strSub('W', a.rt_d, a.rt_d, a.rt_d);
      a.rn_w = strLen(wJ.rn_w +','+ strMin('W', a.rn_d), wLen);
      a.rt_w = strLen(wJ.rt_w +','+ a.rt, wLen);
      a.rt_aw = (a.rt === sub)? null: numR(a.rt - sub[0]);
    }
    if (tHour === 4 && nDate === 1) {
      const sub = strSub('M', a.rt_d, a.rt_d, a.rt_d);
      a.rn_m = strLen(wJ.rn_m +','+ strMin('M', a.rn_d), mLen);
      a.rt_m = strLen(wJ.rt_m +','+ a.rt, mLen);
      a.rt_am = (a.rt === sub)? null: numR(a.rt - sub[0]);
    }
    wZ.video_z.push(a);

    if (f!=='D'){Rank[a.rn][a.cat] = a.id;}
    if (a.flag!==tHour && a.flag!==24) { console.log(a); }
  }

  function cArguments(f) {

    const wJ = wD[w];
    const yJ = (f)? yC[y]: false;
    let a = {};

    if (!f) { //非公開化 or BAN
      a = {
        id: wJ.id,
        img_m: wJ.img_m,
        img_s: wJ.img_s,
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
        rt_m: strLen(wJ.rt_m +','),
        pd  : null,
        pd_f: null,
        pd_l: null,
      }
      wZ.channel_z.push(a);
      return done[0]++
    }

    //channel_y
    a = {
      id: yJ.id,
      title: yJ.snippet.title,
      date: Utilities.formatDate(new Date(yJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'),
      des: textToLink(yJ.snippet.description, yJ.id),
      img: imgChannel(yJ.snippet.thumbnails.medium.url),
      handle: yJ.snippet.customUrl,
      vw: yJ.statistics.viewCount,
      sb: yJ.statistics.subscriberCount,
      vc: yJ.statistics.videoCount,
    }
    if (wJ.date!=null) {
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
      a.sb_am = (a.sb==null)? null: a.sb - sub[1];
      a.vc_am = (a.vc==null)? null: a.vc - sub[2];
    }
    wY.channel_y.push(a);

    //channel_z
    a = {
      id: wJ.id,
      rc: rc
    }
    if (wJ.date!=null) {
      a.pd   = wJ.pd;
      a.pd_f = wJ.pd_f;
      a.pd_l = wJ.pd_l;
      a.pd_b = wJ.pd_b;
      a.pd_s = wJ.pd_s;
      a.pd_e = wJ.pd_e;
      a.rn_h = strLen(wJ.rn_h +','+ ((wJ.rn==null)? '': Number(wJ.rn)), hLen);
      a.rt_h = strLen(wJ.rt_h +','+ Number(wJ.rt), hLen);
      if (!(Number(wJ.rn) > Number(wJ.rn_b)) && wJ.rn!==undefined) {
        a.rn_b = Number(wJ.rn);
        a.rn_t = tLabel;
      }
      if (wJ.pd_l === bLabel && wJ.rn!==undefined) {
        a.pd = Number(wJ.pd) + 1;
        a.pd_l = tLabel;
      } else if (wJ.rn!==undefined) {
        a.pd = 0;
        a.pd_f = tLabel;
        a.pd_l = tLabel;
      } else {
        a.pd = null;
        a.pd_f = null;
        a.pd_l = null;
      }
      if (!(a.pd < Number(wJ.pd_b)) && a.pd!==0) {
        a.pd_b = a.pd;
        a.pd_e = tLabel;
      }
      done[0]++;
    } else {
      a.rn_b = Number(wJ.rn);
      a.rn_t = tLabel;
      a.rn_h = Array(hLen).join() + Number(wJ.rn);
      a.rn_d = Array(dLen).join();
      a.rn_w = Array(wLen).join();
      a.rn_m = Array(mLen).join();
      a.rt_h = Array(hLen).join() + Number(wJ.rt);
      a.rt_d = Array(dLen).join();
      a.rt_w = Array(wLen).join();
      a.rt_m = Array(mLen).join();
      a.pd   = 0;
      a.pd_f = tLabel;
      a.pd_l = tLabel;
      a.pd_b = 0;
      a.pd_s = tLabel;
      a.pd_e = tLabel;
      done[1]++;
    }
    if (tHour === 4) {
      a.rn_d = strLen(wJ.rn_d +','+ strMin('D', a.rn_h), dLen);
      a.rt_d = strLen(wJ.rt_d +','+ a.rt, dLen);
    }
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

  //■■■■ 実施判定２ ■■■■
  try { ssStart('doing_'+rc) }
  catch(e) {
    ssEnd('doing_'+rc);
    return console.log('実施中')
  }

  function step_i1() { //アイキャッチ画像作成
    err = {};
    try {
      const date = Utilities.formatDate(new Date(), 'JST', 'M月d日H:00');
      Eye = Array(cNo.length);
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
        Eye[i] = url;
      }
      console.log('アイキャッチ画像作成中 : '+date);

    } catch (e) {
      console.log('アイキャッチ画像作成\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_i1() }
    }
  }
  t = 0;
  step_i1();
  if (t===3) {
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\nアイキャッチ画像作成')
  }

  function step_vg() { //動画情報取得（WP,YT）
    err = {};
    try {
      wD = wpAPI(vURL+'24/'+rc).sort((a,b) => {
        if (a.id === b.id) { return (a.cat > b.cat)? 1: -1 }
        else { return (a.id > b.id)? 1: -1 }
      })
      yV = [];
      Total = Array(30).fill(0);
      Top = [...Array(30)].map(() => []);
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
      Still = Array(30).fill(0);
      New = Array(30).fill(0);
      Drop = Array(30).fill(0);

      //ランクイン動画タイプ別振り分け、[Still,New]のArg作成
      data = [].concat(wD);
      todo = [];
      done = [0,0,0];
      w = 0;
      y = 0;
      Rank = [...Array(101)].map(()=>Array(30));
      Rank[0] = [,1,2,,,,,,,,10,,,,,15,,17,,,20,,22,23,24,25,26,,28,''];
      while (w < wD.length || y < yV.length) {
        let f = false;
        if (w === wD.length) {f ='N';}
        else { cat = Number(wD[w].cat); }
        if (y === yV.length) {f ='D';}
        if (!f && wD[w].id > yV[y].id) {f ='N';}
        if (!f && wD[w].id < yV[y].id) {f ='D';}
        if (!f && cat > yV[y].cat) {f ='N';}
        if (!f && cat < yV[y].cat) {f ='D';}
        if (!f && wD[w].id===yV[y].id && cat===yV[y].cat) {f ='S';}
        if (!f) {
          console.log('ランクイン動画タイプ別振り分け、[Still,New]のArg作成 : 振り分け判定漏れ\n'+ wD[w].id +' : '+ yV[y].id +'\n'+ wD[w].cat +' : '+ yV[y].cat);
          throw new Error('エラー');
        }

        if (f ==='S') {
          vArguments('S');
          Still[cat]++;
          w++; y++;
        }
        if (f === 'N') {
          cat = yV[y].cat;
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
      ssWrite(xSheet,Rank);
      console.log('D-1\n既存 : '+done[0]+'\n新規 : '+done[1]+'\n実施済み : '+done[2]);

      //Drop動画YT情報取得
      data = [].concat(todo);
      done = [];
      console.log('D-2 : '+todo.length);
      while (todo.length) {
        let vID = todo.splice(0,50).map(x => x.id);
        done = done.concat(ytVideo(vID.join()).items);
      }
      todo = [].concat(done).sort((a, b) => (a.id > b.id)? 1: -1);

      //Drop動画のArg作成
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
      const sSum = Still.reduce((sum, x) => sum + x, 0);
      const nSum = New.reduce((sum, x) => sum + x, 0);
      const dSum = Drop.reduce((sum, x) => sum + x, 0);

      console.log('vArg\n (video_y:video_z) : ' + ySum + ' = ' + zSum + '\nYT動画情報 : ' + (sSum+nSum) + ' (Still:New = ' + sSum + ':' + nSum + ')\nWP動画情報 : '+ (sSum+dSum) + ' (Still:Drop = ' + sSum + ':' + dSum + ')');

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
      Rank = [...Array(101)].map(()=>Array(30));
      Rank[0] = [,1,2,,,,,,,,10,,,,,15,,17,,,20,,22,23,24,25,26,,28,''];
      for (let i=0; i<wZ.video_z.length; i++) {
        if (wZ.video_z[i].rn!=null) { Rank[wZ.video_z[i].rn][wZ.video_z[i].cat] = (Rank[wZ.video_z[i].rn][wZ.video_z[i].cat]=='')? ','+wZ.video_z[i].id: wZ.video_z[i].id;}
        else {wD.push([wZ.video_z[i].id,wZ.video_z[i].cat])}
      }
      ssWrite(ySheet, Rank);
      ssWrite(zSheet, wD);
      Rank = [];
      wD = [];
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
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\nvPost')
  }

  function step_cg() { //チャンネル情報取得（WP,YT）
    err = {};
    try {
      wY = {};
      wZ = {};
      wD = wpAPI(cURL+'24/'+rc).sort((a, b) => (a.id > b.id)? 1: -1);;
      data = [].concat(wD);
      yC = [];
      while (data.length) {
        let vID = data.splice(0,50).map(x => x.id);
        yC = yC.concat(ytChannel(vID.join()).items);
      }
      yC = yC.sort((a, b) => (a.id > b.id)? 1: -1);

      const wSum = wD.length;
      const ySum = yC.length;
      console.log('チャンネル情報取得（WP,YT）\nWP(channel_24) : ' + wSum + '\nYT : ' + ySum);

    } catch (e) {
      console.log('チャンネル情報取得\n' + e.message);
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
    return console.log('【途中終了】エラー回数超過\ncチャンネル情報取得')
  }

  function step_ca() { //cArg
    err = {};
    try {
      wY = {channel_y:[]};
      wZ = {channel_z:[]};
      done = [0,0,0];

      w = 0; y = 0;
      while (w < wD.length || y < yC.length) {
        let f = false;
        if (w === wD.length) { throw new Error('cArg : エラー (真偽判定ミスの可能性あり)'); }
        if (y === yC.length) { f='B'; }
        if (!f && wD[w].id > yC[y].id) { throw new Error('cArg : エラー (真偽判定ミスの可能性あり)'); }
        if (!f && wD[w].id < yC[y].id) { f='B'; }
        if (!f && wD[w].id===yC[y].id) { f='S'; }
        if (!f) {
          throw new Error('cArg エラー : 振り分け判定漏れ\n'+ wD[w].id +' : '+ yC[y].id);
        }
        cArguments(((f==='S')? true: false));
        w++;
        if (f==='S') { y++; }
      }

      const ySum = wY.channel_y.length;
      const zSum = wZ.channel_z.length;
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
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\ncArg')
  }

  function step_cp() { //cPost
    err = {};
    try {
      wD = [];
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
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\ncPost')
  }

  function step_fl() { //カテゴリ別ランキング速報アップデート
    err = {};
    try {
      for (let i=0; i<cNo.length; i++) {
        const update = Utilities.formatDate(new Date(), 'JST', 'M月d日H時');

        const prefix = 'YouTube急上昇ランキング動画まとめ【'+cName[i]+':'+update+'】トップ10にランクインしたチャンネルはこちら［';
        const suffix = '］『レシオ！』ではYouTube急上昇ランキングをリアルタイム集計、1時間ごとに最新情報をお届け。';
        const excerpt = prefix + Top[cNo[i]].join() + suffix;

        const arg = {
          title: '【速報】YouTube急上昇 '+cTitle[i]+'【'+update+'集計】',
          excerpt: excerpt,
          featured_media: 100+cNo[i],
          tags: [cNo[i],70,73,74,78,79,51,(tDay+60)]
        }
        wpAPI(oURL+cNo[i], arg);
      }
      console.log('カテゴリ別ランキング速報アップデート : '+tLabel);
    } catch (e) {
      console.log('Flash\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_fl(); }
    }
  }
  t = 0;
  step_fl();
  if (t===3) {
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\nカテゴリ別ランキング速報アップデート')
  }

  function step_re() { //日次ランキング結果アップデート
    err = {};
    try {
      const id = Utilities.formatDate(new Date(), 'Etc/GMT-4', 'yyMMdd')
      data = wpAPI(pURL+id);
      let arg = {ranking:{}, still:{}, new:{}, drop:{}};
      const flag = Number(data.excerpt.raw);
      const h = (tHour+19) % 24;

      if (tHour !== flag) {
        if (tHour === 5 || data.content.raw === '') {
          for (let i=0; i<cNo.length; i++) {
            arg.still[cNo[i]] = Array(24).fill(0);
            arg.new[cNo[i]] = Array(24).fill(0);
            arg.drop[cNo[i]] = Array(24).fill(0);
          }
        } else { arg = JSON.parse(data.content.raw); }

        for (let i=0; i<cNo.length; i++) {
          arg.still[cNo[i]][h] = Still[cNo[i]];
          arg.new[cNo[i]][h]   = New[cNo[i]];
          arg.drop[cNo[i]][h]  = Drop[cNo[i]];
        }
        arg.content = JSON.stringify(arg);
        arg.excerpt = tHour;
        console.log(wpAPI(pURL+id, arg));
        console.log('日次ランキング結果アップデート : '+tLabel+'\nid : '+id);

      } else { console.log('実施済み : 日次ランキング結果アップデート\nid : '+id) }

    } catch (e) {
      console.log('Flash\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_re(); }
    }
  }
  t = 0;
  step_re();
  if (t===3) {
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\n日次ランキング結果アップデート')
  }

  function step_i2() { //アイキャッチ画像アップデート
    err = {};
    try {
      let arg = {};
      for (let i=0; i<cNo.length; i++) {
        const image = UrlFetchApp.fetch(Eye[i]).getBlob();
        arg[cSlug[i] + '-i.jpg'] = Utilities.base64Encode(image.getBytes());
      }
      console.log(wpAPI(iURL, arg));
    } catch (e) {
      console.log('アイキャッチ画像アップデート\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_i2() }
    }
  }
  t = 0;
  step_i2();
  if (t===3) {
    ssEnd('doing_'+rc);
    return console.log('【途中終了】エラー回数超過\nアイキャッチ画像アップデート')
  }

  function step_e() { //終了処理
    err = {};
    try {
      fSheet.getRange(2, rCol[rc]).setValue(tHour);
      if (tHour===4) {fSheet.getRange(3, rCol[rc]).setValue('Go')};
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