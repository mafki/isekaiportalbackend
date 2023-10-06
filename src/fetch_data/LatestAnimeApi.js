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
              airingSchedules(sort: [TIME_DESC], notYetAired: false) {
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
                }
                episode
              }
            }
          }
        `
    },
    json: true
};

function LatestAnimeApi() {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const airingSchedules = body.data.Page.airingSchedules;
                // Filter the data to get only the items where isAdult is true
                const filteredData = airingSchedules.filter(item => item.media.isAdult === false && !item.media.genres.includes("Fantasy"));
                resolve(filteredData);
            } else {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}

module.exports = LatestAnimeApi;
