//■■■■ 変数 ■■■■
const sURL = 'https://ratio100.com';
const oURL = sURL + '/wp-json/wp/v2/posts/';
const vURL = sURL + '/wp-json/wp/v2/video/';
const cURL = sURL + '/wp-json/wp/v2/channel/';
const pURL = sURL + '/wp-json/wp/v2/pages/';
const rURL = sURL + '/wp-json/wp/v2/categories/';
const tURL = sURL + '/wp-json/wp/v2/tags/';

const apiKey = 'AIzaSyCMgNyHWJRWDrOZO9EWnL0LP0H_HJ-0gCM';
const authUser = 'syo-zid';
const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';

const rFile = SpreadsheetApp.openById('1RfQm5kCOdYX4cnjYXcfMPNB4KE0Z17tF32v9PHnBUak');
const fSheet = rFile.getSheetByName('F');
const cSheet = rFile.getSheetByName('wC');
const vSheet = rFile.getSheetByName('wV');
const rSheet = rFile.getSheetByName('wR');
const tSheet = rFile.getSheetByName('wT');

function rFunction() {

  //■■■■ 実行判定 ■■■■
  const date = new Date(Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd-HH:mm'));
  const hours = date.getHours();
  const done = fSheet.getRange('A1').getValue();
  if (hours === done) { return console.log('実施済み') }
  setFlag('doing');

  deleteData(vSheet, vURL);

  doHourly();
  fSheet.getRange('A1').setValue(hours);

  //■■■■ updateFlash ■■■■

  //■■■■ updateChannel ■■■■

  //■■■■ updateVideo ■■■■

  //■■■■ createResult ■■■■

  deleteFlag('doing');
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
  const clm = sheet.getLastColumn();
  const data = sheet.getRange(1, 1, row, clm).getValues();
  return data
}

function setData(sheet, data) {

  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}

function setFlag(flag) { rFile.insertSheet(flag) }

function deleteFlag(flag) { rFile.deleteSheet(rFile.getSheetByName(flag)) }

function deleteRows(sheet, data) {

  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}

//■■■■ YT関数 ■■■■
function getPopular(nextPageToken) {

  const part = 'snippet,contentDetails,statistics';
  const vfields = 'items(id,snippet(title,description,publishedAt,thumbnails(medium(url)),tags,channelId),contentDetails(duration),statistics(viewCount,likeCount,commentCount)),nextPageToken';
  const options = {chart: 'mostPopular', regionCode: 'jp', videoCategoryId: vCat, maxResults: 50, fields: vfields, pageToken: nextPageToken};

  const resJson = YouTube.Videos.list(part, options);
  return resJson
}

function getChannel(cID, nextPageToken) {

  const part = 'snippet,statistics';
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

function deleteData(sheet, url) {
  let data = getData(sheet);
  let id = [];

  data = data.filter(function(x){
    if (x[1]==='X') {
      id.push(x[3])
      return false;
    }
    else { return true }
  })
  const len = id.length
  if (!len) { return }

  sheet.clearContents();
  setData(sheet, data);

  for (let i=0; i<len; i++) {
    wpDelete(url+id[i]);
  }
}

function doHourly() {

  //■■■■ 変数 ■■■■
  let vList = getData(vSheet);
  let row = 0;
  let rank = 0;
  let arg = {};
  let vData = [];
  const label = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:') + '00';
  const today = Utilities.formatDate(new Date(), 'Etc/GMT-4', 'yyyy-MM-dd');
  const ratio = [
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

  //■■■■ BS_C ■■■■
  function CbsMin(clm, target, from, to) {
    while (from !== to) {
      const middle = from + Math.floor((to - from) / 2);
      if (cList[middle][clm] < target) {
        from = middle + 1;
      } else {
        to = middle;
      }
    }
    return from;
  }

  function CbsMax(clm, target, from, to) {
    while (from !== to) {
      const middle = from + Math.ceil((to - from) / 2);
      if (cList[middle][clm] > target) {
        to = middle - 1;
      } else {
        from = middle;
      }
    }
    if (cList[from][clm] === target) {
      return from;
    } else {
      return 0;
    }
  }

  function CbsRange(clm, target) {
    const from = CbsMin(clm, target, 0, cList.length - 1);
    const to = CbsMax(clm, target, from, cList.length - 1);
    return { from: from, to: to };
  }

  //■■■■ BS_V ■■■■
  function VbsMin(clm, target, from, to) {
    while (from !== to) {
      const middle = from + Math.floor((to - from) / 2);
      if (vList[middle][clm] < target) {
        from = middle + 1;
      } else {
        to = middle;
      }
    }
    return from;
  }

  function VbsMax(clm, target, from, to) {
    while (from !== to) {
      const middle = from + Math.ceil((to - from) / 2);
      if (vList[middle][clm] > target) {
        to = middle - 1;
      } else {
        from = middle;
      }
    }
    if (vList[from][clm] === target) {
      return from;
    } else {
      return 0;
    }
  }

  function VbsRange(clm, target) {
    const from = VbsMin(clm, target, 0, vList.length - 1);
    const to = VbsMax(clm, target, from, vList.length - 1);
    return { from: from, to: to };
  }

  function vArguments(i) {
    arg = (row) ? wpView(vURL+vList[row][3]): {};
    if (row) {
      arg = {
        title: vData[i][1],
        date: vData[i][3],
        cf: {
          yt: vData[i][0],
          title: vData[i][1],
          channel: vData[i][2],
          lb_n: label,
          lb24: arg.cf.lb24.push(label),
          rn_n: vData[i][4],
          rn24: arg.cf.rn24.push(vData[i][4]),
          rt_n: vData[i][5],
          rt24: arg.cf.rn24.push(vData[i][5]),
        }
      }
    } else {
      arg = {
        title: vData[i][1],
        date: vData[i][3],
        cf: {
          yt: vData[i][0],
          title: vData[i][1],
          channel: vData[i][2],
          lb_n: label,
          lb24: [label],
          rn_n: vData[i][4],
          rn24: [vData[i][4]],
          rt_n: vData[i][5],
          rt24: [vData[i][5]],
        }
      }
    }
    return arg
  }

  function vUpdate(j) {
    return [today, 'D', j.cf.yt, j.id, j.cf.channel]
  }

  const vJson1 = getPopular();
  const vJson2 = (typeof(vJson1.nextPageToken)==='undefined') ? {}: getPopular(vJson1.nextPageToken);

  vJson1.items.forEach((vJ) => {
    const data = [
      vJ.id,
      vJ.snippet.title,
      vJ.snippet.channelId,
      Utilities.formatDate(new Date(vJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'),
      ++rank,
      ratio[rank]
    ];
    vData.push(data);
  });
  vJson2.items.forEach((vJ) => {
    const data = [
      vJ.id,
      vJ.snippet.title,
      vJ.snippet.channelId,
      Utilities.formatDate(new Date(vJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'),
      ++rank,
      ratio[rank]
    ];
    vData.push(data);
  })

  vData = vData.sort(function(a,b){ return ((a[0] > b[0]) ?  1: -1) });
  const DataL = vData.length;
  let ListL = vList.length - 1;
  let start = 1;

  for (let i=0; i<DataL; i++) {
    row = (ListL) ? VbsMax(2, vData[i][0], start, ListL): 0;
    if (row) {
      const url = vURL + vList[row][3];
      const vJson = wpEdit(url, vArguments(i));
      vList[row] = vUpdate(vJson);
    }
    else {
      row = (ListL) ? VbsMin(2, vData[i][0], start, ListL++): 0;
      const url = vURL;
      const vJson = wpEmbed(url, vArguments(i));
      if (!row) { row = 1 }
      vList.splice(row, 0, vUpdate(vJson));
    }
    start = (row<ListL) ? row + 1: row;
  }

  setData(vSheet, vList);
}
