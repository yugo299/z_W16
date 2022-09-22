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

function rFunction(vCat) {

  //フラグ取得
  const vFile = SpreadsheetApp.openById(fID[vCat]);
  const vSheet = vFile.getSheetByName('wV');
  const done = vSheet.getRange('A1').getValue();

  switch (done) {

    case tHour: return console.log('実施済み')

    case bHour: //■■■■ fVideo ■■■■
      try { setFlag(vCat, 'doing') }
      catch(e) {
        if (tMinute > 20) { deleteFlag(vCat, 'doing') }
        return console.log('実施中')
      }
      fVideo(vCat);
      deleteFlag(vCat, 'doing');
      return console.log('実行完了 : fVideo')
  }
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

function deleteRows(sheet, src) {

  sheet.getRange(1, 1, src.length, src[0].length).setValues(src);
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

function fOther() {

  //■■■■ 変数 ■■■■
  const tFile = SpreadsheetApp.openById('1CqRNxJNTJttnqv5cYnkNoo-6DW_7RDlpLyaGXDz7CC8');
  const tSheet = tFile.getSheetByName('wT');

  //editCategories();
  //editTags()

  //const vFile = SpreadsheetApp.openById(fID[vCat]);
  //const vSheet = vFile.getSheetByName('wV');
  //const cFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
  //const cSheet = cFile.getSheetByName('wC');;
  //deleteData(sheet, url);

  function editCategories() {

    let tData = getData(tSheet);
    tData = tData.filter(x => x[1]==='C')
    const len = tData.length;

    for (let i=0; i<len; i++) {
      const url = rURL + tData[i][2];
      let arg = {
        slug: tData[i][0],
        name: tData[i][5],
        description: tData[i][6],
        cf: { child: tData[i][4].split(',')}
      };
      if (tData[i][3] !== ''){ arg.parent = tData[i][3] }
      wpEdit(url, arg)
    }
  }

  function editTags() {

    let tData = getData(tSheet);
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

  function deleteData(sheet, url) {

    let src = getData(sheet);
    let id = [];

    src = src.filter(function(x){
      if (x[1]==='X') {
        id.push(x[3])
        return false;
      }
      else { return true }
    })
    const len = id.length
    if (!len) { return }

    sheet.clearContents();
    writeData(sheet, src);

    for (let i=0; i<len; i++) {
      wpDelete(url+id[i]);
    }
  }

}

function fVideo(vCat) {

  //■■■■ 変数 ■■■■
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
  ];

  const vFile = SpreadsheetApp.openById(fID[vCat]);
  const vSheet = vFile.getSheetByName('wV');

  let List = [];
  let vData = [];
  let yData = [];
  let New = 0;
  let Still = 0;
  let Drop = [];
  let lL = 0;
  let yL = 0;
  let dL = 0;
  let rank = 0;
  let row = 0;
  let start = 1;
  let arg = {};
  let err = {};

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

  function vSetData(json) { //yData[ yID, yJ, rank, wID, channelID, ListRow ]
    json.items.forEach((j) => {
      const src = [j.id, j, ++rank, , j.snippet.channelId, ];
      yData.push(src);
    });
  }

  function updateList(i) {
    row = (lL) ? bsMax(2, yData[i][0], start, lL): 0;
    if (row) {
      Still++;
      List[row][0] = today;
      List[row][1] = yData[i][2];
      yData[i][3] = List[row][3];
      yData[i][5] = row;
    }
    else {
      New++;
      row = bsMin(2, yData[i][0], start, lL++);
      List.splice(row, 0, [today, yData[i][2], yData[i][0], , yData[i][4]]);
      yData[i][3] = 0;
      yData[i][5] = row;
    }
    start = (row<lL) ? row + 1: row;
  }

  function vArguments(i) {

    //■■■■ 変数 ■■■■
    const wpJ = (row) ? vData.filter(x => x.cf.yt === yData[i][0])[0]: {};
    const ytJ = yData[i][1];

    //■■■■ 各種項目 ■■■■
    function vTitle(str) {
      return 'YouTubeチャンネル[' + strSlice(str, 7) + ']の動画が急上昇⤴'
    }

    function vContent(i) {
      return ''
    }

    function vExcerpt(i) {
      return '【視聴数' + strView(ytJ.statistics.viewCount) + '万|' + cat[vCat] + '#' + yData[i][2] + '位】YouTube急上昇ランキングを集計！"' + ytJ.snippet.channelTitle + '"のバズり動画⇒' + ytJ.snippet.title
    }

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

    let a = {};
    if (yData[i][3]) {
      a = {
        slug: 'v-'+List[row][3],
//        status: 'private',
        title: vTitle(ytJ.snippet.channelTitle),
//        content: vContent(i),
        excerpt: vExcerpt(i),
//        featured_media: 0,
        cf: {
          name: ytJ.snippet.title,
          desc: ytJ.snippet.description,
          thmb: ytJ.snippet.thumbnails.medium.url,
          yt_t: ytJ.snippet.tags,
          ch_n: ytJ.snippet.channelTitle,
          ch_y: ytJ.snippet.channelId,
          lb_n: lb_n,
          lb24: wpJ.cf.lb24.concat(lb_n),
          rn_n: yData[i][2],
          rn24: wpJ.cf.rn24.concat(yData[i][2]),
          rt_n: Number(wpJ.cf.rt_n) + ratio[yData[i][2]],
          rt24: wpJ.cf.rt24.concat(Number(wpJ.cf.rt_n) + ratio[yData[i][2]]),
          vw_n: ytJ.statistics.viewCount,
          vw24: wpJ.cf.vw24.concat(ytJ.statistics.viewCount),
          lk_n: ytJ.statistics.likeCount,
          lk24: wpJ.cf.lk24.concat(ytJ.statistics.likeCount),
          cm_n: ytJ.statistics.commentCount,
          cm24: wpJ.cf.cm24.concat(ytJ.statistics.commentCount),
        }
      }
      a.content = a.excerpt;
      if (a.cf.rn_n <= Number(wpJ.cf.rn_b)) {
        a.cf.rn_b = a.cf.rn_n;
        a.cf.rn_d = lb_n;
        a.tags = wpJ.tags.filter(x => x > 300).concat(a.cf.rn_n+100, a.cf.rn_n+200);
      } else {
        a.tags = wpJ.tags.filter(x => x > 200).concat(a.cf.rn_n+100);
      }
      if (wpJ.cf.pd_l === lb_b) {
        a.cf.pd_n = Number(wpJ.cf.pd_n) + 1;
        a.cf.pd_l = lb_n;
      } else {
        a.cf.pd_n = 0;
        a.cf.pd_f = lb_n;
        a.cf.pd_l = lb_n;
      }
      if (Number(a.cf.pd_n) >= Number(wpJ.cf.pd_b)) {
        a.cf.pd_b = a.cf.pd_n;
        a.cf.pd_s = wpJ.cf.pd_f;
        a.cf.pd_e = lb_n;
      }
      if (wpJ.cf.lb7[wpJ.cf.lb7.length-1] !== today && tDay === 1) {
        a.cf.lb7 = wpJ.cf.lb7.concat(today);
        a.cf.rn7 = wpJ.cf.rn7.concat(a.cf.rn_n);
        a.cf.rt7 = wpJ.cf.rt7.concat(a.cf.rt_n);
        a.cf.vw7 = wpJ.cf.vw7.concat(a.cf.vw_n);
        a.cf.lk7 = wpJ.cf.lk7.concat(a.cf.lk_n);
        a.cf.cm7 = wpJ.cf.cm7.concat(a.cf.cm_n)
      } else {
        a.cf.lb7 = wpJ.cf.lb7.slice(0,-1).concat(today);
        a.cf.rn7 = wpJ.cf.rn7.slice(0,-1).concat(a.cf.rn_n);
        a.cf.rt7 = wpJ.cf.rt7.slice(0,-1).concat(a.cf.rt_n);
        a.cf.vw7 = wpJ.cf.vw7.slice(0,-1).concat(a.cf.vw_n);
        a.cf.lk7 = wpJ.cf.lk7.slice(0,-1).concat(a.cf.lk_n);
        a.cf.cm7 = wpJ.cf.cm7.slice(0,-1).concat(a.cf.cm_n)
      }
      if (wpJ.cf.lb12[wpJ.cf.lb12.length-1] !== today && (tDate === 1 || tDate === 16)) {
        a.cf.lb12 = wpJ.cf.lb12.concat(today);
        a.cf.rn12 = wpJ.cf.rn12.concat(a.cf.rn_n);
        a.cf.rt12 = wpJ.cf.rt12.concat(a.cf.rt_n);
        a.cf.vw12 = wpJ.cf.vw12.concat(a.cf.vw_n);
        a.cf.lk12 = wpJ.cf.lk12.concat(a.cf.lk_n);
        a.cf.cm12 = wpJ.cf.cm12.concat(a.cf.cm_n)
      } else {
        a.cf.lb12 = wpJ.cf.lb12.slice(0,-1).concat(today);
        a.cf.rn12 = wpJ.cf.rn12.slice(0,-1).concat(a.cf.rn_n);
        a.cf.rt12 = wpJ.cf.rt12.slice(0,-1).concat(a.cf.rt_n);
        a.cf.vw12 = wpJ.cf.vw12.slice(0,-1).concat(a.cf.vw_n);
        a.cf.lk12 = wpJ.cf.lk12.slice(0,-1).concat(a.cf.lk_n);
        a.cf.cm12 = wpJ.cf.cm12.slice(0,-1).concat(a.cf.cm_n)
      }
    } else {
      a = {
        date: Utilities.formatDate(new Date(ytJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'),
        slug: 'v-'+ytJ.statistics.viewCount,
        status: 'publish',
        title: vTitle(ytJ.snippet.channelTitle),
        //content: vContent(i),
        excerpt: vExcerpt(i),
        featured_media: 0,
        categories: [vCat],
        tags: [yData[i][2]+100, yData[i][2]+200],
        cf: {
          name: ytJ.snippet.title,
          desc: ytJ.snippet.description,
          link: 'https://youtu.be/'+ytJ.id,
          thmb: ytJ.snippet.thumbnails.medium.url,
          dur: convertTime(ytJ.contentDetails.duration),
          yt: ytJ.id,
          ch_n: ytJ.snippet.channelTitle,
          ch_y: ytJ.snippet.channelId,
          yt_t: ytJ.snippet.tags,
          rn_b: yData[i][2],
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
          rn_n: yData[i][2],
          rn24: [yData[i][2]],
          rn7: [yData[i][2]],
          rn12: [yData[i][2]],
          rt_n: ratio[yData[i][2]],
          rt24: [ratio[yData[i][2]]],
          rt7: [ratio[yData[i][2]]],
          rt12: [ratio[yData[i][2]]],
          vw_n: ytJ.statistics.viewCount,
          vw24: [ytJ.statistics.viewCount],
          vw7: [ytJ.statistics.viewCount],
          vw12: [ytJ.statistics.viewCount],
          lk_n: ytJ.statistics.likeCount,
          lk24: [ytJ.statistics.likeCount],
          lk7: [ytJ.statistics.likeCount],
          lk12: [ytJ.statistics.likeCount],
          cm_n: ytJ.statistics.commentCount,
          cm24: [ytJ.statistics.commentCount],
          cm7: [ytJ.statistics.commentCount],
          cm12: [ytJ.statistics.commentCount]
        }
      }
      a.content = a.excerpt;
    }
    return a
  }

  function getPopular(nextPageToken) {

    const part = 'snippet,contentDetails,statistics';
    const vfields = 'items(id,snippet(title,description,publishedAt,thumbnails(medium(url)),tags,channelId,channelTitle),contentDetails(duration),statistics(viewCount,likeCount,commentCount)),nextPageToken';
    const filter = '?part='+part+'&chart=mostPopular&regionCode=jp&maxResults=50&videoCategoryId='+vCat+'&fields='+vfields+'&key='+apiKey;
    const token = (nextPageToken)? '&pageToken='+nextPageToken: '';

    const url = 'https://youtube.googleapis.com/youtube/v3/videos' + filter + token;

    const options = {"muteHttpExceptions" : true,};
    const resJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());

    return resJson
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

  do { //List更新、YT動画情報取得、WP動画情報取得
    err = {};

    try {
      List = getData(vSheet).map(function(x){
        if (typeof(x[1]) === 'number') {x[1] = 'R'}
        return x
      });
      lL = List.length - 1;
      rank = 0;
      row = 0;
      start = 1;
      Still = 0;
      New = 0;

      yData = [];
      const vJson1 = getPopular();
      const vJson2 = (vJson1.nextPageToken===undefined) ? 0: getPopular(vJson1.nextPageToken);
      vSetData(vJson1);
      if (vJson2) { vSetData(vJson2) }
      yData = yData.sort((a, b) => (a > b)? 1: -1);
      yL = yData.length;

      let vID = [];
      for (let i=0; i<yL; i++) {
        updateList(i);
        if (yData[i][3]) { vID.push(yData[i][3]) }
        if (i===50-1 || i===yL-1) {
          let url = vURL + '?per_page=100&include=' + vID.join('+');
          if (vID.length) { vData = vData.concat(wpView(url)) }
          vID = [];
        }
      }
      Drop = List.filter(x => x[1] === 'R');
      dL = Drop.length;
      lL = List.length;
      for (let i=0; i<lL; i++) {
        if (List[i][1] === 'R') { List[i][1] = 'D'}
      }
      console.log('Still : ' + Still + '\nNew : ' + New + '\nDrop : ' + dL);
    } catch (e) {
      console.log('List更新、YT動画情報取得、WP動画情報取得\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //Arg
    err = {};
    try {
      for (let i=0; i<yL; i++) { yData[i][4] = vArguments(i) }
      console.log('Arg : ' + yL);
    } catch (e) {
      console.log('Arg\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //Post
    err = {};
    Still = 0;
    New = 0;
    try {
      for (let i=0; i<yL; i++) {
        if (yData[i][3]) {
          Still++;
          wpEdit(vURL+yData[i][3], yData[i][4]);
        }
        else {
          New++;
          List[yData[i][5]][3] = wpEmbed(vURL, yData[i][4]).id;
        }
      }
      console.log('Post : ' + yL + '\nStill : ' + Still + '\nNew : ' + New);
    } catch (e) {
      console.log('Post\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //スプレッドシート更新
    err = {};
    try {
      List = List.filter(x => x[3] !== '' );
      writeData(vSheet, List);
      console.log('スプレッドシート更新完了');
    } catch (e) {
      console.log('スプレッドシート更新\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //Flash
    err = {};
    try {
      List = List.filter(x => typeof(x[1]) === 'number').sort((a, b) => (a[1] > b[1])? 1: -1).map(x => x[3]);
      arg = { cf: {child: List } }
      wpEdit(oURL+vCat, arg);
      console.log('Flash完了');
    } catch (e) {
      console.log('Flash\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //Reset
    err = {};
    try {
      if (dL) {
        const url = vURL + '?per_page=100&include=' + Drop.map(x => x[3]).join('+');
        vData = wpView(url);
        for (let i=0; i<dL; i++) {
          arg = {
            tags: vData[i].tags.filter(x => x > 200),
            cf: { rn_n: '' }
          }
          wpEdit(vURL+Drop[i][3], arg);
        }
      }
      console.log('Reset完了 : ' + dL);
    } catch (e) {
      console.log('Reset\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

  do { //SetFlag
    err = {};
    try {
      vSheet.getRange('A1').setValue(tHour);
      const cFile = SpreadsheetApp.openById(fID[0]);
      const fSheet = cFile.getSheetByName('F');
      const dat = getData(fSheet);
      row = dat.findIndex(x => x[0]===vCat) + 1;
      fSheet.getRange(row, 2).setValue(tHour);
      console.log('SetFlag完了 : ' + tHour);
    } catch (e) {
      console.log('SetFlag\n' + e.message);
      err = e;
    }
  } while (!'message' in err);

}