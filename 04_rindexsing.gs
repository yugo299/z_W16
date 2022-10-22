function ggSubmit(list) {

  const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
  const headers = {'Content-Type': 'application/json'};

  list.forEach(url => {
    const arguments = {url: url, type: 'URL_UPDATED'}
    const options = {
      method: 'POST',
      muteHttpExceptions: true,
      headers: headers,
      payload: JSON.stringify(arguments)
    };
    const Json = JSON.parse(UrlFetchApp.fetch(endpoint, options).getContentText());
    console.log(Json);
  })
}