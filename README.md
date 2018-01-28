# Massdrop

Create a job queue whose workers fetch data from a URL and store the results in a database. The job queue should expose a REST API for adding jobs and checking their status / results.

### Example:

User submits www.google.com to your endpoint. The user gets back a job id. Your system fetches www.google.com (the result of which would be HTML) and stores the result. The user asks for the status of the job id and if the job is complete, he gets a response that includes the HTML for www.google.com.

## Demo

Available at: https://youtu.be/O1aG8BOIghI

## Operation

npm install
npm start (or "nodemon Server/server.js")
npm react (or "webpack -d --watch")
npm test (or "node ./node_modules/mocha/bin/mocha")

## Tech Stack

React, Node, Express, Redis, MySQL, Mocha, Chai, SuperTest

## API

#### Handles get requests from client with URL submission
```
GET /getId
Content-Type: application/json
E.g. {"url": "http://www.google.com"}
```
If a valid URL is received, the ID will be returned.
If an invalid URL is received, the response "Not Available (The URL you entered is not valid)" will be sent.

#### Handles get requests from client with JobID submission
```
GET /getHtml
Content-Type: application/json
E.g. {"id": 1}
```
If a valid ID is received, and the HTML is available in the cache or database, the HTML will be returned.
If the HTML is still being updating, the response "Updating" will be sent.
If an invalid ID is received, the response "Invalid ID" will be sent.
