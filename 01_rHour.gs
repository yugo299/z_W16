function rHour(rc) {

  //■■■■ 実施判定用変数 ■■■■
  const rFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
  const rSheet = rFile.getSheetByName('rWP');

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

    const url = 'https://youtube.googleapis.com/youtube/v3/videos' + filter + token;

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
  const fHour  = data[1][1];
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

  const sURL = 'https://ratio100.com';
  const vURL = sURL + '/wp-json/ratio-zid/v0/video/';
  const cURL = sURL + '/wp-json/ratio-zid/v0/channel/';

  const apiKey = '';
  const authUser = 'syo-zid';
  const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';

  ts = new Date(ts.getTime() - (1000 * 60 * 60));
  const bHour = ts.getHours();

  const today = Utilities.formatDate(new Date(), 'Etc/GMT-4', 'yyyy-MM-dd');
  const tDay = new Date(today).getDay();
  const tomottow = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd');
  const nDate = new Date(tomottow).getDate();

  const tLabel = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:') + '00';
  ts = new Date(lb_n).getTime() - (1000 * 60 * 60);
  const bLabel = Utilities.formatDate(new Date(ts), 'JST', 'yyyy-MM-dd HH:') + '00';

  data = [];
  let arg = {};
  let err = {};
  let s = 0;
  let t = 0;

  let yV = [];
  let yC = [];

  let wVY = [];
  let wVZ = [];
  let wCY = [];
  let wCZ = [];

  let wy = 0;
  let wz = 0;

  let vA = {};
  let cA = {};

  let Total = [];
  let Still = [];
  let New   = [];
  let Drop  = [];
  let yTodo = [];
  let zTodo = [];
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
    let arr = str.split(',').map(x=>Number(x));
    return (arr.length<len)? str: arr.slice(arr.length-len).join()
  }

  //■■■■ 関数 ■■■■
  function vSetData(json) {
    rn = 0;
    json.items.forEach((j) => {
      j.rc = rc;
      j.cat = cat;
      j.rn = ++rn;
      j.rt = ratio[rn];
      yV.push(j);
    });
    Total[cat] = rn;
  }

  function vArguments(i, flag) {

    //■■■■ 変数 ■■■■
    const yJ = (flag)? yV[i]: data[i];
    let yA = {};
    let zA = {};

    //■■■■ 関数 ■■■■
    function vyA () {
      if (wJ.flag===tHour) { return { id: yJ.id } }

      a = {
        id: yJ.id,
        flag: (flag)? cat: tHour,
        ch: yJ.snippet.channelId,
        title: yJ.snippet.title,
        date: Utilities.formatDate(new Date(yJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'),
        dur: convertTime(yJ.contentDetails.duration),
        des: textToLink(yJ.snippet.description),
        tags: yJ.snippet.tags.join(),
        link: 'https://youtu.be/'+yJ.id,
        img_m: yJ.snippet.thumbnails.medium.url,
        img_s: yJ.snippet.thumbnails.default.url,
        vw: yJ.statistics.viewCount,
        lk: yJ.statistics.likeCount,
        cm: yJ.statistics.commentCount,
        vw_h: yJ.statistics.viewCount,
        lk_h: yJ.statistics.likeCount,
        cm_h: yJ.statistics.commentCount,
      }
      if (wJ) {
        a.vw_h = strLen(wJ.vw_h +','+ yJ.statistics.viewCount, 72),
        a.lk_h = strLen(wJ.lk_h +','+ yJ.statistics.likeCount, 72),
        a.cm_h = strLen(wJ.cm_h +','+ yJ.statistics.commentCount, 72),
        a.lk_ah = yJ.statistics.likeCount - wJ.lk,
        a.vw_ah = yJ.statistics.viewCount - wJ.vw,
        a.cm_ah = yJ.statistics.commentCount - wJ.cm
      }
      if (tHour === 4) {
        a.vw_d = strLen(wJ.vw_d +','+ yJ.statistics.viewCount, 35);
        a.lk_d = strLen(wJ.lk_d +','+ yJ.statistics.likeCount, 35);
        a.cm_d = strLen(wJ.cm_d +','+ yJ.statistics.commentCount, 35);
        a.vw_ad = (wJ.vw_d != null)? yJ.statistics.viewCount - strLast(wJ.vw_d): null;
        a.lk_ad = (wJ.lk_d != null)? yJ.statistics.likeCount - strLast(wJ.lk_d): null;
        a.cm_ad = (wJ.cm_d != null)? yJ.statistics.commentCount - strLast(wJ.cm_d): null
      }
      if (tHour === 4 && tDay === 0) {
        a.vw_w = strLen(wJ.vw_w +','+ yJ.statistics.viewCount, 28);
        a.lk_w = strLen(wJ.lk_w +','+ yJ.statistics.likeCount, 28);
        a.cm_w = strLen(wJ.cm_w +','+ yJ.statistics.commentCount, 28);
        a.vw_aw = (wJ.vw_w != null)? yJ.statistics.viewCount - strLast(wJ.vw_w): null;
        a.lk_aw = (wJ.lk_w != null)? yJ.statistics.likeCount - strLast(wJ.lk_w): null;
        a.cm_aw = (wJ.cm_w != null)? yJ.statistics.commentCount - strLast(wJ.cm_w): null
      }
      if (tHour === 4 && nDate === 1) {
        a.vw_m = strLen(wJ.vw_m +','+ yJ.statistics.viewCount, 60);
        a.lk_m = strLen(wJ.lk_m +','+ yJ.statistics.likeCount, 60);
        a.cm_m = strLen(wJ.cm_m +','+ yJ.statistics.commentCount, 60);
        a.vw_am = (wJ.vw_m != null)? yJ.statistics.viewCount - strLast(wJ.vw_m): null;
        a.lk_am = (wJ.lk_m != null)? yJ.statistics.likeCount - strLast(wJ.lk_m): null;
        a.cm_am = (wJ.cm_m != null)? yJ.statistics.commentCount - strLast(wJ.cm_m): null
      }
      return a
    }

    function vzA () {
      if (wJ.flag===tHour) {
        return {
          id: yJ.id,
          rc: rc,
          cat: (flag)? cat: wJ.cat,
        }
      }

      a = {
        id: yJ.id,
        rc: rc,
        cat: (flag)? cat: wJ.cat,
        flag: (flag)? cat: tHour,
        rn: yJ.rn,
        rn_b: yJ.rn,
        rn_t: tLabel,
        rn_h: yJ.rn,
        rt: yJ.rt,
        rt_h: yJ.rt,
        rt_ah: yJ.rt,
        pd: 0,
        pd_f: tLabel,
        pd_l: tLabel,
        pd_b: 0,
        pd_s: tLabel,
        pd_e: tLabel
      }
      if (wJ) {
        a.rt = wJ.rt + yJ.rt;
        a.rn_h = strLen(wJ.rn_h +','+ yJ.rn, 72);
        a.rt_h = strLen(wJ.rt_h +','+ yJ.rt, 72);
        a.rt_ah = yJ.rt;
        if (a.rn > wJ.rn_b) {
          a.rn_b = wJ.rn_b;
          a.rn_t = wJ.rn_t
        }
        if (wJ.pd_l === bLabel) {
          a.pd = wJ.pd + 1;
          a.pd_f = wJ.pd_f
        }
        if (a.pd >= wJ.pd_b) {
          a.pd_b = a.pd;
          a.pd_s = wJ.pd_f;
          a.pd_e = tLabel
        }
        else {
          a.pd_b = wJ.pd_b;
          a.pd_s = wJ.pd_s;
          a.pd_e = wJ.pd_e
        }
      }
      if (tHour === 4) {
        a.rn_d = strLen(wJ.rn_d +','+ a.rn, 35);
        a.rt_d = strLen(wJ.rt_d +','+ a.rt, 35);
        a.rt_ad = (wJ.rt_d != null)? a.rt - strLast(wJ.rt_d): null;
      }
      if (tHour === 4 && tDay === 0) {
        a.rn_w = strLen(wJ.rn_w +','+ a.rn, 28);
        a.rt_w = strLen(wJ.rt_w +','+ a.rt, 28);
        a.rt_aw = (wJ.rt_w != null)? a.rt - strLast(wJ.rt_w): null;
      }
      if (tHour === 4 && nDate === 1) {
        a.rn_m = strLen(wJ.rn_m +','+ a.rn, 60);
        a.rt_m = strLen(wJ.rt_m +','+ a.rt, 60);
        a.rt_am = (wJ.rt_m != null)? a.rt - strLast(wJ.rt_m): null;
      }
    }

    //■■■■ yA ■■■■
    let f = false
    do { if (yTodo[wy].id === yJ.id) { f = true } }
    while (wy < yTodo.length && yTodo[++wy].id <= yJ.id)

    let wJ = (f) ? yTodo.splice(--wy, 1): false;
    yA = vyA();
    vA.video_y.push(yA);

    //■■■■ zA ■■■■
    wJ = {};
    f = false;
    while (wz < zTodo.length && zTodo[++wz].id <= yJ.id) {
      if (zTodo[wz].id === yJ.id) { f = true }
      else if (wJ && wz < zTodo.length && zTodo[wz+1].id > yJ.id) { wJ = false }

      if (f || !wJ) {
        wJ = (f) ? zTodo.splice(--wz, 1): false;
        zA = vzA();
        vA.video_z.push(zA);
        if (flag && wJ) { Still[cat]++ }
        else if (!wJ) { New[cat]++ }
        else { Drop[cat]++ }
      }
    }
  }

  //■■■■ BS ■■■■
  function bsMin(col, target, from, to) {
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

  function bsMax(col, target, from, to) {
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

  //■■■■ 実施判定２ ■■■■
  try { ssStart('doing') }
  catch(e) {
    ssEnd('doing');
    console.log('実施中')
  }

  function step_g() { //情報取得（WP,YT）
    err = {};
    try {
      data = wpAPI(vURL+'25/jp');
      wVY = data.video_y;
      wVZ = data.video_z;
      data = wpAPI(cURL+'25/jp');
      wCY = data.channel_y;
      wCZ = data.channel_z;

      yV = [];
      Total = Array(30).fill(0);
      for (let i=0; i<cNo.length; i++) {
        cat = cNo[i];
        const vJson1 = ytPopular();
        const vJson2 = (vJson1.nextPageToken===undefined) ? 0: getPopular(vJson1.nextPageToken);
        vSetData(vJson1);
        if (vJson2) { vSetData(vJson2) }
      }
      yV.sort((a, b) => (a.id > b.id)? 1: -1);

      let wSum = {wVY:wVY.length, wVZ:wVZ.length, wCY:wCY.length, wCZ:wCZ.length};
      let ySum = Total.reduce((sum, x) => sum + x, 0);
      console.log('WP情報取得 : ' + wSum + '\nYT情報取得 : ' + yV.length + ' = ' + ySum);

    } catch (e) {
      console.log('情報取得 (WP,YT)\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_g() }
    }
  }
  t = 0;
  step_g();
  if (t===3) {
    ssEnd('doing');
    return console.log('【途中終了】エラー回数超過\n情報取得 (WP,YT)')
  }

  function step_v() { //vArg
    err = {};
    try {
      vA = {video_y:[], video_z:[]};
      yC = {};
      Still = Array(30).fill(0);
      New = Array(30).fill(0);
      Drop = Array(30).fill(0);
      yTodo = wVY;
      zTodo = wVZ;

      wy = 0;
      wz = 0;
      for (let i=0; i<yV.length; i++) {
        if (!i || yV[i].id !== yV[i-1].id) { vArguments(i, true) }
        if (!(yC[yV[i].snippet.channelId] < yV[i].rn)) { yC[yV[i].snippet.channelId] = yV[i].rn }
      }

      data = [];
      done = zTodo;
      while (zTodo) {
        let vID = zTodo.splice(0,50).map(x => x.id);
        data = data.concat(ytVideo(Array.from(new Set(vID)).join()).items);
      }

      wy = 0;
      wz = 0;
      zTodo = done;
      for (let i=0; i<data.length; i++) {
        if (!i || data[i].id !== data[i-1].id) { vArguments(i, false) }
        yC[data[i].snippet.channelId] = null;
      }

      let aSum = Object.keys(vA.video_z).length;
      let sSum = Still.reduce((sum, x) => sum + x, 0);
      let nSum = New.reduce((sum, x) => sum + x, 0);
      let dSum = Drop.reduce((sum, x) => sum + x, 0);
      console.log('vArg : ' + aSum + ' = ' + (sSum+nSum) + '\nStill : ' + sSum + '\nNew : ' + nSum + '\nDrop : ' + dSum + ' = ' + done.length);

    } catch (e) {
      console.log('vArg\n' + e.message);
    }
    finally {
      if('message' in err && ++t < 3){ step_g() }
    }
  }
  t = 0;
  step_v();
  if (t===3) {
    ssEnd('doing');
    return console.log('【途中終了】エラー回数超過\nvArg')
  }

  function step_c() { //cArg
    err = {};
    try {


    } catch (e) {
      console.log('cArg\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_a() }
    }
  }
  t = 0;
  step_c();
  if (t===3) {
    ssEnd('doing');
    return console.log('【途中終了】エラー回数超過\ncArg')
  }

  function step_p() { //Post
    err = {};
    try {
      for (let i=k; i<yL; i++) {
        if (yData[i][3]) {
          wpEdit(vURL+yData[i][3], yData[i][4]);
          Still++;
        }
        else {
          List[yData[i][5]][3] = wpEmbed(vURL, yData[i][4]).id;
          New++;
        }
        k = i;
        t = 0;
      }
      console.log('Post : ' + yL + '\nStill : ' + Still + '\nNew : ' + New);
    } catch (e) {
      console.log('Post\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_p() }
    }
  }
  Still = 0;
  New = 0;
  k = 0;
  t = 0;
  step_p();
  if (t===3) {
    ssEnd('doing');
    return console.log('【途中終了】エラー回数超過\nPost')
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
      rSheet.getRange('B2').setValue(tHour);
      console.log('■■■■■■■■■■ 実行完了 : rHour ■■■■■■■■■■')
      deleteFlag('doing');
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
    ssEnd('doing');
    return console.log('【途中終了】エラー回数超過\n終了処理')
  }

}