/** ■■■■ 変数 ■■■■ */
const apiKey = 'AIzaSyDc4oD2yszHNMdF5YLwVjT1-9QlRmm-jec';

const sURL = 'https://ratio100.com';
const aURL = sURL + '/wp-json/ratio-zid/zid/activities/';
const authUser = 'syo-zid';
const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';

function rActivities() {

  /** ■■■■ 実施判定 ■■■■ */
  const date = new Date(Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss'));
  const hour = date.getHours();
  let id = wpAPI(aURL).activities;
  if (id === '') { id = '------------------------'; }
  if (id==='------------------------' && hour!==5) { return console.log('実施済み'); }
  console.log('実施開始位置 : '+id);

  /** ■■■■ 変数 ■■■■ */
  let xA = {};
  let yA = {};
  let err = {};
  let t = 0;

  function step_a() { //aArguments,バナー取得
    err = {};
    try {
      const list = wpAPI(aURL+id);
      const num = (list.length===51)? 50: list.length;
      const next = (list.length===51)? list[50].id: '------------------------';

      xA = {channel_x:[]};
      yA = {channel_y:[]};

      for (let i=0; i<num; i++) {
        xA.channel_x.push(ytActivities(list[i].id));
        yA.channel_y.push(ytBanner(list[i].id));
      }
      xA.channel_x.push({id:'------------------------', activities:next});

      console.log('aArguments,バナー取得\n実施件数 : '+num+' = '+xA.channel_x.length+'(x) = '+yA.channel_y.length+'(y) - 1\n実施開始位置 : '+id+' = '+list[0].id+'\n次回開始位置 : '+next);
    } catch (e) {
      console.log('aArguments,バナー取得\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_a() }
    }
  }
  t = 0;
  step_a();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\naArguments,バナー取得')
  }

  function step_p() { //WPポスト
    err = {};
    try {
      console.log(wpAPI(aURL, xA));
      console.log(wpAPI(aURL, yA));
      console.log('■■■■■■■■■■ 実行完了 : rActivities ■■■■■■■■■■');
    } catch (e) {
      console.log('WPポスト\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_p() }
    }
  }
  t = 0;
  step_p();
  if (t===3) {
    return console.log('【途中終了】エラー回数超過\nWPポスト')
  }

}

/** ■■■■ 関数 ■■■■ */
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

function ytVideo(id) {

  const part = 'snippet,contentDetails,statistics';
  const vfields = 'items(id,snippet(title,description,publishedAt,thumbnails(medium(url),default(url)),tags,channelId,channelTitle),contentDetails(duration),statistics(viewCount,likeCount,commentCount))';
  const filter = '?part='+part+'&id='+id+'&maxResults=50&fields='+vfields+'&key='+apiKey;

  const url = 'https://youtube.googleapis.com/youtube/v3/videos' + filter;

  const options = {"muteHttpExceptions" : true,};
  const resJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());

  return resJson
}

function ytActivities(id) {

  const aPart = 'contentDetails';
  const aFields = 'items(contentDetails(upload(videoId)))';
  const aFilter = '?part='+aPart+'&channelId='+id+'&maxResults=50&fields='+aFields+'&key='+apiKey;
  let url = 'https://youtube.googleapis.com/youtube/v3/activities' + aFilter;
  const options = {"muteHttpExceptions" : true,};
  const aJson = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());

  let vID = [];
  aJson.items.forEach(x => {
    if (x.contentDetails.upload !== undefined && x.contentDetails.upload.videoId !== undefined) {
        vID.push(x.contentDetails.upload.videoId)
    }
  });
  vID = vID.join();
  const resJson = ytVideo(vID);

  let arg = {id:id, activities:''};
  let a = [];
  if (resJson.items !== undefined) {
    resJson.items.forEach(yJ => { a.push(aArguments(yJ)); });
  }
  if (a.length) { arg.activities = JSON.stringify(a); }

  return arg
}

function ytBanner(id) {

  const url = 'https://www.youtube.com/channel/' + id;
  const options = {"muteHttpExceptions" : true,};
  const bJson = UrlFetchApp.fetch(url, options).getContentText();

  const i = bJson.indexOf('x3dw1060');
  const text = bJson.slice(i-100, i-1).replace(/(.*\/)(.*)/,'$2');
  const banner = (text.length>20)? text: '';

  return {id:id, banner:banner};
}

function aArguments(yJ) {

  const a = {
    t_v: yJ.snippet.title,
    vd: yJ.id,
    vw: yJ.statistics.viewCount,
    lk: yJ.statistics.likeCount,
    cm: yJ.statistics.commentCount,
    yt: ''
    //date: Utilities.formatDate(new Date(yJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'),
    //dur: convertTime(yJ.contentDetails.duration),
    //des: textToLink(yJ.snippet.description),
    //tags: (yJ.snippet.tags)? yJ.snippet.tags.join(): '',
  }
  return a;
}
