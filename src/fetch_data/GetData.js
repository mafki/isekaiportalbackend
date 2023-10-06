const request = require('request');


function GetData(d) {
    let v=d.id
    return new Promise((resolve, reject) => {
        request({
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
                    Media(id: ${v}) {
                      relations {
                        nodes {
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
                      type
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
                      meanScore
                      episodes
                    }
                  }
                  
                `
            },
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const airingSchedules = body.data;
                // Filter the data to get only the items where isAdult is true
                const filteredData = airingSchedules;
                resolve(filteredData);
            } else {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}

module.exports = GetData;
