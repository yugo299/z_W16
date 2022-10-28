/** ■■■■ 変数 ■■■■ */
const cNo = [1,2,10,15,17,20,22,23,24,25,26,28];
const sURL = 'https://ratio100.com';
const pURL = sURL + '/wp-json/wp/v2/pages/';
const aURL = sURL + '/wp-json/ratio-zid/zid/a/';
const iURL = sURL + '/wp-json/ratio-zid/zid/image/';
const vURL = sURL + '/wp-json/ratio-zid/zid/video/';
const cURL = sURL + '/wp-json/ratio-zid/zid/channel/';
const authUser = 'syo-zid';
const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';
const msKey = 'cb4064ed957644f485ca6ebe1ec96ce5';

const rFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
const fSheet = rFile.getSheetByName('F');
const rCol = {jp:2};
let data = ssData();

let wD = [];
let Ranking = {};
let Drop = {video_z:[]}
let Channel = [];
let Video = [];
let Top = [];
let r = 0;
let d = 0;
let t = 0;

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
    rt_ad: Math.round(strSub('D', wJ.rt_h, wJ.pd_l)*10000)/10000,
    t_c: wJ.t_c,
    t_v: wJ.title,
    rn: strMin('D', wJ.rn_h),
    vw_ad: strSub('D', wJ.vw_h, wJ.pd_l),
    lk_ad: strSub('D', wJ.lk_h, wJ.pd_l),
    vd: wJ.id,
    rc: wJ.rc,
    ch: wJ.ch,
    vw: wJ.vw,
    lk: wJ.lk,
    cm: wJ.cm,
    cm_ad: strSub('D', wJ.cm_h, wJ.pd_l),
    rn_i: wJ.rn_i,
    rt: wJ.rt,
    pd: wJ.pd
  }

  Ranking[wJ.cat].push(a);
  r++;
}

function strSub(f, str, label) {
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
  else if (f==='M') { j = arr.length-1-date }

  val = 100;
  for (let i=j; i<arr.length-1; i++) {
    if (arr[i]==='') { continue; }
    else if (arr[i]<val) { val = arr[i] }
  }

  return val
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
      for (let i=0; i<Ranking.length; i++) {
        Ranking[i].sort((a, b) => (a.rt_ad < b.rt_ad)? 1: -1);
        Top.concat(Ranking[i][0].t_c.replace(/(チャンネル|ちゃんねる|channel|Channel)/g, ''));
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
      console.log('Dropアップデート：' + resD);
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

      const excerpt = {
        title: 'YouTube急上昇 レシオ！デイリーランキング ' + today,
        des: prefix + Top.join() + suffix
      };

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
      for (let i=0; i<Ranking.length; i++) {
        for (let j=0; j<7; j++) {
          let url = 'https://ratio100.com/youtube/channel/' + Ranking[i][j].ch;
          Channel.push(url);
          url = 'https://ratio100.com/youtube/video/' + Ranking[i][j].vd;
          Video.push(url);
        }
      }
      msSubmit(Channel);
      console.log('IndexNow送信');
      console.log(Channel.join('\n'));
      console.log('Google Indexing用');
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
  const zone = {'11':':朝', '12':':昼', '13':':夕方', '14':':夜'};
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

  const p1 = Utilities.formatDate(time, 'JST', 'yyyy-MM-dd') +'T'+hour+':00:10';
  const p2 = Utilities.formatDate(time, 'JST', 'yyyy-MM-dd') +'T'+hour+':30:00';
  const now = Utilities.formatDate(time, 'JST', 'yyyy-MM-dd HH:mm:ss').replace(' ','T');
  const parent = Utilities.formatDate(time, 'Etc/GMT-4', 'yyMMdd');
  const date = Utilities.formatDate(time, 'JST', 'M月d日');
  const day = time.getDay()+60;

  /** ■■■■ 実施判定 ■■■■ */
  const flag = wpAPI(pURL+(id+20)).title;
  if (flag === parent) { return console.log('実施済み : '+date+' '+zone[id])}

  const wD = wpAPI(aURL+'11/'+rc);
  let Ranking = {};
  let Excerpt = [];
  let err = {};
  let t = 0;

  function step_1() { //速報（11～15）
    err = {};
    try {
      Excerpt = [];
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
          const channel = a.t_c.replace(/(チャンネル|ちゃんねる|channel|Channel)/g, '');
          Excerpt.concat(channel);
        }
      }

      const prefix = 'YouTube急上昇ランキング動画まとめ【'+date+zone[id]+'】各カテゴリでランキング1位にランクインしたチャンネルはこちら［';
      const suffix = '］『レシオ！』ではYouTube急上昇ランキングをリアルタイム集計、1時間ごとに最新情報をお届け。';
      Excerpt = prefix + Array.from(new Set(Excerpt)).join() + suffix;

      const arg = {
        date: p1,
        status: 'publish',
        title: '【速報】YouTube急上昇ランキングまとめ【'+date+zone[id]+'】',
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

  function step_2() { //速報（31～35）
    err = {};
    try {
      const arg = {
        date: p2,
        status: (p2<now)? 'publish': 'future',
        title: parent + '【' + zone[id] + '】',
        content: '',
        excerpt: '',
        featured_media: fm,
        comment_status: 'open',
        ping_status: 'open',
        sticky: false,
        parent: parent,
        categories: [4],
        tags: [70,73,74,78,51,day]
      }

      let res = wpAPI(pURL+(id+20), arg);
      console.log(res)

    } catch (e) {
      console.log('速報（31～35）\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_2() }
    }
  }
  t = 0;
  step_2();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\n速報（31～35）')
  }

  function step_fm() { //アイキャッチ画像
    err = {};
    try {
      const t1 = 'レシオ！';
      const t2 = 'YouTube急上昇ランキング';
      const t4 = '【速報】'+ date + zone[id] +'【集計】';
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
      console.log({name:(slug[i] + '-i.jpg'), length:arg[slug[id] + '-i.jpg'].length})

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
