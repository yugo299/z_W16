const sURL = 'https://ratio100.com';

const pURL = sURL + '/wp-json/wp/v2/pages/';
const tURL = sURL + '/wp-json/wp/v2/taxonomies/';

const authUser = 'syo-zid';
const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';

const gFolder = DriveApp.getFolderById('14u0G2CGKp3TOYkOYGRcacZ25wY5vUDls');
const tFolder = DriveApp.getFolderById('1YvsT3XA0nDGYuvcyIx0seqobMVf9gw-O');

const wFile = SpreadsheetApp.openById('1RfQm5kCOdYX4cnjYXcfMPNB4KE0Z17tF32v9PHnBUak');
const wrSheet = wFile.getSheetByName('wR');
const wcSheet = wFile.getSheetByName('wC');
const wvSheet = wFile.getSheetByName('wV');
const wtSheet = wFile.getSheetByName('wT');

const update = Utilities.formatDate(new Date(), 'Etc/GMT-4', 'yyyy/MM/dd');
let day = new Date();
const today = new Date(day).getDate();
day.setDate(day.getDate()-1);
const yesterday = new Date(day).getDate();
day = new Date();
day.setDate(day.getDate()+1);
const tomorrow = new Date(day).getDate();