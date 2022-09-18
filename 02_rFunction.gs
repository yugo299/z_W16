//■■■■ 変数 ■■■■
const sURL = 'https://ratio100.com';
const oURL = sURL + '/wp-json/wp/v2/posts/';
const vURL = sURL + '/wp-json/wp/v2/video/';
const cURL = sURL + '/wp-json/wp/v2/channel/';
const pURL = sURL + '/wp-json/wp/v2/pages/';
const rURL = sURL + '/wp-json/wp/v2/categories/';
const tURL = sURL + '/wp-json/wp/v2/tags/';

const authUser = 'syo-zid';
const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';

const cNo = [1,2,10,15,17,20,22,23,24,25,26,28];

const cFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
const cSheet = cFile.getSheetByName('wC');
const fSheet = cFile.getSheetByName('F');

const date = new Date(Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm'));
const tHour = date.getHours();
let ts = date.getTime() - (1000 * 60 * 60);
ts = new Date(ts);
const bHour = ts.getHours();

function rFunction() {

  //フラグ取得
  let done = getData(fSheet);
  done = done[6][1];

  switch (done) {

    case 'Done': return console.log('実施済み')

    case tHour: //■■■■ fSummarize ■■■■
      try { setFlag('doing') }
      catch(e) { return console.log('実施中') }
      fSummarize();
      deleteFlag('doing');
      fSheet.getRange('B7').setValue('Done');
      return console.log('実行完了 : fSummarize')
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

function setFlag(flag) { cFile.insertSheet(flag) }

function deleteFlag(flag) { cFile.deleteSheet(cFile.getSheetByName(flag)) }

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

function fSummarize() {

  //■■■■ 変数 ■■■■
  let List = []; //スプレッドシート
  let vData = []; //WP動画最新
  let cData = []; //WPチャンネル既存
  let yData = []; //YTチャンネル情報
  let New = [];
  let Still = [];
  let Drop = [];
  let lL = 0;
  let vL = 0;
  let cL = 0;
  let sL = 0;
  let nL = 0;
  let row = 0;
  let start = 1;
  let s = 0;
  let e = 0;
  let err = {};

  const today = Utilities.formatDate(new Date(), 'Etc/GMT-4', 'yyyy-MM-dd');
  const tDay = new Date(today).getDay();
  const tDate = new Date(today).getDate();

  const lb_n = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:') + '00';
  ts = new Date(lb_n).getTime() - (1000 * 60 * 60);
  const lb_b = Utilities.formatDate(new Date(ts), 'JST', 'yyyy-MM-dd HH:') + '00';

  const ratio = [,
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

  const filtering = '?per_page=100&tags=101+102+103+104+105+106+107+108+109+110+111+112+113+114+115+116+117+118+119+120+121+122+123+124+125+126+127+128+129+130+131+132+133+134+135+136+137+138+139+140+141+142+143+144+145+146+147+148+149+150+151+152+153+154+155+156+157+158+159+160+161+162+163+164+165+166+167+168+169+170+171+172+173+174+175+176+177+178+179+180+181+182+183+184+185+186+187+188+189+190+191+192+193+194+195+196+197+198+199+200&page=';

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

  function bsRange(col, target) {
    const from = bsMin(col, target, 0, List.length - 1);
    const to = bsMax(col, target, from, List.length - 1);
    return { from: from, to: to };
  }

  //■■■■ YT関数 ■■■■
  function getChannel(cID, nextPageToken) {

    const part = 'id,snippet,statistics';
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

  //■■■■ WP関数 ■■■■
  function wpChannel() {
    const wID = Still.map(x => x[1]);
    const wL = wID.length;
    let s = 0;
    let e = 0;
    while (s < wL) {
      e = (s+50-1 < wL)? s+50: wL;
      url = cURL + '?per_page=100&include=' + wID.slice(s,e).join('+');
      cData = cData.concat(wpView(url));
      s = e;
    } ;
  }

  function updateList(id) {
    row = (lL) ? bsMax(2, id, start, lL): 0;
    if (row) {
      List[row][0] = today;
      List[row][1] = tHour;
      Still.push([id, List[row][3], , s, e]);
    }
    else {
      row = bsMin(2, id, start, lL++);
      List.splice(row, 0, [today, tHour, id, '']);
      New.push([id, row, , s, e]);
    }
    start = (row<lL) ? row + 1: row;
  }

  function cArguments(f, i) {

    //■■■■ 変数 ■■■■
    let vJ = [];
    let rt = 0;
    let video = [];
    let yJ = {};
    let cJ = {};
    let a = {};

    //■■■■ 各種項目 ■■■■
    function cTitle() {
      return 'YouTubeチャンネル[' + strSlice(yJ.snippet.title, 8) + ']の統計まとめ⤴'
    }

    function cContent() {
      return ''
    }

    function cExcerpt() {
      return '【登録者数' + strView(yJ.statistics.subscriberCount) + '万人|' + cat[vJ[0].categories] + '#' + vJ[0].cf.rn_n + '位】YouTube急上昇ランキングを集計！"' + yJ.snippet.title + '"のバズり動画⇒' + vJ[0].cf.name
    }

    switch (f) {
      case 'S':
        vJ = vData.slice(Still[i][3], Still[i][4]).sort(function(a,b){ return ((a.cf.rn_n > b.cf.rn_n) ?  1: -1) });
        rt = vJ.reduce((sum, x) => sum + ratio[x.cf.rn_n], 0);
        video = vJ.map(x => x.id);

        yJ = yData.filter(x => x.id === Still[i][0])[0];
        cJ = cData.filter(x => x.id === Still[i][1])[0];
        video = Array.from(new Set(video.concat(cJ.video)));
        a = {
          slug: 'c-'+cJ.id,
  //        status: 'private',
          title: cTitle(yJ.snippet.title),
          excerpt: cExcerpt(),
  //        featured_media: 0,
          cf: {
            name: yJ.snippet.title,
            desc: yJ.snippet.description,
            thmb: yJ.snippet.thumbnails.medium.url,
            video: video,
            lb_n: lb_n,
            lb24: cJ.cf.lb24.concat(lb_n),
            rn_n: vJ[0].cf.rn_n,
            rn24: cJ.cf.rn24.concat(vJ[0].cf.rn_n),
            rt_n: Number(cJ.cf.rt_n) + rt,
            rt24: cJ.cf.rt24.concat(Number(cJ.cf.rt_n) + rt),
            vw_n: yJ.statistics.viewCount,
            vw24: cJ.cf.vw24.concat(yJ.statistics.viewCount),
            sb_n: yJ.statistics.subscriberCount,
            sb24: cJ.cf.sb24.concat(yJ.statistics.subscriberCount),
            vc_n: yJ.statistics.videoCount,
            vc24: cJ.cf.vc24.concat(yJ.statistics.videoCount),
          }
        }
        a.content = a.excerpt;
        if (Number(a.cf.rn_n) <= Number(cJ.cf.rn_b)) {
          a.cf.rn_b = a.cf.rn_n;
          a.cf.rn_d = lb_n;
          a.tags = cJ.tags.filter(x => x > 300).concat(a.cf.rn_n+100, a.cf.rn_n+200);
        } else {
          a.tags = cJ.tags.filter(x => x > 200).concat(a.cf.rn_n+100);
        }
        if (cJ.cf.pd_l === lb_b) {
          a.cf.pd_n = Number(cJ.cf.pd_n) + 1;
          a.cf.pd_l = lb_n;
        } else {
          a.cf.pd_n = 0;
          a.cf.pd_f = lb_n;
          a.cf.pd_l = lb_n;
        }
        if (a.cf.pd_n >= a.cf.pd_b) {
          a.cf.pd_b = a.cf.pd_n;
          a.cf.pd_s = cJ.pd_f;
          a.cf.pd_e = lb_n;
        }
        if (cJ.cf.lb7[cJ.cf.lb7.length-1] !== today &&  tDay === 1) {
          a.cf.lb7 = cJ.cf.lb7.concat(today);
          a.cf.rn7 = cJ.cf.rn7.concat(a.cf.rn_n);
          a.cf.rt7 = cJ.cf.rt7.concat(a.cf.rt_n);
          a.cf.vw7 = cJ.cf.vw7.concat(a.cf.vw_n);
          a.cf.sb7 = cJ.cf.sb7.concat(a.cf.sb_n);
          a.cf.vc7 = cJ.cf.vc7.concat(a.cf.vc_n)
        } else {
          a.cf.lb7 = cJ.cf.lb7.slice(0,-1).concat(today);
          a.cf.rn7 = (a.cf.rn_n < cJ.cf.rn7) ? cJ.cf.rn7.slice(0,-1).concat(a.cf.rn_n): cJ.cf.rn7;
          a.cf.rt7 = cJ.cf.rt7.slice(0,-1).concat(a.cf.rt_n);
          a.cf.vw7 = cJ.cf.vw7.slice(0,-1).concat(a.cf.vw_n);
          a.cf.sb7 = cJ.cf.sb7.slice(0,-1).concat(a.cf.sb_n);
          a.cf.vc7 = cJ.cf.vc7.slice(0,-1).concat(a.cf.vc_n)
        }
        if (cJ.cf.lb12[cJ.cf.lb12.length-1] !== today &&  tDate === 1) {
          a.cf.lb12 = cJ.cf.lb12.concat(today);
          a.cf.rn12 = cJ.cf.rn12.concat(a.cf.rn_n);
          a.cf.rt12 = cJ.cf.rt12.concat(a.cf.rt_n);
          a.cf.vw12 = cJ.cf.vw12.concat(a.cf.vw_n);
          a.cf.sb12 = cJ.cf.sb12.concat(a.cf.sb_n);
          a.cf.vc12 = cJ.cf.vc12.concat(a.cf.vc_n)
        } else {
          a.cf.lb12 = cJ.cf.lb12.slice(0,-1).concat(today);
          a.cf.rn12 = (a.cf.rn_n < cJ.cf.rn12) ? cJ.cf.rn12.slice(0,-1).concat(a.cf.rn_n): cJ.cf.rn12;
          a.cf.rt12 = cJ.cf.rt12.slice(0,-1).concat(a.cf.rt_n);
          a.cf.vw12 = cJ.cf.vw12.slice(0,-1).concat(a.cf.vw_n);
          a.cf.sb12 = cJ.cf.sb12.slice(0,-1).concat(a.cf.sb_n);
          a.cf.vc12 = cJ.cf.vc12.slice(0,-1).concat(a.cf.vc_n)
        }
        return a
      case 'N':
        vJ = vData.slice(New[i][3], New[i][4]).sort(function(a,b){ return ((a.cf.rn_n > b.cf.rn_n) ?  1: -1) });
        rt = vJ.reduce((sum, x) => sum + ratio[x.cf.rn_n], 0);
        yJ = yData.filter(x => x.id === New[i][0])[0];
        video = vJ.map(x => x.id);

        a = {
          date: Utilities.formatDate(new Date(yJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'),
          slug: 'c-'+yJ.statistics.viewCount,
          status: 'publish',
          title: cTitle(yJ.snippet.title),
          excerpt: cExcerpt(),
          featured_media: 0,
          categories: 8,
          tags: [Number(vJ[0].cf.rn_n)+100, Number(vJ[0].cf.rn_n)+200],
          cf: {
            name: yJ.snippet.title,
            desc: yJ.snippet.description,
            link: 'https://youtube.com/channel/'+yJ.id,
            thmb: yJ.snippet.thumbnails.medium.url,
            yt: yJ.id,
            video: video,
            rn_b: vJ[0].cf.rn_n,
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
            rn_n: vJ[0].cf.rn_n,
            rn24: [vJ[0].cf.rn_n],
            rn7: [vJ[0].cf.rn_n],
            rn12: [vJ[0].cf.rn_n],
            rt_n: rt,
            rt24: [rt],
            rt7: [rt],
            rt12: [rt],
            vw_n: yJ.statistics.viewCount,
            vw24: [yJ.statistics.viewCount],
            vw7: [yJ.statistics.viewCount],
            vw12: [yJ.statistics.viewCount],
            sb_n: yJ.statistics.subscriberCount,
            sb24: [yJ.statistics.subscriberCount],
            sb7: [yJ.statistics.subscriberCount],
            sb12: [yJ.statistics.subscriberCount],
            vc_n: yJ.statistics.videoCount,
            vc24: [yJ.statistics.videoCount],
            vc7: [yJ.statistics.videoCount],
            vc12: [yJ.statistics.videoCount]
          }
        }
        a.content = a.excerpt;
        return a
    }
  }

  do { //ランクイン動画WP取得&ソート
    err = {};
    try {
      const cNum = cNo.length;
      for (let i=0; i<cNum; i++) {
        const url = vURL + filtering + i;
        const videos = wpView(url);
        vData = vData.concat(('data' in videos) ? []: videos);
      }
      vData = vData.sort((a,b) => ((a.cf.channel > b.cf.channel) ?  1: -1) );
      vL = vData.length;

    } catch (e) {
      console.log('チャンネルリスト取得、ランクイン動画WP取得&ソート\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //List更新、YTチャンネル情報取得
    err = {};

    List = getData(cSheet).map(function(x){
      if (typeof(x[1]) === 'number') {x[1] = 'R'}
      return x
    });
    lL = List.length - 1;
    row = 0;
    start = 1;
    cData = [];
    New = [];
    Still = [];

    try {
      let i = 0;
      while (i<vL) {
        let c = 0;
        let yID = [];
        while (c++<50 && i<vL) {
          let cID = vData[i].cf.channel;
          let f = true;
          s = i;
          while (f) {
            if (i+1<vL) {
              if (vData[i+1].cf.channel === cID) {
                i++;
              }
              else { f = false }
            }
            else { f = false }
          }
          e = i + 1;
          yID.push(cID);
          updateList(cID);
          i++;
        }
        yData = yData.concat(getChannel(yID.join()).items);
      }
      Drop = List.filter(x => x[1] === 'R');
      sL = Still.length;
      nL = New.length;
      dL = Drop.length;
      console.log('List更新\nStill : ' + sL + '\nNew : ' + nL + '\nDrop : ' + dL);
    } catch (e) {
      console.log('List更新、WP既存チャンネル情報取得\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //WP既存チャンネル情報取得
    err = {};
    try {
      cData = [];
      wpChannel();
      console.log('Still : ' + sL + '\ncData : ' + cData.length);
    } catch (e) {
      console.log('WP既存チャンネル情報取得\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //Arg : Still
    err = {};
    try {
      for (let i=0; i<sL; i++) {
        Still[i][2] = JSON.stringify(cArguments('S', i));
      }
      console.log('Still : ' + sL);
    } catch (e) {
      console.log('Arg : Still\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //Arg : Still SS
    if (!sL) { break }
    err = {};
    const sheet = [
      cFile.getSheetByName('1'),
      cFile.getSheetByName('2'),
      cFile.getSheetByName('3'),
      cFile.getSheetByName('4'),
      cFile.getSheetByName('5'),
      cFile.getSheetByName('6'),
    ]
    try {
      s = 0;
      e = 200;
      let dat = [];
      for (let i=0; i<6; i++) {
        if (s+200-1<sL) {
          dat = Still.slice(s,e).map(x => [x[0], x[2]]);
          writeData(sheet[i], dat);
          s = e;
          e += 200;
        }
        else {
          dat = Still.slice(s).map(x => [x[0], x[2]]);
          writeData(sheet[i], dat);
          console.log('Still SS: シート' + (i+1));
          break
        }
      }
    } catch (e) {
      console.log('Still SS\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //Arg : New Arg
    err = {};
    try {
      for (let i=0; i<nL; i++) {
        New[i][2] = cArguments('N', i);
      }
      console.log('New : ' + nL);
    } catch (e) {
      console.log('Arg : New\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //Arg : New Post
    if (!nL) { break }
    err = {};
    try {
      for (let i=0; i<nL; i++) {
        List[New[i][1]][3] = wpEmbed(cURL, New[i][2]).id;
      }
      console.log('New Post : ' + nL);
    } catch (e) {
      console.log('New Post : \n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //スプレッドシート更新
    err = {};
    try {
      writeData(cSheet, List);
      console.log('スプレッドシート更新\nStill : ' + sL + '\nNew : ' + nL + '\nDrop : ' + dL);
    } catch (e) {
      console.log('スプレッドシート更新\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

}