
const express = require('express');
const LatestAnimeApi = require('./src/fetch_data/LatestAnimeApi.js');
const UpComingAnimeApi = require('./src/fetch_data/UpComingAnimeApi.js');
const MangaDataApi=require("./src/fetch_data/MangaDataApi.js");
const AnimeRecomApi=require("./src/fetch_data/AnimeRecomApi.js");
const GetData=require("./src/fetch_data/GetData.js");
const bodyParser = require('body-parser');

const helmet = require('helmet');
const cors = require('cors');
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

const app = express();
const PORT = 3001;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);





app.use(cors());
let LatestAnimedata = {}; // Variable to store fetched JSON data
let UpComingAnimedata={}
let AnimeDatadata={}
let MangaDatadata={}
let AnimeRecomdata={}
const fetchDataAndUpdateVariable = async () => {
  try {
    await client.connect();

    // Get a reference to the database
    const db = client.db('isekaiportal');
    const animeDataCollection = db.collection('anime-database');
    const animeData = await animeDataCollection.find({}).limit(50).toArray();
    const LatestAnime = await LatestAnimeApi();
    const UpComingAnime = await UpComingAnimeApi();
    const MangaData = await MangaDataApi();
    const AnimeRecom = await AnimeRecomApi();
    AnimeDatadata = animeData; 
    LatestAnimedata=LatestAnime
    UpComingAnimedata=UpComingAnime
    AnimeRecomdata=AnimeRecom
    MangaDatadata=MangaData

    console.log('JSON data fetched and updated in variable and MongoDB');
  } catch (error) {
    console.error('Error fetching or updating data:', error);
  }
};

// Rest of your code remains the same

  
  // Call the fetchDataAndUpdateVariable function initially
  fetchDataAndUpdateVariable();
  
  // Set interval to fetch data every 60 seconds
  setInterval(fetchDataAndUpdateVariable, 6000000); // 60 seconds in milliseconds
  
app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is Successfully Running, and App is listening on port " + PORT);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});

app.get('/latest-anime-api', (req, res) => {
  res.status(200).send(LatestAnimedata);
});
app.get('/upcoming-anime-api', (req, res) => {
  res.status(200).send(UpComingAnimedata);
});
app.get('/anime', (req, res) => {
  res.status(200).send(AnimeDatadata);
});
app.get('/manga', (req, res) => {
  res.status(200).send(MangaDatadata);
});
app.get('/reco', (req, res) => {
  res.status(200).send(AnimeRecomdata);
});

app.post('/get', async (req, res) => {
  try {
    // Assuming you want to send the post data as an object
    const postData = req.body;
    // Call the GetData function with the post data
    await client.connect();

    // Get a reference to the database
    const db = client.db('isekaiportal');
    const animeDataCollection = db.collection('anime-database');
    
    // Use the `find` method with a query object based on the post data
    const result = await animeDataCollection.find({id:parseInt(postData.id)}).toArray();
    
    // Send the result back as a response
    res.status(200).json(result); // Sending the retrieved data as JSON
  } catch (error) {
    console.error('Error in /get POST request:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Define an endpoint to fetch data from MongoDB and save it to AnimeDatadata variable

