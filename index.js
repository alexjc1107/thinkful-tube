const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
let nextToken = '';
let prevToken = '';
let queryGlobal = '';
let pageNum = 1;

function getDataFromApi(searchTerm, callback) {
  const query = {
    part: `snippet`,
    key: `AIzaSyAyMY8kZnywIwa4serzBu6crMJT7kM_wqg`,
    q: `${queryGlobal}`,
    type: `video`
  }
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function getNext(token, callback) {
  const query = {
    pageToken: `${token}`,
    part: `snippet`,
    key: `AIzaSyAyMY8kZnywIwa4serzBu6crMJT7kM_wqg`,
    q: `${queryGlobal}`,
    type: `video`
  }
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderResult(result) {
  return `
    <div>
      <h2>
      <a href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">${result.snippet.title}</a> by <a class="js-user-name" href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">${result.snippet.channelTitle}</a></h2>
      <a data-fancybox href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">
        <img src="${result.snippet.thumbnails.high.url}" alt="${result.snippet.description}"
      </a>
    </div>
  `;
}

function displayYoutubeSearchData(data) {
  nextToken = data.nextPageToken;
  prevToken = data.prevPageToken;
  const results = data.items.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
  $('.js-page').html(`Page ${pageNum}`);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    queryGlobal = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(queryGlobal, displayYoutubeSearchData);
  });
}

function watchNext() {
  $('.js-next').click(event => {
    getNext(nextToken, displayYoutubeSearchData);
    pageNum++;
  });
}

function watchPrevious() {
  $('.js-previous').click(event => {
    getNext(prevToken, displayYoutubeSearchData);
    if(pageNum > 1) {
      pageNum--;
    }
  });
}

function handleButtons(){
  watchPrevious();
  watchNext();
  watchSubmit();
}

$(handleButtons);
/*
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

const settings = {
    url: YOUTUBE_SEARCH_URL,
    data: {
      part: `snippet`,
      key: `AIzaSyAyMY8kZnywIwa4serzBu6crMJT7kM_wqg`,
      q: `monkey`,
      per_page: 5
    },
    dataType: 'json',
    type: 'GET',
    success: function displayYoutubeSearchData(data) {
      const results = data.items.map((item, index) => renderResult(item));
      $('.js-search-results').html(results);
    }
  };

function renderResult(result) {
  console.log(`videoId: ${result.id.videoId}`);
  console.log(`Title: ${result.snippet.title}`);
  console.log(``);
}

$.ajax(settings);
*/