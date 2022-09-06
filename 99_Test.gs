function testView() {
  const id = 2;
  const url = pURL + id;
  console.log(wpView(url));
}

function testEdit() {
  const id = 19;
  const arg = { parent: '17' };
  const url = pURL + id;

  console.log(wpEdit(url, arg));
}

function testEmbed() {
  const id = 19;
  const arg = { parent: '17' };
  const url = pURL + id;

  console.log(wpEmbed(url, arg));
}

function testPost() {

  let cntC = 0, cntV = 0;
  const s = rSheet('20', '22', '09', '02');
  const dC = getData(s[7]);
  const dV = getData(s[0]);
  const rV = dV.length;

  let wV = [...Array(dV.length-1)].map(() => Array(10));
  let wC = [...Array(dV.length-1)].map(() => Array(8));

  dV.sort(function(a,b){ if (a[2] > b[2]) { return 1 } else { return -1 } })

  for (let i=1; i<rV; i++) {

    const row = dC.findIndex(x => x[0] === dV[i][2]);
    cntC++;
    const cJ = wpEmbed(pURL, testArg(0, cntC, dC[row]));
    wC[i] = setResponse('c', cJ);
    wC[1] = dC[row][0], wC[1] = dC[row][1];
    const cID = cJ.id;
    let child = [], f = true;

    while (f) {

      let src = [];
      cntV++;
      const vJ = wpEmbed(pURL, testArg(cID, cntV, dV[i]));
      child.push(vJ.id);
      wV[i] = setResponse('v', vJ);
      wV[i][1] = dV[i][0], wV[1] = dV[i][1];

      if (i+1<rV) {
        if (dV[i+1][2] === dV[i][2]) { i++; }
        else { f = false; }
      }
      else { f = false; }
    }
    wC[5] = child.join();
  }

  wcSheet.getRange(2, 1, wC.length-1, wC[0].length).setValues(wC);
  wvSheet.getRange(2, 1, wV.length-1, wV[0].length).setValues(wV);
  console.log('チャンネル : ' + cntC +'\n動画 : ' + cntV)
}

function testArg(id, i, d) {

  let arg = {
    date: d[4],
    status: 'private',
    type: 'post',
    cf:
    { name: d[1],
      rn: i,
      rn1: '+' + i,
      rn24: '',
      rnA: [2,3,4,2,1,4,5],
      rt: i*7,
      rt1: '+' + i*3,
      rt24: '',
      rtA: [131,345,657,768,876,913,1234],
    }
  }

  if (id) {
    arg.parent = id;
    arg.slug = 'video-' + i;
    arg.categories = [20,4];
    arg.cf.dur = d[5];
    arg.cf.desc = d[6];
    arg.cf.link = d[7];
    arg.cf.thmb = d[8];
    arg.cf.tags = d[9];
  }
  else {
    arg.slug = 'channel-' + i;
    arg.categories = [8,4];
    arg.cf.desc = d[5];
    arg.cf.link = d[6];
    arg.cf.thmb = d[7];
  }
  arg.title = '[タイトル]' + arg.slug;
  arg.content = '[本文]' + arg.slug;
  arg.excerpt = '[抜粋]' + arg.slug;

  return arg
}

function getPopular(nextPageToken) {

  let [
    token, vID, vTitle, vDate, dur, cntV, cntL, cntC, cID, cTitle,
    cDate, cntS, cntN, totV, vDesc, vURL, vTmb, vTags, cDesc, cURL,
    cTmb, cCustom
  ] = [
    '',[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],
    [],[]
  ];
  let c_tmp = ''

  const vfields = 'items(id,snippet(title,description,publishedAt,thumbnails(medium(url)),tags,channelId),contentDetails(duration),statistics(viewCount,likeCount,commentCount)),nextPageToken';
  let optJson = {chart: 'mostPopular', regionCode: 'jp', videoCategoryId: vCat, maxResults: 50, fields: vfields, pageToken: nextPageToken};

  vJson = YouTube.Videos.list('snippet,contentDetails,statistics',optJson);
  token = vJson.nextPageToken;

  vJson.items.forEach((vJ) => {

    const cfields = 'items(id,snippet(title,description,publishedAt,thumbnails(medium(url)),customUrl),statistics(viewCount,subscriberCount,videoCount)),nextPageToken';
    optJson = {id: vJ.snippet.channelId, fields: cfields, key: apiKey};
    cJ = YouTube.Channels.list('snippet,statistics',optJson).items[0];

    vID.push(vJ.id);
    vTitle.push(vJ.snippet.title);
    vDate.push(Utilities.formatDate(new Date(vJ.snippet.publishedAt), 'JST', 'yyyy-MM-dd HH:mm:ss'));
    dur.push(convertTime(vJ.contentDetails.duration));
    cntV.push(vJ.statistics.viewCount);
    cntL.push(vJ.statistics.likeCount);
    cntC.push(vJ.statistics.commentCount);
    cID.push(vJ.snippet.channelId);
    cTitle.push(cJ.snippet.title);
    cDate.push(Utilities.formatDate(new Date(cJ.snippet.publishedAt), 'JST"', 'yyyy-MM-dd HH:mm:ss'));
    cntS.push(cJ.statistics.subscriberCount);
    cntN.push(cJ.statistics.videoCount);
    totV.push(cJ.statistics.viewCount);
    vDesc.push(vJ.snippet.description);
    vURL.push('https://youtube.com/watch?v='+vJ.id);
    vTmb.push(vJ.snippet.thumbnails.medium.url);
    vTags.push(joinArr(vJ.snippet.tags));
    cDesc.push(cJ.snippet.description);
    cTmb.push(cJ.snippet.thumbnails.medium.url);

    c_tmp = removeAt(cJ.snippet.customUrl)
    cCustom.push(c_tmp);

    if (c_tmp) { cURL.push('https://youtube.com/c/'+c_tmp) }
    else { cURL.push('https://youtube.com/channel/'+vJ.snippet.channelId) }
  })

  const srcData = [
    token, vID, vTitle, vDate, dur, cntV, cntL, cntC, cID, cTitle,
    cDate, cntS, cntN, totV, vDesc, vURL, vTmb, vTags, cDesc, cURL,
    cTmb, cCustom
  ];

  return srcData
}