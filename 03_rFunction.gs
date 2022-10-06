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

const cFile = SpreadsheetApp.openById('1WsUl5TYWxcE4ltAisWPja9fkqb5hd48uvAeT-r5HrQ4');

const date = new Date(Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm'));
const tMinute = date.getMinutes();

function rFunction(s) {

  //フラグ取得
  const sheet = cFile.getSheetByName(s);
  const done = sheet.getRange('A1').getValue();

  if (done==='Done') { return console.log('実施済み') }
  else if (!done) { return console.log('実施不要') }
  else { //■■■■ fChannel ■■■■
    try { setFlag('doing-'+s) }
    catch(e) {
      if (tMinute > 20) { deleteFlag('doing-'+s) }
      return console.log('実施中')
    }
    fChannel(s);
    deleteFlag('doing-'+s);
    return console.log('実行完了 : fChannel')
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

function setFlag(flag) {
  cFile.insertSheet(flag);
}

function deleteFlag(flag) {
  cFile.deleteSheet(cFile.getSheetByName(flag));
}

function fChannel(s) {

  //■■■■ 変数 ■■■■
  let err = {};
  let k = 0;
  let t = 0;

  function step_p() { //Post
    err = {};
    try {
      const sheet = cFile.getSheetByName(s);
      let List = getData(sheet);
      const lL = List.length;
      for (let i=k; i<lL; i++) {
        if (List[i]!=='') {
          let arg = JSON.parse(List[i][1]);
          arg.tags = arg.tags.map(x => Number(x));
          wpEdit(cURL+List[i][0], arg);
          if (i===100) { console.log('実施中\nList.length = '+lL+'\ni = 100') }
        }
        else { console.log('エラー : arg空欄') }
        List[i] = Array(2);
        k = i;
        t = 0;
      }
      writeData(sheet, List);
      console.log('wpEdit完了 : ' + lL);
    } catch (e) {
      console.log('wpEdit\n' + e.message);
      err = e;
    }
    finally {
      if('message' in err && ++t < 3){ step_p() }
    }
  }
  k = 0;
  t = 0;
  step_p();

}