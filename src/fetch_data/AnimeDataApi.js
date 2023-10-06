const request = require('request');

const options = {
    method: 'POST',
    url: 'https://anilist-graphql.p.rapidapi.com/',
    headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '82829b219bmsh55fafe77e0a0ddcp1fe5f1jsn6c12e62b0f5f',
        'X-RapidAPI-Host': 'anilist-graphql.p.rapidapi.com'
    },
    body: {
        query: `
        {
          Page(page: 1) {
            media {
              relations {
                nodes {
                  id
                  averageScore
                  popularity
                  episodes
                  coverImage {
                    extraLarge
                  }
                  isAdult
                  genres
                  title {
                    romaji
                  }
                }
              }
              nextAiringEpisode {
                airingAt
              }
              description
              externalLinks {
                site
                url
                icon
              }
              isAdult
              title {
                romaji
              }
              genres
              coverImage {
                extraLarge
              }
              popularity
              averageScore
              episodes
            }
          }
        }
          `
    },
    json: true
};

function AnimeDataApi() {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const mediaArray = body.data.Page.media;
                // Filter the data to get only the media with isAdult === true
                const filteredData = mediaArray.filter(item => item.isAdult === false);
                resolve(filteredData);
            } else {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}

module.exports = AnimeDataApi;

