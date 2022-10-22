function rDay(rc) {

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
      vd: wJ.id,
      rc: wJ.rc,
      cat: wJ.cat,
      ch: wJ.ch,
      t_c: wJ.t_c,
      t_v: wJ.t_v,
      img_s: wJ.img_s,
      vw: wJ.vw,
      vw_ad: strSub('D', wJ.vw_h, wJ.pd_l),
      lk: wJ.vw,
      lk_ad: strSub('D', wJ.lk_h, wJ.pd_l),
      cm: wJ.cm,
      cm_ad: strSub('D', wJ.cm_h, wJ.pd_l),
      rn: wJ.rn,
      rn_i: wJ.rn_i,
      rt: wJ.rt,
      rt_ad: strSub('D', wJ.rt_h, wJ.pd_l),
      pd: wJ.pd
    }

    Ranking[a.cat].push(a);
    r++;
  }

  function strSub(f, str, label) {
    let j = 0;
    arr = str.split(',');
    if (f==='D') { j = arr.length-1-24 }
    else if (f==='W') { j = arr.length-1-7 }
    else {f==='M'} { j = arr.length-1-date }

    for (let i=j; i<arr.length-1; i++) {
      if (arr[i]!=='') { j = i; break; }
      if (i===arr.length-1) { j = arr.length-1 }
    }

    const t = (label)? Math.ceil((time-new Date(label).getTime())/(1000*60)): 0;
    val = (arr.length-1-t>j)? (arr[arr.length-1-t]-arr[j]): 0;
    return val
  }

  /** ■■■■ 実行判定 ■■■■ */
  const rFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
  const fSheet = rFile.getSheetByName('F');
  const rCol = {jp:2};
  let data = ssData();
  let flag = data[2][rCol[rc]-1];
  if (flag!=='Go') { return console.log('実施対象外') }

  /** ■■■■ 変数 ■■■■ */
  const cNo = [1,2,10,15,17,20,22,23,24,25,26,28];
  const sURL = 'https://ratio100.com';
  const pURL = sURL + '/wp-json/wp/v2/pages/';
  const vURL = sURL + '/wp-json/ratio-zid/zid/video/';
  const cURL = sURL + '/wp-json/ratio-zid/zid/channel/';
  const authUser = 'syo-zid';
  const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';

  time = new Date(Utilities.formatDate(new Date(), 'Etc/GMT-5', 'yyyy-MM-dd HH:mm'));
  const date = time.getDate() - 1;
  time = new Date(Utilities.formatDate(new Date(), 'Etc/GMT+14', 'yyyy-MM-dd'));
  const day = time.getDay()+60;
  const id = Utilities.formatDate(new Date(), 'Etc/GMT+14', 'yyMMdd');
  const today = Utilities.formatDate(new Date(), 'Etc/GMT+14', 'yyyy年M月d日');
  const publish = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd') + ' 05:30:00';
  const now = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd') + 'T' + Utilities.formatDate(new Date(), 'JST', 'HH:mm:ss');

  time = Utilities.formatDate(new Date(),'JST','yyyy-MM-dd HH:') + '00:00';
  time = new Date(time).getTime();
  let url = vURL + '25/' + rc;
  const wD = wpAPI(url);
  let Ranking = {};
  let Drop = {video_z:[]}
  let r = 0;
  let d = 0;
  let t = 0;

  function step_dr() { //dArguments
    err = {};
    try {
      for (let i=0; i<cNo.length; i++) { Ranking[cNo[i]] = []; }
      for (let i=0; i<wD.length; i++) { dArguments(i); }
      console.log({ranking:r,drop:d});
    } catch (e) {
      console.log('dArguments\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_dr() }
    }
  }
  t = 0;
  step_dr();
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
      data = wpAPI(pURL+id).content.raw;
      data.ranking = Ranking;
      const excerpt = 'デイリーランキング ' + today;

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
        tags: [70,73,74,78,79,52,57,day],
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
      console.log('デイリーランキング更新\n' + resR);
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