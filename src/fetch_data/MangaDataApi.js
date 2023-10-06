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
               media(isAdult: false, type: MANGA){
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
                description
                externalLinks {
                  site
                  url
                  icon
                }
                type
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
                meanScore
                episodes
              }
            }
          }
        `
    },
    json: true
};

function MangaDataApi() {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const medias = body.data.Page.media;
                // Filter the data to get only the items where isAdult is true
                const filteredData = medias.filter(item => item.isAdult === false);
                resolve(filteredData);
            } else {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}

module.exports = MangaDataApi;