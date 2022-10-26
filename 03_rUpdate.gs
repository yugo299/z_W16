function rUpdate() {

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

  /** ■■■■ 変数 ■■■■ */
  const apiKey = 'AIzaSyAqHRINTIP30Gw0C0WxL_2GMi7Y2np6i3M';
  const msKey = 'cb4064ed957644f485ca6ebe1ec96ce5';

  const sURL = 'https://ratio100.com';
  const oURL = sURL + '/wp-json/wp/v2/posts/';
  const pURL = sURL + '/wp-json/wp/v2/pages/';
  const authUser = 'syo-zid';
  const authPass = 'lpwN R9pX bviV fliz CZIo wV8W';

  const cNo = [1,2,10,15,17,20,22,23,24,25,26,28];
  const cSlug = [
    'movie-anime',
    'car-bike-train',
    'music',
    'pets-animals',
    'sports',
    'game',
    'blog',
    'comedy',
    'entame',
    'news-politics',
    'howto-style',
    'science-tech'
  ];

  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();


  if (minutes>40 && minutes<45) { //Youtube,チャンネル,動画ページ更新
    const time = (Utilities.formatDate(date,'JST','yyyy-MM-dd HH:')+'30:00').replace(' ','T');
    const arg = { date: time }
    console.log(wpAPI(pURL+4, arg));
    console.log(wpAPI(oURL+8, arg));
    console.log(wpAPI(oURL+9, arg));
    console.log('アップデート完了 ( 4,8,9 ) : '+time);
  }

  if (minutes>20 && minutes<25 && (hour%2===0)) { //カテゴリ別ランキングページ更新
    const time = (Utilities.formatDate(date,'JST','yyyy-MM-dd HH:')+'00:10').replace(' ','T');
    const arg = { date: time }
    const list = ['https://ratio100.com/youtube/trending/'+cSlug[Math.round(hour/2)]]
    console.log(msSubmit(list));
    console.log(wpAPI(oURL+cNo[Math.round(hour/2)], arg));
    console.log('アップデート完了 ( '+Math.round(hour/2)+' ) : '+time);
  }

  if (minutes>30 && minutes<35 && (hour===19)) { //リンクページ更新
    const time = (Utilities.formatDate(date,'JST','yyyy-MM-dd HH:')+'01:29').replace(' ','T');
    const arg = { date: time }
    console.log(wpAPI(pURL+6, arg));
    console.log('アップデート完了（ 6 ） : '+time);
  }

  if (minutes>50 && minutes<55 && (hour===4)) { //Bing WebMaterTool API送信
    list = [];
    //msSubmit(list);
    //console.log('Bing通知完了（ '+list.length+'件 ） : '+time);
  }

}