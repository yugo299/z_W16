/** ■■■■ テスト ■■■■ */
function wpPage() {

  function pArguments(id, slug) {
    a = {
      ID: id,
      post_author: 1,
      post_date: date,
      post_content: '',
      post_title: id,
      post_excerpt: '',
      post_status: 'private',
      comment_status: 'open',
      ping_status: 'open',
      post_name: slug,
      post_parent: parent,
      menu_order: (Number(slug)<70)? Number(slug)+100: Number(slug),
      post_type: 'page',
    };
    wA.zr_posts.push(a);
  }

  let y = new Date().getFullYear() - 2000;
  const e = y + 2;
  const date = '20' + e + '/10/10 00:00'

  let ts = new Date('20' + y + '/12/31 12:00');
  let m = 0;
  let d = 0;
  let w = 0;

  let wA = {zr_posts:[]};

  const s = 50;
  let slug = y + 1;
  let id = Number(slug+'00'+s);
  let parent = 4;
  pArguments(id, slug);

  while (y < e) {
    ts.setDate(ts.getDate() + 1);
    y = ts.getFullYear() - 2000;
    if (y === e) { break; }

    if (m < ts.getMonth()+1) {
      w = 0;
      m = ts.getMonth()+1;
      slug = (m < 10)? ('0'+m): String(m);
      id = Number(y+slug)+s;
      parent = y+'00'+s;
      pArguments(id, slug);
      parent = id;
    };
    d = ts.getDate();

    if (ts.getDay()===0) {
      slug = String(70 + (++w));
      id = Number(y + ((m<10)? ('0'+m): String(m)) + slug) + s;
      pArguments(id, slug);
    }

    slug = (d < 10)? ('0'+d): String(d);
    id = Number(y + ((m<10)? ('0'+m): String(m)) + slug) + s;
    pArguments(id, slug);
  }
  console.log(wpAPI(vURL, wA));
}