const request = require('request');
const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = "mongodb+srv://mafki:Aminefki%40123@isekaiportaldb.mo2troa.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
function GetData(v) {
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
                    Page(page: ${v}) {
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
                        id
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
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const airingSchedules = body.data.Page.media;
                // Filter the data to get only the items where isAdult is true
                const filteredData = airingSchedules.filter(item => item.isAdult === false);
                resolve(filteredData);
            } else {
                console.error('Error fetching data:', error);
                reject(error);
            }
        });
    });
}

async function fetchAllData() {
    let mergedData = [];

    for (let i = 2101; i <= 2319; i++) {
        try {
            const data = await GetData(i);
            mergedData = mergedData.concat(data);
            console.log(i)
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    console.log('Merged Data:', mergedData.length);
    // Database Name
    const dbName = 'isekaiportal';

    

    try {
        // Connect to MongoDB
        await client.connect();

        // Get the database
        const db = client.db(dbName);

        // Specify the collection where you want to insert the data
        const collection = db.collection('anime-database');

        // Insert the mergedData array into the collection
        const result = await collection.insertMany(mergedData);
        console.log(`${result.insertedCount} documents inserted.`);
    } catch (err) {
        console.error('Error inserting data into MongoDB:', err);
    } finally {
        // Close the MongoDB client
        console.log("closing conn")
        client.close();
        console.log("connection closed")
    }

}


fetchAllData();

