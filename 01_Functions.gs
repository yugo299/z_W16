function wpView(url) {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Utilities.base64Encode(authUser + ":" + authPass)
  };
  const options = {
    'muteHttpExceptions': true,
    'headers': headers,
  };

  const res = UrlFetchApp.fetch(url, options);
  const resJson = JSON.parse(res.getContentText());
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

  const res = UrlFetchApp.fetch(url, options);
  const resJson = JSON.parse(res.getContentText());
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

  const res = UrlFetchApp.fetch(url, options);
  const resJson = JSON.parse(response.getContentText());
  return resJson
}

function pSheet(c, y, m, d) {

  const fileID = DriveApp.getFilesByName('gP'+ c + '_' + y + m).next().getId();
  const file = SpreadsheetApp.openById(fileID);

  let sheet = [file.getSheetByName('c')];
  const sName = (d < 10) ? '0' + d: String(d);
  sheet.push(file.getSheetByName(sName));

  return sheet
}

function rSheet(c, y, m, d) {

  const fileID = tFolder.getFilesByName('g'+ y + m + d + '_R' + c).next().getId();
  const file = SpreadsheetApp.openById(fileID);

  const sheet = [
    file.getSheetByName('vI'),
    file.getSheetByName('vRt'),
    file.getSheetByName('vRn'),
    file.getSheetByName('vP'),
    file.getSheetByName('vV'),
    file.getSheetByName('vL'),
    file.getSheetByName('vC'),
    file.getSheetByName('cI'), //#7
    file.getSheetByName('cRt'),
    file.getSheetByName('cRn'),
    file.getSheetByName('cP'),
    file.getSheetByName('cV'),
    file.getSheetByName('cL'),
    file.getSheetByName('cC'),
    file.getSheetByName('cS'), //#14
    file.getSheetByName('cN'),
    file.getSheetByName('cT')
  ];
  return sheet
}

function getData(sheet) {

  const row = sheet.getLastRow();
  const clm = sheet.getLastColumn();
  const data = sheet.getRange(1, 1, row, clm).getValues();
  return data
}

function setResponse(c, j) {

  let data = Array(11);
  switch (c) {
    case 'c': case 'v':
      data[0] = update;
      data[3] = j.id;
      data[4] = j.parent;
      data[6] = j.categories;
      data[7] = j.tags;
      data[8] = j.link;
      data[9] = j.title.rendered;
      data[10] = j.excerpt.raw;
      return data
    case 'r':
      return
    case 't':
      return
  }
}