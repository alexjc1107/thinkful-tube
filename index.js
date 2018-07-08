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
    
    <section>
      <a data-fancybox href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">
        <h2>${result.snippet.title}</h2>  
        <img src="${result.snippet.thumbnails.high.url}" alt="${result.snippet.description}">
      </a>
      <h3>
        By <a class="js-user-name" href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">${result.snippet.channelTitle}</a>
      </h3>
    </section>
  `;
}

function displayYoutubeSearchData(data) {
    console.log(data);
    nextToken = data.nextPageToken;
    prevToken = data.prevPageToken;
    const results = data.items.map((item, index) => renderResult(item));
    $('.js-search-results').prop('hidden', false)
    $('.js-search-results').html(`<h2>Results (${data.items.length})</h2>`);
    $('.js-search-results').append(results);
    $('.js-page').prop('hidden', false)
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
        if (pageNum > 1) {
            pageNum--;
        }
    });
}

function handleButtons() {
    watchPrevious();
    watchNext();
    watchSubmit();
}

$(handleButtons);