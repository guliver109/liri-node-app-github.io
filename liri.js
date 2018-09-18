// setting variable with dotenv package
var dotenv = require("dotenv").config();
//importing file keys, storing into variable
var keys = require("./keys.js");
// for using inquirer and request
var inquirer = require("inquirer");
var request = require("request");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);

//seting up keyes for choices
//venue
function venueDetails (artistName) {
    //variable for url
    var venueURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
    //function for output
    request(venueURL, function(error, response, body) {
        var singer = JSON.parse(body);
        console.log("Name of the venue:" + singer[0].venue.name);
        console.log("Country: " + singer[0].venue.country);
        console.log("Region: " +  singer[0].venue.region);
        console.log("City: " + singer[0].venue.city);
        console.log("Date: " + moment(singer[0].venue.datetime).format("MM/DD/YYYY"));
    });
}
//song output
function spotSong(songName) {
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            console.log('Error type: ' + err);
            return;
        } else {
            console.log("Artists Name: " + data.tracks.items[0].artists[0].name);
            console.log("Name of the Song: " + data.tracks.items[0].name);
            console.log("Song's Preview: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        }
    });
}
//movie title
function movieDetails(movieTitle) {
    //movie query with api key on the end
    var movieURL = "http://www.omdbapi.com/?t="+ movieTitle +"&y=&plot=short&tomatoes=true&r=json&apikey=d893ac97";
    
    //function for reuest data from query
    request(movieURL, function(error, response, body) {

        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes Rating:  " + JSON.parse(body).Ratings[1].Value);
        console.log("Country of origin: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).plot);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);

    });
}
//do what it says
var a = process.argv[2]; // operator
var b = process.argv.slice(3); // search parameter on song

function random() {
    fs.readFile("random.txt", "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      } else {
        songName = data;
        spotSong(songName);
      }
    });
  }
//prompt with choices
inquirer
  .prompt([
    // Here we give the user a list to choose from.
    {
      type: "list",
      message: "Please choose from folowing options",
      choices: ["Choose Concert", "Spotify Song", "Choose Movie", "Do What it Says"],
      name: "event"
    },
    // Here we ask the user to confirm.
    {
      type: "confirm",
      message: "Are you sure that this is your choice:",
      name: "confirm",
      default: true
    }
  ])
  //function for sorting answer
  .then(function(response) {
//if concert is choice
    if (response.event === "Choose Concert"){
       //console.log("Your choice is Choose Concert");
    inquirer
    .prompt([
        {
            type: "input",
            message: "Please type your Band/Singer name: ",
            name: "artistName"
        }
    ])
    .then(function(artist) {
        var artist = artist.artistName;
        console.log(artist);
        if (artist === undefined) {
            artist = "Frank Sinatra"
          } else {
            venueDetails(artist);
          }
    });
//if song is choice
} else if (response.event === "Spotify Song" ) {
       //console.log("Your choice is Spotify Song");
    inquirer     
    .prompt([
        {
            type: "input",
            message: "Please Enter Your Song's Title: ",
            name: "songTitle"
        }
    ])
    .then(function(song) {
        //console.log(response);
        var song = song.songTitle;
        
        if (song === undefined) {
            song = "'The Sign' by Ace Of Base";
        }
        spotSong(song);
    });
//if movie is choice
} else if (response.event === "Choose Movie") {
            //console.log("Your choice is Movie");     
    inquirer
    .prompt([
        {
            type: "input",
            message: "Please type your Movie title:",
            name: "movieTitle"
        }
    ])
    .then(function(movie) {
        //console.log(response);
        var movie = movie.movieTitle;
                    if (movie === undefined) {
                        movie = "Mr.Nobody";
                    }   
                    movieDetails(movie);
    });
   
//if do what it says is choice
} else if (response.event === "Do What it Says") {
            //console.log("Your choice is Do What it Says"); 
            random();
} else {
            console.log("Thanks for Considering our Game!"); 
         }
});
