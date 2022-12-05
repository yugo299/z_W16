/** ■■■■ 変数 ■■■■ */
const cNo = [1,2,10,15,17,20,22,23,24,25,26,28];
const tName = { jp: {d:'24時間', w:'週間', m:'月間', y:'年間'} };
const zone = { jp:'-9', gb:'', us:'+5' };
const rCol = { jp:2, gb:3, us:4 };

const hLen = 72;
const dLen = 35;
const wLen = 28;
const mLen = 60;

const sURL = 'https://ratio100.com';
const aURL = sURL + '/wp-json/ratio-zid/zid/a/';
const vURL = sURL + '/wp-json/ratio-zid/zid/video/';
const cURL = sURL + '/wp-json/ratio-zid/zid/channel/';
const authUser = 'syo-zid';
const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';
const apiKey = 'AIzaSyCjUPHiLdiJAhg04-nSfXCH11fsrClH0DI';

const rFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');
const fSheet = rFile.getSheetByName('F');

function rWeek() {

  /** ■■■■ 変数 ■■■■ */
  let d = new Date();
  const now = Utilities.formatDate(d, 'Etc/GMT'+zone.jp, 'yyyy-MM-dd HH:mm:ss').replace(' ','T');
  const today = new Date(d.getTime() - 3600000*5);
  const tomorrow = new Date(d.getTime() + 3600000*19);

  const tHour = new Date(now).getHours();
  const tDate = today.getDate();
  const tDay = today.getDay();

  const tLabel = Utilities.formatDate(d, 'Etc/GMT'+zone[rc], 'yyyy-MM-dd HH:00:00').replace(' ','T');

  let wY = {};
  let wZ = {};
  let w = 0;
  let y = 0;
  let todo = [];
  let done = [];
  let wD = [];
  let Drop = {video_z:[]}
  d = 0;
  let t = 0;
  let err = {};

  /** ■■■■ 実行判定 ■■■■ */
  let data = ssData();
  const f1 = data[1][rCol[rc]-1];
  const f2 = data[2][rCol[rc]-1];
  console.log({rc:rc,f1:f1,f2:f2,tHour:tHour,tLabel:tLabel});
  console.log({'wpDay':(f1*10%10<2),'wpDrop':(f2==='Go'),'wpResult':!(f2*10%10)})

  if (f1===7 || f1===12 || f1===16 || f1===20) { wpFlash(rc, f1); }
  if (f1*10%10<2) { wpDay(rc, f1); }
  else if (f2==='Go') { wpDrop(rc); }
  else if (!(f2*10%10)) { wpResult(rc, f2); }
  else { console.log('実施対象外'); }

  /** ■■■■ SS/WP関数 ■■■■ */
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

  function strAdd(f, str, label) { //集計（途中）
    let val = null;
    let j = 0;
    let ts = (label)? Math.round((new Date(tLabel).getTime()-new Date(label).getTime())/(1000*60*60)): 0;

    let arr = str.split(',').map(x => (x==='')? '': Number(x));
    if (f==='d') { j = arr.length-1-((tHour+23-4)%24+1); }
    else if (f==='w') { j = arr.length-1-((tDay+6)%7+1); }
    else if (f==='m') { j = arr.length-1-tDate; }

    for (let i=j; i<arr.length-1; i++) {
      if (arr[i]!=='') { j = i; break; }
      else if (i===arr.length-1) { j = arr.length-1; }
    }
    for (let i=arr.length-1-ts; i>=j; i--) {
      if (arr[i]!=='') { val = arr[i]-arr[j]; break; }
    }
    return val
  }

  function strMin(f, str) {
    let j = 0;
    const arr = str.split(',').map(x => Number(x));
    if (f==='d') { j = arr.length-1-((tHour+23-4)%24+1); }
    else if (f==='w') { j = arr.length-1-7; }
    else if (f==='m') { j = arr.length-1-tDate; }

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

  function strSub(f, str) { //デイリーの集計（確定）
    let val = null;
    let j = 0;
    const arr = str.split(',').map(x => (x==='')? '': Number(x));
    if (f==='d') { j = arr.length-1-24 }
    else if (f==='w') { j = arr.length-1-7 }
    else {f==='m'} { j = arr.length-1-30 }

    for (let i=j; i<arr.length; i++) {
      if (arr[i]!=='') { j = i; break; }
      if (i===arr.length-1) { j = arr.length-1 }
    }
    for (let i=arr.length-1; i>=j; i--) {
      if (arr[i]==='') { continue; }
      else { val = arr[arr.length-1]-arr[j]; }
    }
    //if (arr[arr.length-1]==='') {console.log({'エラー':d, f:f, label:label, str:str});}
    return val
  }

  /** ■■■■ Arg関数 ■■■■ */
  function vArguments() {
    const wJ = data[w];
    const yJ = todo[y];
    let a = {};

    //video_y
    if (!~wD.findIndex(x => x.id===wJ.id) || wJ.ban!=null) {
      if (wJ.ban==null) {
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
      }
      else { //非公開化 or BAN
        a = {
          id: wJ.id,
          vw: wJ.vw,
          lk: wJ.lk,
          cm: wJ.cm
        }
        done[2]++;
      }

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
      a.vw_ad = (a.vw==null)? null: strSub('d', a.vw_h);
      a.lk_ad = (a.lk==null)? null: strSub('d', a.lk_h);
      a.cm_ad = (a.cm==null)? null: strSub('d', a.cm_h);
      a.vw_aw = (a.vw==null)? null: strSub('w', a.vw_d);
      a.lk_aw = (a.lk==null)? null: strSub('w', a.lk_d);
      a.cm_aw = (a.cm==null)? null: strSub('w', a.cm_d);
      a.vw_am = (a.vw==null)? null: strSub('m', a.vw_d);
      a.lk_am = (a.lk==null)? null: strSub('m', a.lk_d);
      a.cm_am = (a.cm==null)? null: strSub('m', a.cm_d);

      wY.video_y.push(a);
    }

    //video_z
    a = {
      id: wJ.id,
      rc: wJ.rc,
      cat: wJ.cat,
      flag: (wJ.ban==null)? 30: 30, //ウィークリー更新作成後に70にする
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
    a.rt_ad = strSub('d', a.rt_h);
    a.rt_aw = strSub('w', a.rt_d);
    a.rt_am = strSub('m', a.rt_d);
    a.rt_ad = (a.rt_ad)? a.rt_ad: null;
    a.rt_aw = (a.rt_aw)? a.rt_aw: null;
    a.rt_am = (a.rt_am)? a.rt_am: null;

    wZ.video_z.push(a);
  }

  function cArguments(f) {

    const wJ = data[w];
    const yJ = todo[y];
    let a = {};

    //channel_y
    if (f) {
      a = {
        id: yJ.id,
        title: yJ.snippet.title,
        des: yJ.snippet.description,
        img: imgChannel(yJ.snippet.thumbnails.medium.url),
        handle: yJ.snippet.customUrl,
        vw: yJ.statistics.viewCount,
        sb: yJ.statistics.subscriberCount,
        vc: yJ.statistics.videoCount
      }
      done[0]++;
    } else { //非公開化 or BAN
      a = {
        id: wJ.id,
        vw: wJ.vw,
        sb: wJ.sb,
        vc: wJ.vc
      }
      done[2]++;
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
    a.vw_ad = (a.vw==null)? null: strSub('d', a.vw_h);
    a.sb_ad = (a.sb==null)? null: strSub('d', a.sb_h);
    a.vc_ad = (a.vc==null)? null: strSub('d', a.vc_h);
    a.vw_aw = (a.vw==null)? null: strSub('w', a.vw_d);
    a.sb_aw = (a.sb==null)? null: strSub('w', a.sb_d);
    a.vc_aw = (a.vc==null)? null: strSub('w', a.vc_d);
    a.vw_am = (a.vw==null)? null: strSub('m', a.vw_d);
    a.sb_am = (a.sb==null)? null: strSub('m', a.sb_d);
    a.vc_am = (a.vc==null)? null: strSub('m', a.vc_d);

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

  /** ■■■■ メイン関数 ■■■■ */
  function wpDrop(rc) {

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
        console.log('■■■■ Dropアップデート漏れ ■■■■/n'+d+'件');

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


  function wpUpdate(rc) {

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
          if (!f && data[w].id===todo[y].id) { f='d'; }
          if (!f) { throw new Error('cArg エラー : 振り分け判定漏れ\n'+ data[w].id +' : '+ todo[y].id); }
          if (f==='B') { data[w].ban = true; }

          cat = data[w].cat;
          if (!cat) {console.log('Drop動画のArg作成 : カテゴリ『0』エラー\nid : '+data[w].id)}
          vArguments();
          w++;
          if (f==='d') { y++; }
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
        console.log('■■■■ Dropアップデート漏れ ■■■■/n'+d+'件');

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

}