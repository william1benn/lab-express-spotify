const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')



// setting the spotify-api goes here:
const clientId = '06e27dc77c6748e981559f9cc93a4709',
    clientSecret = '256aa30dc86144c8917b08279fc76fda';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:

app.get('/', (req, res, next) => {
    let data = {
      title:"HomePage"
    }
    res.render('index',data);
  });

  app.get('/artist', (req, res, next)=>{
      spotifyApi.searchArtists(req.query.artist)
      .then(data => {
          res.render('artist', data.body.artists);
      console.log("The received data from the API: ", data.body.artists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  })

  app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId) 
    .then(data => {
        res.render('albums',data.body)
        
    })
  });

  app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId) 
    .then(data => {
        res.render('tracks',data.body)
        console.log(data.body.items[0])
    })
  });



app.listen(8500, () => console.log("My Spotify project running on port 8500 🎧 🥁 🎸 🔊"));
