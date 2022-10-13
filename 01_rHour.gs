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
  const tDay = new Date(today).getDay();
  const tomottow = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd');
  const nDate = new Date(tomottow).getDate();

  const tLabel = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:') + '00';
  ts = new Date(tLabel).getTime() - (1000 * 60 * 60);
  const bLabel = Utilities.formatDate(new Date(ts), 'JST', 'yyyy-MM-dd HH:') + '00';

  data = [];
  let err = {};
  let t = 0;
  let n = 0;
  let w = 0;
  let y = 0;

  let yV = [];  //YTの動画データ
  let yC = [];  //YTのチャンネルデータ

  let wD = [];  //WPの既存の動画,チャンネルデータ
  let wA = {};  //WPの動画,チャンネルPOSTデータ

  let Total = [];
  let Still = [];
  let New   = [];
  let Drop  = [];

  let todo  = [];
  let done  = [];

  let cat   = 0;
  let rn  = 0;

  //■■■■ 文字列操作 ■■■■
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
    str = str.replace(regexp_url, '<a class="external" href="$1" target="_blank" rel="noreferrer" title="外部リンク"></a> ');
    return str
  }

  function strLast(str) {
    let arr = str.split(',');
    return Number(arr[arr.length-1])
  }

  function strLen(str, len) {
    str = str.replace(/^(?:(undefined)?)\,/, '');
    let arr = str.split(',').map(x=>Number(x));
    return (arr.length<len)? str: arr.slice(arr.length-len).join()
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

    const wJ = (f==='N')? false: todo[w];
    const yJ = (f==='D')? todo[y]: yV[y];

    if (wJ && wJ.flag==tHour) {
      wA.video_y.push( { id:yJ.id } );
      wA.video_z.push( { id:yJ.id, rc:rc, cat: cat} );
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
      a.vw_h = strLen(wJ.vw_h +','+ yJ.statistics.viewCount, hLen),
      a.lk_h = strLen(wJ.lk_h +','+ yJ.statistics.likeCount, hLen),
      a.cm_h = strLen(wJ.cm_h +','+ yJ.statistics.commentCount, hLen),
      a.lk_ah = yJ.statistics.likeCount - Number(wJ.lk),
      a.vw_ah = yJ.statistics.viewCount - Number(wJ.vw),
      a.cm_ah = yJ.statistics.commentCount - Number(wJ.cm)
    } else {
      a.vw_h = Array(hLen).join() + yJ.statistics.viewCount,
      a.vw_d = Array(dLen).join();
      a.vw_w = Array(wLen).join();
      a.vw_m = Array(mLen).join();
      a.lk_h = Array(hLen).join() + yJ.statistics.likeCount,
      a.lk_d = Array(dLen).join();
      a.lk_w = Array(wLen).join();
      a.lk_m = Array(mLen).join();
      a.cm_h = Array(hLen).join() + yJ.statistics.commentCount,
      a.cm_d = Array(dLen).join();
      a.cm_w = Array(wLen).join();
      a.cm_m = Array(mLen).join();
    }
    if (tHour === 4) {
      a.vw_d = strLen(wJ.vw_d +','+ yJ.statistics.viewCount, dLen);
      a.lk_d = strLen(wJ.lk_d +','+ yJ.statistics.likeCount, dLen);
      a.cm_d = strLen(wJ.cm_d +','+ yJ.statistics.commentCount, dLen);
      a.vw_ad = (wJ.vw_d != null)? yJ.statistics.viewCount - strLast(wJ.vw_d): null;
      a.lk_ad = (wJ.lk_d != null)? yJ.statistics.likeCount - strLast(wJ.lk_d): null;
      a.cm_ad = (wJ.cm_d != null)? yJ.statistics.commentCount - strLast(wJ.cm_d): null
    }
    if (tHour === 4 && tDay === 0) {
      a.vw_w = strLen(wJ.vw_w +','+ yJ.statistics.viewCount, wLen);
      a.lk_w = strLen(wJ.lk_w +','+ yJ.statistics.likeCount, wLen);
      a.cm_w = strLen(wJ.cm_w +','+ yJ.statistics.commentCount, wLen);
      a.vw_aw = (wJ.vw_w != null)? yJ.statistics.viewCount - strLast(wJ.vw_w): null;
      a.lk_aw = (wJ.lk_w != null)? yJ.statistics.likeCount - strLast(wJ.lk_w): null;
      a.cm_aw = (wJ.cm_w != null)? yJ.statistics.commentCount - strLast(wJ.cm_w): null
    }
    if (tHour === 4 && nDate === 1) {
      a.vw_m = strLen(wJ.vw_m +','+ yJ.statistics.viewCount, mLen);
      a.lk_m = strLen(wJ.lk_m +','+ yJ.statistics.likeCount, mLen);
      a.cm_m = strLen(wJ.cm_m +','+ yJ.statistics.commentCount, mLen);
      a.vw_am = (wJ.vw_m != null)? yJ.statistics.viewCount - strLast(wJ.vw_m): null;
      a.lk_am = (wJ.lk_m != null)? yJ.statistics.likeCount - strLast(wJ.lk_m): null;
      a.cm_am = (wJ.cm_m != null)? yJ.statistics.commentCount - strLast(wJ.cm_m): null
    }
    wA.video_y.push(a);

    //video_z
    a = {
      id: yJ.id,
      rc: rc,
      cat: cat,
      flag: (f==='D')? '24': tHour,
      rn: yJ.rn,
      rt_ah: yJ.rt,
      pd_l: tLabel,
    }
    if (wJ) {
      a.rt = Number(wJ.rt) + yJ.rt;
      a.rn_h = strLen(wJ.rn_h +','+ yJ.rn, hLen);
      a.rt_h = strLen(wJ.rt_h +','+ a.rt, hLen);
      if (!(yJ.rn >= wJ.rn_b)) {
        a.rn_b = yJ.rn;
        a.rn_t = tLabel;
      }
      if (wJ.pd_l === bLabel) {
        a.pd = Number(wJ.pd) + 1;
      }
      if (!(a.pd < Number(wJ.pd_b))) {
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
      a.pd_b = 0;
      a.pd_s = tLabel;
      a.pd_e = tLabel;
    }
    if (tHour === 4) {
      a.rn_d = strLen(wJ.rn_d +','+ a.rn, dLen);
      a.rt_d = strLen(wJ.rt_d +','+ a.rt, dLen);
      a.rt_ad = (wJ.rt_d != null)? a.rt - strLast(wJ.rt_d): null;
    }
    if (tHour === 4 && tDay === 0) {
      a.rn_w = strLen(wJ.rn_w +','+ a.rn, wLen);
      a.rt_w = strLen(wJ.rt_w +','+ a.rt, wLen);
      a.rt_aw = (wJ.rt_w != null)? a.rt - strLast(wJ.rt_w): null;
    }
    if (tHour === 4 && nDate === 1) {
      a.rn_m = strLen(wJ.rn_m +','+ a.rn, mLen);
      a.rt_m = strLen(wJ.rt_m +','+ a.rt, mLen);
      a.rt_am = (wJ.rt_m != null)? a.rt - strLast(wJ.rt_m): null;
    }
    wA.video_z.push(a);
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
      a.vw_h = strLen(wJ.vw_h +','+ yJ.statistics.viewCount, hLen),
      a.sb_h = strLen(wJ.sb_h +','+ yJ.statistics.subscriberCount, hLen),
      a.vc_h = strLen(wJ.vc_h +','+ yJ.statistics.videoCount, hLen),
      a.sb_ah = yJ.statistics.subscriberCount - Number(wJ.sb),
      a.vw_ah = yJ.statistics.viewCount - Number(wJ.vw),
      a.vc_ah = yJ.statistics.videoCount - Number(wJ.vc)
    } else {
      a.vw_h = Array(hLen).join() + yJ.statistics.viewCount,
      a.vw_d = Array(dLen).join();
      a.vw_w = Array(wLen).join();
      a.vw_m = Array(mLen).join();
      a.sb_h = Array(hLen).join() + yJ.statistics.subscriberCount,
      a.sb_d = Array(dLen).join();
      a.sb_w = Array(wLen).join();
      a.sb_m = Array(mLen).join();
      a.vc_h = Array(hLen).join() + yJ.statistics.videoCount,
      a.vc_d = Array(dLen).join();
      a.vc_w = Array(wLen).join();
      a.vc_m = Array(mLen).join();
    }
    if (tHour === 4) {
      a.vw_d = strLen(wJ.vw_d +','+ yJ.statistics.viewCount, dLen);
      a.sb_d = strLen(wJ.sb_d +','+ yJ.statistics.subscriberCount, dLen);
      a.vc_d = strLen(wJ.vc_d +','+ yJ.statistics.videoCount, dLen);
      a.vw_ad = (wJ.vw_d != null)? yJ.statistics.viewCount - strLast(wJ.vw_d): null;
      a.sb_ad = (wJ.sb_d != null)? yJ.statistics.subscriberCount - strLast(wJ.sb_d): null;
      a.vc_ad = (wJ.vc_d != null)? yJ.statistics.videoCount - strLast(wJ.vc_d): null
    }
    if (tHour === 4 && tDay === 0) {
      a.vw_w = strLen(wJ.vw_w +','+ yJ.statistics.viewCount, wLen);
      a.sb_w = strLen(wJ.sb_w +','+ yJ.statistics.subscriberCount, wLen);
      a.vc_w = strLen(wJ.vc_w +','+ yJ.statistics.videoCount, wLen);
      a.vw_aw = (wJ.vw_w != null)? yJ.statistics.viewCount - strLast(wJ.vw_w): null;
      a.sb_aw = (wJ.sb_w != null)? yJ.statistics.subscriberCount - strLast(wJ.sb_w): null;
      a.vc_aw = (wJ.vc_w != null)? yJ.statistics.videoCount - strLast(wJ.vc_w): null
    }
    if (tHour === 4 && nDate === 1) {
      a.vw_m = strLen(wJ.vw_m +','+ yJ.statistics.viewCount, mLen);
      a.sb_m = strLen(wJ.sb_m +','+ yJ.statistics.subscriberCount, mLen);
      a.vc_m = strLen(wJ.vc_m +','+ yJ.statistics.videoCount, mLen);
      a.vw_am = (wJ.vw_m != null)? yJ.statistics.viewCount - strLast(wJ.vw_m): null;
      a.sb_am = (wJ.sb_m != null)? yJ.statistics.subscriberCount - strLast(wJ.sb_m): null;
      a.vc_am = (wJ.vc_m != null)? yJ.statistics.videoCount - strLast(wJ.vc_m): null
    }
    wA.channel_y.push(a);

    //channel_z
    a = {
      id: yJ.id,
      rc: rc,
      rt_ah: wJ.rt_v,
      pd_l: tLabel
    }
    if (wJ.date) {
      a.rt = Number(wJ.rt) + Number(wJ.rt_v);
      a.rn_h = strLen(wJ.rn_h +','+ wJ.rn_v, hLen);
      a.rt_h = strLen(wJ.rt_h +','+ wJ.rt_v, hLen);
      a.rt_ah = yJ.rt;
      if (!(Number(wJ.rn_v) > Number(wJ.rn_b))) {
        a.rn_b = wJ.rn_v;
        a.rn_t = tLabel;
      }
      if (wJ.pd_l === bLabel) {
        a.pd = Number(wJ.pd) + 1;
      }
      if (!(a.pd < Number(wJ.pd_b))) {
        a.pd_b = a.pd;
        a.pd_s = wJ.pd_f;
        a.pd_e = tLabel
      }
    } else {
      a.rn   = wJ.rn_v;
      a.rn_b = wJ.rn_v;
      a.rn_t = tLabel;
      a.rn_h = Array(hLen).join() + wJ.rn_v;
      a.rn_d = Array(dLen).join();
      a.rn_w = Array(wLen).join();
      a.rn_m = Array(mLen).join();
      a.rt   = wJ.rt_v;
      a.rt_h = Array(hLen).join() + wJ.rt_v;
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
      a.rn_d = strLen(wJ.rn_d +','+ a.rn, dLen);
      a.rt_d = strLen(wJ.rt_d +','+ a.rt, dLen);
      a.rt_ad = (wJ.rt_d != null)? a.rt - strLast(wJ.rt_d): null;
    }
    if (tHour === 4 && tDay === 0) {
      a.rn_w = strLen(wJ.rn_w +','+ a.rn, wLen);
      a.rt_w = strLen(wJ.rt_w +','+ a.rt, wLen);
      a.rt_aw = (wJ.rt_w != null)? a.rt - strLast(wJ.rt_w): null;
    }
    if (tHour === 4 && nDate === 1) {
      a.rn_m = strLen(wJ.rn_m +','+ a.rn, mLen);
      a.rt_m = strLen(wJ.rt_m +','+ a.rt, mLen);
      a.rt_am = (wJ.rt_m != null)? a.rt - strLast(wJ.rt_m): null;
    }
    wA.channel_z.push(a);
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
        if (vJ.nextPageToken===undefined) { data.concat(ytPopular(vJ.nextPageToken).items) }
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
      wA = {video_y:[], video_z:[]};
      yC = {};
      Still = Array(30).fill(0);
      New = Array(30).fill(0);
      Drop = Array(30).fill(0);

      //ランクイン動画(Still,New)のArg作成
      todo = wD;
      data = [];
      w = 0;
      y = 0;
      while (w < todo.length || y < yV.length) {
        cat = (w < todo.length)? Number(todo[w].cat): false;

        if (!(w === todo.length) && !(todo[w].id > yV[y].id) && !(todo[w].id >= yV[y].id)) {
          data.push(todo[w]);
          rn = false;
          w++;
          Drop[cat]++
        } else if (!(w === todo.length) && !(y === yV.length) && todo[w].id === yV[y].id) {
          vArguments('S');
          rn = true;
          w++; y++;
          Still[cat]++
        } else {
          cat = yV[y].cat;
          vArguments('N');
          rn = true;
          y++;
          New[cat]++
        }
      }

      done = [].concat(data);
      todo = [];
      while (data.length) {
        let vID = data.splice(0,50).map(x => x.id);
        todo = todo.concat(ytVideo(vID.join()).items);
      }

      //Drop動画のArg作成
      y = -1;
      while (++y < todo.length) { vArguments('D') }

      const ySum = wA.video_y.length;
      const zSum = wA.video_z.length;
      const sSum = Still.reduce((sum, x) => sum + x, 0);
      const nSum = New.reduce((sum, x) => sum + x, 0);
      const dSum = Drop.reduce((sum, x) => sum + x, 0);
      console.log('vArg (video_y:video_z) : ' + ySum + ' = ' + zSum + '\nStill : ' + sSum + '\nNew : ' + nSum + '\nDrop : ' + dSum + ' = ' + done.length);

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
      let res = wpAPI(vURL, wA);
      console.log('vPost\nvideo_y : ' + res.y  + '\nvideo_z : ' + res.z);
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
      wA = {channel_y:[], channel_z:[]};
      for (let i=0; i<wD.length; i++) { cArguments(i); }

      const ySum = wA.channel_y.length;
      const zSum = wA.channel_z.length;
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
      let res = wpAPI(cURL, wA);
      console.log('cPost\nchannel_y : ' + res.y  + '\nchannel_z : ' + res.z);
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