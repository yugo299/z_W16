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
      d[0]++;
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

    if (wJ.flag==='24') { wA.Drop[a.cat].push(a); d[1]++; }
    else { wA.Ranking[a.cat].push(a); r++; }
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

  let time = new Date(Utilities.formatDate(new Date(), 'Etc/GMT-5', 'yyyy-MM-dd HH:mm'));
  const date = time.getDate() - 1;
  time = new Date(Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd'));
  const day = time.getDay()+60;
  const id = String(time.getFullYear()-2000) + ((time.getMonth()+1<10)? ('0'+time.getMonth()+1): String(time.getMonth()+1)) + ((time.getDate()<10)? ('0'+time.getDate()): String(time.getDate()));
  const today = Utilities.formatDate(new Date(), 'GMT', 'yyyy年M月d日');
  const publish = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd') + ' 05:30:00';
  const now = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd') + Utilities.formatDate(new Date(), 'JST', ' HH:mm:ss');

  time = Utilities.formatDate(new Date(),'JST','yyyy-MM-dd HH:') + '00:00';
  time = new Date(time).getTime();
  let url = vURL + '25/' + rc;
  const wD = wpAPI(url);
  let wA = { Ranking: {}, Drop: {} };
  let Drop = {video_z:[]}
  let r = 0;
  let d = [0,0];

  for (let i=0; i<cNo.length; i++) { wA.Ranking[cNo[i]] = []; wA.Drop[cNo[i]] = [];}
  for (let i=0; i<wD.length; i++) { dArguments(i); }

  console.log({r:r,d:d});

  const resD = wpAPI(vURL, Drop);
  console.log('Dropアップデート：' + resD);

  excerpt = 'デイリーランキング ' + today;
  arg = {
    date: publish,
    status: (publish<now)? 'publish': 'future',
    title: date+'日',
    content: JSON.stringify(wA),
    excerpt: excerpt,
    //featured_media: 0,
    comment_status: 'open',
    ping_status: 'open',
    sticky: false,
    categories: [4],
    tags: [70,73,74,78,79,52,57,day],
  };

  const resR = wpAPI(pURL+id, arg);
  console.log('デイリーランキング更新\n' + resR);

  fSheet.getRange(3, rCol[rc]).setValue(date);
  //if (tHour===4) {fSheet.getRange(3, rCol[rc]).setValue('Go')};
}