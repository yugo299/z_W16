function rFetch() {

  /** ■■■■ 実施判定 ■■■■ */
  let x = new Date(Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss'));
  x = x.getHours();
  if (x>18) { x = 2; }
  else if (x>10) { x = 4; }
  else if (x<2 || x>6) { x = 5; }
  else { x = 0; }
  x = (x)? Math.round(Math.random()*10) % x: 10;
  if (x) { return console.log('実施対象外 : '+x) }

  const s = Math.round(Math.random()*500+500) * 60;
  console.log(Math.round(s/1000)+'秒待機');
  Utilities.sleep(s);

  /** ■■■■ ブログランキング ■■■■ */
  let url = 'https://blog.with2.net/link/?id=2093058';
  const options = {"muteHttpExceptions" : true,};

  let res = UrlFetchApp.fetch(url, options).getContentText();
  x = res.indexOf('2093058');
  x = res.slice(x-60,x+60).replace('\n', '');
  console.log(x);
  let regexp = /(.*)link(.*)">(.*)/;
  url = 'https://blog.with2.net/link' + x.replace(regexp,'$2') +'&wh=1';
  console.log(url);

  res = UrlFetchApp.fetch(url, options).getContentText();
  x = res.indexOf('Fratio100.com%');
  x = res.slice(x-60,x+100);
  console.log(x);
  regexp = /(.*)php(.*)" (.*)/;
  url = 'https://blog.with2.net/out.php' + x.replace(regexp,'$2');
  console.log(url);

  console.log(Math.round(s/1000)+'秒待機');
  Utilities.sleep(s);

  res = UrlFetchApp.fetch(url, options).getContentText();
  console.log(res);

  /** ■■■■ ブログ村 ■■■■ */
  url = 'https://blogmura.com/profiles/11152365?p_cid=11152365';

  res = UrlFetchApp.fetch(url, options).getContentText();
  x = res.indexOf('Fratio100.com%');
  x = res.slice(x-60,x+100).replace('\n', '').replace(/amp;/g, '');
  console.log(x);
  regexp = /(.*)out\/(.*)(" target.*)(?:\s.*)?/;
  url = 'https://link.blogmura.com/out/' + x.replace(regexp,'$2');
  console.log(url);

  console.log(Math.round(s/1000)+'秒待機');
  Utilities.sleep(s);

  res = UrlFetchApp.fetch(url, options).getContentText();
  console.log(res);

}