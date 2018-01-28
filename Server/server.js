const express 		= require('express');
const path 			= require('path');
const bodyParser 	= require('body-parser');
const cors 			= require('cors');
const request 		= require('request');
const normalizeUrl 	= require('normalize-url');
const escape 		= require("html-escape");
const decode 		= require('unescape');
const database 		= require('../Database/index.js');
const redis 		= require('redis');

const app = express();

app.use(express.static(__dirname + '/../Client'));

app.use(cors());

app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('listening on port 3000!');
});

//Create a Redis client object for use as cache on default port 6379
const REDIS_PORT = process.env.REDIS_PORT;
const client = redis.createClient(REDIS_PORT);
client.on("error", (err) => {
    console.log("Error:" + err);
});
 

//Handles get requests from client with URL submission
app.get('/getId', (req, res) => {
  const url = req.query.url;
  //Enters URL into database
  database.findID(url, (err, data) => {
    if(err) {
      res.sendStatus(404).end();
    } else {
      //If no error in entering the URL into the database, request for the HTML of the page
      //using the normalized version of the URL
      request(normalizeUrl(url), (error, response, body) => {
      	if(error) {
      	  //If error in fetching HTML from normalized URL, send response "Not Available"
      	  res.status(200).send(' Not Available (The URL you entered is not valid) ');
      	} else {
      	  //If successful in fetching HTML from normalized URL, send ID in response
      	  res.status(200).send(`'${data.insertId}'`);
      	  //Add HTML to Redis Cache
      	  client.set(`'${data.insertId}'`, escape(body), redis.print);
      	  //Then add the HTML to the database
      	  database.updateHtml(escape(body), data.insertId, (fault, results) => {
      	  	if(fault) {
      	  	  console.log('error:', fault);
      	  	};
      	  });  		
      	};
      });
     };
  });
});

//Handles get requests from client with JobID submission
app.get('/getHtml', (req, res) => {
	const id = req.query.id;
	client.get(`'${id}'`, (err,reply) => {
		if(reply) {
			//If there is HTML associated with key in cache, return HTML
			res.status(200).send(decode(reply.toString()));	
		} else if(err) {
			//If can't find HTML from cache, find HTML from database
			database.findHtml(id, (error, results) => {
				if(error) {
		  			res.sendStatus(404).end();
				} else {
		  			if(!results[0]) {
		  				res.status(200).send('Invalid JobID');
		  			} else if(!results[0].html) {
		  				res.status(200).send('Updating');
		  			} else {
		  				res.status(200).send(decode(results[0].html));
		  			}
				};
			});
		} else {
			res.status(200).send('Invalid JobID');
		}
	});
});

module.exports = app;