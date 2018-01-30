const express 	 = require('express');
const path 			  = require('path');
const bodyParser = require('body-parser');
const cors 			= require('cors');
const request 	= require('request');
const normalizeUrl 	= require('normalize-url');
const escape 		= require("html-escape");
const decode 		= require('unescape');
const database 	= require('../Database/index.js');
const redis 		= require('redis');
const kue       = require('kue');

const app = express();

//Create a job queue
const queue = kue.createQueue({
    prefix: 'q',
    redis: {
        createClientFactory: function () {
            let client = redis.createClient({
                port: process.env.REDIS_PORT,
            });
            return client;
        }
    }
});

queue.setMaxListeners(1000);

app.use(express.static(__dirname + '/../Client'));

app.use(cors());

app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('listening on port 3000!');
});


//Handles get requests from client with URL submission
app.get('/getId', (req, res) => {
  const url = req.query.url;
  //Create a job within the queue
  const job = queue.create('url', {
      title: url
  })
  job.on('complete', function(){
      if (res.finished) {
          console.log("Job complete");
      } else {
          res.sendStatus(200).send(`${job.id}`);
      }
  }).on('failed', function(){
      if (res.finished) {
          console.log("Job failed");
      } else {
          res.send(" Not Available (The URL you entered is not valid) ");
      }
  }).on('progress', function(progress){
      console.log('job #' + job.id + ' ' + progress + '% complete');
  });
    
  job.save();

  //Processes up to 5 jobs concurrently, calling done when finished
  queue.process('url', 5, (job, done) => {
      //Enters URL into database
    database.findID(url, (err, data) => {
      if(err) {
        done(err);
      } else {
        //If no error in entering the URL into the database, request for the HTML of the page
        //using the normalized version of the URL
        request(normalizeUrl(url), (error, response, body) => {
          if(error) {
            //If error in fetching HTML from normalized URL, send response "Not Available"
            done(error);
          } else {
            //If successful in fetching HTML from normalized URL, send ID in response
            done();
            //Then add the HTML to the database
            database.updateHtml(escape(body), data.insertId, (fault, results) => {
              if(fault) {
                console.log('Error:', fault);
              };
            });     
          };
        });
       };
    });
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
