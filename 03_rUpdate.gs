/** ■■■■ 変数 ■■■■ */
const CONSUMER_KEY = 'TaaTCR2HJ3hr5Tor5rDGfkhBs';
const CONSUMER_SECRET = 'XfrWXBSiF0YCvLTN3JGXyK41wv8fo5PWdRhsG7RpIdWokRoIuv';
const client = TwitterClient2.getInstance(CONSUMER_KEY, CONSUMER_SECRET);

/** ■■■■ Twitter関数 ■■■■ */

/**認証実行
 */
 function authorize () {
  client.authorize();
}

/**認証を削除したい時はこれを実行する
 */
function reset () {
  client.reset()
}

/**Twitterの developer portal に登録するURLを取得する
 */
function getCallbackUrl () {
  client.getCallbackUrl();
}

/**authorizeでTwitterでの認証後に実行される処理
 * ※手動で実行はしません
 */
function authCallback (request) {
  return client.authCallback(request)
}

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

  function strSlice(str, len) {

    const sLen = str.length
    if (sLen*2 < len) { return str }

    let cnt = 0;
    for (let i = 0; i < sLen-1; i++) {
      cnt = (escape(str[i]).charAt(0) === '%' && escape(str[i]).charAt(1) === 'u')? cnt+2: cnt+1;
      if (cnt === len*2-4) {
        if (escape(str[i+1]).charAt(0) === '%' && escape(str[i+1]).charAt(1) === 'u') {
          return str.slice(0, i+2)+'…';
        }
        else if (escape(str[i+2]).charAt(0) === '%' && escape(str[i+2]).charAt(1) === 'u') {
          return str.slice(0, i+2)+'…';
        }
        else { return str.slice(0, i+3)+'…' }
      }
      if (cnt === len*2-3) {
        if (escape(str[i+1]).charAt(0) === '%' && escape(str[i+1]).charAt(1) === 'u') {
          return str.slice(0, i+1)+'…';
        }
        else { return str.slice(0, i+2)+'…' }
      }
    }
    return str
  }

  /** ■■■■ 変数 ■■■■ */
  const apiKey = 'AIzaSyAqHRINTIP30Gw0C0WxL_2GMi7Y2np6i3M';
  const msKey = 'cb4064ed957644f485ca6ebe1ec96ce5';

  const sURL = 'https://ratio100.com';
  const oURL = sURL + '/wp-json/wp/v2/posts/';
  const pURL = sURL + '/wp-json/wp/v2/pages/';
  const vURL = sURL + '/wp-json/ratio-zid/zid/video/';
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
  const cName = [
    '映画とアニメ',
    '自動車と乗り物',
    '音楽',
    'ペットと動物',
    'スポーツ',
    'ゲーム',
    'ブログ',
    'お笑い',
    'エンタメ',
    'ニュースと政治',
    'ハウツーとスタイル',
    '科学と技術'
  ];
  const tNo = [5,6,4,7,11,10,3,8,9,0,1,2];

  const date = new Date(Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss'));
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDay() + 60;

  if (minutes>40 && minutes<45) { //Youtube,チャンネル,動画ページ更新
    const time = (Utilities.formatDate(date,'JST','yyyy-MM-dd HH:')+'30:00').replace(' ','T');
    let arg = { date: time }
    console.log(wpAPI(pURL+4, arg));

    tr = wpAPI(sURL+'/wp-json/ratio-zid/zid/trending/');

    let title = 'YouTube急上昇 本日ランクインのチャンネル(' + tr.c + ')をピックアップ';
    let prefix = 'YouTube急上昇 本日は'+tr.v+'のチャンネルの動画が各カテゴリTop100にランクイン。獲得レシオ上位のチャンネルはこちら［';
    let suffix = '］『レシオ！』ではYouTube急上昇ランキングをリアルタイム集計、1時間ごとに最新情報をお届け。';
    let excerpt = prefix + tr.channel.join().replace(/(チャンネル|ちゃんねる|channel|Channel)/g, '') + suffix;

    arg = {date: time, title: title, excerpt: excerpt, tags: [70,73,74,78,51,day]}
    console.log(wpAPI(oURL+8, arg));

    title = 'YouTube急上昇 本日ランクインの動画(' + tr.v + ')の獲得レシオTop100';
    prefix = 'YouTube急上昇 本日は'+tr.v+'本の動画が各カテゴリTop100にランクイン。獲得レシオ上位の動画はこちら［';
    suffix = '］『レシオ！』ではYouTube急上昇ランキングをリアルタイム集計、1時間ごとに最新情報をお届け。';
    excerpt = prefix + tr.video.join() + suffix;

    arg = {date: time, title: title, excerpt: excerpt, tags: [70,73,74,79,51,day]}
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

  if (minutes>30 && minutes<35 && hour===19) { //リンクページ更新
    const time = (Utilities.formatDate(date,'JST','yyyy-MM-dd HH:')+'01:29').replace(' ','T');
    const arg = { date: time }
    console.log(wpAPI(pURL+16, arg));
    console.log('アップデート完了（ 16 ） : '+time);
  }

  if (minutes>25 && minutes<30 && hour>11) { //Twitter投稿カテゴリ別Top10

    const wD = wpAPI(vURL+'24/jp');
    if (Number(wD[0].flag)!==hour) { return console.log('video24未更新'); }

    const i = hour-12;
    const no = {'1':'➊', '2':'➋', '3':'➌', '4':'➍', '5':'➎', '6':'➏', '7':'➐', '8':'➑', '9':'➒', '10':'➓'};

    console.log([i, tNo[i], cNo[tNo[i]]]);

    let tw = Array(3);
    let data = {};
    let rank = {};
    let yt = {};
    let tID = null;

    wD.forEach(d => { if (Number(d.cat)===cNo[tNo[i]] && Number(d.rn)<=10) { data[d.rn] = d; } });

    for (let j=1; j<=10; j++) {
      console.log([data[j].t_c,strSlice(data[j].t_c, 14)]);
      rank[j] = no[j] + ' ' + strSlice(data[j].t_c, 14) + '\nratio100.com/@' + data[j].id;
      if (j<=3) { yt[j] = 'youtu.be/' + data[j].id; }
    }

    tw[0] = '【 YouTube急上昇ランキング速報 】\n'+hour+'時は #'+cName[tNo[i]]+' カテゴリのトップ10\n▼100位までのランキングはこちら▼\nratio100.com/'+cNo[tNo[i]]+'\n\n'+rank[1]+'\n\n'+rank[4]+'\n\n'+yt[1];
    tw[1] = '▼100位までのランキングはこちら▼\nratio100.com/'+cNo[tNo[i]]+'\n\n'+rank[2]+'\n\n'+rank[5]+'\n\n'+rank[7]+'\n\n'+rank[9]+'\n\n'+yt[2];
    tw[2] = '▼100位までのランキングはこちら▼\nratio100.com/'+cNo[tNo[i]]+'\n\n'+rank[3]+'\n\n'+rank[6]+'\n\n'+rank[8]+'\n\n'+rank[10]+'\n\n'+yt[3];

    for (let i=0; i<tw.length; i++) {
      const res = client.postTweet(tw[i], tID);
      tID = res.data.id;
      console.log(res);
    }
  }

}